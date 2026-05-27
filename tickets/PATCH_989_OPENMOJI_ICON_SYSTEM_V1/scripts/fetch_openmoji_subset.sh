#!/usr/bin/env bash
set -euo pipefail

# PATCH 989 helper script.
# This is a starting point for Codex, not a guaranteed final selector.
# OpenMoji SVG filenames are usually codepoint-based, so Codex must verify the exact filenames.

OPENMOJI_DIR="${OPENMOJI_DIR:-/tmp/openmoji}"
DEST_DIR="${DEST_DIR:-public/assets/openmoji}"

if [ ! -d "$OPENMOJI_DIR" ]; then
  echo "Cloning OpenMoji into $OPENMOJI_DIR"
  git clone --depth 1 https://github.com/hfg-gmuend/openmoji.git "$OPENMOJI_DIR"
fi

SVG_DIR="$OPENMOJI_DIR/color/svg"

if [ ! -d "$SVG_DIR" ]; then
  echo "ERROR: Could not find $SVG_DIR"
  exit 1
fi

mkdir -p "$DEST_DIR/world" "$DEST_DIR/hud" "$DEST_DIR/pickups" "$DEST_DIR/result"

echo "OpenMoji SVG folder: $SVG_DIR"
echo "Destination: $DEST_DIR"
echo ""
echo "Next step: map desired icons to actual OpenMoji SVG codepoint filenames."
echo "Use the manifest at scripts/openmoji_subset_manifest.json."
echo ""
echo "Example after verifying filename:"
echo "cp $SVG_DIR/1F3F0.svg $DEST_DIR/world/castle.svg"
