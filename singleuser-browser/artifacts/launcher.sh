#!/bin/bash

# https://peter.sh/experiments/chromium-command-line-switches/

set -e

google-chrome-stable --enable-logging --v=1 --no-first-run --no-default-browser-check --disable-background-networking --disable-breakpad --disable-cloud-import --disable-default-apps --disable-demo-mode --disable-device-discovery-notifications --disable-domain-reliability --disable-extensions --disable-file-system --disable-gpu --disable-in-process-stack-traces --disable-ios-physical-web --disable-login-animations --disable-print-preview --start-maximized --homepage ${HOME_PAGE} ${JHUB_URL}/user/$JUPYTERHUB_USER
# --enable-logging  --kiosk  --start-maximized --start-maximized 
#rstudio