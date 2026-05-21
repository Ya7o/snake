# LOT C — Vérification GameScene / assets runtime

## Objectif
Confirmer et corriger l’affichage en jeu des 24 assets runtime.

## À faire
- Vérifier preload de l’univers courant.
- Vérifier pickup.
- Vérifier obstacle.
- Vérifier boss marker.
- Vérifier fallback si texture absente.
- Ajuster tailles :
  - pickup : 0.65–0.75 cellule ;
  - obstacle : 0.75–0.90 cellule ;
  - boss : 1.0–1.15 cellule.

## Fichiers probables
- `src/scenes/GameScene.ts`
- `src/systems/RuntimeAssetResolver.ts`
- `src/assets/runtimeUniverseAssets.ts`

## Interdits
- Ne pas charger tous les assets globalement.
- Ne pas réintroduire les pipelines.
- Ne pas modifier les 24 PNG.

## Rapport final
Pour chaque univers : pickup OK/NOK, obstacle OK/NOK, boss OK/NOK.
