#!/usr/bin/env bash

port=${NODEPORT:-8080}
PORT=$port node ./dist/index.js
