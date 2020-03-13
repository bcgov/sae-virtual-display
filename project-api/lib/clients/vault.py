import logging
import config
import requests
import json
from string import Template

log = logging.getLogger(__name__)

class VaultClient():
    def __init__(self, addr, token):
        self.addr = addr
        self.token = token

    def get_roles(self):
        url = "%s/v1/auth/jwt/role" % self.addr
        headers = {
            'Content-Type':  "application/json",
            'X-Vault-Token': self.token
        }
        r = requests.request('list', url, headers = headers)
        if r.status_code == 200:
            return r.json()['data']['keys']
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to get list of roles")

    def del_project(self, project_id):
        self._delete("%s/v1/sys/policies/acl/%s" % (self.addr, "sae-issue-cert-role-%s" % project_id))
        self._delete("%s/v1/auth/jwt/role/%s" % (self.addr, "sae-issue-cert-%s" % project_id))

    def get_project(self, project_id):
        policy = self._get("%s/v1/sys/policies/acl/%s" % (self.addr, "sae-issue-cert-role-%s" % project_id))
        role = self._get("%s/v1/auth/jwt/role/%s" % (self.addr, "sae-issue-cert-%s" % project_id))
        return {
            "name": project_id,
            "policy": policy,
            "role": role
        }

    def add_project(self, project_id):
        self._add_policy(project_id)
        self._add_role(project_id)

    def _delete (self, url):
        headers = {
            'Content-Type':  "application/json",
            'X-Vault-Token': self.token
        }
        r = requests.delete(url, headers = headers)
        if r.status_code == 204:
            log.info("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to delete.")

    def _get (self, url):
        headers = {
            'Content-Type':  "application/json",
            'X-Vault-Token': self.token
        }
        r = requests.get(url, headers = headers)
        if r.status_code == 200:
            log.info("[%s] %s" % (r.status_code, r.text))
            return r.json()
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to get.")

    def _add_role(self, project_id):
        role = {
            "role_type": "jwt",
            "token_policies": ["sae-issue-cert-role-%s" % project_id],
            "token_ttl": 20,
            "token_max_ttl": 20,
            "bound_audiences": [],
            "user_claim": "preferred_username",
            "bound_claims": {
                "groups": project_id
            }
        }

        url = "%s/v1/auth/jwt/role/%s" % (self.addr, "sae-issue-cert-%s" % project_id)
        headers = {
            'Content-Type':  "application/json",
            'X-Vault-Token': self.token
        }
        r = requests.post(url, data = json.dumps(role), headers = headers)
        if r.status_code == 200:
            log.info("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to add project %s" % project_id)

    def _add_policy(self, project_id):
        s = Template("""
path "pki_int/issue/$role" {
  capabilities = ["update"]
}
        """)
        policy = {
            "policy": s.substitute(role="pki-backend-role-%s" % project_id)
        }
        url = "%s/v1/sys/policies/acl/%s" % (self.addr, "sae-issue-cert-role-%s" % project_id)
        headers = {
            'Content-Type':  "application/json",
            'X-Vault-Token': self.token
        }
        r = requests.put(url, data = json.dumps(policy), headers = headers)
        if r.status_code == 204:
            log.info("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to add policy for project %s" % project_id)
