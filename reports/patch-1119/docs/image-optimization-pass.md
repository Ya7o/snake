# Image Optimization Pass

## Objectif
Réduire le poids des images sans dégrader le rendu, en convertissant les candidats `safe_to_optimize = yes` de PATCH 1118 en WebP lossy q82 avec resize 1080px max.

## Backup

- **Chemin :** `/home/kali/apps/snake_asset_backups/patch-1119/20260602-130716`
- **Fichiers sauvegardés :** 43
- **Confirmation non commit :** oui — le dossier est hors du repo (`~/apps/snake_asset_backups/`)

## Actions

| Fichier | Action | Gain | Risque |
|---|---|---:|---|
| `paperboy_boss_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2683.4 KB (94.3%) | Faible |
| `paperboy_clear_bg.png` | PNG_to_WebP_lossy_q82+resize | 1827.6 KB (95.5%) | Faible |
| `paperboy_game_over_bg.png` | PNG_to_WebP_lossy_q82+resize | 1455.3 KB (98.3%) | Faible |
| `paperboy_gameplay_bg.png` | PNG_to_WebP_lossy_q82+resize | 1964.3 KB (96.6%) | Faible |
| `paperboy_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 1972.6 KB (95.9%) | Faible |
| `kombat_boss_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2082.3 KB (96.1%) | Faible |
| `kombat_clear_bg.png` | PNG_to_WebP_lossy_q82+resize | 2004.6 KB (96.2%) | Faible |
| `kombat_game_over_bg.png` | PNG_to_WebP_lossy_q82+resize | 1767.1 KB (97.8%) | Faible |
| `kombat_gameplay_bg.png` | PNG_to_WebP_lossy_q82+resize | 1525.5 KB (98.4%) | Faible |
| `kombat_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 1704.0 KB (97.7%) | Faible |
| `title_hub_bg.png` | PNG_to_WebP_lossy_q82+resize | 1810.1 KB (96.0%) | Faible |
| `world_map_minimap_16_9.png` | PNG_to_WebP_lossy_q82+resize | 2645.0 KB (93.6%) | Faible |
| `fighter_boss_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2412.9 KB (95.2%) | Faible |
| `fighter_clear_bg.png` | PNG_to_WebP_lossy_q82+resize | 2122.0 KB (94.7%) | Faible |
| `fighter_game_over_bg.png` | PNG_to_WebP_lossy_q82+resize | 1839.9 KB (96.7%) | Faible |
| `fighter_gameplay_bg.png` | PNG_to_WebP_lossy_q82+resize | 2249.4 KB (95.1%) | Faible |
| `fighter_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2371.3 KB (94.2%) | Faible |
| `streets_boss_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2157.8 KB (95.8%) | Faible |
| `streets_clear_bg.png` | PNG_to_WebP_lossy_q82+resize | 2351.1 KB (94.9%) | Faible |
| `streets_game_over_bg.png` | PNG_to_WebP_lossy_q82+resize | 1826.6 KB (97.1%) | Faible |
| `streets_gameplay_bg.png` | PNG_to_WebP_lossy_q82+resize | 1901.0 KB (97.1%) | Faible |
| `streets_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2372.5 KB (95.8%) | Faible |
| `castle_boss_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2112.8 KB (96.4%) | Faible |
| `castle_clear_bg.png` | PNG_to_WebP_lossy_q82+resize | 2307.7 KB (94.9%) | Faible |
| `castle_game_over_bg.png` | PNG_to_WebP_lossy_q82+resize | 1856.1 KB (97.1%) | Faible |
| `castle_gameplay_bg.png` | PNG_to_WebP_lossy_q82+resize | 1557.6 KB (97.4%) | Faible |
| `castle_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2031.7 KB (96.2%) | Faible |
| `sonic_boss_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2124.7 KB (94.7%) | Faible |
| `sonic_clear_bg.png` | PNG_to_WebP_lossy_q82+resize | 1868.0 KB (95.2%) | Faible |
| `sonic_game_over_bg.png` | PNG_to_WebP_lossy_q82+resize | 1476.9 KB (98.6%) | Faible |
| `sonic_gameplay_bg.png` | PNG_to_WebP_lossy_q82+resize | 1714.3 KB (96.3%) | Faible |
| `sonic_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 1876.2 KB (95.2%) | Faible |
| `outrun_boss_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2458.7 KB (94.4%) | Faible |
| `outrun_clear_bg.png` | PNG_to_WebP_lossy_q82+resize | 2203.5 KB (95.9%) | Faible |
| `outrun_game_over_bg.png` | PNG_to_WebP_lossy_q82+resize | 1732.5 KB (98.5%) | Faible |
| `outrun_gameplay_bg.png` | PNG_to_WebP_lossy_q82+resize | 1639.6 KB (98.8%) | Faible |
| `outrun_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 1917.3 KB (96.3%) | Faible |
| `shinobi_boss_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2387.3 KB (95.4%) | Faible |
| `shinobi_clear_bg.png` | PNG_to_WebP_lossy_q82+resize | 2038.6 KB (95.4%) | Faible |
| `shinobi_game_over_bg.png` | PNG_to_WebP_lossy_q82+resize | 1535.9 KB (97.5%) | Faible |
| `shinobi_gameplay_bg.png` | PNG_to_WebP_lossy_q82+resize | 1561.9 KB (97.8%) | Faible |
| `shinobi_system_bg.png` | PNG_to_WebP_lossy_q82+resize | 2088.0 KB (96.0%) | Faible |
| `world_map.png` | PNG_to_WebP_lossy_q82+resize | 2556.3 KB (91.1%) | Faible |

## Références mises à jour

| Fichier code/config | Changement |
|---|---|
| `src/config/constants.ts` | `_bg.png` × 5 templates → `_bg.webp` (40 bg) |
| `src/config/constants.ts` | `world_map.png` → `world_map.webp` |
| `src/config/constants.ts` | `world_map_minimap_16_9.png` → `world_map_minimap_16_9.webp` |
| `src/scenes/TitleScene.ts` | `title_hub_bg.png` → `title_hub_bg.webp` |
| `src/scenes/WorldMapScene.ts` | Commentaires/warn mis à jour (non fonctionnel) |

## Résultat

| Métrique | Valeur |
|---|---:|
| Poids avant | 89814.9 KB (87.71 MB) |
| Poids après | 3723.0 KB (3.64 MB) |
| Gain total | 86091.9 KB (84.07 MB) |
| Réduction | 95.9% |
| Fichiers optimisés | 43 |
| Fichiers non traités | 0 |

## Limites

- Validation mobile réelle recommandée (rendu sur petit écran).
- Le resize 608×1080 peut produire un léger upscale sur écrans >1080p — acceptable pour ce type de fond décoratif.
- Certains `game_over_bg` sont très petits après WebP (25–40 KB) car peu de détails — c'est normal.
- Les world_token_*.png (non référencés) n'ont pas été traités — ils resteront jusqu'à un patch de nettoyage dédié.
