
import os
import sys
import json
import datetime
import config
import requests
import logging
import traceback
from datetime import timezone

conf = config.Config().data
log = logging.getLogger(__name__)

def activity (action, repo, project, actor, success, message):

    print("Recording activity")
    with open('/audit/activity.log', 'a', 1) as f:

        payload = {
            "action" : action,
            "repository" : repo,
            "project" : project,
            "actor" : actor,
            "ts" : utc_to_local(datetime.datetime.now()).isoformat(),
            "success": success,
            "message": message
        }
        f.write(json.dumps(payload) + os.linesep)

        notify(payload)

def utc_to_local(utc_dt):
    return utc_dt.replace(tzinfo=timezone.utc).astimezone(tz=None)

def notify(payload):
    if conf['notification']['enabled'] == False:
        return

    try:
        url = conf['notification']['url']
        headers = {
            'Content-Type':  "application/json",
            'X-Api-Token': conf['notification']['token']
        }
        r = requests.post(url, data = json.dumps(payload), headers = headers)
        if r.status_code == 200:
            log.debug("[%s] %s" % (r.status_code, r.text))
        else:
            log.error("Notification to %s failed" % url)
            log.error("[%s] %s" % (r.status_code, r.text))
    except:
        log.error("Notification to %s failed" % url)
        traceback.print_exc(file=sys.stdout)
