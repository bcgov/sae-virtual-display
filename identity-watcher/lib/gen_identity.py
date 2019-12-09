import os
import json
import requests
import base64
from os import listdir
import logging
from command import call

log = logging.getLogger(__name__)

# from jwt import (
#     JWT,
#     jwk_from_dict,
#     jwk_from_pem,
# )

from urllib.parse import urlencode

import xml.etree.ElementTree as ET


class GenIdentity():
    def info (self, message):
        log.info(message)

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

        self.info("New token expires in %s minutes" % round(int(j['expires_in'])/60))
        self.info("New refresh token expires in %s minutes" % round(int(j['refresh_expires_in'])/60))

        return j['access_token'], int(j['expires_in']), j['refresh_token'], int(j['refresh_expires_in'])       

    # def jwt_info(self, access_token, refresh_token):

        # jwt = JWT()
        # decoded = jwt.decode(access_token, '')
        # print(decoded)

    def vault_login(self, vault_addr, access_token, refresh_token, attempt):
        url = "%s/v1/auth/jwt/login" % vault_addr

        self.info("vault_login - " + url)

        payload = {'role': 'sae-issue-cert-role', 'jwt': access_token}

        headers = {
            "Content-Type": "application/json"
        }

        x = requests.post(url, data = json.dumps(payload), headers = headers )   
        self.info("status_code %s" % x.status_code)
        # if x.status_code == 400 and 'token is expired' in x.text:
        #     self.info("text %s" % x.text)
        #     if attempt == 2:
        #         raise Exception("Failed to login to Vault even after JWT refresh")
        #     access_token, refresh_token = self.refresh_jwt_token(refresh_token)
        #     return self.vault_login (vault_addr, access_token, refresh_token, 2)

        if x.status_code != 200:
            self.info("text %s" % x.text)
            raise Exception("Failed to login")

        self.info("vault login %s" % x.text)

        j = x.json()
        vault_token = j['auth']['client_token']

        return vault_token


    def generate(self, access_token, refresh_token, role, user_project_id):
        self.info("GenIdentity User Project=%s" % (user_project_id))

        #self.jwt_info (access_token, refresh_token)
        
        vault_token = self.vault_login (os.environ['VAULT_ADDR'], access_token, refresh_token, 1)

        # {
        #     "role": "dev-role",
        #     "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        # }   
        # curl \
        #     --request POST \
        #     --data @payload.json \
        #     https://127.0.0.1:8200/v1/auth/jwt/login
        # {
        #     "auth":{
        #         "client_token":"f33f8c72-924e-11f8-cb43-ac59d697597c",
        #         "accessor":"0e9e354a-520f-df04-6867-ee81cae3d42d",
        #         "policies":[
        #             "default",
        #             "dev",
        #             "prod"
        #         ],
        #         "lease_duration":2764800,
        #         "renewable":true
        #     },
        #     ...
        # }

        url = "%s/v1/pki_int/issue/%s" % (os.environ['VAULT_ADDR'], role)

        self.info("issue url %s" % url)

        payload = {'common_name': user_project_id}

        headers = {'X-Vault-Token': vault_token}

        x = requests.post(url, data = json.dumps(payload), headers = headers)   
        self.info("status_code %s" % x.status_code)
        if x.status_code != 200:
            self.info("text %s" % x.text)
            raise Exception("Failed to issue certificate")
        j = x.json()
        self.info("issue_cert " + json.dumps(j))


        call('curl -k -O ' + os.environ['CA_CHAIN_URI'])
        
        call('openssl pkcs12 -in ca_chain.pfx -out ca_chain.pem -password pass:password')

        # {
        #   "common_name": "www.example.com"
        # }

        # curl \
        #     --header "X-Vault-Token: ..." \
        #     --request POST \
        #     --data @payload.json \
        #     http://127.0.0.1:8200/v1/pki/issue/my-role

        # RUN pk12util -v -d sql:$HOME/.pki/nssdb -W password -i /tmp/private.pfx

        f = open("crt", "w")
        f.write(j['data']['certificate'])
        f.close()

        f = open("key", "w")
        f.write(j['data']['private_key'])
        f.close()

        call('openssl pkcs12 -export -out private.pfx -inkey key -in crt -password pass:password')

        call('rm -rf nssdb')

    

        call('mkdir nssdb')
        call('certutil -d nssdb -N --empty-password')

        print("Created new DB")
        call('ls -la nssdb')
        call('pk12util -v -d sql:nssdb -K password -W password -i private.pfx')
        print("Added private key")

        # call('echo "password" > pass')
        # call('certutil -A -n "ca-vaultpki-root" -t TC -i /cacerts/ca-vaultpki-root.crt -d sql:nssdb')
        # call('certutil -A -n "ca-vaultpki-inter" -t TC -i /cacerts/ca-vaultpki-inter.crt -d sql:nssdb')

        # call('certutil -L -d sql:nssdb')

        # #Usage:   pk12util -i importfile [-d certdir] [-P dbprefix] [-h tokenname]
        # #                 [-k slotpwfile | -K slotpw] [-w p12filepwfile | -W p12filepw]
        # #                 [-v]

        secret_data = {}

        secret_data['postgresql.crt'] = base64.b64encode(j['data']['certificate'].encode('utf-8')).decode('utf-8')
        secret_data['postgresql.key'] = base64.b64encode(j['data']['private_key'].encode('utf-8')).decode('utf-8')

        # ~/.mc/config.json
        # MINIO Configuration:
        # {
        #         "version": "9",
        #         "hosts": {
        #                 "minio": {
        #                         "url": "",
        #                         "accessKey": "",
        #                         "secretKey": "",
        #                         "api": "s3v4",
        #                         "lookup": "auto"
        #                 }
        #         }
        # }

        # https://minio.dev18.bbsae.xyz?Action=AssumeRoleWithWebIdentity&DurationSeconds=3600&WebIdentityToken=$JWT_TOKEN&Version=2011-06-15
    

        payload = {
            'Action': 'AssumeRoleWithWebIdentity',
            # 'DurationSeconds': 43200, # 12 hours - max allowed
            'Version': '2011-06-15', # Always this - it's an AWS spec thing
            'WebIdentityToken': access_token,
            'Policy': '{"Version": "2012-10-17","Statement": [{"Action": ["s3:*"],"Effect": "Allow","Resource": ["arn:aws:s3:::*"]}]}'
        }

        url = "%s?%s" % (os.environ['MINIO_ADDR'], urlencode(payload))

        self.info("minio url %s" % url)

        headers = {
            'Content-Type': 'application/json'
        }

        x = requests.post(url, headers = headers, verify = 'ca_chain.pem')   
        self.info("status_code %s" % x.status_code)
        self.info("response %s" % x.content)
        if x.status_code != 200:
            self.info("text %s" % x.content)
            raise Exception("Failed to authenticate with Minio")

        # <AssumeRoleWithWebIdentityResponse xmlns="https://sts.amazonaws.com/doc/2011-06-15/">
        #   <AssumeRoleWithWebIdentityResult>
        #     <AssumedRoleUser>
        #       <Arn></Arn>
        #       <AssumeRoleId></AssumeRoleId>
        #     </AssumedRoleUser>
        #     <Credentials>
        #       <AccessKeyId>VCM1GZV1TZWH0NAEDRH0</AccessKeyId>
        #       <SecretAccessKey>1qgtbxqzG+ZTlxTAK7uQBj9hmJD1xV56Zp7Qp51r</SecretAccessKey>
        #       <Expiration>2019-10-25T00:32:03Z</Expiration>
        #       <SessionToken>eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJWQ00xR1pWMVRaV0gwTkFFRFJIMCIsImFjciI6IjEiLCJhdXRoX3RpbWUiOjAsImF6cCI6IndvcmtiZW5jaCIsImVtYWlsIjoidW5rbm93bkBwb3BkYXRhLmJjLmNhIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJleHAiOjE1NzE5NjM1MjMsImZhbWlseV9uYW1lIjoiQ29wZSIsImdpdmVuX25hbWUiOiJBaWRhbiBDb3BlIiwiZ3JvdXBzIjpbIi9leHBvcnRlcnN0ZyIsIi9wcm9qZWN0XzEiLCIvcHJvamVjdF8yIiwiL3NyZS11c2VycyIsIi85OS10MDUiXSwiaWF0IjoxNTcxOTYzMjIzLCJpc3MiOiJodHRwczovL2F1dGhzdGcucG9wZGF0YS5iYy5jYS9hdXRoL3JlYWxtcy9teXBvcGRhdGEiLCJqdGkiOiI5NzBhMDdmNi1mZTY0LTRhZjYtOTdiNC0zOTUxZTE3NmQ2NzgiLCJuYW1lIjoiQWlkYW4gQ29wZSBDb3BlIiwibmJmIjowLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhY29wZS05OS10MDUiLCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJzZXNzaW9uX3N0YXRlIjoiOGU5N2MxMTMtMmYzYi00OTk4LWJhMzItMDU2M2RhODRjNDY1Iiwic3ViIjoiZGM2NjBiOTQtYTJmMC00ZGI3LTg2MTgtMjBhNWVmMmQwNmM2IiwidHlwIjoiQmVhcmVyIn0.Ns3R90RlW5wGFydbiDzG71n5FWZgd42JWXDiTAGEyCFbske6S1Q4RNgZcXUn_2t6VXsCLG-SoXV9iR4xjxp5hg</SessionToken>
        #     </Credentials>
        #     <SubjectFromWebIdentityToken>dc660b94-a2f0-4db7-8618-20a5ef2d06c6</SubjectFromWebIdentityToken>
        #   </AssumeRoleWithWebIdentityResult>
        #   <ResponseMetadata>
        #     <RequestId>15D0BC405D478442</RequestId>
        #   </ResponseMetadata>
        # </AssumeRoleWithWebIdentityResponse>    

        root = ET.fromstring(x.text)


        accessKeyId = root[0][1][0].text
        secretAccessKey = root[0][1][1].text
        expiration = root[0][1][2].text

        # Not able to get STS to work at the moment, so having to pass in the master keys
        #
        minio_secret = {
            "version": "9",
            "hosts": {
                    "minio": {
                            "url": os.environ['MINIO_ADDR'],
                            "accessKey": os.environ['MINIO_ACCESS_KEY_ID'], # accessKeyId,
                            "secretKey": os.environ['MINIO_SECRET_ACCESS_KEY'], # secretAccessKey,
                            "api": "s3v4",
                            "lookup": "auto"
                    }
            }
        }

        self.info("minio access key " + accessKeyId)
        self.info("minio secret " + secretAccessKey)
        self.info("minio expiration " + expiration)

        secret_data['mc-config.json'] = base64.b64encode(json.dumps(minio_secret).encode('utf-8')).decode('utf-8')

        for f in listdir('nssdb'):
            data = open("nssdb/%s" % f, "rb").read()   
            b64 = base64.b64encode(data)
            secret_data[f] = b64.decode('utf-8')

        # data = open("nssdb/cert9.db", "rb").read()
        # cert9 = base64.b64encode(data)
        # data = open("nssdb/key4.db", "rb").read()
        # key4 = base64.b64encode(data)
        # data = open("nssdb/pkcs11.txt", "rb").read()
        # pkcs11 = base64.b64encode(data)


        namespace = 'vdi'
        metadata = {'name': "%s-cert" % user_project_id, 'namespace': namespace}
        # data=  {
        #     'cert9.db': cert9.decode("utf-8"), 
        #     'key4.db': key4.decode("utf-8"),
        #     'pkcs11.txt': pkcs11.decode("utf-8")
        # }
        #secret = dict('v1', secret_data , 'Secret', metadata, type='Opaque')
        #print("Secret name = %s" % secret.metadata['name'])
        print(secret_data.keys())
        return secret_data
