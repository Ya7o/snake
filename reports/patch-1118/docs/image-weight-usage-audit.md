# Image Weight + Usage Audit

## Résumé

| Métrique | Valeur |
|---|---:|
| Total images | 89 |
| Poids total | 90608.8 KB (88.49 MB) |
| Images utilisées | 81 |
| Images non utilisées | 8 (586.1 KB) |
| Candidats safe_to_optimize | 43 |
| Gain estimé | ~73647.0 KB (~71.92 MB) |

> **Note :** L'estimation de gain (82%) est conservative. WebP lossy q82 sur PNG sans alpha en pratique donne souvent 85–90%.

### Top 5 fichiers les plus lourds

| Fichier | Poids | Dimensions | Alpha | Optimisable |
|---|---:|---|---|---|
| `paperboy_boss_system_bg.png` | 2846.7 KB | 941x1672 | no | yes |
| `world_map_minimap_16_9.png` | 2827.3 KB | 1672x941 | no | yes |
| `world_map.png` | 2807.0 KB | 1448x1086 | no | yes |
| `outrun_boss_system_bg.png` | 2604.8 KB | 941x1672 | no | yes |
| `fighter_boss_system_bg.png` | 2535.1 KB | 941x1672 | no | yes |

---

## Inventaire par catégorie

| Catégorie | Nombre | Poids total | Risque | Action |
|---|---:|---:|---|---|
| Backgrounds UI (universes) | 40 | 82294.4 KB (80.37 MB) | Critique — màj code requise | WebP lossy + resize |
| World Map | 2 | 5634.3 KB (5.5 MB) | Critique — màj code requise | WebP lossy + resize |
| Title Hub Background | 1 | 1886.2 KB (1.84 MB) | Critique — màj code requise | WebP lossy + resize |
| World Tokens (unused) | 8 | 586.1 KB (0.57 MB) | Nul | Supprimer |
| Icônes runtime PNG | 28 | 174.9 KB (0.17 MB) | Faible | Conserver |
| Icônes runtime SVG | 7 | 20.6 KB (0.02 MB) | Faible | Conserver |
| Sprites serpent | 3 | 12.3 KB (0.01 MB) | Faible | Conserver |

---

## Candidats optimisation

> Tous ont `safe_to_optimize = yes`. Tous sont des PNG portrait 941×1672 sans alpha.
> La conversion WebP + resize 645×1080 réduit à la fois le poids de compression et le volume en pixels.

