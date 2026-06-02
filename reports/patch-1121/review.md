# Review

## Objectif

Restaurer la qualité visuelle des écrans critiques (WorldMap/minimap et boss screens) trop dégradés après l'optimisation globale PATCH 1119 (PNG → WebP q82 + resize).
Ne pas annuler l'optimisation globale — rebalancer uniquement les assets Tier A.

## Résultat

**10 assets Tier A retraités** depuis les originaux backup hors git.

| Catégorie | Assets traités | Qualité retenue | Resize |
|---|---|---|---|
| WorldMap / minimap | 2 | WebP q96 | identique à 1119 |
| Boss screens (tous univers) | 8 | WebP q94 | identique à 1119 |

**Poids total (10 assets critiques) :**

| Étape | Total |
|---|---:|
| Original avant 1119 | 24 979.7 KB |
| Après 1119 (q82) | 1 358.5 KB |
| Après 1121 (q94-q96) | 2 532.8 KB |
| Delta vs 1119 | +1 174.3 KB (~+1.1 MB) |
| Économie vs original | **89.9%** |

Les 33 autres assets non critiques restent à leur niveau 1119 — gain global largement préservé.

## Fichiers modifiés

Images remplacées (même chemin, même nom, même extension `.webp`) :

```
public/assets/ui/worldmap/world_map_minimap_16_9.webp   182.3 KB → 333.2 KB  (q96)
public/assets/map/world_map.webp                         250.7 KB → 443.5 KB  (q96)
public/assets/ui/shinobi/shinobi_boss_system_bg.webp     115.7 KB → 237.7 KB  (q94)
public/assets/ui/fighter/fighter_boss_system_bg.webp     122.2 KB → 234.8 KB  (q94)
public/assets/ui/kombat/kombat_boss_system_bg.webp        85.1 KB → 181.4 KB  (q94)
public/assets/ui/streets/streets_boss_system_bg.webp      94.9 KB → 190.3 KB  (q94)
public/assets/ui/castle/castle_boss_system_bg.webp        79.2 KB → 170.0 KB  (q94)
public/assets/ui/sonic/sonic_boss_system_bg.webp         119.0 KB → 206.1 KB  (q94)
public/assets/ui/outrun/outrun_boss_system_bg.webp       146.1 KB → 247.7 KB  (q94)
public/assets/ui/paperboy/paperboy_boss_system_bg.webp   163.3 KB → 288.1 KB  (q94)
```

**Aucun changement de nom ni d'extension** → aucune référence code à mettre à jour.

Rapport créé :
```
reports/patch-1121/logs/quality-rebalance-results.csv
reports/patch-1121/docs/critical-screen-quality-rebalance.md
reports/patch-1121/review.md
```

Variantes de comparaison (hors git, non committées) :
```
reports/patch-1121/comparison/<asset_name>/<asset>_q90.webp
reports/patch-1121/comparison/<asset_name>/<asset>_q94.webp
reports/patch-1121/comparison/<asset_name>/<asset>_q96.webp
reports/patch-1121/comparison/<asset_name>/<asset>_q97.webp
```

## Backup

Backup hors git utilisé :
`/home/kali/apps/snake_asset_backups/patch-1119/20260602-130716/`

Tous les originaux PNG ont été lus depuis ce backup.
Le backup n'a pas été modifié ni commité.
Les originaux du backup sont intacts.

## Tests / vérifications

```
npm run check
```

Résultat : **OK**

```
> snake-drive-v4@0.1.0 check
> npm run build

> snake-drive-v4@0.1.0 build
> tsc && vite build

✓ 62 modules transformed.
✓ built in 6.84s
```

TypeScript : aucune erreur.
Build Vite : succès.
`npm run build` non nécessaire séparément — inclus dans `npm run check`.

## Captures / comparaisons

Variantes q90 / q94 / q96 / q97 disponibles dans `reports/patch-1121/comparison/` pour comparaison visuelle manuelle.
Pas de screenshot headless disponible (Phaser WebGL — contrainte connue de l'environnement).

## Limites / risques

- Validation mobile réelle obligatoire — les chiffres de poids ne remplacent pas l'œil humain
- Poids remonte de +1 174.3 KB sur les 10 assets critiques (acceptable — reste 89.9% d'économie)
- Si q94 reste insuffisant pour certains boss screens, des variantes q97 sont disponibles localement
- Le resize (608×1080 pour portraits) est maintenu depuis 1119 — si la résolution est le problème, un patch supplémentaire sera nécessaire

## Liens GitHub

- Commit :
- PR :
