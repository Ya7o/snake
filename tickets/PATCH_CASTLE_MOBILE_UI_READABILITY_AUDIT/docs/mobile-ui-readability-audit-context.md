# Note de contexte — audit mobile UI Castle + transversal

## Diagnostic
Les captures montrent une même famille de défauts : l'UI n'a pas encore de contrat mobile strict.

Le risque serait de corriger chaque symptôme isolément : réduire une police ici, agrandir une icône là, supprimer une ligne ailleurs. Ce serait fragile. Le patch doit plutôt poser trois contrats simples :

1. **Contrat texte** : tout texte fonctionnel doit tenir dans une largeur sûre, avec une formulation courte.
2. **Contrat HUD** : en gameplay, une seule ligne compacte ; pas de redite entre règle statique et statut dynamique.
3. **Contrat lisibilité grille** : la grille, les pickups et les dangers priment sur cadre, décor et wording.

## Priorité d'intervention
1. `HUDRenderer.ts` + appel `GameScene.ts` : plus gros gain immédiat en espace et clarté.
2. `PickupRenderer.ts` / `ObstacleRenderer.ts` : corrige la lecture instantanée en jeu.
3. `TitleScene.ts` / `LevelIntroScene.ts` : corrige les débordements et le wording.
4. `GridRenderer.ts` / layout `GameScene.ts` : maximiser proprement la zone jouable.
5. `levels.ts` : audit wording complet.

## Proposition de wording Castle
- Rule : `MURS FANTÔMES`
- Hint : `Ils apparaissent par pulsations. Avance quand la voie est libre.`
- HUD compact : `CASTLE | MURS FANTÔMES | 0/10`

Alternative si le statut dynamique est plus utile :
- Rule intro : `MURS FANTÔMES`
- HUD : `CASTLE | PULSE DANGER | 0/10`

Ne pas afficher simultanément les deux si cela répète la même information.

## Matrice d'audit univers
| Univers | À vérifier | Risque principal |
|---|---|---|
| castle | murs clignotants, pickup, HUD | doublon + obstacles peu lisibles |
| sonic | rings / chains | pickup trop petit ou trop proche du décor |
| streets | crowd blockers | obstacles confondus avec décor |
| fighter | charge / rounds | HUD trop verbeux |
| outrun | lanes / checkpoints | grille sacrifiée au cadre |
| shinobi | focus / decoys | dangers insuffisamment télégraphiés |
| kombat | fatal zones | danger trop agressif visuellement |
| paperboy | delivery targets | cible / obstacle ambigu |

## Captures de référence incluses
- `references/screenshots/01_title_overflow.jpg`
- `references/screenshots/02_level_intro_translation.jpg`
- `references/screenshots/03_castle_gameplay_hud_grid_pickup.jpg`
