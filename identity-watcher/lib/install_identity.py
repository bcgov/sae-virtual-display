import os
import sys
import traceback
import base64
import logging
import subprocess
from command import call

log = logging.getLogger(__name__)

def encoded_content (data):
    return base64.b64encode(data.encode('utf-8')).decode('utf-8')

def decoded_content (data):
    return base64.b64decode(data.encode('utf-8'))

def install_files(secret_data):

    log.info("Writing Minio/S3 details..")
    with open("/tmp-auth-minio/credentials", "wb") as f:
        log.info("Updating file: /tmp-auth-minio/credentials")
        f.write(decoded_content(secret_data["aws-credentials"]))

    log.info("Writing Postgres details..")
    for k in secret_data.keys():
        if k.startswith("postgresql."):
            with open("/tmp-pki-postgres/%s" % k, "wb") as f:
                log.info("Updating file:  /tmp-pki-postgres/%s" % k)
                f.write(decoded_content(secret_data[k]))

    log.info("Writing Browser NSSDB details..")
    for k in secret_data.keys():
        if not (k.startswith("postgresql.") or k == "refresh_token" or k == "jre_cacerts" or k == "aws-credentials" or k == "mc-config.json"):
            with open("/tmp-pki-nssdb/%s" % k, "wb") as f:
                log.info("Updating file:  /tmp-pki-nssdb/%s" % k)
                f.write(decoded_content(secret_data[k]))

    #log.info("Writing Java Keystore..")
    #with open("/tmp-pki-java/cacerts", "wb") as f:
    #    f.write(decoded_content(secret_data["jre_cacerts"]))
