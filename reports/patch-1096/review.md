# PATCH 1096 Review

## Objectif
Corriger uniquement les P0 de visibilite Kombat normal, Kombat boss et Shinobi boss sans modifier gameplay, difficulte, score ou assets source.

## Resultat
Termine. Les corrections sont limitees aux couleurs runtime et aux renderers :

- Kombat normal : pickup renforce par backplate, halo et outline.
- Kombat boss : zones danger plus lisibles, boss au-dessus des hazards, board plus contraste.
- Shinobi boss : board non noir, clones plus visibles, vrai clone differencie en phase `FRAPPE`.

## Fichiers modifies
| Fichier | Changement |
|---|---|
| `src/render/PickupRenderer.ts` | Profil visuel Kombat pour pickup. |
| `src/render/ObstacleRenderer.ts` | Traitements visuels Kombat/Shinobi pour hazards et boss. |
| `src/scenes/GameScene.ts` | Palette runtime critique Kombat/Shinobi boss et passage d'univers au renderer obstacle. |
| `reports/patch-1096/capture-targeted-screenshots.mjs` | Script de captures ciblees. |
| `reports/patch-1096/docs/kombat-shinobi-critical-visibility-fix.md` | Documentation du correctif. |
| `reports/patch-1096/logs/verification.txt` | Log de verification. |
| `reports/patch-1096/screenshots/*.png` | Captures apres demandees. |

## Tests
- `npm run check` : OK.
- Captures ciblees : OK.

## Captures
- `reports/patch-1096/screenshots/kombat_normal_after.png`
- `reports/patch-1096/screenshots/kombat_boss_after.png`
- `reports/patch-1096/screenshots/shinobi_boss_after.png`

## Limites
- Pas de smoke test complet, conformement au scope.
- Les captures boss avancent les ticks via le script Playwright pour rendre les phases critiques visibles en headless; cela ne modifie pas le code gameplay.
- Validation tactile/mobile reelle non faite.
- Les assets source n'ont pas ete remplaces.

## Liens GitHub
- Branche : https://github.com/Ya7o/snake/tree/main
- Rapport : https://github.com/Ya7o/snake/tree/main/reports/patch-1096
