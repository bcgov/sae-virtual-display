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

from tornado import gen

from kubespawner.spawner import KubeSpawner
from kubespawner.objects import make_pvc
from kubernetes.client.rest import ApiException
from kubernetes.client import V1PersistentVolume

from k8sspawner.gen_identity import GenIdentity

class K8sSpawner(KubeSpawner):
    @gen.coroutine
    def get_options_form(self):

        auth_state = yield self.user.get_auth_state()

        if not auth_state or not auth_state['oauth_user'] or not auth_state['oauth_user']['groups']:
            return

        groups = auth_state['oauth_user']['groups']

        options = {
            "projects": groups,
            "applications": ["notebook", "browser", "rstudio"]
        }
        return json.dumps(options)

    def set_image_options(self, images):
        self.image_options = images

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
        
        return make_pvc(**pvcDict)

    def get_pv_manifest(self, volume):
        spec = {
            "capacity": {
                "storage": volume['storage_size']
            },
            "accessModes": volume['accessModes'],
            "persistentVolumeReclaimPolicy": "Retain",
            "storageClassName": volume['storage_class']
        }
        metadata = {
            "name": volume['name']
        }
        body = V1PersistentVolume("v1", None, metadata,  spec)
        return body


    @gen.coroutine
    def start(self):

        # take the user's token and use it to call Vault to issue a new certificate
        # and register the certificate
        auth_state = yield self.user.get_auth_state()

        self.log.info("oauth_user " + json.dumps(auth_state))

        gen = GenIdentity()

        user_profile = auth_state['oauth_user']

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

        self.volume_mounts = self._expand_all(self.volume_mounts)
        self.volumes = self._expand_all(self.volumes)

        self.image = self.image_options[self.user_options['image'][0]]

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

        try:
            project = self.user_options['project'][0].lower().replace("_", "-").replace("/", "")
        except Exception:
            project = ''

        userN = ''
        unAndGroups = self.user.name.lower().split("-")
        if (len(unAndGroups) >= 1):
            userN = unAndGroups[0]

        # If user name ends with the project then do not bother using it to form the new identity
        if len(project) > 0 and self.user.name.lower().endswith(project) == False:
            userN = "%s-%s" % (self.user.name, project)

        legacy_escaped_username = ''.join([s if s in safe_chars else '-' for s in userN.lower()])
        safe_username = escapism.escape(userN, safe=safe_chars, escape_char='-').lower()

        formatDict = {}

        formatDict['userid'] = self.user.id
        formatDict['username'] = safe_username
        formatDict['legacy_escape_username'] = legacy_escaped_username
        formatDict['servername'] = servername
        formatDict['group'] = project

        return template.format(**formatDict)
