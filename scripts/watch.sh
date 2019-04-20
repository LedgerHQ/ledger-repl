#!/bin/bash

set -e

PATH=$(yarn bin):$PATH
export NODE_ENV=development

rm -rf dist
mkdir -p dist

parcel watch src/renderer/index.html -d dist/www &
parcel watch src/main.js -d dist/main --target node &

wait
