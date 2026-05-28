#!/usr/bin/env bash
# create-clean-source-archive.sh
# Produces a clean source archive of Snake Drive V4 for restore testing.
# Run from the repo root: bash scripts/create-clean-source-archive.sh
# Output: /mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${REPO_ROOT}/tmp"
ARCHIVE_NAME="snake-drive-v4-clean-source.tar.gz"
ARCHIVE_PATH="${OUTPUT_DIR}/${ARCHIVE_NAME}"

echo "=== Snake Drive V4 — Clean Source Archive ==="
echo "Repo root : ${REPO_ROOT}"
echo "Output    : ${ARCHIVE_PATH}"
echo ""

# Create output dir if needed
mkdir -p "${OUTPUT_DIR}"

# Build the archive from the repo root
tar -czf "${ARCHIVE_PATH}" \
  --exclude="./node_modules" \
  --exclude="./dist" \
  --exclude="./.git" \
  --exclude="./tickets" \
  --exclude="./design_boards" \
  --exclude="./.cache" \
  --exclude="./cache" \
  --exclude="./.vite" \
  --exclude="./coverage" \
  --exclude="./tmp" \
  --exclude="./temp" \
  --exclude="./logs" \
  --exclude="./.claude" \
  --exclude="*.tmp" \
  --exclude="*.log" \
  --exclude="*.bak" \
  --exclude="*.swp" \
  --exclude="*.swo" \
  --exclude=".DS_Store" \
  --exclude="Thumbs.db" \
  --exclude="desktop.ini" \
  -C "${REPO_ROOT}" \
  .

echo "Archive created."
echo ""

# Size
ARCHIVE_SIZE=$(du -sh "${ARCHIVE_PATH}" | cut -f1)
echo "Size      : ${ARCHIVE_SIZE}"
echo ""

# Verify listing
echo "Verifying archive (tar -tzf)..."
FILE_COUNT=$(tar -tzf "${ARCHIVE_PATH}" | wc -l)
echo "Entries   : ${FILE_COUNT}"
echo ""

echo "First 20 entries:"
tar -tzf "${ARCHIVE_PATH}" | head -20 || true
echo ""

echo "=== Done ==="
echo "Archive   : ${ARCHIVE_PATH}"
echo "Size      : ${ARCHIVE_SIZE}"
echo "Entries   : ${FILE_COUNT}"
