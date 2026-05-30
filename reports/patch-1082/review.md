# Review

## Objectif

Harmoniser l'empreinte visuelle des icones runtime apres QA mobile post-1077.
Les obstacles restaient trop petits (cs * 1.25) par rapport aux pickups de reference (cs * 1.9).

## Resultat

Scales obstacles et boss PNG runtime releves dans `src/render/ObstacleRenderer.ts`.
Les obstacles sont desormais proches du niveau de visibilite des pickups. Hierarchy:
pickup (1.9) > boss (1.75-1.82) > obstacle (1.70-1.75) > pickup reste la reference.

| Constante | Avant | Apres |
|---|---|---|
| DEFAULT_RUNTIME_OBSTACLE_ICON_SCALE | 1.25 | 1.70 |
| DEFAULT_RUNTIME_BOSS_ICON_SCALE | 1.55 | 1.75 |
| trafficBlock override | 1.45 | 1.75 |
| routeObstacle override | 1.35 | 1.70 |
| crimeLord override | 1.68 | 1.82 |
| finalChallenger override | 1.62 | 1.78 |
| turboRival override | 1.70 | 1.82 |
| chaosObstacle override | 1.35 | 1.60 |

## Fichiers modifies

- `src/render/ObstacleRenderer.ts`
- `reports/patch-1082/review.md`
- `reports/patch-1082/docs/runtime-icon-footprint-harmonization-fix.md`
- `reports/patch-1082/logs/icon-footprint-changes.csv`

## Tests / verifications

Commandes lancees :

- `npm run check`

Resultat :

- OK — 0 erreur TypeScript, 60 modules, warning chunk > 500 kB attendu.

## Captures

Captures Playwright non retenues (GameOver systematique en headless apres timeout snake).
Le fix visuel est verifie par lecture du code (scales uniquement, aucune mecanique modifiee).

## Documents

- `reports/patch-1082/docs/runtime-icon-footprint-harmonization-fix.md`
- `reports/patch-1082/logs/icon-footprint-changes.csv`

## Limites / risques

- Captures mobiles reelles recommandees pour validation finale.
- Les icones plus larges augmentent le chevauchement visuel sur niveaux denses.
- Collisions inchangees — seules les tailles d'affichage sont modifiees.

## Liens GitHub

- Commit : a renseigner apres push
- PR : non creee
