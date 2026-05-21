#!/usr/bin/env bash
set -euo pipefail

# cleanup_failed_asset_pipelines.sh
# À lancer depuis la racine du projet Snake Drive V4.
# Objectif : supprimer les anciennes tentatives de pipeline/assets et garder seulement
# les 24 assets runtime validés du patch 943.

echo "[cleanup] Suppression des anciennes bibliothèques/staging assets..."

rm -rf public/assets/external/_downloaded || true
rm -rf public/assets/external/_extracted || true
rm -rf public/assets/external/_manual_drop || true
rm -rf public/assets/external/_audit || true
rm -rf public/assets/external/_sources || true
rm -rf public/assets/external/_licenses || true

rm -rf public/assets/design_board_icons || true
rm -rf public/assets/design_boards_raw || true
rm -rf public/assets/runtime_candidates_from_design_boards || true
rm -rf public/assets/generated || true

echo "[cleanup] Suppression des anciens scripts expérimentaux si présents..."

rm -rf tools/design-boards || true
rm -f tools/assets/downloadExternalAssets.ts || true
rm -f tools/assets/indexExternalAssets.ts || true
rm -f tools/assets/auditExternalAssets.ts || true

echo "[cleanup] Conservation attendue :"
echo "  public/assets/runtime/universes/"
echo "  src/assets/runtimeUniverseAssets.ts"
echo "  src/assets/runtimeUniverseAssets.manifest.json"

echo "[cleanup] Vérification des 24 assets..."
expected=(
"public/assets/runtime/universes/castle/pickup_orb.png"
"public/assets/runtime/universes/castle/obstacle_blink_wall.png"
"public/assets/runtime/universes/castle/boss_witch_mirror.png"
"public/assets/runtime/universes/sonic/pickup_ring.png"
"public/assets/runtime/universes/sonic/obstacle_bumper.png"
"public/assets/runtime/universes/sonic/boss_loop_serpent.png"
"public/assets/runtime/universes/streets/pickup_street_bonus.png"
"public/assets/runtime/universes/streets/obstacle_crowd.png"
"public/assets/runtime/universes/streets/boss_crime_lord.png"
"public/assets/runtime/universes/fighter/pickup_energy.png"
"public/assets/runtime/universes/fighter/obstacle_charge_marker.png"
"public/assets/runtime/universes/fighter/boss_final_challenger.png"
"public/assets/runtime/universes/outrun/pickup_checkpoint.png"
"public/assets/runtime/universes/outrun/obstacle_car.png"
"public/assets/runtime/universes/outrun/boss_turbo_rival.png"
"public/assets/runtime/universes/shinobi/pickup_shuriken.png"
"public/assets/runtime/universes/shinobi/obstacle_decoy.png"
"public/assets/runtime/universes/shinobi/boss_shadow_ninja.png"
"public/assets/runtime/universes/kombat/pickup_finish_token.png"
"public/assets/runtime/universes/kombat/obstacle_fatal_zone.png"
"public/assets/runtime/universes/kombat/boss_dragon_gate.png"
"public/assets/runtime/universes/paperboy/pickup_newspaper.png"
"public/assets/runtime/universes/paperboy/obstacle_dog.png"
"public/assets/runtime/universes/paperboy/boss_neighborhood_chaos.png"
)

missing=0
for f in "${expected[@]}"; do
  if [ ! -f "$f" ]; then
    echo "[cleanup][MISSING] $f"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo "[cleanup] ERREUR : assets manquants."
  exit 1
fi

echo "[cleanup] OK : 24 assets présents."
