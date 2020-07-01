import os
import json
import requests
import base64
from os import listdir
import tempfile
import shutil
from urllib.parse import urlencode

import xml.etree.ElementTree as ET

from kubernetes.client.models import (
    V1Secret
)

class GenIdentity():
    def info (self, message):
        print(message)

    def refresh_jwt_token (self, refresh_token):
        # Check if token as expired, and if so, try and refresh it
        # curl -X POST -H 'Authorization: Basic dGVzdGNsaWVudDpzZWNyZXQ=' -d 'refresh_token=fdb8fdbecf1d03ce5e6125c067733c0d51de209c&grant_type=refresh_token' localhost:3000/oauth/token
        url = os.environ['OAUTH2_TOKEN_URL']
        self.info("refresh_jwt_token - " + url)

        payload = {
            'refresh_token': refresh_token, 
            'grant_type': 'refresh_token',
            'client_id': os.environ['OAUTH2_CLIENT_ID'],
            'client_secret': os.environ['OAUTH2_CLIENT_SECRET']
        }

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        x = requests.post(url, data = payload, headers = headers )   
        if x.status_code != 200:
            self.info("text %s" % x.text)
            raise Exception("Failed to refresh token from OIDC provider")

        j = x.json()
        return j['access_token']        

    def vault_login(self, vault_addr, role, access_token, refresh_token, attempt):
        url = "%s/v1/auth/jwt/login" % vault_addr

        self.info("vault_login - " + url)

        payload = {'role': role, 'jwt': access_token}

        headers = {
            "Content-Type": "application/json"
        }

        x = requests.post(url, data = json.dumps(payload), headers = headers )   
        self.info("status_code %s" % x.status_code)
        if x.status_code == 400 and 'token is expired' in x.text:
            if attempt == 2:
                raise Exception("Failed to login to Vault even after JWT refresh")
            access_token = self.refresh_jwt_token(refresh_token)
            return self.vault_login (vault_addr, role, access_token, refresh_token, 2)

        if x.status_code != 200:
            self.info("text %s" % x.text)
            raise Exception("Failed to login")

        j = x.json()
        vault_token = j['auth']['client_token']

        return access_token, vault_token
        
    def generate(self, user_id, access_token, refresh_token, user_project_id, project_id):
        self.info("GenIdentity U=%s, P=%s" % (user_id, user_project_id))

        pki_role = "pki-backend-role-%s" % project_id
        jwt_role = "sae-issue-cert-%s" % project_id

        access_token, vault_token = self.vault_login (os.environ['VAULT_ADDR'], jwt_role, access_token, refresh_token, 1)

        url = "%s/v1/pki_int/issue/%s" % (os.environ['VAULT_ADDR'], pki_role)

        self.info("issue url %s" % url)

        payload = {'common_name': user_project_id}

        headers = {'X-Vault-Token': vault_token}

        x = requests.post(url, data = json.dumps(payload), headers = headers)   
        self.info("status_code %s" % x.status_code)
        if x.status_code != 200:
            self.info("text %s" % x.text)
            raise Exception("Failed to issue certificate")
        j = x.json()
        self.info("issue_cert SERIAL NUMBER " + j['data']['serial_number'])


        dirpath = tempfile.mkdtemp()
        self.info("Building creds in %s" % dirpath)


        f = open("%s/crt" % dirpath, "w")
        f.write(j['data']['certificate'])
        f.close()

        f = open("%s/key" % dirpath, "w")
        f.write(j['data']['private_key'])
        f.close()

        os.system("(cd %s; openssl pkcs12 -export -out private.pfx -inkey key -in crt -password pass:password)" % dirpath)


        os.system('mkdir %s/nssdb && certutil -d %s/nssdb -N --empty-password' % (dirpath, dirpath))
        print("Created new DB")
        os.system('pk12util -v -d sql:%s/nssdb -K password -W password -i %s/private.pfx' % (dirpath, dirpath))
        print("Added private key")

        #os.system('echo "password" > pass')
        os.system('certutil -A -n "ca-vaultpki-root" -t TC -i /cacerts/ca-vaultpki-root.crt -d sql:%s/nssdb' % dirpath)
        os.system('certutil -A -n "ca-vaultpki-inter" -t TC -i /cacerts/ca-vaultpki-inter.crt -d sql:%s/nssdb' % dirpath)
        os.system('certutil -L -d sql:%s/nssdb' % dirpath)

        os.system('ls -la %s/nssdb' % dirpath)

        secret_data = {}
        secret_data['refresh_token'] = base64.b64encode(refresh_token.encode('utf-8')).decode('utf-8')
        secret_data['postgresql.crt'] = base64.b64encode(j['data']['certificate'].encode('utf-8')).decode('utf-8')
        secret_data['postgresql.key'] = base64.b64encode(j['data']['private_key'].encode('utf-8')).decode('utf-8')

        for f in listdir('%s/nssdb' % dirpath):
            data = open("%s/nssdb/%s" % (dirpath, f), "rb").read()   
            b64 = base64.b64encode(data)
            secret_data[f] = b64.decode('utf-8')

        self.info("Deleting temp folder %s" % dirpath)
        shutil.rmtree(dirpath)

        namespace = 'vdi'
        metadata = {'name': "%s-cert" % user_project_id, 'namespace': namespace}
        secret = V1Secret('v1', secret_data , 'Secret', metadata, type='Opaque')
        print("Secret name = %s" % secret.metadata['name'])
        print(secret_data.keys())
        return secret
