# Runtime Icon Footprint Harmonization Fix

## Contexte

Apres PATCH 1077, la QA mobile reelle a montre que les obstacles runtime restaient trop petits
par rapport aux pickups. Les pickups (sonic ring, castle pickup, paperboy newspaper) etaient
lisibles a `cellSize * 1.9`. Les obstacles etaient a `cellSize * 1.25`, soit un ecart visuel
trop important sur mobile portrait.

Objectif : harmoniser l'empreinte visuelle pour que les obstacles soient "au moins aussi visibles"
que les pickups, sans les rendre enormes ni masquer le serpent ou la grille.

## Regles de classe appliquees

| Classe | Empreinte cible | Echelle appliquee |
|---|---|---|
| pickup important | depasse legerement la case (reference) | cs * 1.9 (inchange) |
| obstacle important | visible au moins comme pickup | cs * 1.70 (default) |
| obstacle critique (wide car) | legerement au-dessus du default | cs * 1.75 |
| boss | au-dessus des obstacles | cs * 1.75 (default) |
| boss portrait / wide | override dedie | cs * 1.78 - 1.82 |
| boss hazard paperboy | sous le pickup mais lisible | cs * 1.60 |

## Changements

Fichier unique modifie : `src/render/ObstacleRenderer.ts`

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

## Pickups inchanges

Les pickups etaient deja a la bonne echelle :
- `DEFAULT_IMAGE_PROFILE.maxSizeScale = 1.9` (sonic, streets, fighter, kombat, paperboy)
- outrun pickup : 2.35 (inchange, beacon tall asset)
- shinobi pickup : 2.05 (inchange, shuriken offset compense)
- `OPENMOJI_GAMEPLAY_ICON_SCALE = 1.9` (castle openmoji, delivery targets)

## Non-regression

- Collisions : inchangees, seules les tailles d'affichage sont modifiees.
- Gameplay : inchange, aucune mecanique ni niveau modifies.
- Assets : aucun asset converti, compresse ou renomme.
- `fitImageInCell` conserve les ratios natifs de chaque PNG.

## Risques

- Les icones plus larges augmentent le chevauchement visuel sur les niveaux denses.
- Les aspects non carres des PNG peuvent etre contraints par le ratio natif (fitImageInCell).
- La lisibilite finale reste subjective selon l'appareil mobile.
