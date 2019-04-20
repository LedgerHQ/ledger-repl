#!/bin/bash

set -e

PATH=$(yarn bin):$PATH
export NODE_ENV=production

rm -rf dist
mkdir -p dist

parcel build src/renderer/index.html -d dist/www &
parcel build src/main.js -d dist/main --target node &

wait