| Fichier | Poids | Dimensions | Usage | safe_to_optimize | Action recommandée | Gain estimé |
|---|---:|---|---|---|---|---:|
| `paperboy_boss_system_bg.png` | 2846.7 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~2335.0 KB |
| `world_map_minimap_16_9.png` | 2827.3 KB | 1672x941 | direct | yes | WebP lossy + resize 645x1080 | ~2318.0 KB |
| `world_map.png` | 2807.0 KB | 1448x1086 | direct | yes | WebP lossy + resize 645x1080 | ~2302.0 KB |
| `outrun_boss_system_bg.png` | 2604.8 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~2136.0 KB |
| `fighter_boss_system_bg.png` | 2535.1 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~2079.0 KB |
| `fighter_system_bg.png` | 2517.4 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~2064.0 KB |
| `shinobi_boss_system_bg.png` | 2503.0 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~2052.0 KB |
| `streets_clear_bg.png` | 2478.4 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~2032.0 KB |
| `streets_system_bg.png` | 2476.8 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~2031.0 KB |
| `castle_clear_bg.png` | 2432.8 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1995.0 KB |
| `fighter_gameplay_bg.png` | 2365.2 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1939.0 KB |
| `outrun_clear_bg.png` | 2297.9 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1884.0 KB |
| `streets_boss_system_bg.png` | 2252.7 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1848.0 KB |
| `sonic_boss_system_bg.png` | 2243.7 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1840.0 KB |
| `fighter_clear_bg.png` | 2241.1 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1838.0 KB |
| `castle_boss_system_bg.png` | 2192.0 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1797.0 KB |
| `shinobi_system_bg.png` | 2174.4 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1783.0 KB |
| `kombat_boss_system_bg.png` | 2167.4 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1777.0 KB |
| `shinobi_clear_bg.png` | 2136.9 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1752.0 KB |
| `castle_system_bg.png` | 2111.8 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1732.0 KB |
| `kombat_clear_bg.png` | 2084.1 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1709.0 KB |
| `paperboy_system_bg.png` | 2056.6 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1687.0 KB |
| `paperboy_gameplay_bg.png` | 2033.4 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1667.0 KB |
| `outrun_system_bg.png` | 1990.7 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1633.0 KB |
| `sonic_system_bg.png` | 1971.7 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1617.0 KB |
| `sonic_clear_bg.png` | 1963.0 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1610.0 KB |
| `streets_gameplay_bg.png` | 1957.2 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1605.0 KB |
| `paperboy_clear_bg.png` | 1914.2 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1569.0 KB |
| `castle_game_over_bg.png` | 1910.6 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1567.0 KB |
| `fighter_game_over_bg.png` | 1903.2 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1560.0 KB |
| `title_hub_bg.png` | 1886.2 KB | 941x1672 | direct | yes | WebP lossy + resize 645x1080 | ~1546.0 KB |
| `streets_game_over_bg.png` | 1882.0 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1543.0 KB |
| `kombat_game_over_bg.png` | 1807.5 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1482.0 KB |
| `sonic_gameplay_bg.png` | 1780.9 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1460.0 KB |
| `outrun_game_over_bg.png` | 1758.5 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1442.0 KB |
| `kombat_system_bg.png` | 1744.8 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1431.0 KB |
| `outrun_gameplay_bg.png` | 1659.4 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1360.0 KB |
| `castle_gameplay_bg.png` | 1598.4 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1310.0 KB |
| `shinobi_gameplay_bg.png` | 1597.0 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1310.0 KB |
| `shinobi_game_over_bg.png` | 1574.9 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1292.0 KB |
| `kombat_gameplay_bg.png` | 1549.6 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1271.0 KB |
| `sonic_game_over_bg.png` | 1497.7 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1228.0 KB |
| `paperboy_game_over_bg.png` | 1480.9 KB | 941x1672 | dynamic_template | yes | WebP lossy + resize 645x1080 | ~1214.0 KB |

---

## À ne pas convertir

| Fichier / catégorie | Raison |
|---|---|
| SVGs OpenMoji (castle icons) | Format vectoriel optimal, tiny, conservé |
| `snake_u01_*.png` | Sprites gameplay critiques, alpha probable |
| Icônes runtime <15 KB | Gain négligeable, risque lisibilité |
| `world_token_*.png` | Non référencés → candidats suppression, pas conversion |
| `design_boards/` | Hors scope — sources graphiques |
| `dist/` | Build artefact — ignoré |

---

## Images non utilisées

Ces 8 fichiers ne sont référencés nulle part dans `src/`. Ils représentent **586.1 KB** de poids inutile.

| Fichier | Poids | Dimensions |
|---|---:|---|
| `world_token_castle.png` | 75.9 KB | 256x256 |
| `world_token_fighter.png` | 68.7 KB | 256x256 |
| `world_token_kombat.png` | 70.2 KB | 256x256 |
| `world_token_outrun.png` | 74.7 KB | 256x256 |
| `world_token_paperboy.png` | 78.0 KB | 256x256 |
| `world_token_shinobi.png` | 75.1 KB | 256x256 |
| `world_token_speed.png` | 74.2 KB | 256x256 |
| `world_token_streets.png` | 69.3 KB | 256x256 |

> **Action recommandée :** suppression propre (hors scope PATCH 1119 — dédier un patch séparé).

