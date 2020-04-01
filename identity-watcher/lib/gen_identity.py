import os
import json
import requests
from datetime import datetime, timezone
import base64
from os import listdir
import logging
from command import call
import xml.etree.ElementTree as ET
from urllib.parse import urlencode
from minio_s3 import assume_role_with_web_identity

log = logging.getLogger(__name__)

class GenIdentity():
    def info (self, message):
        log.info(message)

    def refresh_jwt_token (self, refresh_token):
        url = os.environ['OAUTH2_TOKEN_URL']

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

    def vault_login(self, vault_addr, role, access_token, refresh_token, attempt):
        url = "%s/v1/auth/jwt/login" % vault_addr

        self.info("vault_login - " + url)

        payload = {'role': role, 'jwt': access_token}

        headers = {
            "Content-Type": "application/json"
        }

        x = requests.post(url, data = json.dumps(payload), headers = headers )   
        self.info("status_code %s" % x.status_code)

        if x.status_code != 200:
            self.info("text %s" % x.text)
            raise Exception("Failed to login")

        j = x.json()
        vault_token = j['auth']['client_token']

        return vault_token


    def generate(self, access_token, refresh_token, user_project_id, project_id):
        self.info("GenIdentity User Project=%s" % (user_project_id))
        
        pki_role = "pki-backend-role-%s" % project_id
        jwt_role = "sae-issue-cert-%s" % project_id

        vault_token = self.vault_login (os.environ['VAULT_ADDR'], jwt_role, access_token, refresh_token, 1)

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
        self.info("issue_cert " + json.dumps(j))


        call('curl -f -k -O ' + os.environ['CA_CHAIN_URI'])
        
        call('openssl pkcs12 -in ca_chain.pfx -out ca_chain.pem -password pass:password')

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

        call('pk12util -v -d sql:nssdb -K password -W password -i private.pfx')

        call('echo "password" > pass')
        call('certutil -A -n "ca-vaultpki-root" -t TC -i /cacerts/ca-vaultpki-root.crt -d sql:nssdb')
        call('certutil -A -n "ca-vaultpki-inter" -t TC -i /cacerts/ca-vaultpki-inter.crt -d sql:nssdb')
        call('certutil -L -d sql:nssdb')

        # Install the Root CA into the JAVA keystore
        call('rm -f jre_cacerts')
        call('keytool -trustcacerts -noprompt -keystore jre_cacerts -storepass changeit -alias root -import -file /cacerts/ca-vaultpki-root.crt')


        secret_data = {}

        secret_data['postgresql.crt'] = base64.b64encode(j['data']['certificate'].encode('utf-8')).decode('utf-8')
        secret_data['postgresql.key'] = base64.b64encode(j['data']['private_key'].encode('utf-8')).decode('utf-8')

        s3_config = {
            "aws_access_key_id": '',
            "aws_secret_access_key": '',        
            "endpoint_url": os.environ['MINIO_ADDR']
        }

        creds = assume_role_with_web_identity (s3_config, access_token)

        aws_credentials = """
[default]
aws_access_key_id={key}
aws_secret_access_key={secret}
aws_session_token={token}
        """.format(
            key=creds['AccessKeyId'],
            secret=creds['SecretAccessKey'],
            token=creds['SessionToken']
        )

        aws_credentials_r = """
aws_access_key_id <- "{key}"
aws_secret_access_key <- "{secret}"
aws_session_token <- "{token}"
        """.format(
            key=creds['AccessKeyId'],
            secret=creds['SecretAccessKey'],
            token=creds['SessionToken']
        )

        self.info("minio/s3 expiration " + str(creds['Expiration']))
        self.info("minio/s3 access key " + creds['AccessKeyId'])
        
        def diff_dates(date1, date2):
            return abs(date2-date1)

        minutes = divmod(diff_dates(datetime.now(timezone.utc), creds['Expiration']).seconds, 60)  
        self.info("minio/s3 expires in %d mins %d secs" % (minutes[0], minutes[1]))

        secret_data['aws-credentials'] = base64.b64encode(aws_credentials.encode('utf-8')).decode('utf-8')
        secret_data['aws-credentials-r'] = base64.b64encode(aws_credentials_r.encode('utf-8')).decode('utf-8')

        for f in listdir('nssdb'):
            data = open("nssdb/%s" % f, "rb").read()   
            b64 = base64.b64encode(data)
            secret_data[f] = b64.decode('utf-8')

        data = open("jre_cacerts", "rb").read()   
        b64 = base64.b64encode(data)
        secret_data["jre_cacerts"] = b64.decode('utf-8')

        namespace = 'vdi'
        metadata = {'name': "%s-cert" % user_project_id, 'namespace': namespace}

        self.info(secret_data.keys())

        return secret_data
