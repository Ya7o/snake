# Runtime Icon Size Harmonization Fix

## Probleme

PATCH 1069 a montre que les icones runtime n'avaient pas la meme lisibilite mobile selon leur chemin de rendu.

- Les pickups et la mailbox Paperboy etaient lisibles autour de `cellSize * 1.9`.
- Les obstacles PNG runtime etaient autour de `cellSize * 0.74`, trop petits sur mobile.
- Les boss PNG runtime etaient proches de `cellSize * 1.0`, souvent trop proches d'un obstacle ordinaire.
- OutRun et certains boss portrait/large etaient les cas les plus sensibles.

## Decision

Harmonisation par classes, pas taille unique.

La mailbox Paperboy reste la reference positive, mais les obstacles et boss ne sont pas forces a la meme taille que les pickups. Les PNG sont agrandis de facon controlee et gardent leur ratio via `fitImageInCell`.

## Regles appliquees

| Classe | Regle |
|---|---|
| pickup | Inchangé, taille lisible existante |
| entity OpenMoji | Inchangé a `cellSize * 1.9`, mailbox Paperboy conservee |
| obstacle PNG | `cellSize * 1.25` par defaut |
| obstacle PNG critique | Overrides par type, ex. OutRun `trafficBlock` a `cellSize * 1.45` |
| boss PNG | `cellSize * 1.55` par defaut |
| boss PNG aspect sensible | Overrides par type pour OutRun et boss portrait |
| decor/procedural | Pas de changement global |

## Changements

| Univers | Objet | Avant | Apres | Raison |
|---|---|---|---|---|
| Sonic | bumper | `cs * 0.74` | `cs * 1.25` | Obstacle plus lisible |
| Streets | crowd blocker | `cs * 0.74` | `cs * 1.25` | Obstacle plus lisible |
| Fighter | charge marker | `cs * 0.74` | `cs * 1.25` | Obstacle plus lisible |
| OutRun | traffic car | `cs * 0.74` | `cs * 1.45` | Cas critique mobile, asset large |
| Kombat | fatal zone | `cs * 0.74` | `cs * 1.25` | Obstacle plus lisible |
| Paperboy | mailbox | `cs * 1.9` | `cs * 1.9` | Reference conservee |
| Paperboy | roadblock | `cs * 1.9` | `cs * 1.9` | Reference lisible conservee |
| Paperboy | dog fallback | `cs * 0.74` | `cs * 1.35` | Fallback SVG non minuscule |
| Boss PNG | default | environ `cs * 1.0` | `cs * 1.55` | Boss plus visible |
| OutRun boss | turbo rival | environ `cs * 1.0` | `cs * 1.70` | Asset large critique |
| Paperboy boss | chaos obstacle | environ `cs * 1.0` | `cs * 1.35` | Hazard mobile plus clair, sous la mailbox |

## Non-regression

- collisions : inchangees, seules les tailles d'affichage sont modifiees.
- gameplay : inchange, aucune mecanique ni niveau modifies.
- lisibilite mobile : verifiee par captures 390x844.
- boss : les sprites boss sont plus visibles, sans changer PV, weakpoints ou dangers.

## Risques

- Certains objets peuvent sembler visuellement plus proches de leur cellule voisine.
- Une surcharge visuelle reste possible sur mobile si beaucoup d'entites se regroupent.
- La lisibilite garde une part subjective selon l'appareil.
