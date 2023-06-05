#!/bin/bash
ENVIRONMENT=$1
MESSAGE_TYPE=$2

./compile.sh
# Messages that poll for community interest are stored in local filestorage
mkdir -p storage
node dist/bot.js $ENVIRONMENT $MESSAGE_TYPE

