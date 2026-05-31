# PATCH 1095 Review

## Objectif
Supprimer proprement les assets runtime `secondary`, retirer leur cablage code/config, supprimer les PNG inutilises et verifier que le projet compile.

## Resultat
Termine. Le contrat runtime ne contient plus `pickupSecondary`, le preload ne charge plus ces assets, `GameScene` ne les assigne plus, et `PickupRenderer` n'alterne plus vers une texture secondaire. Paperboy conserve ses pickups multiples avec l'asset primaire existant.

## Fichiers modifies/supprimes
| Fichier | Statut | Note |
|---|---|---|
| `src/assets/runtimeUniverseAssets.ts` | modifie | Retrait du role/champ/mappings `pickupSecondary`. |
| `src/systems/RuntimeAssetResolver.ts` | modifie | Retrait de `pickupSecondary` des roles precharges. |
| `src/scenes/GameScene.ts` | modifie | Retrait resolution/assignation/debug overlay secondary. |
| `src/render/PickupRenderer.ts` | modifie | Retrait du support de texture secondaire. |
| `public/assets/runtime/universes/sonic/pickup_secondary.png` | supprime | Plus reference. |
| `public/assets/runtime/universes/streets/pickup_secondary.png` | supprime | Plus reference. |
| `public/assets/runtime/universes/fighter/pickup_secondary.png` | supprime | Plus reference. |
| `public/assets/runtime/universes/outrun/pickup_secondary.png` | supprime | Plus reference. |
| `public/assets/runtime/universes/shinobi/pickup_secondary.png` | supprime | Plus reference. |
| `public/assets/runtime/universes/kombat/pickup_secondary.png` | supprime | Plus reference. |
| `public/assets/runtime/universes/paperboy/pickup_secondary.png` | supprime | Plus reference; Paperboy utilise `pickup_newspaper.png`. |
| `reports/patch-1095/logs/secondary-removal-check.txt` | ajoute | Preuves avant/apres et verification. |
| `reports/patch-1095/docs/secondary-runtime-assets-removal.md` | ajoute | Documentation du retrait. |
| `reports/patch-1095/review.md` | ajoute | Review obligatoire. |

## Tests
- `npm run check` : OK (`tsc && vite build`).
- Recherche runtime apres : `rg -n "pickup_secondary|pickupSecondary|setSecondaryTextureKey|secondaryTextureKey" src/assets src/systems src/scenes/GameScene.ts src/render public/assets/runtime --glob '!dist/**'` : aucun match.
- Fichiers runtime apres : `find public/assets/runtime -iname '*secondary*' -type f -print` : aucun match.

## Captures
Aucune. Patch logique/cleanup, pas de capture requise.

## Limites
- La reference `src/ui/OpenMojiIconRegistry.ts:13` (`CASTLE_OPENMOJI_ICONS.pickupSecondary`) reste conservee car elle est non-runtime, non-PNG et hors suppression des assets `public/assets/runtime`.
- Les anciens rapports historiques peuvent encore mentionner `secondary`; ils documentent les audits precedents et ne sont pas des references runtime actives.
- `dist/` n'est pas ajoute au commit.

## Liens GitHub
- Branche : https://github.com/Ya7o/snake/tree/main
- Fichiers patch : https://github.com/Ya7o/snake/tree/main/reports/patch-1095
