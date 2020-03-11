#!/bin/bash -i

set -x

Xvfb -extension GLX +extension Composite -dpi 96 -nolisten tcp -noreset -screen 0 5760x2560x24+32 -auth /home/jovyan/.Xauthority :100 &

sleep 10

# export XPRA_PRINTERS_GENERIC=0
# export XPRA_CUPS_DBUS=0
# export XPRA_SCALING=0
# xpra start :100 $XPRA_ARGS --bind-tcp=*:5000 --start-new-commands=no --resize-display=yes --fake-xinerama=no --pulseaudio=off --printing=no --mdns=no --webcam=no --clipboard=no --file-transfer=no --open-files=no --pulseaudio=no --speaker=off --printing=no --microphone=off --keyboard-layout=us --html=on
# sleep 10
# tail -f /tmp/runtime-jovyan/xpra/:100.log &
# tail -f /run/user/1000/xpra/:100.log &

sh -c launcher.sh

sleep infinity
