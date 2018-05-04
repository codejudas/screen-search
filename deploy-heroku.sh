#!/bin/bash

# Exit on any failure
set -e

set +x

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
heroku logs
