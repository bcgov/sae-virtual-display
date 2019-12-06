from gevent import monkey

# Patch Sockets to make requests asynchronous
monkey.patch_all()

import logging, time, os, json, sys, signal, config

from gen_identity import GenIdentity
from install_identity import install_files
from command import call
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
        log.info("--")
        log.info("--")
        log.info("--")
        log.info("Check Identity...")
        gen = GenIdentity()

        if 'REFRESH_TOKEN_PATH' in os.environ:
            log.info("Read %s", os.environ['REFRESH_TOKEN_PATH'])
            with open(os.environ['REFRESH_TOKEN_PATH']) as f:
                refresh_token = f.read()
                log.info(refresh_token)

            log.info("Refreshing Token")
            access_token = gen.refresh_jwt_token(refresh_token)
            log.info("Access Token Refreshed - %s" % access_token)
            secret_data = gen.generate(access_token, refresh_token, 'users-bbsae-xyz', user_project_id)
            install_files (secret_data)
        else:
            jwt_str = os.environ['JWT']
            jwt = json.loads(jwt_str)
            secret_data = gen.generate(jwt['access_token'], jwt['refresh_token'], 'users-bbsae-xyz', user_project_id)
            install_files (secret_data)
        
    except KeyboardInterrupt:
        log.error("Keyboard Interrupted.  Exiting..")
        sys.exit(1)
    except:
        log.error("Unexpected error")
        log.error(str(sys.exc_info()))

    log.info("Sleep 60 seconds...")
    time.sleep(60)
