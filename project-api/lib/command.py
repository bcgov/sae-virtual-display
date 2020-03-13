import sys
import json
import subprocess
import logging
import traceback

log = logging.getLogger(__name__)

def call(*args):
    log.debug("CMD %s" % str(args))
    cmd = args
    if len(args) == 1:
        cmd = args[0].split(' ')
    try:
        output = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        for line in output.split(b'\n'):
            log.debug("CMD   %s" % line.decode("utf-8"))
    except subprocess.CalledProcessError as error:
        log.error("CMD FAILED %s" % str(args))
        log.error("CMD OUTPUT %s" % str(error.output))
        raise error

def call_jsonl(*args):
    log.debug("CMD_JSONL %s" % str(args))
    cmd = args
    if len(args) == 1:
        cmd = args[0].split(' ')
    output = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    log.debug("CMD_JSON OUT: %s" % output.decode("utf-8"))
    reply = []
    for line in output.split(b'\n'):
        jsonl = line.decode("utf-8")
        if len(jsonl) != 0:
            reply.append(json.loads(jsonl))
    return reply
