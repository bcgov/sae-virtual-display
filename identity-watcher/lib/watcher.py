from gevent import monkey

# Patch Sockets to make requests asynchronous
monkey.patch_all()

import traceback, logging, time, os, json, sys, signal, config

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

sleep_time = 60

if 'REFRESH_TOKEN_PATH' in os.environ:
    log.info("Read %s", os.environ['REFRESH_TOKEN_PATH'])
    with open(os.environ['REFRESH_TOKEN_PATH']) as f:
        refresh_token = f.read()
        log.info(refresh_token)
else:
    jwt_str = os.environ['JWT']
    jwt = json.loads(jwt_str)
    refresh_token = jwt['refresh_token']
    log.info(refresh_token)

errors = 0

while True:
    log.info("Sleeping %d minutes..." % int(sleep_time/60))
    time.sleep(sleep_time)

    if errors == 10:
        log.error("Too many errors.. turning off identity watcher.")
        sleep_time = 60*60*4 # 4 hr
    else:
        try:
            log.info("--")
            log.info("--")
            log.info("--")
            log.info("Check Identity...")
            gen = GenIdentity()

            log.info("Refreshing Token")
            access_token, expires_on, refresh_token, refresh_expires_on = gen.refresh_jwt_token(refresh_token)

            sleep_time = max(60, min(expires_on, refresh_expires_on) - 120) # 2 minute buffer, wait atleast 60 seconds

            log.info("Access Token Refreshed - new sleep time %d - %s" % (sleep_time, access_token))
            secret_data = gen.generate(access_token, refresh_token, 'users-bbsae-xyz', user_project_id)
            install_files (secret_data)
            
        except KeyboardInterrupt:
            log.error("Keyboard Interrupted.  Exiting..")
            sys.exit(1)
        except:
            log.error("Unexpected error")
            log.error(str(sys.exc_info()))
            tb = traceback.format_exc()
            log.error(str(tb))
            errors = errors + 1

