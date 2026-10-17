#!/bin/sh
# Render sets RENDER_EXTERNAL_URL and RENDER_EXTERNAL_HOSTNAME to the service's public
# address; they are the default CORS origin and the Swagger server host.
set -eu

export CORS_ORIGIN="${CORS_ORIGIN:-${RENDER_EXTERNAL_URL:-}}"
export HOST="${HOST:-${RENDER_EXTERNAL_HOSTNAME:-localhost}}"

if [ "${DEMO_RESET_ON_START:-false}" = "true" ]; then
  echo "[start] resetting demo database (migrations + seed)"
  npx prisma migrate reset --force --skip-generate
else
  echo "[start] prisma migrate deploy"
  npx prisma migrate deploy
fi

echo "[start] api and ui on port ${PORT}"
exec node dist/index.js
