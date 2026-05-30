# Pickup Icon Readability Fix — PATCH 1067

## Probleme

Le QA mobile a signale deux problemes visuels sur les pickups runtime :

- OutRun : le pickup checkpoint etait trop fin / peu lisible sur la grille OutRun.
- Shinobi : le pickup shuriken paraissait decale, avec un rendu proche d'une emoji mal alignee.

La correction devait rester strictement visuelle : aucune modification de mecanique, difficulte, boss, progression, WorldMap, audio ou systemes de sauvegarde.

## Cause

`PickupRenderer` appliquait le meme `maxSize = cellSize * 1.9`, le meme centrage et le meme halo a tous les pickups image.

Ce profil unique fonctionne pour les icones carrees, mais il etait limite pour :

- OutRun : grille volontairement plus petite (`FRAME_GRID_WIDTH = 0.78`) et checkpoint tres vertical. Le rendu etait contraint par la hauteur et perdait en largeur apparente.
- Shinobi : shuriken optiquement legerement haut/gauche apres nettoyage des pixels parasites. Le centrage mathematique ne donnait pas le meilleur centre visuel dans le halo.

## Changements Par Fichier

| Fichier | Changement | Effet |
| --- | --- | --- |
| `src/render/PickupRenderer.ts` | Ajout de profils visuels par univers pour les pickups image | Ajuste taille, offset et halo sans toucher aux cellules ni aux collisions |
| `src/render/PickupRenderer.ts` | Profil OutRun : `maxSizeScale 2.35`, offset vertical leger, halo/ring un peu plus larges | Checkpoint plus lisible sur grille OutRun mobile |
| `src/render/PickupRenderer.ts` | Profil Shinobi : `maxSizeScale 2.05`, micro-offset x/y, halo legerement elargi | Shuriken mieux pose dans son halo, moins decale |
| `public/assets/runtime/universes/outrun/pickup_checkpoint.png` | PNG runtime deja ajuste dans le worktree, conserve dans le patch | Canvas runtime coherent 256x256, pas d'asset lourd |
| `public/assets/runtime/universes/shinobi/pickup_shuriken.png` | PNG runtime deja ajuste dans le worktree, conserve dans le patch | Pixels parasites retires, bbox alpha stable |

## Reference Paperboy Mailbox

La reference visuelle Paperboy est la mailbox OpenMoji avec halo vert : elle reste lisible car l'icone a une masse visuelle compacte et un halo distinct, meme en mobile portrait.

La correction 1067 reprend ce principe sans dupliquer le systeme Paperboy :

- un halo plus adapte a l'icone ;
- une taille effective suffisante pour lire la silhouette ;
- un centrage optique plutot qu'un centrage purement texture.

## Non-Regression

Le changement est limite a `PickupRenderer` et aux assets runtime pickup OutRun/Shinobi. Les fonctions de spawn, score, collision, boss, audio, SaveSystem et WorldMap ne sont pas modifiees.

Captures produites :

- `reports/patch-1067/screenshots/outrun_pickup_after.png`
- `reports/patch-1067/screenshots/shinobi_pickup_after.png`
- `reports/patch-1067/screenshots/paperboy_mailbox_reference.png`
- `reports/patch-1067/screenshots/castle_pickup_non_regression.png`

Verification :

- `npm run check` : PASS

Risque restant : le rendu final peut varier legerement selon densite d'ecran et interpolation WebGL, mais la taille/position sont maintenant stabilisees par configuration runtime.
