#!/bin/bash
ENVIRONMENT=$1

./compile.sh
node dist/bot.js $ENVIRONMENT

