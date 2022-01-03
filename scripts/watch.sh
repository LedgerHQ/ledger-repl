#!/bin/bash

set -e

PATH=$(yarn bin):$PATH
export NODE_ENV=development

rm -rf dist
mkdir -p dist

parcel watch src/renderer/index.html --dist-dir dist/www &
parcel watch src/main.js --dist-dir dist/main &

wait
