import os
import logging
import config
import json
import tempfile
import base64
from string import Template
from command import call, call_jsonl

log = logging.getLogger(__name__)

class MinioClient():
    def __init__(self, addr, access_key, secret_key):
        self.addr = addr
        self.access_key = access_key
        self.secret_key = secret_key
        call("mc config host add s3 %s %s %s" % (addr, access_key, secret_key))

    def list_all(self):
        return {
            "policies": self.get_policies(),
            "buckets": self.get_buckets()
        }

    def get_buckets(self):
        reply = []
        buckets = self.call_jsonl_check_errors("mc ls s3 --json")
        for bucket in buckets:
            reply.append(bucket['key'])
        return reply

    def get_policies(self):
        reply = []
        pols = self.call_jsonl_check_errors("mc admin policy list s3 --json")
        for pol in pols:
            reply.append(pol['policy'])
        return reply

    def del_buckets(self, project_id):
        log.info("Delete bucket? %s" % project_id)
        all = self.list_all()
        if "%s-datasets/" % project_id in all['buckets']:
            log.info("Deleting bucket %s-datasets" % project_id)
            self.call_jsonl_check_errors("mc rb --json s3/%s-datasets" % project_id)
        if "%s-working/" % project_id in all['buckets']:
            log.info("Deleting bucket %s-working" % project_id)
            self.call_jsonl_check_errors("mc rb --json s3/%s-working" % project_id)

    def del_project(self, project_id):
        all = self.list_all()
        if "%s-s3-access" % project_id in all['policies']:
            self.call_jsonl_check_errors("mc admin policy remove --json s3 %s-s3-access" % project_id)

    def get_project(self, project_id):
        policy = self.call_jsonl_check_errors("mc admin policy info --json s3 %s-s3-access" % project_id)
        return {
            "policy": json.loads(base64.b64decode(policy[0]["policyJSON"]).decode("utf-8"))
        }

    def add_project(self, project_id):
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                "Effect": "Allow",
                "Action": [
                    "s3:ListAllMyBuckets"
                ],
                "Resource": ["arn:aws:s3:::*"]
                },     
                {
                "Effect": "Allow",
                "Action": ["s3:ListBucket"],
                "Resource": ["arn:aws:s3:::%s-*" % project_id]
                },    
                {
                "Action": [
                    "s3:GetObject"
                ],
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:s3:::%s-datasets/*" % project_id
                ],
                "Sid": ""
                },
                {
                "Action": [
                    "s3:AbortMultipartUpload",
                    "s3:ListMultipartUploadParts",
                    "s3:DeleteObject",
                    "s3:GetObject",
                    "s3:PutObject"
                ],
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:s3:::%s-working/*" % project_id
                ],
                "Sid": ""
                }
            ]
        }

        self.call_jsonl_check_errors("mc mb --json s3/%s-datasets" % project_id)
        self.call_jsonl_check_errors("mc mb --json s3/%s-working" % project_id)

        handle, filename = tempfile.mkstemp()
        with os.fdopen(handle, "wb") as tmp:
            tmp.write(json.dumps(policy).encode("utf-8"))

        self.call_jsonl_check_errors("mc admin policy add --json s3 %s-s3-access %s" % (project_id, filename))

    def call_jsonl_check_errors(self, cmd):
        result = call_jsonl(cmd)
        if len(result) == 1 and "status" in result[0] and result[0]["status"] == "error":
            log.error("Error running %s" % cmd)
            log.error(result[0]["error"]["message"])
            log.error(result[0]["error"]["cause"]["message"])
            raise Exception("Failed to process request for Minio")
        return result