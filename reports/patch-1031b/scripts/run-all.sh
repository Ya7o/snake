#!/bin/bash
set -e
cd ~/apps/snake
echo "Starting vite dev server"
npm run dev -- --host 0.0.0.0 > /tmp/vite-dev.log 2>&1 &
DEV_PID=$!
echo "Dev server PID: $DEV_PID"
echo "Waiting 10s for server to start"
sleep 10
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/ 2>/dev/null || echo "000")
echo "Server HTTP status: $STATUS"
if [ "$STATUS" != "200" ] && [ "$STATUS" != "304" ]; then
  echo "Server not ready, log:"
  cat /tmp/vite-dev.log
  kill $DEV_PID 2>/dev/null || true
  exit 1
fi
echo "Running Playwright assertions"
node reports/patch-1031b/scripts/assert-runtime.mjs
SCRIPT_EXIT=$?
echo "Stopping dev server"
kill $DEV_PID 2>/dev/null || pkill -f vite 2>/dev/null || true
echo "Done. Exit code: $SCRIPT_EXIT"
exit $SCRIPT_EXIT
