import subprocess
import logging

log = logging.getLogger(__name__)

def call(*args):
    log.debug("CMD %s" % str(args))
    cmd = args
    if len(args) == 1:
        cmd = args[0].split(' ')
    output = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    for line in output.split(b'\n'):
        log.debug("CMD   %s" % line.decode("utf-8"))
