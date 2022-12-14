#!/bin/bash

npx prettier --write .

tsc src/bot.ts --outDir dist
