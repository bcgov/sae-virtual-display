#!/bin/bash

# https://peter.sh/experiments/chromium-command-line-switches/

set -e

unset JUPYTERHUB_CLIENT_ID
unset JUPYTERHUB_ADMIN_ACCESS
unset JUPYTERHUB_API_TOKEN
unset JPY_API_TOKEN

echo 'alias s3="aws s3 --endpoint $MINIO_ADDR"' >> /home/jovyan/.profile

JUPYTER_ENABLE_LAB=1 tini -g -- start-notebook.sh --port=4444 &

sleep 3

DISPLAY=:100 google-chrome-stable --no-sandbox --disable-dev-shm-usage --enable-logging --v=1 --no-first-run --no-default-browser-check --disable-background-networking --disable-breakpad --disable-cloud-import --disable-default-apps --disable-demo-mode --disable-device-discovery-notifications --disable-domain-reliability --disable-extensions --disable-file-system --disable-gpu --disable-in-process-stack-traces --disable-ios-physical-web --disable-login-animations --disable-print-preview --start-maximized --homepage http://localhost:4444/lab

