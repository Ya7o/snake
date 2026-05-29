# OutRun TurboZone Readability Pass

## Probleme

La turboZone du boss OutRun etait rendue comme une entite d'obstacle generique. Dans le contexte visuel OutRun, elle pouvait se confondre avec les sprites/effets proches du rival et ne signalait pas assez clairement la fenetre d'attaque.

## Changement

| Fichier | Changement | Raison |
|---|---|---|
| `src/render/ObstacleRenderer.ts` | Ajout d'un rendu dedie pour `turboZone`: halo cyan leger, fond jaune pulse, contour blanc, cercle interne et chevrons. | Renforcer la lecture de la fenetre d'attaque sans changer la cellule, le timing, la collision ou les weakpoints. |

## Avant / apres

Avant, la turboZone utilisait le rendu d'obstacle/image partage et pouvait manquer de contraste dans la grille OutRun.

Apres, la turboZone apparait comme une cible procedurale claire, centree sur une seule cellule, avec un contour blanc/cyan et un signe directionnel. Le signal reste localise et ne masque pas la grille.

## Non-regression

- OutRun normal : non touche par le changement; le rendu dedie ne s'applique qu'a l'entite `turboZone`, produite par le boss `TurboRivalBoss`.
- OutRun boss : turboZone plus visible; mecanique, timing, ttl, danger rival et weakpoint inchanges.
- Castle boss : capture de non-regression realisee; le rendu Castle/OpenMoji reste separe et non modifie.

## Limites

- Polish visuel seulement.
- Pas de changement mecanique.
- Test effectue en Chromium headless avec emulation mobile, pas sur appareil mobile reel.
- La lisibilite reste partiellement subjective selon luminosite d'ecran et contexte joueur.
