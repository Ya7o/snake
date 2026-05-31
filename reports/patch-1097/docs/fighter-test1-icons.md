# Fighter Test1 Icons

## Objectif
Brancher les 5 icônes test1 pour validation mobile.

## Mapping
| Usage | Ancien asset/key | Nouveau fichier | Renderer |
|---|---|---|---|
| Pickup énergie normal Fighter | `rt_fighter_pickup` / `public/assets/runtime/universes/fighter/pickup_energy.png` | `public/assets/runtime/universes/fighter/test1/sf2_pickup_energy.png` | `PickupRenderer` |
| Obstacle normal / `sparZone` Fighter | `openmoji-fighter-fist` / `public/assets/runtime/universes/fighter/icon_spar_fist.svg` | `public/assets/runtime/universes/fighter/test1/sf2_obstacle_normal.png` | `ObstacleRenderer` entity resolver |
| `counterZone` / obstacle boss Fighter | `rt_fighter_obstacle` / `public/assets/runtime/universes/fighter/obstacle_charge_marker.png` | `public/assets/runtime/universes/fighter/test1/sf2_obstacle_boss.png` | `ObstacleRenderer` obstacle texture |
| Boss `finalChallenger` idle | `rt_fighter_boss_idle` / `public/assets/runtime/universes/fighter/boss_idle.png` | `public/assets/runtime/universes/fighter/test1/sf2_boss_idle.png` | `ObstacleRenderer` boss resolver |
| Boss `finalChallenger` `attack_window` / `counter` | `rt_fighter_boss_attack` / `public/assets/runtime/universes/fighter/boss_attack.png` | `public/assets/runtime/universes/fighter/test1/sf2_boss_attack.png` | `ObstacleRenderer` boss resolver |

## Non-régression
- gameplay : inchangé, aucun code de mécanique modifié.
- difficulté : inchangée, aucun spawn/timing/HP modifié.
- score : inchangé, aucune constante ou règle de score modifiée.
- autres univers : inchangés, mapping limité à Fighter.

## Validation attendue
L’utilisateur fera des captures avant/après :
- Fighter normal
- Fighter boss
