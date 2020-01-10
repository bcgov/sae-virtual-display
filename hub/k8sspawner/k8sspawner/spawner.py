"""
JupyterHub Spawner to spawn user notebooks on a Kubernetes cluster.

This module exports `K8sSpawner` class, which is the actual spawner
implementation that should be used by JupyterHub.
"""

import os
import string
import escapism
import json
import requests
import urllib.parse
from traitlets import (
    List
)
from tornado import gen

from kubespawner.spawner import KubeSpawner
from kubespawner.objects import make_pvc
from kubernetes.client.rest import ApiException
from kubernetes.client import V1PersistentVolume

from k8sspawner.gen_identity import GenIdentity

class K8sSpawner(KubeSpawner):
    vdi_applications = List(
        [],
        config=True,
        help="""
        List of Virtual Display applications that can be selected.
        """
    )

    @gen.coroutine
    def get_options_form(self):

        auth_state = yield self.user.get_auth_state()

        if not auth_state or not auth_state['oauth_user'] or not auth_state['oauth_user']['groups']:
            groups = []
        else:
            groups = auth_state['oauth_user']['groups']

        options = {
            "projects": groups,
            "applications": self.vdi_applications
        }
        return json.dumps(options)

    def get_specific_pvc_manifest(self, volume):
        """
        Make a pvc manifest for a given volume definition
        """
        labels = self._build_common_labels(self._expand_all(self.storage_extra_labels))

        annotations = self._build_common_annotations({})

        #del annotations["hub.jupyter.org/username"]

        pvcDict = {}
        pvcDict['name'] = self.pvc_name
        pvcDict['storage_class'] = self.storage_class
        pvcDict['access_modes'] = self.storage_access_modes
        pvcDict['selector'] = self.storage_selector
        pvcDict['storage'] = self.storage_capacity
        pvcDict['labels'] = labels
        pvcDict['annotations'] = annotations

        try:
            pvcDict['name'] = volume['persistentVolumeClaim']['claimName']
        except KeyError:
            pass

        try:
            pvcDict['storage_class'] = volume['storage_class']
        except KeyError:
            pass

        try:
            pvcDict['access_modes'] = volume['access_modes']
        except KeyError:
            pass

        try:
            pvcDict['storage'] = volume['storage']
        except KeyError:
            pass

        try:
            pvcDict['annotations'] = volume['annotations']
        except KeyError:
            pass

        try:
            pvcDict['labels'] = volume['labels']
        except KeyError:
            pass

        print(pvcDict)
        
        pvc = make_pvc(**pvcDict)
        pvc.spec.persistentVolumeReclaimPolicy = 'Retain'
        return pvc

    # def get_pv_manifest(self, volume):
    #     spec = {
    #         "capacity": {
    #             "storage": volume['storage_size']
    #         },
    #         "accessModes": volume['accessModes'],
    #         "persistentVolumeReclaimPolicy": "Retain",
    #         "storageClassName": volume['storage_class']
    #     }
    #     metadata = {
    #         "name": volume['name']
    #     }
    #     body = V1PersistentVolume("v1", None, metadata,  spec)
    #     return body


    @gen.coroutine
    def start(self):

        # take the user's token and use it to call Vault to issue a new certificate
        # and register the certificate
        auth_state = yield self.user.get_auth_state()

        self.log.info("oauth_user " + json.dumps(auth_state))
        self.log.info(".. as user " + self.user.name)

        user_profile = auth_state['oauth_user']

        # Force the selected project to be the user's group from the auth_state
        self.user_options['project'] = user_profile['groups']

        gen = GenIdentity()

        token = auth_state['access_token']

        user_project_id = self._expand_user_properties('{username}-{group}')

        secret = gen.generate(user_profile['preferred_username'],token, auth_state['refresh_token'], 'users-bbsae-xyz', user_project_id)

        try:
            yield self.asynchronize(
                self.api.create_namespaced_secret,
                namespace=self.namespace,
                body=secret
            )
        except ApiException as e:
            if e.status == 409:
                self.log.info("Secret for " + user_profile['preferred_username'] + " already exists, so doing an update.")
                yield self.asynchronize(
                    self.api.replace_namespaced_secret,
                    name=secret.metadata['name'],
                    namespace=self.namespace,
                    body=secret
                )

            else:
                raise

        self.pod_name = self._expand_user_properties(self.pod_name_template)

        self.volume_mounts = self._expand_all(self.volume_mounts)
        self.volumes = self._expand_all(self.volumes)

        for a in self.vdi_applications:
            if a["name"] == self.user_options['image'][0]:
                self.log.info("Using image " + a["container"])
                self.image = a["container"]

        self.log.info("environment " + json.dumps(self.environment))
        
        for key, value in self.environment.items():
            tvalue = self._expand_user_properties(value)
            self.log.info("env " + key + " : " + value + " -> " + tvalue)
            self.environment[key] = tvalue

        first = True
        for volume in self.volumes:
            if first:
                first = False
            else:
                pvc = self.get_specific_pvc_manifest(volume)
                try:
                    yield self.asynchronize(
                        self.api.create_namespaced_persistent_volume_claim,
                        namespace=self.namespace,
                        body=pvc
                    )
                except ApiException as e:
                    if e.status == 409:
                        self.log.info("PVC " + volume['name'] + " already exists, so did not create new pvc.")
                    else:
                        self.log.info("PVC " + volume['name'] + " Exception!")

        tuple = yield super().start()
        return tuple

    def get_pvc_manifest(self):
        self.pvc_name = self._expand_user_properties(self.pvc_name_template)
        return super().get_pvc_manifest()

    def _expand_user_properties(self, template):
        self.options_form = self.get_options_form
        # Make sure username and servername match the restrictions for DNS labels
        safe_chars = set(string.ascii_lowercase + string.digits)

        # Set servername based on whether named-server initialised
        if self.name:
            servername = '-{}'.format(self.name)
        else:
            servername = ''

        if 'project' in self.user_options:
            project = self.user_options['project'][0].lower().replace("/", "").replace("_","-")
        else:
            project = ''
        
        username = urllib.parse.unquote(self.user.name)

        userN = username.lower()

        # Special handling for a naming convention for users having the project ID at the end
        if len(project) > 0 and username.lower().endswith(project) == True:
            userN = username.split("-")[0]

        safe_username = ''.join([s if s in safe_chars else '-' for s in userN])
        #safe_username = escapism.escape(userN, safe=safe_chars, escape_char='-')

        formatDict = {}

        formatDict['userid'] = self.user.id
        formatDict['username'] = safe_username
        #formatDict['legacy_escape_username'] = legacy_escaped_username
        formatDict['servername'] = servername
        formatDict['group'] = project

        return template.format(**formatDict)
