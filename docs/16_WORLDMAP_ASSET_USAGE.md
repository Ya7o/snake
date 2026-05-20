# 16 — World Map Asset Usage

## Pipeline

```text
design_boards/_incoming/ (source)
→ generate_worldmap.py (génération procédurale initiale)
→ public/assets/map/world_map.png  (480×800, portrait mobile)
→ WorldMapScene.preload() : charge 'world_map'
→ WorldMapScene.create() : image en fond (depth 0)
→ lignes (depth 1)
→ nodes/labels (depth 2)
→ HUD titre + cleared count (depth 30)
```

## Asset

| Propriété | Valeur |
|---|---|
| Chemin | `public/assets/map/world_map.png` |
| Clé Phaser | `world_map` (ASSET_KEYS.WORLD_MAP) |
| Dimensions | 480×800 |
| Format | PNG |

## Ordre des calques dans mapContainer

1. `world_map.png` image (depth 0) — fond
2. Lignes de liaison (depth 1)
3. Node containers avec cercles + labels (depth 2)

## Coordonnées des nodes

Coordonnées normalisées `0..1` relatives à l'image :

| Node | levelId | x | y |
|---|---|---|---|
| 1 | castle_normal | 0.12 | 0.10 |
| 2 | castle_boss | 0.28 | 0.10 |
| 3 | sonic_normal | 0.50 | 0.10 |
| 4 | sonic_boss | 0.72 | 0.10 |
| 5 | streets_normal | 0.88 | 0.22 |
| 6 | streets_boss | 0.88 | 0.36 |
| 7 | fighter_normal | 0.72 | 0.48 |
| 8 | fighter_boss | 0.50 | 0.48 |
| 9 | outrun_normal | 0.28 | 0.48 |
| 10 | outrun_boss | 0.12 | 0.60 |
| 11 | shinobi_normal | 0.28 | 0.72 |
| 12 | shinobi_boss | 0.50 | 0.72 |
| 13 | kombat_normal | 0.72 | 0.72 |
| 14 | kombat_boss | 0.88 | 0.84 |
| 15 | paperboy_normal | 0.50 | 0.90 |
| 16 | paperboy_boss | 0.28 | 0.90 |

Conversion runtime :

```ts
screenX = node.x * mapW
screenY = node.y * mapH
```

où `mapW = width` et `mapH = height - 100`.

## Fallback

Si `world_map.png` est absent au chargement :
- Warning console : `World map image missing, using procedural fallback`
- Affichage d'un fond procédural sombre avec zones colorées par univers
- Aucun crash
