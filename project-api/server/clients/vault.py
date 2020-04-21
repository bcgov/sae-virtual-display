import logging
import config
import requests
import json
import sys
import traceback
from string import Template

log = logging.getLogger(__name__)

class VaultClient():
    def __init__(self, addr, token):
        self.addr = addr
        self.token = token

    def list_all(self):
        return {
            "jwt_roles": self.get_roles(),
            "pki_roles": self.get_pki_roles(),
            "policies": self.get_policies(),
            "applications_released": self.get_package_release(),
            "applications_request": self.get_package_requests()
        }

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

    def get_pki_roles(self):
        url = "%s/v1/pki_int/roles" % self.addr
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

    def get_policies(self):
        url = "%s/v1/sys/policies/acl" % self.addr
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
        self._delete("%s/v1/pki_int/roles/%s" % (self.addr, "pki-backend-role-%s" % project_id))

    def get_project(self, project_id):
        policy = self._get("%s/v1/sys/policies/acl/%s" % (self.addr, "sae-issue-cert-role-%s" % project_id))
        role = self._get("%s/v1/auth/jwt/role/%s" % (self.addr, "sae-issue-cert-%s" % project_id))
        pki_role = self._get("%s/v1/pki_int/roles/%s" % (self.addr, "pki-backend-role-%s" % project_id))
        return {
            "name": project_id,
            "policy": policy,
            "jwt_role": role,
            "pki_role": pki_role
        }

    def add_project(self, project_id):
        self._add_policy(project_id)
        self._add_role(project_id)
        self._add_pki_role(project_id)

    def update_package_request (self, data):
        url = "%s/v1/secret/bbsae/applications_request" % (self.addr)
        self._put(url, data, 204)

    def delete_package_request (self):
        url = "%s/v1/secret/bbsae/applications_request" % (self.addr)
        self._delete(url)

    def get_package_requests (self):
        try:
            request = self._get("%s/v1/secret/bbsae/applications_request" % (self.addr))
            if 'applications' in request['data']:
                request['data']['applications_formatted'] = json.dumps(request['data']['applications'], indent=4)
            return request['data']
        except Exception as ex:
            log.error("Exception %s" % ex)
            traceback.print_exc(file=sys.stdout)
            log.warn("No package request.")
            return None

    def get_package_release (self):
        try:
            request = self._get("%s/v1/secret/bbsae/applications_released" % (self.addr))
            return request['data']
        except Exception as ex:
            log.error("Exception %s" % ex)
            traceback.print_exc(file=sys.stdout)
            log.warn("No package release recorded.")
            return {}

    def _delete (self, url):
        headers = {
            'Content-Type':  "application/json",
            'X-Vault-Token': self.token
        }
        r = requests.delete(url, headers = headers)
        if r.status_code == 204:
            log.debug("[%s] %s" % (r.status_code, r.text))
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
            log.debug("[%s] %s" % (r.status_code, r.text))
            return r.json()
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to get.")

    # vault_pki_secret_backend_role : "pki-backend-role-%s" % project_id
    #
    # _add_pki_role()
    #
    # resource "vault_pki_secret_backend_role" "users" {
    #   backend          = vault_mount.pki_int.path
    #   name             = "users-bbsae-xyz"
    #   allow_subdomains = false
    #   max_ttl          = 86400 # 24 hours
    #   allow_any_name   = true
    #   server_flag      = false
    #   client_flag      = true
    #   require_cn       = true
    #   key_usage        = ["DigitalSignature","KeyAgreement","KeyEncipherment"]
    #   organization     = ["Data Innovation Programme @ PopDataBC"]
    # }
    def _add_pki_role(self, project_id):
        role = {
            "name": "pki-backend-role-%s" % project_id,
            "max_ttl": 86400,
            "allow_any_name": True,
            "server_flag": False,
            "client_flag": True,
            "require_cn": True,
            "key_usage": ["DigitalSignature","KeyAgreement","KeyEncipherment"],
            "organization": "BBSAE Org"
        }

        url = "%s/v1/pki_int/roles/%s" % (self.addr, "pki-backend-role-%s" % project_id)
        headers = {
            'Content-Type':  "application/json",
            'X-Vault-Token': self.token
        }
        r = requests.post(url, data = json.dumps(role), headers = headers)
        if r.status_code == 204:
            log.debug("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to add project %s" % project_id)

    #
    # _add_jwt_role()
    #
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
            log.debug("[%s] %s" % (r.status_code, r.text))
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
            log.debug("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed to add policy for project %s" % project_id)

    def _put(self, url, payload, expected_status):
        headers = {
            'Content-Type':  "application/json",
            'X-Vault-Token': self.token
        }
        r = requests.put(url, data = json.dumps(payload), headers = headers)
        if r.status_code == expected_status:
            log.debug("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("[%s] %s" % (r.status_code, r.text))
            raise Exception("Failed call to Vault")