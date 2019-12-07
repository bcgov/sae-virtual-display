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

def install_files(secret_data):

    log.info("Writing Minio details..")
    with open("/tmp-auth-minio/config.json", "w") as f:
        log.info("Updating file: /tmp-auth-minio/config.json")
        f.write(encoded_content(secret_data["mc-config.json"]))

    log.info("Writing Postgres details..")
    for k in secret_data.keys():
        if k.startswith("postgresql."):
            with open("/tmp-pki-postgres/%s" % k, "w") as f:
                log.info("Updating file:  /tmp-pki-postgres/%s" % k)
                f.write(encoded_content(secret_data[k]))

    log.info("Writing Browser NSSDB details..")
    for k in secret_data.keys():
        if not (k.startswith("postgresql.") or k == "refresh_token"):
            with open("/tmp-pki-nssdb/%s" % k, "w") as f:
                log.info("Updating file:  /tmp-pki-nssdb/%s" % k)
                f.write(encoded_content(secret_data[k]))

    log.info("Setting access..")
    access = [
        "chown -R 1000:1000 /tmp-auth-minio/*",
        "chmod -R 0700 /tmp-auth-minio/*",
        "chown 1000:1000 /tmp-pki-postgres/*",
        "chmod 600 /tmp-pki-postgres/*",
        "chown 1000:1000 /tmp-pki-nssdb/*",
        "chmod 600 /tmp-pki-nssdb/*"
    ]

    for cmd in access:
        try:
            call(cmd)
        except subprocess.CalledProcessError as ex:
            log.error("Failed to update access for %s" % cmd)
            log.error(str(sys.exc_info()))
            tb = traceback.format_exc()
            log.error(str(tb))
            log.error("Return code %d" % ex.returncode)
            log.error("Return stdout/stderr %s" % ex.output)
   