# Kombat / Shinobi Critical Visibility Fix

## Probleme
Trois P0 visuels etaient encore presents apres les patchs de nettete :

- Kombat normal : le pickup rouge/orange se perdait sur un board rouge sombre.
- Kombat boss : le board, le boss et les zones d'attaque manquaient de separation visuelle.
- Shinobi boss : le rendu pouvait etre trop noir, avec clones et board trop proches en luminance.

## Cause
Les assets n'etaient pas le probleme principal. La cause etait un melange de contraste insuffisant, de couleurs runtime trop proches, de halos trop faibles, et d'empilement visuel qui laissait les hazards Kombat couvrir le boss.

En capture headless, le timing passif ne faisait pas toujours avancer la phase boss; le script de capture force donc uniquement les ticks necessaires pour obtenir les phases `DANGER` et `FRAPPE`.

## Changements
| Fichier | Changement | Raison |
|---|---|---|
| `src/render/PickupRenderer.ts` | Ajout d'un profil Kombat avec backplate sombre, halo jaune/blanc, outline blanc plus fort et taille legerement augmentee. | Rendre le pickup Kombat clairement visible sans remplacer l'asset ni changer la mecanique. |
| `src/render/ObstacleRenderer.ts` | Ajout de `setUniverseId`, traitement Kombat pour `fatalZone`/`dangerZone`, halos boss Dragon Gate et Shadow Ninja, teinte/alpha pour le vrai Shadow Ninja, et boss sprites au-dessus des hazards. | Distinguer hazards, boss et clones sur boards sombres. |
| `src/scenes/GameScene.ts` | Application d'une palette runtime critique pour Kombat et Shinobi boss. | Conserver l'ambiance sombre tout en augmentant la lisibilite du board et des contours. |
| `reports/patch-1096/capture-targeted-screenshots.mjs` | Script Playwright cible pour les trois captures apres. | Produire les preuves visuelles demandees sans smoke test complet. |

## Verifications
- Kombat normal : `reports/patch-1096/screenshots/kombat_normal_after.png` montre le pickup avec halo/backplate lisible sur le board rouge.
- Kombat boss : `reports/patch-1096/screenshots/kombat_boss_after.png` montre board, zones danger et boss distingues pendant `DANGER`.
- Shinobi boss : `reports/patch-1096/screenshots/shinobi_boss_after.png` montre un board non noir et les ombres visibles pendant `FRAPPE`.
- `npm run check` : OK.

## Limites
- Validation mobile reelle : non faite; captures Playwright portrait 390x844 seulement.
- Ambiance sombre a preserver : les couleurs restent sombres, donc les captures doivent etre validees visuellement sur appareil si possible.
- Assets source non remplaces : les PNG existants restent utilises; le correctif est renderer/couleur/contraste.
