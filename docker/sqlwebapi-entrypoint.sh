#!/bin/sh
set -eu

cat >/usr/share/nginx/html/runtime-config.js <<EOF
window.__APP_CONFIG__ = {
  VITE_SQLWEBAPI_URL: "${VITE_SQLWEBAPI_URL:-http://localhost:7071/swa}",
  VITE_SQLWEBAPI_SERVICE: "${VITE_SQLWEBAPI_SERVICE:-${VITE_SERVICE:-crmapi}}"
};
EOF
