#!/bin/bash
echo $'\n******* Updating GSP, any local changes will be lost!'
git fetch --all
git reset --hard origin/master

echo $'\n******* Re-reating shortcuts'
echo /home/cpi/GSP/nwjs-sdk-v0.27.6-linux-arm/nw /home/cpi/GSP --use-gl=egl --ignore-gpu-blacklist --disable-accelerated-2d-canvas --num-raster-threads=2 --remote-debugging-port=9222 > /home/cpi/apps/launcher/Menu/GameShell/GSPLauncher.sh
chmod +x /home/cpi/apps/launcher/Menu/GameShell/GSPLauncher.sh
cp ./common/GSPLauncher.png /home/cpi/apps/launcher/skin/default/Menu/GameShell/GSPLauncher.png
