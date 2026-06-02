# Critical Screen Quality Rebalance

## Problème

L'optimisation PATCH 1119 a réduit le poids total de ~87.71 MB à ~3.64 MB (gain ~95.9%) via conversion PNG → WebP q82 + resize (941×1672 → 608×1080 pour portraits, 1672×941 → 1080×608 / 1448×1086 → 1080×810 pour paysages).

QA mobile post-optimisation a révélé :
- **WorldMap / minimap** : flou et pixelisation visibles sur mobile (q82 trop destructeur pour une carte riche en détails géographiques)
- **Shinobi boss screen** : rendu trop low-res — personnage et décor perdent leurs détails fins
- **Autres boss screens** : même problème probable — illustrations personnage+décor à 94-97% de réduction = artefacts

## Principe

Compression par criticité visuelle, pas compression uniforme.

Le gain global de 1119 est conservé pour tous les assets non critiques (Tier B et C).
Seuls les assets Tier A (écrans riches en détails) sont retraités depuis les originaux backup.

## Tiers

| Tier | Type asset | Politique |
|---|---|---|
| A | WorldMap, boss screens détaillés | WebP q94-q97 (même resize que 1119) |
| B | gameplay backgrounds, system/clear/game_over bg | WebP q82 optimisé actuel — non touché |
| C | icônes/UI (OpenMoji, SVG, sprites) | ne pas toucher |

## Assets traités

| Asset | Problème | Action | Poids avant (orig) | Poids 1119 | Poids 1121 |
|---|---|---|---:|---:|---:|
| `ui/worldmap/world_map_minimap_16_9.webp` | Flou/pixelisation sur mobile | WebP q96, resize 1080×608 | 2 827.3 KB | 182.3 KB | 333.2 KB |
| `map/world_map.webp` | Carte détaillée, q82 insuffisant | WebP q96, resize 1080×810 | 2 807.0 KB | 250.7 KB | 443.5 KB |
| `ui/shinobi/shinobi_boss_system_bg.webp` | Too low-res — personnage + décor perdent détails fins | WebP q94, resize 608×1080 | 2 503.0 KB | 115.7 KB | 237.7 KB |
| `ui/fighter/fighter_boss_system_bg.webp` | Boss intro — illustration détaillée, 95.2% trop agressif | WebP q94, resize 608×1080 | 2 535.1 KB | 122.2 KB | 234.8 KB |
| `ui/kombat/kombat_boss_system_bg.webp` | Boss intro — illustration détaillée, 96.1% trop agressif | WebP q94, resize 608×1080 | 2 167.4 KB | 85.1 KB | 181.4 KB |
| `ui/streets/streets_boss_system_bg.webp` | Boss intro — illustration détaillée, 95.8% trop agressif | WebP q94, resize 608×1080 | 2 252.7 KB | 94.9 KB | 190.3 KB |
| `ui/castle/castle_boss_system_bg.webp` | Boss intro — illustration détaillée, 96.4% trop agressif | WebP q94, resize 608×1080 | 2 192.0 KB | 79.2 KB | 170.0 KB |
| `ui/sonic/sonic_boss_system_bg.webp` | Boss intro — illustration détaillée, 94.7% trop agressif | WebP q94, resize 608×1080 | 2 243.7 KB | 119.0 KB | 206.1 KB |
| `ui/outrun/outrun_boss_system_bg.webp` | Boss intro — illustration détaillée, 94.4% trop agressif | WebP q94, resize 608×1080 | 2 604.8 KB | 146.1 KB | 247.7 KB |
| `ui/paperboy/paperboy_boss_system_bg.webp` | Boss intro — illustration détaillée, 94.3% trop agressif | WebP q94, resize 608×1080 | 2 846.7 KB | 163.3 KB | 288.1 KB |

**Totaux (10 assets) :**

| Étape | Poids |
|---|---:|
| Original (avant 1119) | 24 979.7 KB |
| Après 1119 (q82) | 1 358.5 KB |
| Après 1121 (q94-q96) | 2 532.8 KB |
| Delta 1121 vs 1119 | +1 174.3 KB |
| Économie finale vs original | **89.9%** |

## Assets non traités

Les assets suivants ont été examinés mais conservés en l'état car ils ne constituent pas des écrans riches en détails fins ou leur rendu mobile est jugé acceptable :

| Asset | Raison |
|---|---|
| `title_hub_bg.webp` | Titre/hub — rendu mobile jugé OK, pas de signalement |
| Tous les `*_gameplay_bg.webp` | Tier B — backgrounds gameplay, décors sans illustrations de personnages detaillés |
| Tous les `*_system_bg.webp` (non boss) | Tier B — écrans système avec textes/UI, q82 acceptable |
| Tous les `*_clear_bg.webp` | Tier B — écrans victoire, qualité suffisante |
| Tous les `*_game_over_bg.webp` | Tier B — écrans défaite, qualité suffisante |
| OpenMoji / SVG / sprites | Tier C — ne pas toucher |

## Variantes de comparaison générées

Des variantes q90 / q94 / q96 / q97 ont été produites pour chaque asset critique dans :
`reports/patch-1121/comparison/<asset_name>/`

Ces fichiers sont hors git et servent uniquement à la comparaison visuelle.

## Résultat attendu

- **WorldMap/minimap** plus nette — q96 vs q82, même résolution 1080×608
- **Boss screens** plus détaillés — q94 vs q82, même résolution 608×1080
- **Gain global 1119 majoritairement conservé** — 89.9% d'économie sur les 10 assets critiques vs ~95.9% avant (delta acceptable)
- **33 autres assets non touchés** — gain 1119 intégralement préservé

## Limites

- Validation mobile réelle obligatoire — la comparaison programmée ne remplace pas l'œil humain
- Certaines pertes de détails peuvent venir du scaling runtime (Phaser) ou de l'upscaling dans le CSS
- Si q94 reste insuffisant pour certains boss screens, q97 est disponible dans `comparison/`
- Le resize (608×1080 pour portraits) est maintenu — si la résolution elle-même est le problème, une restauration partielle de résolution peut être envisagée dans un patch suivant
