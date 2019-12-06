import subprocess
import logging

log = logging.getLogger(__name__)

def call(*args):
    log.debug("CMD %s" % str(args))
    output = subprocess.check_output(args, stderr=subprocess.STDOUT)
    for line in output.split(b'\n'):
        log.debug("CMD   %s" % line.decode("utf-8"))
