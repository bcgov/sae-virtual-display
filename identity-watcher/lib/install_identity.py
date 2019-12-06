import os
import base64
import logging
from command import call

log = logging.getLogger(__name__)

def install_files(secret_data):

    log.info("Writing Minio details..")
    with open("/tmp-auth-minio/config.json", "w") as f:
        log.info("WRITE /tmp-auth-minio/config.json")
        f.write(base64.b64encode(secret_data["mc-config.json"]).encode('utf-8'))

    log.info("Writing Postgres details..")
    for k in secret_data.keys():
        if k.startswith("postgresql."):
            with open("/tmp-pki-postgres/%s" % k, "w") as f:
                log.info("WRITE /tmp-pki-postgres/%s" % k)
                f.write(base64.b64encode(secret_data[k]).encode('utf-8'))

    log.info("Writing Browser NSSDB details..")
    for k in secret_data.keys():
        if not (k.startswith("postgresql.") or k == "refresh_token"):
            with open("/tmp-pki-nssdb/%s" % k, "w") as f:
                log.info("WRITE /tmp-pki-nssdb/%s" % k)
                f.write(base64.b64encode(secret_data[k]).encode('utf-8'))

    access = [
        "chown -R 1000:1000 /tmp-auth-minio/*",
        "chmod -R 0700 /tmp-auth-minio/*",
        "chown 1000:1000 /tmp-pki-postgres/*",
        "chmod 600 /tmp-pki-postgres/*",
        "chown 1000:1000 /tmp-pki-nssdb/*",
        "chmod 600 /tmp-pki-nssdb/*"
    ]

    for cmd in access:
        call(cmd)