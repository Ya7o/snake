# Secondary Runtime Assets Removal

## Probleme
Assets secondary cables mais legacy / peu utiles.

## Decision
Debrancher et supprimer les secondary inutiles.

## Changements
| Fichier | Changement | Raison |
|---|---|---|
| `src/assets/runtimeUniverseAssets.ts` | Retrait du role `pickupSecondary`, du champ `pickupSecondary` et des sept mappings `pickup_secondary.png`. | Le contrat runtime ne doit plus referencer les assets secondary legacy. |
| `src/systems/RuntimeAssetResolver.ts` | Retrait de `pickupSecondary` des roles precharges en normal et boss. | Eviter tout preload vers des fichiers supprimes. |
| `src/scenes/GameScene.ts` | Retrait de la resolution `rtPickupSecondary`, de l'assignation au renderer et de l'entree debug overlay. | Le rendu runtime utilise maintenant uniquement le pickup primaire. |
| `src/render/PickupRenderer.ts` | Retrait de `secondaryTextureKey` et de l'alternance `i % 2 === 1`. | Les pickups multiples, dont Paperboy, restent lisibles avec l'asset primaire existant. |

## Fichiers supprimes
| Fichier | Pourquoi suppression sure |
|---|---|
| `public/assets/runtime/universes/sonic/pickup_secondary.png` | Plus reference par le registre runtime, le preload ou le renderer. |
| `public/assets/runtime/universes/streets/pickup_secondary.png` | Plus reference par le registre runtime, le preload ou le renderer. |
| `public/assets/runtime/universes/fighter/pickup_secondary.png` | Plus reference par le registre runtime, le preload ou le renderer. |
| `public/assets/runtime/universes/outrun/pickup_secondary.png` | Plus reference par le registre runtime, le preload ou le renderer. |
| `public/assets/runtime/universes/shinobi/pickup_secondary.png` | Plus reference par le registre runtime, le preload ou le renderer. |
| `public/assets/runtime/universes/kombat/pickup_secondary.png` | Plus reference par le registre runtime, le preload ou le renderer. |
| `public/assets/runtime/universes/paperboy/pickup_secondary.png` | Paperboy multi-pickups utilisent maintenant `pickup_newspaper.png`; plus de reference active. |

## Verifications
- plus de reference secondary : OK pour le contrat runtime (`src/assets`, `src/systems`, `src/scenes/GameScene.ts`, `src/render`, `public/assets/runtime`). Une reference restante `CASTLE_OPENMOJI_ICONS.pickupSecondary` est non-runtime et non-PNG.
- npm run check : OK.
- niveaux concernes : Sonic, Streets, Fighter, OutRun, Shinobi, Kombat et Paperboy utilisent leurs pickups primaires existants; Paperboy conserve ses multi-pickups sans alternance secondary.

## Risques
- fallback visuel disparu : accepte par decision de suppression; les pickups multiples utilisent l'asset primaire.
- Paperboy multi-pickups : lisibilite depend maintenant de `pickup_newspaper.png` pour tous les pickups actifs.
- future selection d'icones : si une vraie distinction secondaire revient, elle devra etre ajoutee explicitement avec un nouveau contrat, pas via les PNG legacy.
