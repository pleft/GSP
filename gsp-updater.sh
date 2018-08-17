#!/bin/bash
echo $'\n******* Updating GSP, any local changes will be lost!'
git fetch --all
git reset --hard origin/master