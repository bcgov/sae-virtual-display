import logging
import schedule
import time
import requests
import json
from multiprocessing import Process
from datetime import datetime
import config

log = logging.getLogger(__name__)

def get_spark_info(spark_url):
    if spark_url == "":
        spark_url = "http://spark-master-svc.vdi.svc.cluster.local"
    url = "%s/json/" % spark_url
    headers = {
        'Accept':  "application/json"
    }
    r = requests.request('get', url, headers = headers)
    if r.status_code == 200:
        return r.json()
    else:
        log.error("[%s] %s" % (r.status_code, r.text))
        raise Exception("Failed to get spark details")

def job():
    log = logging.getLogger(__name__)
    log.info("Job started...")

    conf = config.Config()

    recorder_url = conf.data['recorder_url']
    spark_url = conf.data['spark_url']


    spark = get_spark_info(spark_url)

    for app in spark['completedapps']:

        payload = {
            'app_id': app['id'],
            'starttime' : app['starttime'],
            'start_ts': datetime.fromtimestamp(app['starttime']/1000.0).isoformat(),
            'name': app['name'],
            'cores': app['cores'],
            'memoryperslave': app['memoryperslave'],
            'user': app['user'],
            'state': app['state'],
            'duration': app['duration'],
            'finish_ts': datetime.fromtimestamp((app['starttime'] + app['duration'])/1000.0).isoformat()
        }
        log.info("d = %s" % payload['start_ts'])
        headers = {
            "Content-Type": "application/json"
        }
        r = requests.post("%s/api/v1/record/%s/%s" % (recorder_url, "bbsae_spark", "bbsae"), data=json.dumps(payload), headers=headers)
        log.info("%s %d" % (payload['app_id'], r.status_code))

    for app in spark['activeapps']:
        payload = {
            'app_id': app.id,
            'start_ts': date.fromtimestamp(app.starttime),
            'name': app.name,
            'cores': app.cores,
            'memoryperslave': app.memoryperslave,
            'user': app.user,
            'state': app.state
        }
        headers = {
            "Content-Type": "application/json"
        }
        r = requests.post("%s/api/v1/record/%s/%s" % (recorder_url, "bbsae_spark_running", "bbsae"), data=json.dumps(payload), headers=headers)
        log.info("%s %d" % (payload['app_id'], r.status_code))

def sched():
    #schedule.every().day.at("06:00").do(job)
    #schedule.every().day.at("16:00").do(job)
    schedule.every(10).seconds.do(job)
    while True:
        schedule.run_pending()
        time.sleep(1)

def start():
    log = logging.getLogger(__name__)
    log.info("Starting schedule...")

    p = Process(target=sched, args=())
    p.start()


