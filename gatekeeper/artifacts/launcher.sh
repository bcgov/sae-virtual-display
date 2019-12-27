#!/bin/bash -i

set -x

echo "Configuring Gatekeeper FOR $JUPYTERHUB_USER"

env

# Give some time for the virtual display to launch
sleep 1

openresty
echo "Listening on port 8888"

echo "Waiting for DISPLAY to be ready..."
while [[ ! $(DISPLAY=:100 xset -q) ]]; do echo "Waiting 2 seconds..."; sleep 2; done

export XPRA_PRINTERS_GENERIC=0
export XPRA_CUPS_DBUS=0
export XPRA_SCALING=0

xpra start :100 $XPRA_ARGS --bind-tcp=127.0.0.1:5000 --start-new-commands=no --resize-display=yes --fake-xinerama=no --pulseaudio=off --printing=no --mdns=no --webcam=no --clipboard=no --file-transfer=no --open-files=no --pulseaudio=no --speaker=off --printing=no --microphone=off --html=on

sleep 2

tail -f /run/user/1000/xpra/:100.log &

(cd /gatekeeper; python3 ./gatekeeper.py)
