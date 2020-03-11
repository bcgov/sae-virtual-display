#!/bin/bash -i

# -i is needed to bootstrap CONDA to get the proper environment

cd /app/data-curator
DISPLAY=:100 /app/data-curator/build/linux-unpacked/datacurator &