# spark-master-0.spark-headless.vdi.svc.cluster.local
#  curl -v https://spark.stg.bbsae.xyz:8443/json/
# {
#   "url" : "spark://spark-master-0.spark-headless.vdi.svc.cluster.local:7077",
#   "workers" : [ {
#     "id" : "worker-20200525220443-10.42.1.13-33547",
#     "host" : "10.42.1.13",
#     "port" : 33547,
#     "webuiaddress" : "http://10.42.1.13:8081",
#     "cores" : 8,
#     "coresused" : 0,
#     "coresfree" : 8,
#     "memory" : 24576,
#     "memoryused" : 0,
#     "memoryfree" : 24576,
#     "state" : "ALIVE",
#     "lastheartbeat" : 1591386373905
#   }, {
#     "id" : "worker-20200525220410-10.42.2.18-43863",
#     "host" : "10.42.2.18",
#     "port" : 43863,
#     "webuiaddress" : "http://10.42.2.18:8081",
#     "cores" : 8,
#     "coresused" : 0,
#     "coresfree" : 8,
#     "memory" : 24576,
#     "memoryused" : 0,
#     "memoryfree" : 24576,
#     "state" : "ALIVE",
#     "lastheartbeat" : 1591386371092
#   }, {
#     "id" : "worker-20200525220157-10.42.1.12-42869",
#     "host" : "10.42.1.12",
#     "port" : 42869,
#     "webuiaddress" : "http://10.42.1.12:8081",
#     "cores" : 8,
#     "coresused" : 0,
#     "coresfree" : 8,
#     "memory" : 24576,
#     "memoryused" : 0,
#     "memoryfree" : 24576,
#     "state" : "ALIVE",
#     "lastheartbeat" : 1591386366755
#   }, {
#     "id" : "worker-20200525220332-10.42.2.17-39963",
#     "host" : "10.42.2.17",
#     "port" : 39963,
#     "webuiaddress" : "http://10.42.2.17:8081",
#     "cores" : 8,
#     "coresused" : 0,
#     "coresfree" : 8,
#     "memory" : 24576,
#     "memoryused" : 0,
#     "memoryfree" : 24576,
#     "state" : "ALIVE",
#     "lastheartbeat" : 1591386378216
#   } ],
#   "aliveworkers" : 4,
#   "cores" : 32,
#   "coresused" : 0,
#   "memory" : 98304,
#   "memoryused" : 0,
#   "activeapps" : [ ],
#   "completedapps" : [ {
#     "id" : "app-20200529182907-0000",
#     "starttime" : 1590776947148,
#     "name" : "sparklyr",
#     "cores" : 24,
#     "user" : "jovyan",
#     "memoryperslave" : 8192,
#     "submitdate" : "Fri May 29 18:29:07 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 77785
#   }, {
#     "id" : "app-20200529183517-0001",
#     "starttime" : 1590777317238,
#     "name" : "sparklyr",
#     "cores" : 24,
#     "user" : "jovyan",
#     "memoryperslave" : 8192,
#     "submitdate" : "Fri May 29 18:35:17 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 433854
#   }, {
#     "id" : "app-20200529184243-0002",
#     "starttime" : 1590777763074,
#     "name" : "sparklyr",
#     "cores" : 24,
#     "user" : "jovyan",
#     "memoryperslave" : 8192,
#     "submitdate" : "Fri May 29 18:42:43 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 129906
#   }, {
#     "id" : "app-20200529184501-0003",
#     "starttime" : 1590777901547,
#     "name" : "sparklyr",
#     "cores" : 24,
#     "user" : "jovyan",
#     "memoryperslave" : 8192,
#     "submitdate" : "Fri May 29 18:45:01 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 44630
#   }, {
#     "id" : "app-20200529184817-0004",
#     "starttime" : 1590778097066,
#     "name" : "sparklyr",
#     "cores" : 24,
#     "user" : "jovyan",
#     "memoryperslave" : 8192,
#     "submitdate" : "Fri May 29 18:48:17 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 48955
#   }, {
#     "id" : "app-20200529184918-0005",
#     "starttime" : 1590778158767,
#     "name" : "sparklyr",
#     "cores" : 24,
#     "user" : "jovyan",
#     "memoryperslave" : 8192,
#     "submitdate" : "Fri May 29 18:49:18 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 137927
#   }, {
#     "id" : "app-20200529185317-0006",
#     "starttime" : 1590778397918,
#     "name" : "sparklyr",
#     "cores" : 32,
#     "user" : "jovyan",
#     "memoryperslave" : 4096,
#     "submitdate" : "Fri May 29 18:53:17 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 23658
#   }, {
#     "id" : "app-20200529185403-0007",
#     "starttime" : 1590778443426,
#     "name" : "sparklyr",
#     "cores" : 24,
#     "user" : "jovyan",
#     "memoryperslave" : 8192,
#     "submitdate" : "Fri May 29 18:54:03 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 76564
#   }, {
#     "id" : "app-20200529190005-0008",
#     "starttime" : 1590778805409,
#     "name" : "sparklyr",
#     "cores" : 32,
#     "user" : "jovyan",
#     "memoryperslave" : 4096,
#     "submitdate" : "Fri May 29 19:00:05 UTC 2020",
#     "state" : "FINISHED",
#     "duration" : 4852351
#   } ],
#   "activedrivers" : [ ],
#   "completeddrivers" : [ ],
#   "status" : "ALIVE"
# }