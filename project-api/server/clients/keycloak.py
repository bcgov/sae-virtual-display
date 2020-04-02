

# temp-principal
# role: realm-management / manage-users
#

# GET /{realm}/groups
# POST /{realm}/groups
import logging
import config
import datetime, time
import requests
import json
from string import Template

log = logging.getLogger(__name__)

class KeycloakClient():
    def __init__(self, addr, realm, username, password):
        self.addr = addr
        self.realm = realm
        self.username = username
        self.password = password
        self.access_token = None

    def session(self):
        url = "%s/auth/realms/%s/protocol/openid-connect/token" % (self.addr, self.realm)

        form = {
            "grant_type": 'password',
            'client_id': 'admin-cli',
            'username': self.username,
            'password': self.password
        }

        r = requests.post(url, data = form)

        if r.status_code == 200:
            self.access_token = r.json()['access_token']
            self.token_expires = datetime.datetime.now().timestamp() + r.json()['expires_in']
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to get session")

    def check_session (self):
        if self.access_token == None:
            self.session()
        elif self.token_expires < datetime.datetime.now().timestamp():
            log.info("Session expired - getting new session")
            self.session()
        else:
            diff = round(self.token_expires - datetime.datetime.now().timestamp())
            log.info("Session looks ok - good for another %s seconds" % diff)

    def list_all (self):
        url = "%s/auth/admin/realms/%s/groups?max=1000" % (self.addr, self.realm)
        return self._get(url)

    def join_project (self, project_id, username):
        self.join_group (project_id, username)

    def join_group (self, group_id, username):
        idref = self._find(group_id)

        if len(idref) == 0:
            log.debug("Group does not exist %s" % group_id)
            raise Exception("Failed to get group %s" % group_id)

        gid = idref[0]['id']

        idref = self._find_user(username)
        if len(idref) == 0:
            log.debug("User does not exist %s" % username)
            raise Exception("Failed to get user %s" % username)

        uid = idref[0]['id']

        url = "%s/auth/admin/realms/%s/users/%s/groups/%s" % (self.addr, self.realm, uid, gid)

        self._put(url)

    def leave_project (self, project_id, username):
        idref = self._find(project_id)

        if len(idref) == 0:
            log.debug("Project does not exist %s" % project_id)
            raise Exception("Failed to get project %s" % project_id)

        gid = idref[0]['id']

        idref = self._find_user(username)
        if len(idref) == 0:
            log.debug("User does not exist %s" % username)
            raise Exception("Failed to get user %s" % username)

        uid = idref[0]['id']

        url = "%s/auth/admin/realms/%s/users/%s/groups/%s" % (self.addr, self.realm, uid, gid)

        self._del(url)

    def add_project (self, name):
        self.add_group(name)

    def add_group (self, name):
        if len(self._find(name)) != 0:
            log.debug("Group already exists %s" % name)
            return

        data = {
            "name": name
        }

        url = "%s/auth/admin/realms/%s/groups" % (self.addr, self.realm)
        return self._add(url, data)

    def del_user (self, name):
        idref = self._find_user(name)

        if len(idref) == 0:
            log.debug("User does not exist %s" % name)
            raise Exception("Failed to get user %s" % name)

        id = idref[0]['id']

        url = "%s/auth/admin/realms/%s/users/%s" % (self.addr, self.realm, id)
        return self._del(url)

    def add_user (self, name, email, first_name, last_name, user_attributes):
        user = self._find_user(name)
        if len(user) != 0:
            log.debug("Username already exists %s" % name)
            return self.update_user(user[0], name, email, first_name, last_name, user_attributes)

        data = {
            "username": name,
            "email": email,
            "firstName": first_name,
            "lastName": last_name,
            "enabled": True,
            "attributes": {}
        }

        for k,v in user_attributes.items():
            log.debug("Added [%s] %s to %s" % (k, v, name))
            data['attributes'][k] = [v]

        url = "%s/auth/admin/realms/%s/users" % (self.addr, self.realm)
        return self._add(url, data)

    def update_user (self, user, name, email, first_name, last_name, user_attributes):
        data = {
            "email": email,
            "firstName": first_name,
            "lastName": last_name
        }
        log.debug(str(user))

        for k,v in user_attributes.items():
            log.debug("Added [%s] %s to %s" % (k, v, name))
            if "attributes" not in user:
                user['attributes'] = {}
            user['attributes'][k] = [v]

        for k,v in data.items():
            log.debug("Updating [%s] %s" % (k, v))
            user[k] = v
            
        url = "%s/auth/admin/realms/%s/users/%s" % (self.addr, self.realm, user['id'])
        return self._put(url, json.dumps(user))

    def get_project (self, name):
        idref = self._find(name)

        if len(idref) == 0:
            log.debug("Project does not exist %s" % name)
            raise Exception("Failed to get project %s" % name)

        id = idref[0]['id']

        url = "%s/auth/admin/realms/%s/groups/%s" % (self.addr, self.realm, id)
        return self._get(url)

    def get_project_membership (self, name):
        idref = self._find(name)

        if len(idref) == 0:
            log.debug("Project does not exist %s" % name)
            raise Exception("Failed to get project %s" % name)

        id = idref[0]['id']

        url = "%s/auth/admin/realms/%s/groups/%s/members" % (self.addr, self.realm, id)
        return self._get(url)

    def del_project (self, name):
        idref = self._find(name)

        if len(idref) == 0:
            log.debug("Project does not exist %s" % name)
            return

        id = idref[0]['id']

        url = "%s/auth/admin/realms/%s/groups/%s" % (self.addr, self.realm, id)
        return self._del(url)

    def _find (self, name):
        url = "%s/auth/admin/realms/%s/groups?search=%s" % (self.addr, self.realm, name)
        return self._get(url)

    def _find_user (self, name):
        url = "%s/auth/admin/realms/%s/users?username=%s" % (self.addr, self.realm, name)
        return self._get(url)

    def _get (self, url):
        self.check_session()
        headers = {
            'Content-Type':  "application/json",
            'Authorization': "Bearer %s" % self.access_token
        }
        r = requests.get(url, headers = headers)
        if r.status_code == 200:
            log.debug("[%s] %s" % (r.status_code, r.text))
            return r.json()
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to get.")

    def _add (self, url, data):
        self.check_session()
        headers = {
            'Content-Type':  "application/json",
            'Authorization': "Bearer %s" % self.access_token
        }

        r = requests.post(url, data = json.dumps(data), headers = headers)
        if r.status_code == 201:
            log.debug("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed %s" % url)

    def _del (self, url):
        self.check_session()
        headers = {
            'Content-Type':  "application/json",
            'Authorization': "Bearer %s" % self.access_token
        }

        r = requests.delete(url, headers = headers)
        if r.status_code == 204:
            log.debug("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed %s" % url)

    def _put (self, url, data = None):
        self.check_session()
        headers = {
            'Content-Type':  "application/json",
            'Authorization': "Bearer %s" % self.access_token
        }

        r = requests.put(url, data = data, headers = headers)
        if r.status_code == 204:
            log.debug("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed %s" % url)