#!/usr/bin/env bash
# PATCH 1032 — Start dev server + run Playwright tests in one session
set -e

cd ~/apps/snake

echo "==> Starting dev server..."
npm run dev &> /tmp/snake-dev.log &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait until server responds
MAX_WAIT=20
COUNT=0
until curl -s --connect-timeout 1 http://localhost:5173/ > /dev/null 2>&1; do
  sleep 1
  COUNT=$((COUNT + 1))
  if [ $COUNT -ge $MAX_WAIT ]; then
    echo "ERROR: Server did not start within ${MAX_WAIT}s"
    cat /tmp/snake-dev.log
    kill $SERVER_PID 2>/dev/null
    exit 1
  fi
done
echo "Server ready after ${COUNT}s"

# Run Playwright tests
echo "==> Running Playwright behavioral tests..."
cd ~/apps/snake/reports/patch-1032/scripts
node behavioral-test.mjs
RESULT=$?

# Kill server
echo "==> Stopping server..."
kill $SERVER_PID 2>/dev/null

echo "==> Done (exit code: $RESULT)"
exit $RESULT
