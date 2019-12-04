from gevent import monkey

# Patch Sockets to make requests asynchronous
monkey.patch_all()

import logging, time, os, json, sys, signal, config

from gen_identity import GenIdentity

log = logging.getLogger(__name__)

conf = config.Config()

# logLevel = config['logLevel'].upper()

loggingLevel = getattr(logging, 'DEBUG')

logging.basicConfig(level=loggingLevel,
                    format='%(asctime)s - %(levelname)s - %(message)s')

user_project_id = os.environ["USER_PROJECT_ID"]

log.info("Identity Watcher Started for %s" % user_project_id)

while True:
    try:
        log.info("Check Identity...")
        gen = GenIdentity()

        jwt_str = os.environ['JWT']
        jwt = json.loads(jwt_str)

        gen.generate(jwt['access_token'], jwt['refresh_token'], 'users-bbsae-xyz', user_project_id)
    except:
        print("Unexpected error:", sys.exc_info())

    log.info("Sleep 60 seconds...")
    time.sleep(60)
