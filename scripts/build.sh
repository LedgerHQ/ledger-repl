#!/bin/bash

set -e

PATH=$(yarn bin):$PATH
export NODE_ENV=production

rm -rf dist
mkdir -p dist

parcel build src/renderer/index.html --dist-dir dist/www &
parcel build src/main.js --dist-dir dist/main &

wait
