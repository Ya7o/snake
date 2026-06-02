# Format Rebalance From Raw Assets

## Objectif

Améliorer la qualité visuelle en repartant des assets bruts, avec une optimisation légère centrée sur le format, pas sur la compression agressive.

Le patch-1121 avait amélioré la qualité de WebP q82 → q94-q96 pour les assets critiques, mais conservait le resize de 1119 (608×1080 pour les boss screens, 1080×608-810 pour WorldMap/minimap). Cette réduction de résolution reste visible sur mobile — notamment sur la WorldMap et le Shinobi boss screen.

## Décision produit

La beauté du jeu et la préservation des détails passent avant l'optimisation maximale.

La résolution native des originaux (941×1672 pour les boss screens portrait, 1672×941 pour la minimap, 1448×1086 pour la WorldMap) est restaurée dans cette passe. Le format PNG est converti en WebP q98 (méthode 6), ce qui assure une fidélité visuelle très proche des originaux tout en divisant le poids par ~3,5 vs PNG brut.

## Politique par type d'asset

| Type asset | Politique |
|---|---|
| WorldMap / minimap | Pleine résolution originale + WebP q98 |
| Boss screens détaillés | Pleine résolution originale + WebP q98 |
| Backgrounds gameplay | Conserver l'optimisation actuelle (1119/1121) — non touché |
| UI / icônes | Inchangé |

## Assets retraités

| Asset | Problème | Ancien format | Nouveau format | Résolution | Poids brut | Poids 1121 | Poids 1122 | Décision |
|---|---|---|---|---|---:|---:|---:|---|
| `map/world_map.webp` | Downscale 1448→1080 trop visible — carte détaillée | WebP q96 1080×810 | WebP q98 | 1448×1086 | 2807.0 KB | 443.5 KB | 793.1 KB | Résolution native restaurée |
| `ui/worldmap/world_map_minimap_16_9.webp` | Downscale 1672→1080 trop visible — labels illisibles | WebP q96 1080×608 | WebP q98 | 1672×941 | 2827.3 KB | 333.2 KB | 793.2 KB | Résolution native restaurée |
| `ui/shinobi/shinobi_boss_system_bg.webp` | Downscale 941→608 — personnage perd ses détails fins | WebP q94 608×1080 | WebP q98 | 941×1672 | 2503.0 KB | 237.7 KB | 632.4 KB | Résolution native restaurée |
| `ui/fighter/fighter_boss_system_bg.webp` | Downscale 941→608 — illustration combat dégradée | WebP q94 608×1080 | WebP q98 | 941×1672 | 2535.1 KB | 234.8 KB | 618.4 KB | Résolution native restaurée |
| `ui/kombat/kombat_boss_system_bg.webp` | Downscale 941→608 — détails boss Kombat perdus | WebP q94 608×1080 | WebP q98 | 941×1672 | 2167.4 KB | 181.4 KB | 491.0 KB | Résolution native restaurée |
| `ui/streets/streets_boss_system_bg.webp` | Downscale 941→608 — détails boss Streets perdus | WebP q94 608×1080 | WebP q98 | 941×1672 | 2252.7 KB | 190.3 KB | 512.1 KB | Résolution native restaurée |
| `ui/castle/castle_boss_system_bg.webp` | Downscale 941→608 — détails boss Castle perdus | WebP q94 608×1080 | WebP q98 | 941×1672 | 2192.0 KB | 170.0 KB | 466.3 KB | Résolution native restaurée |
| `ui/sonic/sonic_boss_system_bg.webp` | Downscale 941→608 — détails boss Sonic perdus | WebP q94 608×1080 | WebP q98 | 941×1672 | 2243.7 KB | 206.1 KB | 497.1 KB | Résolution native restaurée |
| `ui/outrun/outrun_boss_system_bg.webp` | Downscale 941→608 — illustration boss OutRun dégradée | WebP q94 608×1080 | WebP q98 | 941×1672 | 2604.8 KB | 247.7 KB | 637.0 KB | Résolution native restaurée |
| `ui/paperboy/paperboy_boss_system_bg.webp` | Downscale 941→608 — illustration boss Paperboy dégradée | WebP q94 608×1080 | WebP q98 | 941×1672 | 2846.7 KB | 288.1 KB | 734.8 KB | Résolution native restaurée |

**Totaux (10 assets) :**

| Étape | Poids total |
|---|---:|
| Originaux bruts PNG (backup) | 24 979.7 KB |
| Après 1119 (q82, 608×1080 / 1080×608-810) | 1 358.5 KB |
| Après 1121 (q94-q96, même resize) | 2 532.8 KB |
| Après 1122 (q98, résolution native) | 6 175.4 KB |
| Réduction vs brut | **75.3%** |
| Delta vs 1121 | +3 642.6 KB (poids remonté — accepté pour la qualité) |

## Assets non retraités

Ces assets ont été examinés mais conservés en l'état intentionnellement :

| Asset | Raison |
|---|---|
| Tous les `*_gameplay_bg.webp` | Tier B — backgrounds gameplay à décors, rendu mobile acceptable |
| Tous les `*_system_bg.webp` (non boss) | Tier B — écrans textes/UI, q82 suffisant |
| Tous les `*_clear_bg.webp` | Tier B — écrans victoire, qualité suffisante |
| Tous les `*_game_over_bg.webp` | Tier B — écrans défaite, qualité suffisante |
| `title_hub_bg.webp` | Tier B — écran titre, pas de signalement dégradation |
| Sprites, OpenMoji, SVG, icônes | Tier C — ne pas toucher |
| Assets `level-intros/` | Tier B — non signalés comme dégradés |
| Assets `frames/` | Tier C — assets gameplay, hors scope |

## Justification du choix q98 vs q99

- q98 : ~793 KB pour WorldMap/minimap, ~491–734 KB pour boss screens
- q99 : ~849 KB pour WorldMap/minimap, ~534–805 KB pour boss screens
- Delta q99 vs q98 : +7–9% de poids pour un gain visuel marginal

q98 est le bon compromis : rendu quasi-irréprochable, format moderne WebP, poids raisonnable.

## Résolution

Les chemins `.webp` sont maintenus (identiques à 1119/1121) — aucune modification de références de code nécessaire.

## Résultat attendu

- Jeu plus beau sur mobile — boss screens et cartes à pleine résolution
- Détails fins préservés — personnages, décors, labels de carte
- Gain de poids maintenu vs brut — ~75% d'économie vs PNG original
- Aucune modification de code — même chemins `.webp`

## Limites

- Ce n'est pas une optimisation maximale — le poids remonte de ~3.6 MB vs 1121
- La priorité est la qualité visuelle
- Validation mobile réelle obligatoire pour confirmer l'amélioration
- Certains assets Tier B pourraient encore bénéficier d'une passe similaire si des problèmes sont constatés