---

## Stratégie d'optimisation

### Format cible
- **WebP lossy q82** pour tous les backgrounds PNG sans alpha (ui_bg, worldmap, title_hub_bg).
- **Pas de conversion** pour SVGs, sprites serpent, icônes runtime <15 KB.

### Resize
- Tous les backgrounds 941×1672 → **645×1080** (facteur 0.686 sur la hauteur).
- World map 1448×1086 → **790×593** (cap à 1080 sur la plus longue).
- Minimap 1672×941 → **1080×608** (cap à 1080 sur la plus longue).
- Title hub 941×1672 → **645×1080**.

### Backup
- Backup hors git obligatoire : `~/apps/snake_asset_backups/patch-1119/YYYYMMDD-HHMMSS/`
- Conserver l'arborescence relative.

### Mise à jour code
- Conversion en WebP → changement d'extension dans :
  - `src/config/constants.ts` : template `${uid}_system_bg.png` → `.webp`
  - `src/scenes/TitleScene.ts` : `title_hub_bg.png` → `.webp`
  - `src/config/constants.ts` : `WORLD_MAP` et `WORLD_MAP_MINIMAP` urls → `.webp`

---

## Plan 1119

Actions exactes à exécuter dans PATCH 1119 :

```
Backup hors git : ~/apps/snake_asset_backups/patch-1119/<timestamp>/

1. `public/assets/ui/paperboy/paperboy_boss_system_bg.png` → WebP q82, 608x1080 (gain ~2335.0 KB)
2. `public/assets/ui/worldmap/world_map_minimap_16_9.png` → WebP q82, 1080x608 (gain ~2318.0 KB)
3. `public/assets/map/world_map.png` → WebP q82, 1080x810 (gain ~2302.0 KB)
4. `public/assets/ui/outrun/outrun_boss_system_bg.png` → WebP q82, 608x1080 (gain ~2136.0 KB)
5. `public/assets/ui/fighter/fighter_boss_system_bg.png` → WebP q82, 608x1080 (gain ~2079.0 KB)
6. `public/assets/ui/fighter/fighter_system_bg.png` → WebP q82, 608x1080 (gain ~2064.0 KB)
7. `public/assets/ui/shinobi/shinobi_boss_system_bg.png` → WebP q82, 608x1080 (gain ~2052.0 KB)
8. `public/assets/ui/streets/streets_clear_bg.png` → WebP q82, 608x1080 (gain ~2032.0 KB)
9. `public/assets/ui/streets/streets_system_bg.png` → WebP q82, 608x1080 (gain ~2031.0 KB)
10. `public/assets/ui/castle/castle_clear_bg.png` → WebP q82, 608x1080 (gain ~1995.0 KB)
11. `public/assets/ui/fighter/fighter_gameplay_bg.png` → WebP q82, 608x1080 (gain ~1939.0 KB)
12. `public/assets/ui/outrun/outrun_clear_bg.png` → WebP q82, 608x1080 (gain ~1884.0 KB)
13. `public/assets/ui/streets/streets_boss_system_bg.png` → WebP q82, 608x1080 (gain ~1848.0 KB)
14. `public/assets/ui/sonic/sonic_boss_system_bg.png` → WebP q82, 608x1080 (gain ~1840.0 KB)
15. `public/assets/ui/fighter/fighter_clear_bg.png` → WebP q82, 608x1080 (gain ~1838.0 KB)
16. `public/assets/ui/castle/castle_boss_system_bg.png` → WebP q82, 608x1080 (gain ~1797.0 KB)
17. `public/assets/ui/shinobi/shinobi_system_bg.png` → WebP q82, 608x1080 (gain ~1783.0 KB)
18. `public/assets/ui/kombat/kombat_boss_system_bg.png` → WebP q82, 608x1080 (gain ~1777.0 KB)
19. `public/assets/ui/shinobi/shinobi_clear_bg.png` → WebP q82, 608x1080 (gain ~1752.0 KB)
20. `public/assets/ui/castle/castle_system_bg.png` → WebP q82, 608x1080 (gain ~1732.0 KB)
21. `public/assets/ui/kombat/kombat_clear_bg.png` → WebP q82, 608x1080 (gain ~1709.0 KB)
22. `public/assets/ui/paperboy/paperboy_system_bg.png` → WebP q82, 608x1080 (gain ~1687.0 KB)
23. `public/assets/ui/paperboy/paperboy_gameplay_bg.png` → WebP q82, 608x1080 (gain ~1667.0 KB)
24. `public/assets/ui/outrun/outrun_system_bg.png` → WebP q82, 608x1080 (gain ~1633.0 KB)
25. `public/assets/ui/sonic/sonic_system_bg.png` → WebP q82, 608x1080 (gain ~1617.0 KB)
26. `public/assets/ui/sonic/sonic_clear_bg.png` → WebP q82, 608x1080 (gain ~1610.0 KB)
27. `public/assets/ui/streets/streets_gameplay_bg.png` → WebP q82, 608x1080 (gain ~1605.0 KB)
28. `public/assets/ui/paperboy/paperboy_clear_bg.png` → WebP q82, 608x1080 (gain ~1569.0 KB)
29. `public/assets/ui/castle/castle_game_over_bg.png` → WebP q82, 608x1080 (gain ~1567.0 KB)
30. `public/assets/ui/fighter/fighter_game_over_bg.png` → WebP q82, 608x1080 (gain ~1560.0 KB)
31. `public/assets/ui/title/title_hub_bg.png` → WebP q82, 608x1080 (gain ~1546.0 KB)
32. `public/assets/ui/streets/streets_game_over_bg.png` → WebP q82, 608x1080 (gain ~1543.0 KB)
33. `public/assets/ui/kombat/kombat_game_over_bg.png` → WebP q82, 608x1080 (gain ~1482.0 KB)
34. `public/assets/ui/sonic/sonic_gameplay_bg.png` → WebP q82, 608x1080 (gain ~1460.0 KB)
35. `public/assets/ui/outrun/outrun_game_over_bg.png` → WebP q82, 608x1080 (gain ~1442.0 KB)
36. `public/assets/ui/kombat/kombat_system_bg.png` → WebP q82, 608x1080 (gain ~1431.0 KB)
37. `public/assets/ui/outrun/outrun_gameplay_bg.png` → WebP q82, 608x1080 (gain ~1360.0 KB)
38. `public/assets/ui/castle/castle_gameplay_bg.png` → WebP q82, 608x1080 (gain ~1310.0 KB)
39. `public/assets/ui/shinobi/shinobi_gameplay_bg.png` → WebP q82, 608x1080 (gain ~1310.0 KB)
40. `public/assets/ui/shinobi/shinobi_game_over_bg.png` → WebP q82, 608x1080 (gain ~1292.0 KB)
41. `public/assets/ui/kombat/kombat_gameplay_bg.png` → WebP q82, 608x1080 (gain ~1271.0 KB)
42. `public/assets/ui/sonic/sonic_game_over_bg.png` → WebP q82, 608x1080 (gain ~1228.0 KB)
43. `public/assets/ui/paperboy/paperboy_game_over_bg.png` → WebP q82, 608x1080 (gain ~1214.0 KB)
```

Puis mise à jour des références dans le code (3 fichiers) et `npm run check`.

---

## Risques

| Risque | Niveau | Mitigation |
|---|---|---|
| Dégradation visuelle | Faible | q82 préserve la qualité perceptuelle |
| Casse de référence | Moyen | Mettre à jour constants.ts + TitleScene.ts |
| Oubli d'un preload | Moyen | Grep toutes les urls .png avant commit |
| Resize trop agressif | Faible | 645×1080 = ~66 000 px, assez sur mobile |
