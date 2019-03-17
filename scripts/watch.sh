#!/bin/bash

set -e

cd ../..
PATH=$(yarn bin):$PATH
cd -

export NODE_ENV=development

rm -rf dist
mkdir -p dist

parcel watch src/renderer/index.html -d dist/www &
parcel watch src/main.js -d dist/main --target node &

wait