#!/bin/bash

# https://peter.sh/experiments/chromium-command-line-switches/

set -e

unset JUPYTERHUB_CLIENT_ID
unset JUPYTERHUB_ADMIN_ACCESS
unset JUPYTERHUB_API_TOKEN
unset JPY_API_TOKEN

# Because the singleuser POD does not have DNS records created for it, we use an IP address
# so that the Spark workers can communicate with the driver running in POD
export SPARK_DRIVER_HOST=`hostname -I | xargs`
export SPARK_MASTER_URL="spark://spark-master-svc:7077"

echo 'alias s3="aws s3 --endpoint $MINIO_ADDR"' >> /home/jovyan/.profile

NEW_UUID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
echo "c.NotebookApp.token = u'${NEW_UUID}'" >> ~/.jupyter/jupyter_notebook_config.py

echo "TOKEN=${NEW_UUID}"

JUPYTER_ENABLE_LAB=1 tini -g -- start-notebook.sh --port=4444 &

sleep 3

DISPLAY=:100 google-chrome-stable --no-sandbox --disable-dev-shm-usage --enable-logging --v=1 --no-first-run --no-default-browser-check --disable-background-networking --disable-breakpad --disable-cloud-import --disable-default-apps --disable-demo-mode --disable-device-discovery-notifications --disable-domain-reliability --disable-extensions --disable-file-system --disable-gpu --disable-in-process-stack-traces --disable-ios-physical-web --disable-login-animations --disable-print-preview --start-maximized --homepage http://localhost:4444/lab?token=$NEW_UUID

