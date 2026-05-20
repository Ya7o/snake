# 06 — Technical Architecture

## Modules

- Scenes : Boot, Title, WorldMap, LevelIntro, Game, Clear, GameOver.
- Core : Grid, Snake, Collision, Spawn, Objective.
- Mechanics : une classe/système par mécanique.
- Render : Grid, Snake, HUD, Frame, Pickups, Obstacles, Boss, Transitions.
- Systems : Input, Audio, Save, Asset.
- Config : universes, levels, nodes.
- QA : self-tests.

## Principe

Le jeu est data-driven :
node → levelConfig → universeConfig → mechanic → GameScene.

## Fallback

Si un asset manque :
- ne pas crasher ;
- utiliser rendu procédural ;
- log warning.
