import os
import logging
import config
import json
import tempfile
from string import Template
from command import call, call_jsonl

log = logging.getLogger(__name__)

# mc rb s3
# mc ls s3 --json
# mc admin policy add/remove/list/info s3
# mc admin policy remove s3 99-t08-s3-access
# mc admin policy info s3 readonly

# JSON error: "status": "error" (error.message, error.cause.message)
"""
{
 "status": "success",
 "type": "folder",
 "lastModified": "2020-03-04T22:40:51.217Z",
 "size": 0,
 "key": "99-t05-datasets/",
 "etag": ""
}
"""

class MinioClient():
    def __init__(self, addr, access_key, secret_key):
        self.addr = addr
        self.access_key = access_key
        self.secret_key = secret_key
        call("mc config host add s3 %s %s %s" % (addr, access_key, secret_key))

    def get_policies(self):
        reply = []
        pols = call_jsonl("mc admin policy list s3 --json")
        for pol in pols:
            reply.append(pol['policy'])
        return reply

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

        call("mc mb s3/%s-datasets" % project_id)
        call("mc mb s3/%s-working" % project_id)

        handle, filename = tempfile.mkstemp()
        with os.fdopen(handle, "wb") as tmp:
            tmp.write(json.dumps(policy).encode("utf-8"))

        call("mc admin policy add s3 %s-s3-access %s" % (project_id, filename))

