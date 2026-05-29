#!/bin/bash
# PATCH 1031 — Run static progression assertions
# Usage: bash reports/patch-1031/scripts/run-tests.sh
set -e
cd ~/apps/snake

echo '=== PATCH 1031 — Static Assertions ==='
node reports/patch-1031/scripts/assert-progression.mjs
echo 'Done.'
