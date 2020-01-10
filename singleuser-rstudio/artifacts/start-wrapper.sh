#!/bin/bash

set -x

Xvfb +extension GLX +extension Composite -dpi 96 -nolisten tcp -noreset -screen 0 5760x2560x24+32 -auth /home/jovyan/.Xauthority :100 &

sleep 2

sh -c launcher.sh

sleep infinity
