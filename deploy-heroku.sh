#!/bin/bash

# Exit on any failure
set -e

# Echo commands
set -x

# This function is called when Ctrl-C is sent
function trap_ctrlc ()
{
    # perform cleanup here
    echo "Ctrl-C caught... returning to master"
 
    git checkout master
    exit 2
}

# initialise trap to call trap_ctrlc function
# when signal 2 (SIGINT) is received
trap "trap_ctrlc" 2

git checkout build
git reset --hard master
npm run build
git add --force client/build
git commit -am "Built client side code"
git push -f heroku build:master
echo "================"
echo "====DEPLOYED===="
echo "================"
sleep 1
heroku logs --tail
