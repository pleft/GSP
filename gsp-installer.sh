#!/bin/bash
echo $'\n******* 1) Installing NWjs...'
wget https://github.com/LeonardLaszlo/nw.js-armv7-binaries/releases/download/v0.27.6/nwjs-sdk-v0.27.6-linux-arm.tar.gz
tar -xvf nwjs-sdk-v0.27.6-linux-arm.tar.gz
sudo cp nwjs-sdk-v0.27.6-linux-arm/lib/*.so /usr/lib
echo $'\n******* 2) Updating GSP, any local changes will be lost!'
git fetch --all
git reset --hard origin/master
echo $'\n******* 3) Creating shortcuts'
echo /home/cpi/GSP/nwjs-sdk-v0.27.6-linux-arm/nw /home/cpi/GSP --use-gl=egl --ignore-gpu-blacklist --disable-accelerated-2d-canvas --num-raster-threads=2 --remote-debugging-port=9222 > /home/cpi/apps/launcher/Menu/GameShell/GSPLauncher.sh
chmod +x /home/cpi/apps/launcher/Menu/GameShell/GSPLauncher.sh
cp ./common/GSPLauncher.png /home/cpi/apps/launcher/skin/default/Menu/GameShell/GSPLauncher.png
echo $'\n******* 4) removing archives...'
rm *.tar.gz
echo "***********************************************************************"
echo "* If no errors, reboot your GameShell and select the GSPLauncher icon *" 
echo "*                      HAVE FUN!                                      *"
echo "***********************************************************************"
