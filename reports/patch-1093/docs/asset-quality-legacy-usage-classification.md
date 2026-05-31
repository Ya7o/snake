# Asset Quality / Legacy Usage Classification

## Resume

PATCH 1093 distingue les problemes constates en 1092 selon leur vraie cause probable :

- Code/rendu : filtrage LINEAR global dans `PickupRenderer` et `ObstacleRenderer`, `antialias:true`, halos trop faibles, alphas proceduraux trop bas, boss/crowd pas assez separes.
- Assets a regenerer/remplacer : surtout les `pickup_secondary.png` 32x32 si la notion de pickup alternatif reste voulue, et le pickup primaire Kombat si un outline code ne suffit pas.
- Legacy probable : la plupart des `pickup_secondary.png` hors Paperboy sont encore references et precharges, mais rarement affiches par les mecaniques actuelles.
- Risque suppression : ne pas supprimer les secondary maintenant. Paperboy peut les afficher; les autres sont relies au contrat runtime et doivent etre retires seulement avec une cleanup de registre/preload.

## Tableau principal

| Asset / element | Utilise ou | Source | Probleme | Cause probable | Action recommandee | Priorite |
|---|---|---|---|---|---|---|
| Kombat finish token | `kombat_normal`, `PickupRenderer`, `RUNTIME_UNIVERSE_ASSETS.pickup` | PNG runtime | Presque invisible | Palette rouge/orange trop proche du board rouge, halo trop discret | Regenerer/remplacer avec contraste fort; code peut ajouter outline/halo | P0 |
| Kombat boss board | `kombat_boss`, background + boss entities | PNG background + renderer | Board quasi noir | Fonds, grille, boss et dangers dans des valeurs trop sombres | Corriger luminosite/contours en code; verifier assets boss si necessaire | P0 |
| Shinobi boss | `shinobi_boss` | PNG background + runtime | Capture noire | Possible preload/timing/fallback ou scene trop sombre | Investiguer code/runtime avant remplacement asset | P0 |
| Secondary pickups | `public/assets/runtime/universes/*/pickup_secondary.png` | PNG runtime | 32x32 flou a l'upscale | Asset source trop petit + LINEAR | Garder temporairement; regenerer en 256x256 si conserves | P1/P2 |
| Shinobi shuriken | `shinobi_normal` | PNG runtime 256x256 | Faible contraste | Silhouette grise/cyan sur fond sombre | Renforcer halo/outline en code; remplacer seulement si besoin | P1 |
| Castle ghost obstacles | Castle `blinkWall` / warning states | SVG OpenMoji + alpha procedural | Quasi invisibles | Alpha trop faible, pas la source SVG | Code: augmenter alpha/outline/telegraph | P1 |
| Fighter boss | `fighter_boss` | PNG runtime 1254x1254 | Trop doux et peu distinct | Downscale extreme + palette proche du fond | Code: scale/outline/filter; option pre-resize 256px | P1 |
| Streets boss/crowd | `streets_boss` | PNG runtime + procedural | Lecture confuse | Crowd dense, boss de taille/style proche | Code: separation visuelle boss/crowd | P1 |
| Sonic boss | `sonic_boss` | PNG runtime 1254x1254 | Sprite mou | Downscale extreme avec LINEAR | Code: politique filtre ou derivative pre-size | P1 |
| Huge generated PNG family | Plusieurs pickups/obstacles/boss 1254x1254 | PNG runtime | Details perdus au downscale | Pipeline asset trop grand pour taille d'affichage | Produire derivatives 128/256px ou corriger renderer | P1 |
| Paperboy HUD label | HUD runtime | Procedural/text | Label compact | Layout/capsule courte | Code layout polish | P2 |
| World map | `WorldMapScene` | PNG background | Legere douceur | Asset/crop perceptuellement doux | Remplacement utilisateur optionnel plus tard | P2 |
| AI-art vs pixel sprites | Backgrounds + runtime sprites | Provenance mixte | Incoherence style | Pipelines differents | Harmonisation DA ulterieure | P2 |

## Assets a regenerer / remplacer par l'utilisateur

Regeneration recommandee uniquement quand la source est mauvaise, trop basse resolution, ou visuellement inadaptee :

- `public/assets/runtime/universes/paperboy/pickup_secondary.png` : 32x32, encore actif en Paperboy quand plusieurs pickups sont visibles. Remplacer par un asset Paperboy 256x256 minimum.
- `public/assets/runtime/universes/sonic/pickup_secondary.png`
- `public/assets/runtime/universes/streets/pickup_secondary.png`
- `public/assets/runtime/universes/fighter/pickup_secondary.png`
- `public/assets/runtime/universes/outrun/pickup_secondary.png`
- `public/assets/runtime/universes/shinobi/pickup_secondary.png`
- `public/assets/runtime/universes/kombat/pickup_secondary.png`

Ces six derniers sont plutot legacy-suspects que prioritaires. Les regenerer seulement si le design garde officiellement un pickup alternatif par univers.

- `public/assets/runtime/universes/kombat/pickup_finish_token.png` : pas basse resolution, mais palette source inadaptee au board rouge. Un remplacement plus contraste est justifie si un halo/outline code ne suffit pas.
- Optionnel : derivatives 128/256px pour les familles 1254x1254 tres downscalees (`boss_loop_serpent.png`, `fighter/boss_*.png`, `streets/boss_*.png`, gros pickups/obstacles). Ce n'est pas une urgence de source basse resolution, plutot une stabilisation de pipeline.
- `public/assets/map/world_map.png` et `public/assets/ui/worldmap/world_map_minimap_16_9.png` : remplacement optionnel seulement pour polish; pas un blocage.

