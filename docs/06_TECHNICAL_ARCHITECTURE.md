# 06 — Technical Architecture

## Modules

- **Scenes** : Boot → Title → WorldMap → LevelIntro → Game → Clear / GameOver → (retour WorldMap ou retry).
- **Core** : Grid (16×20 ou 16×26 Castle), Snake, Spawn, Collision.
- **Mechanics** : une classe par mécanique (`BaseMechanic` + `BaseBoss`). 8 normales + 8 boss. Factory dans `MechanicFactory.ts`.
- **Render** : GridRenderer, SnakeRenderer, PickupRenderer, ObstacleRenderer, HUDRenderer, VfxUtils, TextureFiltering.
- **Systems** : InputSystem (swipe + clavier), AudioSystem, SaveSystem (localStorage), RuntimeAssetResolver.
- **Config** : `levels.ts` (16 niveaux), `universes.ts` (8 univers), `mapNodes.ts` (16 nodes), `constants.ts` (SCORE_VALUES, SCENES, WORLD_MAP_VIEW…).

## Principe data-driven

```
MAP_NODE → LevelConfig (levelId) → UniverseConfig → Mechanic → GameScene
```

## HUD — 4 capsules

```
| [UNIVERS]   | [RÈGLE / ÉTAT BOSS]  | [X/10 ou HP 2/3]  | [SCORE RUNTIME] |
  20% W          ~35% W                18.5% W               21.5% W
```

- Capsule gauche : shortName univers (ARCADE_FONT, couleur accent).
- Capsule centre : `ruleText` du niveau ou `extra` du mécanisme si plus court et pertinent.
- Capsule progress : `score/quota` (normal) ou `HP hp/maxHp` (boss).
- Capsule score : `runtimeScore` (gold, mis à jour chaque tick).

## Système de score

```
runtimeScore = 0                       // reset chaque partie
  += SCORE_VALUES.PICKUP = 100         // par pickup collecté
  += SCORE_VALUES.BOSS_HIT = 250       // par hit boss (weak point)
  += SCORE_VALUES.STAGE_CLEAR = 500    // sur clear niveau normal
  += SCORE_VALUES.BOSS_CLEAR = 1000    // sur clear boss
  += timeBonus                         // +10 × secondes restantes (hors boss, sur 120s max)
```

`runtimeScore` est le score affiché en HUD et sauvegardé en best score. `score` (interne) est le compteur de pickups / HP boss.

## Pipeline asset

```
db_  : Castle uniquement (OpenMoji SVG + PNGs dans public/assets/universes/castle/)
rt_  : 7 autres univers (PNGs 64×64 dans public/assets/runtime/universes/[uid]/)
proc : fallback procédural (shapes géométriques PickupRenderer, ENTITY_COLORS ObstacleRenderer)
```

Priorité : `db_` > `rt_` > procédural. Aucun crash si asset manquant.

## Filtrage texture

`TextureFiltering.ts` : LINEAR pour toutes les clés `rt_` non-Castle (PATCH 1115b) et `openmoji-*`. NEAREST pour pixel art pur (non utilisé en pratique). Appliqué via `applyGameplayTextureFilter()` à chaque `fitImageInCell()`.

## Save System

Deux clés localStorage distinctes :
- `snakeDriveV4_save` : progression (clearedLevels, unlockedNodes).
- `snakeDriveV4.bestScores` : meilleurs scores par levelId.

`SESSION_UNLOCK_ALL` : flag URL `?unlockAll=1` — bypass localStorage sans écriture.

## Fallback

Si un asset manque : ne pas crasher, utiliser rendu procédural, log warning. Règle absolue 13 CLAUDE.md.
