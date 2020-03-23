

# temp-principal
# role: realm-management / manage-users
#

# GET /{realm}/groups
# POST /{realm}/groups
import logging
import config
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
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to get session")

    def list_all (self):
        if self.access_token == None:
            self.session()

        url = "%s/auth/admin/realms/%s/groups?max=1000" % (self.addr, self.realm)
        return self._get(url)

    def add_project (self, name):
        if self.access_token == None:
            self.session()

        if len(self._find(name)) != 0:
            log.debug("Project already exists %s" % name)
            return

        data = {
            "name": name
        }

        url = "%s/auth/admin/realms/%s/groups" % (self.addr, self.realm)
        return self._add(url, data)

    def get_project (self, name):
        if self.access_token == None:
            self.session()

        idref = self._find(name)

        if len(idref) == 0:
            log.debug("Project does not exist %s" % name)
            raise Exception("Failed to get project %s" % name)

        id = idref[0]['id']

        url = "%s/auth/admin/realms/%s/groups/%s" % (self.addr, self.realm, id)
        return self._get(url)

    def del_project (self, name):
        if self.access_token == None:
            self.session()

        idref = self._find(name)

        if len(idref) == 0:
            log.debug("Project does not exist %s" % name)
            return

        id = idref[0]['id']

        url = "%s/auth/admin/realms/%s/groups/%s" % (self.addr, self.realm, id)
        return self._del(url)

    def _find (self, name):
        if self.access_token == None:
            self.session()

        url = "%s/auth/admin/realms/%s/groups?search=%s" % (self.addr, self.realm, name)
        return self._get(url)

    def _get (self, url):
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
