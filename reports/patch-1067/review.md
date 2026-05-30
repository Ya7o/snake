# PATCH 1067 — Pickup Icon Readability Fix

## Controle

| Point | Statut | Note |
| --- | --- | --- |
| OutRun corrige | OUI | Checkpoint agrandi via profil renderer dedie, halo/ring elargis, leger offset vertical. |
| Shinobi corrige | OUI | Shuriken rendu avec micro-offset optique, taille legerement augmentee et halo stabilise. |
| Mecanique inchangee | OUI | Aucun changement de spawn, score, collision, boss, difficulte, progression, WorldMap, audio ou SaveSystem. |
| Captures presentes | OUI | 4 captures dans `reports/patch-1067/screenshots/`. |
| Verification | OUI | `npm run check` PASS. |

## Fichiers Modifies

- `src/render/PickupRenderer.ts`
- `public/assets/runtime/universes/outrun/pickup_checkpoint.png`
- `public/assets/runtime/universes/shinobi/pickup_shuriken.png`
- `reports/patch-1067/docs/pickup-icon-readability-fix.md`
- `reports/patch-1067/review.md`
- `reports/patch-1067/screenshots/outrun_pickup_after.png`
- `reports/patch-1067/screenshots/shinobi_pickup_after.png`
- `reports/patch-1067/screenshots/paperboy_mailbox_reference.png`
- `reports/patch-1067/screenshots/castle_pickup_non_regression.png`

## Captures

| Capture | Statut |
| --- | --- |
| `outrun_pickup_after.png` | Presente |
| `shinobi_pickup_after.png` | Presente |
| `paperboy_mailbox_reference.png` | Presente |
| `castle_pickup_non_regression.png` | Presente |

## Risques

- OutRun : l'icone deborde volontairement plus dans son halo, mais reste purement visuelle.
- Shinobi : l'offset est optique et tres faible ; il ne modifie pas la cellule cible.
- Les PNG runtime OutRun/Shinobi etaient deja modifies dans le worktree avant l'edition code et sont inclus car ils participent au correctif pickup.

## Resultat

PATCH 1067 valide : correction visuelle ciblee, mecanique inchangee, captures presentes, build/check OK.
