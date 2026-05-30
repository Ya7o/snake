# Audit Trace — PATCH 1069

**Date** : 2026-05-30
**Mode** : Lecture seule — aucune modification de code ou d'assets

## Fichiers lus

| Fichier | Motif |
|---------|-------|
| src/assets/runtimeUniverseAssets.ts | Catalogue assets runtime (pickup/obstacle/boss par univers) |
| src/scenes/GameScene.ts | Logique preload, create, entityTextureResolver Paperboy |
| src/render/PickupRenderer.ts | Formule maxSize = cs * 1.9, fitImageInCell |
| src/render/ObstacleRenderer.ts | Formules cs*0.74 (obstacle), cs*1.9 (entityTexture), fitImageInCell (boss) |
| src/render/GridRenderer.ts | Calcul cellSize via computeGridLayout |
| src/ui/OpenMojiIconRegistry.ts | Clés mailbox.svg, roadblock.svg, OPENMOJI_GAMEPLAY_ICON_SCALE |
| src/ui/RuntimeUILayout.ts | HUD HEIGHT=56, GAMEPLAY_LAYERS |
| src/config/constants.ts | Dimensions, UNIVERSE_FRAME_ASSETS |
| src/systems/RuntimeAssetResolver.ts | Clés rt_<univers>_<role>, preloadRuntimeAssets |
| src/mechanics/PaperboyDeliveryMechanic.ts | Types d'entités : routeObstacle, deliveryTarget |
| src/mechanics/bosses/NeighborhoodChaosBoss.ts | Types d'entités : chaosObstacle, bossTarget |
| src/config/levels.ts | Confirmation univers / mécaniques |

## Commandes d'inspection assets

```
file public/assets/runtime/universes/**/*.png
→ dimensions de tous les 21 assets runtime PNG
```

Résultats clés :
- `outrun/obstacle_car.png` : 256×160 (aspect 1.6:1) — problème détecté
- `outrun/boss_turbo_rival.png` : 256×165 (aspect 1.55:1) — problème détecté
- `outrun/pickup_checkpoint.png` : 160×256 (aspect 0.625:1) — portrait asymétrique
- `paperboy/obstacle_dog.png` : 256×170 — asset mort confirmé
- Tous les autres : ~256×256 (near-square)

## Captures runtime

Aucun screenshot runtime disponible — le serveur de dev n'a pas été lancé
(conforme aux règles PATCH 1069 : audit seul, pas de modification)

## Constat principal

La constante `OPENMOJI_GAMEPLAY_ICON_SCALE = 1.9` dans ObstacleRenderer.ts:6 s'applique
aux icônes OpenMoji (mailbox, roadblock) mais PAS aux assets PNG runtime obstacles (0.74)
ni aux boss (~1.0). Cette incohérence de facteur d'échelle est la cause racine du problème.
