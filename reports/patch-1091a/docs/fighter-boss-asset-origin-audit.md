# Fighter Boss Asset Origin Audit

## Question
D'ou vient le personnage visible dans Fighter boss ?

## Reponse courte
Le personnage visible en haut du plateau est le boss Fighter prevu par la mecanique `finalChallenger`. Il vient de l'asset runtime PNG `public/assets/runtime/universes/fighter/boss_final_challenger.png`, charge sous la cle Phaser `rt_fighter_boss`, puis rendu par `ObstacleRenderer` comme entite boss `finalChallenger`.

Ce n'est pas un OpenMoji, pas un obstacle, pas un weakpoint separe, pas un projectile, et pas un fallback procedural. C'est un asset partage/provenance externe de l'univers Fighter, issu du pack runtime valide `patch_943_final_24_validated_runtime_assets_and_cleanup`. Visuellement, il ressemble a un combattant d'arcade/dojo et peut donc paraitre sorti d'un autre univers "Street Fighter-like", mais le mapping runtime pointe bien vers Fighter boss.

## Trace technique
| Etape | Valeur |
|---|---|
| levelId | `fighter_boss` |
| niveau | `Ultime Challenger` |
| universeId | `fighter` |
| boss mechanic | `finalChallenger` / `FinalChallengerBoss` |
| position initiale | `col = floor(cols / 2)`, `row = 2`, donc haut du plateau |
| entity type | boss entity |
| logical name | `finalChallenger` |
| entites associees | `finalChallenger` + `counterZone` pendant la phase de contre |
| asset key | `rt_fighter_boss` |
| renderer | `ObstacleRenderer.draw()` branche `isBossType && hasBossTexture`, avec `drawBossTelegraph()` + image Phaser |
| file path | `/home/kali/apps/snake/public/assets/runtime/universes/fighter/boss_final_challenger.png` |
| source | runtime asset PNG, pack valide `patch_943_final_24_validated_runtime_assets_and_cleanup`; source externe Fighter documentee `streets_of_fight_ansimuz` / `Streets of Fight` |
| taille fichier image | PNG RGBA 217x256 |
| asset lisible | oui, alpha non nul et personnage visible |
| OpenMoji implique | non pour le boss; OpenMoji Fighter actuel ne couvre que `sparZone` via `assets/openmoji/obstacles/fist.svg` |

Chaine niveau -> boss -> asset :

1. `src/config/levels.ts:16` definit `fighter_boss`, `universeId: 'fighter'`, `type: 'boss'`, `mechanic: 'finalChallenger'`, `bossHp: 3`.
2. `src/mechanics/MechanicFactory.ts:31` instancie `new FinalChallengerBoss()` pour `finalChallenger`.
3. `src/mechanics/bosses/FinalChallengerBoss.ts:19` place le boss en `row: 2`, ce qui explique sa presence en haut du plateau.
4. `src/mechanics/bosses/FinalChallengerBoss.ts:50-56` expose l'entite `finalChallenger` et les `counterZone`.
5. `src/scenes/GameScene.ts:113` precharge les runtime assets pour l'univers courant; en boss, le role `boss` est inclus.
6. `src/systems/RuntimeAssetResolver.ts:11-22` genere la cle `rt_fighter_boss` et charge le fichier runtime.
7. `src/assets/runtimeUniverseAssets.ts:27-30` mappe `fighter.boss` vers `assets/runtime/universes/fighter/boss_final_challenger.png`.
8. `src/scenes/GameScene.ts:241-248` donne priorite a `rt_fighter_boss` sur `db_fighter_boss`.
9. `src/render/ObstacleRenderer.ts:7-10` classe `finalChallenger` comme boss entity.
10. `src/render/ObstacleRenderer.ts:156-167` rend le boss par glow procedural + image texture boss.

## Diagnostic
- boss prevu : oui. L'entite vient directement de `FinalChallengerBoss`.
- mauvais mapping : non cote code runtime; `fighter_boss` -> `finalChallenger` -> `rt_fighter_boss` -> `boss_final_challenger.png` est coherent.
- fallback : non. Le PNG runtime existe et est charge; le fallback procedural ne s'appliquerait que si la texture etait absente.
- OpenMoji : non pour ce personnage. Le seul override OpenMoji Fighter en runtime actuel est `sparZone` -> poing.
- obstacle : non. Les obstacles dangereux du boss sont les `counterZone`; ils utilisent le role obstacle, pas le personnage.
- weakpoint : le boss lui-meme devient weakpoint pendant `attack_window`; il n'y a pas d'asset weakpoint separe.
- projectile : non.
- asset partage : oui au sens provenance externe; la source Fighter documentee est `streets_of_fight_ansimuz`, aussi presente dans l'ecosysteme Streets/Fighter.
- asset lisible : oui. Le fichier est un PNG 217x256 avec alpha non nul; le sprite affiche un combattant humain en posture de combat.

Conclusion : le rendu est techniquement coherent avec Fighter boss, mais probablement mauvais/risque UX si QA attend une iconographie neutre ou OpenMoji. Le sprite est tres figuratif, "arcade fighter", et peut etre percu comme un personnage importe d'un autre jeu/univers plutot que comme une icone systemique du boss.

## Alternatives possibles
| Option | Source OpenMoji / asset | Pourquoi |
|---|---|---|
| `1F93A` fencer | `/home/kali/apps/snake/reports/patch-1090b/preview-assets/1F93A.svg` ou `/home/kali/apps/snake/design_boards/openemoji/color/svg/1F93A.svg` | Audit 1090 le classe fort pour `fighter_boss`; duel final lisible, moins "sprite heredite". |
| `2694` crossed swords | `/home/kali/apps/snake/public/assets/openmoji/boss/crossed_swords.svg` | Deja copie dans les OpenMoji runtime locaux; symbole de combat neutre et non-personnage. |
| `1F94B` martial arts uniform | `/home/kali/apps/snake/reports/patch-1090b/preview-assets/1F94B.svg` ou `/home/kali/apps/snake/design_boards/openemoji/color/svg/1F94B.svg` | Signale arts martiaux/dojo sans faire apparaitre un personnage specifique. |
| `1F3C6` trophy | `/home/kali/apps/snake/reports/patch-1090b/preview-assets/1F3C6.svg` ou `/home/kali/apps/snake/design_boards/openemoji/color/svg/1F3C6.svg` | Met l'accent sur "Ultime Challenger" et la victoire de rounds. |
| `1FA96` military helmet | `/home/kali/apps/snake/reports/patch-1090b/preview-assets/1FA96.svg` ou `/home/kali/apps/snake/design_boards/openemoji/color/svg/1FA96.svg` | Option plus dure/combat final, mais moins dojo; a garder en second choix. |

## Recommandation
- Remplacer lors du patch de selection d'icones, plutot que corriger la mecanique.
- Cible recommandee : `1F93A` si l'objectif est un boss "duel", ou `2694` si l'objectif est une icone neutre, sans personnage.
- Ne pas traiter comme bug de fallback ou mauvais mapping runtime : la chaine actuelle fonctionne comme codee.

