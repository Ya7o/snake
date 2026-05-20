# 16 — World Map Asset Usage

## Asset

| Propriété | Valeur |
|---|---|
| Chemin | `public/assets/map/world_map.png` |
| Clé Phaser | `world_map` |
| Dimensions | 1448×1086 |
| Format | PNG |

## Pipeline Runtime

```text
WorldMapScene.preload()
→ charge ASSET_KEYS.WORLD_MAP
→ affiche l'image en cover dans la zone utile
→ place les nodes via src/config/mapNodes.ts
→ drag/pinch/selection/double tap
```

## Cadrage

La scène utilise un cover scale pour éviter les bandes noires, puis applique un zoom local :

- `WORLD_MAP_VIEW.INITIAL_ZOOM`
- `WORLD_MAP_VIEW.MIN_ZOOM`
- `WORLD_MAP_VIEW.MAX_ZOOM`

Les bounds empêchent de perdre la carte hors écran.

## Coordonnées Nodes

Les coordonnées sont normalisées `0..1` sur l'image source 1448×1086 et calibrées sur les ronds/étoiles visibles de la minimap. La source de vérité est :

```text
src/config/mapNodes.ts
```

## Interactions

- simple tap : sélection ;
- double tap même node accessible : lancement ;
- node locked : aucun lancement ;
- drag/pinch : exploration de la carte ;
- bouton START : fallback secondaire.

## Fallback

Si `world_map.png` est absent :

- warning console ;
- fond procédural sombre ;
- nodes toujours interactifs ;
- aucun crash.
