#!/usr/bin/env bash
# cleanup_failed_asset_pipelines.sh — patch 943
# Supprime les dossiers expérimentaux des pipelines d'assets ratés.
# À exécuter une seule fois depuis la racine du projet.
# Idempotent : ne plante pas si les dossiers n'existent plus.

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "[943 cleanup] Dossiers à supprimer..."

DIRS=(
  "public/assets/external/_downloaded"
  "public/assets/external/_extracted"
  "public/assets/external/_manual_drop"
  "public/assets/design_board_icons"
  "public/assets/design_boards_raw"
  "public/assets/runtime_candidates_from_design_boards"
  "public/assets/generated"
  "tools/design-boards"
  "tools/assets"
)

for d in "${DIRS[@]}"; do
  if [ -d "$d" ]; then
    rm -rf "$d"
    echo "  Supprimé : $d"
  else
    echo "  Déjà absent : $d"
  fi
done

echo "[943 cleanup] Scripts npm obsolètes : retirés manuellement de package.json (patch 943)."
echo "[943 cleanup] Assets runtime validés : $(find public/assets/runtime/universes -name '*.png' 2>/dev/null | wc -l) PNG dans public/assets/runtime/universes/"
echo "[943 cleanup] Terminé."
