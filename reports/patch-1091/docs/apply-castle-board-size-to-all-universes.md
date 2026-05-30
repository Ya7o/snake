# Apply Castle Board Size To All Universes

## Problème
PATCH 1089 a gardé Castle comme exception, mais la décision produit est que Castle doit être la référence visuelle.

## Référence Castle
Castle utilise une grille logique 16x26. Sur le viewport mobile de référence 390x844, son empreinte visuelle est 288x468, avec une cellule de 18 px, positionnée à x=51 et y=176. Cette référence vient du `widthFactor` 0.75, du `verticalBias` 0.38 et du léger breathing vertical déjà utilisé pour Castle.

Cette empreinte devient la référence parce qu'elle donne le plateau le plus intégré au fond gameplay Castle et laisse assez d'air au HUD et au bas de l'écran.

## Changement
| Fichier | Changement | Raison |
|---|---|---|
| `src/scenes/GameScene.ts` | Séparation entre grille logique active et empreinte visuelle Castle 16x26. | Appliquer la présence visuelle Castle partout sans modifier les mécaniques. |
| `src/scenes/GameScene.ts` | Suppression des maps d'exceptions de sizing par univers, y compris OutRun. | Castle devient la règle de référence commune. |
| `reports/patch-1091/capture-patch-1091.mjs` | Captures ciblées et CSV de comparaison. | Produire les preuves visuelles demandées. |

## Règle finale
Les niveaux normaux utilisent leur grille logique existante. Castle reste en 16x26; Sonic, Streets, Fighter, OutRun, Shinobi, Kombat et Paperboy restent en 16x20.

Les boss utilisent la même règle que les niveaux normaux de leur univers.

Les univers avec une grille logique 16x20 sont centrés dans l'empreinte visuelle Castle 16x26, avec la même taille de cellule que Castle. Les coordonnées, collisions, spawns et mécaniques restent sur la grille logique active.

OutRun n'a plus d'exception de largeur ou de biais vertical. Son cockpit est traité par la même empreinte visuelle Castle; la validation capture vérifie le cadrage.

## Comparaison
| Niveau | Univers | Type | Grille | Plateau visuel | Cellule | Référence appliquée |
|---|---|---|---|---|---|---|
| castle_normal | castle | normal | 16x26 | 288x468 | 18 | oui |
| sonic_normal | sonic | normal | 16x20 | 288x468 | 18 | oui |
| paperboy_normal | paperboy | normal | 16x20 | 288x468 | 18 | oui |
| outrun_normal | outrun | normal | 16x20 | 288x468 | 18 | oui |
| sonic_boss | sonic | boss | 16x20 | 288x468 | 18 | oui |

## Exceptions
Aucune exception de sizing visuel par univers ne reste. La seule différence conservée est la grille logique Castle 16x26 contre 16x20 pour les autres univers, afin de ne pas changer les mécaniques.

## Risques
- Les backgrounds non-Castle ont maintenant un plateau plus étroit et plus cadré verticalement.
- La grille active 16x20 occupe le centre de l'empreinte 16x26, ce qui peut demander une validation mobile réelle.
- Les petits écrans mobiles restent à vérifier après déploiement.
