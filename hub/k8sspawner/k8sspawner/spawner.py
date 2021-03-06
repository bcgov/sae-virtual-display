"""
JupyterHub Spawner to spawn user notebooks on a Kubernetes cluster.

This module exports `K8sSpawner` class, which is the actual spawner
implementation that should be used by JupyterHub.
"""

import os
import sys
import string
import escapism
import json
import requests
import urllib.parse
import traceback
from traitlets import (
    List,
    Dict
)
from tornado import gen

from kubespawner.spawner import KubeSpawner
from kubespawner.objects import make_pvc
from kubernetes.client.rest import ApiException
from kubernetes.client import V1PersistentVolume

from k8sspawner.gen_identity import GenIdentity

class K8sSpawner(KubeSpawner):

   
    def get_applications(self):
      with open('/vdi/applications.json') as infile:
        return json.load(infile)
        
    @gen.coroutine
    def get_options_form(self):

        auth_state = yield self.user.get_auth_state()

        if not auth_state or not auth_state['oauth_user'] or 'groups' not in auth_state['oauth_user']:
            groups = []
        else:
            groups = auth_state['oauth_user']['groups']

        options = {
            "projects": groups,
            "applications": self.get_applications()
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

    def publish_event(self, payload):

        url = "%s/v1/events" % os.environ['PROJECT_API_URL']
        token = os.environ['PROJECT_API_TOKEN']
        try:
            headers = {
                'Content-Type':  "application/json",
                'x-api-key': token
            }
            r = requests.post(url, data = json.dumps(payload), headers = headers)
            if r.status_code == 200:
                self.log.debug("[%s] %s" % (r.status_code, r.text))
            else:
                self.log.error("Notification to %s failed" % url)
                self.log.error("[%s] %s" % (r.status_code, r.text))
        except:
            self.log.error("Notification to %s failed" % url)
            traceback.print_exc(file=sys.stdout)

    def gen_user(self, user_project_id, user_profile):

        groups = user_profile['groups']

        url = "%s/v1/internalusers/%s" % (os.environ['PROJECT_API_URL'], user_project_id)
        token = os.environ['PROJECT_API_TOKEN']
        try:
            headers = {
                'Content-Type':  "application/json",
                'x-api-key': token
            }
            payload = {
                'groups': groups,
                'first_name': user_profile['given_name'],
                'last_name': user_profile['family_name'],
                'email': user_profile['email']
            }
            if "businessCategory" in user_profile:
                payload["user_attributes"] = {
                    "businessCategory": user_profile["businessCategory"]
                }

            r = requests.put(url, data = json.dumps(payload), headers = headers)
            if r.status_code == 200:
                self.log.debug("PUT /v1/internalusers/%s [%s] %s" % (user_project_id, r.status_code, r.text))
            else:
                self.log.error("Internal user setup failed - %s" % url)
                self.log.error("[%s] %s" % (r.status_code, r.text))
                self.publish_event({"action": "bbsae_spawn", "project": "", "actor": 'hub', "success": False, "message": "Failed setting up user %s" % user_project_id})
        except:
            self.log.error("Internal user setup failed - %s" % url)
            traceback.print_exc(file=sys.stdout)

    @gen.coroutine
    def start(self):

        # take the user's token and use it to call Vault to issue a new certificate
        # and register the certificate
        auth_state = yield self.user.get_auth_state()

        self.log.info(".. as user " + self.user.name)

        user_profile = auth_state['oauth_user']

        self.log.info(".. as user " + str(user_profile))

        # Force the selected project to be the user's group from the auth_state
        self.user_options['groups']  = user_profile['groups']

        self.user_options['project'] = []

        for grp in user_profile['groups']:
            self.log.info(".. Project? " + grp)

            if grp.split('-')[0].isnumeric():
                self.log.info(".. Project? " + grp + " == YES")
                self.user_options['project'].append(grp)

        self.user_options['username'] = user_profile['preferred_username']

        gen = GenIdentity()

        token = auth_state['access_token']
        self.log.debug(token)

        project_id = self._expand_user_properties('{group}')
        user_project_id = self._expand_user_properties('{username}-{group}')

        self.gen_user (user_project_id, user_profile)

        # Handle the scenario where the user_options for image can come through on
        # the POST as an array or a single string.
        containerImage = self.user_options['image']
        if (isinstance(containerImage, list)):
            containerImage = containerImage[0]

        login_username = user_profile['preferred_username']

        try:
            secret = gen.generate(login_username, token, auth_state['refresh_token'], user_project_id, project_id)
            self.publish_event({"action": "bbsae_spawn", "project": self.user_options['project'], "actor": urllib.parse.unquote(login_username), "application": containerImage, "success": True, "message": "Spawning %s" % containerImage})
        except:
            self.publish_event({"action": "bbsae_spawn", "project": self.user_options['project'], "actor": urllib.parse.unquote(login_username), "application": containerImage, "success": False, "message": "Failed to spawn %s" % containerImage})
            raise

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

        self.log.info("user options " + json.dumps(self.user_options))


        self.log.info("image (default) " + self.image)

        for a in self.get_applications():
            if a["name"] == containerImage:
                self.log.info("Using image " + a["container"])
                self.image = a["container"]

        self.log.info("image (selected) " + self.image)

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

        if 'username' in self.user_options:
            userN = urllib.parse.unquote(self.user_options['username']).lower()
        else:
            userN = urllib.parse.unquote(self.user.name).lower()

        # Special handling for a naming convention for users having the project ID at the end
        if len(project) > 0 and userN.endswith(project) == True:
            userN = userN[0:0-(len(project)+1)]

        safe_username = ''.join([s if s in safe_chars else '-' for s in userN])

        formatDict = {}

        formatDict['userid'] = self.user.id
        formatDict['username'] = "oid-" + safe_username
        formatDict['servername'] = servername.lower().replace("/", "").replace("_","-")
        formatDict['group'] = project
 
        return template.format(**formatDict)