## Assets legacy / suspects

| Asset | Dimensions | Taille | Usage reel | Legacy probable | Risque suppression | Recommandation |
|---|---:|---:|---|---|---|---|
| `sonic/pickup_secondary.png` | 32x32 | 195 B | Reference/preload; Sonic expose un seul pickup actif | Incertain | Moyen si registre inchange | Garder temporairement |
| `streets/pickup_secondary.png` | 32x32 | 217 B | Reference/preload; normal generique a un pickup | Oui probable | Moyen si registre inchange | Garder temporairement |
| `fighter/pickup_secondary.png` | 32x32 | 196 B | Reference/preload; normal generique a un pickup | Oui probable | Moyen si registre inchange | Garder temporairement |
| `outrun/pickup_secondary.png` | 32x32 | 199 B | Reference/preload; primary override trophy, un checkpoint | Oui probable | Moyen si registre inchange | Candidat cleanup ulterieure |
| `shinobi/pickup_secondary.png` | 32x32 | 141 B | Reference/preload; decoys ne sont pas des secondary pickups | Oui probable | Moyen si registre inchange | Garder temporairement |
| `kombat/pickup_secondary.png` | 32x32 | 218 B | Reference/preload; P0 concerne le primary token | Oui probable | Moyen si registre inchange | Garder temporairement |
| `paperboy/pickup_secondary.png` | 32x32 | 216 B | Peut etre affiche comme second pickup actif | Non | Eleve | Remplacer/regenerer, ne pas supprimer |

Autres suspects notes :

- `public/assets/runtime/universes/*/boss_attack.png` pour Fighter/Kombat/OutRun/Streets : pas legacy, charges explicitement en boss et choisis selon l'etat du boss.
- `public/assets/runtime/universes/paperboy/mailbox.png` : pas legacy, charge pour `deliveryTarget` / `bossTarget`.
- Castle SVG non utilises directement par nom dans `GameScene` restent couverts par le registre `CASTLE_OPENMOJI_ICON_ASSETS`; ne pas supprimer sur simple recherche texte par fichier.

## Corrections code recommandees

- Definir une politique claire de filtrage : `NEAREST` pour sprites pixel-art/icons runtime, `LINEAR` pour backgrounds/illustrations continues.
- Ne pas appliquer aveuglement `FilterMode.LINEAR` dans `PickupRenderer.fitImageInCell()` et `ObstacleRenderer.fitImageInCell()`.
- Ajouter un contour ou halo plus fort aux pickups sur fonds sombres/rouges, notamment Kombat et Shinobi.
- Rehausser l'alpha minimum et les contours pour Castle `blinkWall` ghost/warning.
- Separer visuellement les boss et hazards en boss mode : scale, outline, glow, valeur minimale de luminosite.
- Traiter Shinobi boss comme bug runtime potentiel : verifier preload, background key, timing de scene, fallback, et capture non-headless.
- Ajuster Paperboy HUD par layout/copy, pas par asset.

## Decision pour les assets secondary

A quoi servent-ils ?

- Ce sont des textures alternatives de pickup. Elles sont enregistrees sous `pickupSecondary`, prechargees par `RuntimeAssetResolver`, assignees dans `GameScene`, puis choisies par `PickupRenderer` pour les pickups actifs d'index impair (`i % 2 === 1`).

Sont-ils encore utilises ?

- Oui au niveau code/contrat runtime.
- Visuellement, Paperboy est le cas actif le plus credible car `getActivePickups()` peut combiner le pickup papier et plusieurs cibles de livraison.
- Pour Sonic, Streets, Fighter, OutRun, Shinobi et Kombat, les mecaniques actuelles exposent generalement un seul pickup actif; les secondary sont donc wired mais legacy-suspects.

Peut-on les supprimer ?

- Non en l'etat de PATCH 1093. Les supprimer sans changer le registre/preload laisserait des references runtime. Paperboy risquerait aussi une regression visuelle reelle.

Faut-il les remplacer ?

- Paperboy : oui si l'alternance visuelle reste voulue.
- Autres univers : seulement apres decision design. Si le pickup secondaire n'a plus de role, il vaut mieux supprimer proprement le champ `pickupSecondary` dans un patch de cleanup plutot que regenerer des fichiers inutiles.

Faut-il les garder temporairement ?

- Oui. Garder tous les secondary jusqu'a un patch dedie qui decide entre regeneration 256x256 et retrait du contrat runtime.

## Sources auditees

- `reports/patch-1092/review.md`
- `reports/patch-1092/docs/full-visual-rendering-audit.md`
- `reports/patch-1092/logs/rendering-config-audit.txt`
- `reports/patch-1092/logs/asset-quality-inventory.csv`
- `reports/patch-1092/logs/visual-issues.csv`
- `src/assets/runtimeUniverseAssets.ts`
- `src/systems/RuntimeAssetResolver.ts`
- `src/scenes/GameScene.ts`
- `src/render/PickupRenderer.ts`
- `src/render/ObstacleRenderer.ts`
- `src/mechanics/*`
