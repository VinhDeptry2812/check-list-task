#!/usr/bin/env sh
# serve.sh - Phục vụ static files từ dist folder

set -e

PORT=${PORT:-3000}
npx http-server dist -p $PORT -c-1
