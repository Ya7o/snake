# Full Visual Rendering Audit

## Objectif

Audit global du rendu visuel avant phase de corrections. Ce patch documente les problemes de nettete, scaling, lisibilite, contraste, coherence asset/runtime et causes techniques probables. Aucune correction code, gameplay, HUD ou asset n'est incluse.

## Resume executif

L'etat global est jouable sur les ecrans systeme et sur plusieurs univers, mais la qualite runtime est inegale. Les backgrounds haute resolution sont globalement bien exploites a DPR 2, tandis que les sprites runtime et OpenMoji souffrent surtout de contraste, de filtrage lineaire et de ratios de scale extremes.

Problemes majeurs :
- P0 : Kombat normal rend le pickup quasi invisible sur fond rouge.
- P0 : Kombat boss est presque noir, avec entites et dangers indiscernables.
- P0 : Shinobi boss a produit une capture entierement noire en headless, signe d'un rendu absent ou d'un chargement/timing fragile.
- P1 : les `pickup_secondary.png` 32x32 sont upscales et flous dans tous les univers.
- P1 : `antialias:true` + `FilterMode.LINEAR` applique aux textures runtime adoucit les assets pixel art.

Causes probables :
- Assets source trop petits pour leur taille d'affichage (`pickup_secondary.png` 32x32).
- Assets source tres grands downscales fortement avec filtre LINEAR (boss 1254px vers environ 50px CSS).
- Fond et entites partagent des palettes trop proches dans Kombat, Shinobi, Fighter boss et Streets boss.
- Effets proceduraux et halos trop faibles pour separer les pickups sur fonds sombres.
- Canvas en `Phaser.Scale.RESIZE` correct, mais sans politique differenciee `NEAREST` vs `LINEAR`.

Priorites recommandees :
- P0 : corriger lisibilite Kombat normal, Kombat boss, Shinobi boss.
- P1 : definir une regle de filtrage par famille d'assets, remplacer les pickups secondaires basse resolution, renforcer contrastes pickup/boss.
- P2 : polish HUD Paperboy, worldmap legerement doux, snake debut de partie, coherence style AI-art/pixel art.

## Ecrans audites

| Ecran | Statut visuel | Problemes | Priorite | Recommandation |
|---|---|---|---|---|
| TitleScene | Correct | Aucun probleme bloquant. Fond et titre lisibles. | Aucun | Conserver. |
| WorldMap | Correct | Image legerement douce, style plus illustratif que pixel art. | P2 | Ne pas toucher avant les P0/P1. |
| LevelIntro/System screen | Correct | Castle capture propre, texte lisible, alignement stable. Les autres univers non captures individuellement. | Aucun | Refaire un spot-check multi-univers dans un patch layout si necessaire. |
| Gameplay normal | Variable | OutRun/Paperboy solides, Castle/Sonic/Streets/Shinobi faibles par contraste ou blur, Kombat casse. | P0-P1 | Voir tableau univers. |
| Gameplay boss | Variable | OutRun/Paperboy bons, Castle/Sonic/Streets/Fighter faibles, Kombat/Shinobi critiques. | P0-P1 | Voir tableau boss/problemes. |
| ClearScene | Correct | Texte et fond lisibles. Pas d'overflow capture. | Aucun | Conserver. |
| Boss Clear | Couvert via ClearScene et boss flows | Pas de capture dediee distincte identifiee dans ce patch. | P2 | Ajouter capture dediee si un prochain patch modifie les clear states. |
| GameOver | Correct | Fond thematique et texte lisibles. | Aucun | Conserver. |

## Univers gameplay audites

| Univers | Background | Board/frame | HUD | Icones | Effets | Statut | Priorite |
|---|---|---|---|---|---|---|---|
| Castle | Bon fond sombre | Bordure lisible | Lisible | OpenMoji globalement nets, obstacles ghost trop faibles | BlinkWall trop transparent | Jouable mais fragile | P1 |
| Sonic | Lumineux, lisible | Correct | Lisible | Ring OK, secondary pickup flou | Bumpers adoucis | Jouable | P1 |
| Streets | Fond dense et chaud | Correct | Lisible | Pickup/obstacles petits sur palette proche | Crowd dense en boss | Confus en boss | P1 |
| Fighter | Fond coherent | Correct | Lisible | Fists visibles, boss downscale doux | Boss/counter zones faibles | Normal bon, boss faible | P1 |
| OutRun | Excellent retrowave | Neon lisible | Lisible | Trophies/voitures tres visibles | Turbo zones lisibles | Meilleur rendu | Aucun |
| Shinobi | Tres sombre | Grille discrete | Lisible | Shuriken faible contraste | Boss capture noire | Critique en boss | P0 |
| Kombat | Rouge uniforme | Board peu distinct | Lisible | Pickup finish invisible | Boss/dangers trop sombres | Critique | P0 |
| Paperboy | Lumineux | Vert sombre lisible | Lisible mais label court | Newspaper/mailbox/dog visibles | Boss correct | Tres bon | P2 |

## Problemes de rendu identifies

| ID | Probleme | Exemple | Cause probable | Impact | Priorite |
|---|---|---|---|---|---|
| VQA-001 | Pickup trop peu contraste | `kombat_gameplay.png`, `crops/kombat_pickup_crop.png` | PNG rouge/orange sur board rouge + halo trop faible | Objectif invisible | P0 |
| VQA-002 | Board boss trop noir | `kombat_boss.png` | Background/grille et entites dans les memes tons noirs | Boss et hazards indiscernables | P0 |
| VQA-003 | Rendu boss absent/noir | `shinobi_boss.png` | Chargement background ou timing capture fragile, scene trop sombre sans fallback | Ecran injouable si reproduit | P0 |
| VQA-004 | Blur par asset trop petit | `crops/sonic_pickup_crop.png` | `pickup_secondary.png` 32x32 upscale avec LINEAR | Icones floues | P1 |
| VQA-005 | Icone trop petite/faible contraste | `shinobi_gameplay.png` | Shuriken gris sur fond sombre | Pickup difficile a lire | P1 |
| VQA-006 | Effet/alpha trop faible | `castle_gameplay.png` | BlinkWall ghost alpha 0.24 sur fond maroon | Obstacles quasi invisibles | P1 |
| VQA-007 | Mauvais scaling boss | `fighter_boss.png` | Boss 1254px downscale vers environ 50px + palette proche | Boss peu identifiable | P1 |
| VQA-008 | Procedural/crowd trop charge | `streets_boss.png` | Trop d'entites de meme taille/style autour du boss | Lecture confuse | P1 |
| VQA-009 | Pixel art lisse | `sonic_boss.png` | Boss 1254px downscale x24 avec LINEAR | Sprite mou | P1 |
| VQA-010 | Mauvais renderer global | Plusieurs captures | `antialias:true` et `setFilter(LINEAR)` sur pickups/obstacles | Perte de nettete generale | P1 |
| VQA-011 | Texte/label compact | `paperboy_hud_crop.png` | Capsule HUD trop courte pour label long | Polish, pas bloquant | P2 |
| VQA-012 | Background legerement masque/doux | `worldmap.png` | AI-art et crop/scale carte | Qualite percue moyenne | P2 |
| VQA-013 | Asset incoherent | Streets/Fighter/Kombat | Fonds AI-art realistes vs sprites pixel art | Direction artistique mixte | P2 |
| VQA-014 | Effets trop discrets | Pickups sombres | Halo alpha 0.10-0.30 insuffisant | Lisibilite faible | P1 |
| VQA-015 | Icones trop grandes/downscalees | Boss Sonic/Fighter/Kombat | Sources 1254px pour affichage tres petit | Rendu doux, details perdus | P1 |

## Causes techniques possibles

### Phaser config

`src/main.ts` utilise `Phaser.Scale.RESIZE`, `antialias:true`, `roundPixels:true` et `powerPreference:'high-performance'`. `roundPixels` aide les positions entieres, mais `antialias:true` favorise le lissage WebGL. Le rendu texte recoit `resolution: Math.min(devicePixelRatio, 2)`, ce qui stabilise la lisibilite texte a DPR 2.

### CSS/canvas

`index.html` ne declare pas de regle `image-rendering` pour le canvas. Le canvas Phaser est donc scale par le navigateur avec le comportement smooth par defaut. Aucun bug de stretch global n'a ete prouve par les captures : les backgrounds 941x1672 ou 1672x941 correspondent plutot bien a un viewport mobile DPR 2.

### DPR/mobile

La resolution de rendu est plafonnee a DPR 2. C'est raisonnable pour performance mobile, mais les assets SVG charges a `64 * min(DPR, 2)` peuvent etre legerement upscales en DPR 1 et legerement adoucis en DPR 2 si affiches au-dessus de 128px physiques.

### Image smoothing

`PickupRenderer.fitImageInCell()` et `ObstacleRenderer.fitImageInCell()` appliquent `Phaser.Textures.FilterMode.LINEAR` a toutes les textures runtime. Cette politique est correcte pour backgrounds et illustrations continues, mais mauvaise pour pixel art, petites icones, boss downscales, sprites OpenMoji a fort contraste et pickups secondaires.

### Asset resolution

Les backgrounds UI/runtime sont gros et globalement nets. Les problemes principaux viennent des extremes : `pickup_secondary.png` 32x32 upscale vers environ 57px CSS, et boss/obstacles 1254x1254 downscales vers environ 50px CSS. Ces deux cas produisent un rendu mou avec LINEAR.

### SVG/PNG pipeline

Les OpenMoji SVG sont charges via Phaser en rasterisation 64-128px selon DPR. Le pipeline est acceptable mais doit rester proche de la taille d'affichage. Les PNG runtime ont des tailles heterogenes : 32px, 256px, 450px, 1254px. Sans regle de tailles cibles, le renderer compense par scaling et cree du blur.

### Scaling runtime

La grille mobile utilise environ 23px CSS par cellule sur 390px de large. Pickups et obstacles sont volontairement plus grands que la cellule (`2.2x` a `3.0x`). Cette decision ameliore la presence visuelle, mais amplifie les risques si l'asset source est petit, peu contraste ou tres detaille.

## Audit des familles d'assets

| Famille | Chemin | Format | Usage | Risque qualite | Risque scaling | Priorite |
|---|---|---|---|---|---|---|
| Backgrounds UI | `public/assets/ui/**` | PNG | Title/system/clear/gameover/gameplay/boss | Bon sauf scenes tres sombres | Faible a DPR 2 | P2 |
| World map | `public/assets/map/world_map.png`, `public/assets/ui/worldmap/*.png` | PNG | WorldMap | Legere douceur | Faible | P2 |
| Runtime PNG pickups | `public/assets/runtime/universes/*/pickup_*.png` | PNG | Collectibles | Variable, contrastes faibles | Eleve pour 32px secondary | P0-P1 |
| Runtime PNG obstacles | `public/assets/runtime/universes/*/obstacle_*.png` | PNG | Obstacles/hazards | Soft si LINEAR | Moyen-eleve | P1 |
| Runtime PNG boss | `public/assets/runtime/universes/*/boss*.png` | PNG | Boss entities/attacks | Details perdus au downscale | Eleve pour 1254px | P1 |
| OpenMoji SVG runtime | `public/assets/runtime/universes/*/*.svg` | SVG rasterise | Castle/Fighter/OutRun/Paperboy icons | Bon si contraste suffisant | Moyen selon DPR/display | P1-P2 |
| Effets proceduraux | `src/render/*`, graphics Phaser | Shapes/halos/glow/zones | Pickups, zones danger, HUD, frames | Peut paraitre cheap ou trop discret | N/A | P1 |
| Anciens/fallback | Procedural shapes si texture absente | Graphics | Fallback pickups/entities | Lisible mais moins moderne | N/A | P2 |

## Audit OpenMoji et icones

Le rapport `reports/used-icons-by-universe.html` et les assets OpenMoji copies indiquent surtout Castle, Fighter, OutRun et Paperboy. La selection 1090 n'est pas refaite ici. Constats qualite :
- Castle : icones source nettes, mais obstacles rendus trop transparents en ghost/warning.
- Fighter : fist OpenMoji lisible en normal, mais boss PNG et zones boss manquent de contraste.
- OutRun : trophy SVG tres lisible, bon accord avec fond neon.
- Paperboy : OpenMoji mailbox/newspaper lisibles, meilleure coherence globale.
- Mauvais choix d'icone vs mauvais scaling : les P0 ne viennent pas d'une mauvaise selection OpenMoji, mais de contraste et renderer/scaling.

## Audit effets proceduraux

| Effet | Usage | Lisibilite | Probleme | Priorite |
|---|---|---|---|---|
| Halo pickups | Tous univers | Variable | Trop discret sur Kombat/Shinobi | P0-P1 |
| Glow boss telegraph | Boss | Variable | Ne separe pas assez Fighter/Streets/Kombat | P1 |
| Zones danger/lava/fatal | Hazards | Faible sur fonds sombres | Alpha/couleur trop proches du board | P1 |
| Turbo zones | OutRun | Bonne | Aucun probleme majeur | Aucun |
| Boss attacks | Boss PNG/procedural | Variable | Trop sombre ou trop petit selon univers | P1 |
| HUD capsules | Gameplay | Bonne | Label Paperboy abrege | P2 |
| Frames/panels | Board/HUD | Bonne | Castle boss surcharge visuelle | P2 |
| Score popups | Non isoles en capture | Non conclu | Animation difficile a figer | P2 |

## Recommandations de correction

### P0 - A corriger rapidement

- Kombat normal : ajouter halo/outline blanc-jaune au pickup finish ou remplacer par asset plus contraste.
- Kombat boss : relever la luminosite board/background et separer boss/hazards par contours visibles.
- Shinobi boss : verifier preload/timing/fallback du background et confirmer sur vrai runtime non headless.

### P1 - Stabilisation visuelle

- Remplacer tous les `pickup_secondary.png` 32x32 par 256x256 minimum.
- Definir une politique de filtre : `NEAREST` pour pixel art/icons runtime, `LINEAR` pour backgrounds/illustrations.
- Pre-resizer les boss 1254px vers 128/256px cibles ou ajouter mipmap/filtrage adapte.
- Renforcer halos pickup sur fonds sombres.
- Augmenter contraste/taille des boss Fighter et Streets.
- Augmenter alpha minimum des obstacles Castle ghost/warning.

### P2 - Polish

- Ajuster label HUD Paperboy.
- Ajouter glow leger au snake en debut de partie sur fonds sombres.
- Reduire surcharge Castle boss.
- Documenter ou harmoniser progressivement le style fonds AI-art vs sprites pixel.
- Garder WorldMap en P2 tant que la navigation reste lisible.

### Ne pas faire maintenant

- Refonte DA complete.
- Compression WebP massive.
- Changement gameplay.
- Nouveaux assets non valides.
- Refactor moteur global.
- Corrections HUD/gameplay dans ce patch 1092.

## Plan de patchs recommande

- PATCH 1093 - Rendering Sharpness / Canvas Scaling Fix : politique `NEAREST`/`LINEAR`, verification canvas/DPR, pickups secondary.
- PATCH 1094 - Runtime Icon Rendering Quality Fix : halos pickup, contraste Kombat/Shinobi, tailles cible PNG.
- PATCH 1095 - Screen Layout Visual Polish : HUD Paperboy, LevelIntro multi-univers, WorldMap polish.
- PATCH 1096 - Procedural Effects Readability Pass : boss glows, danger zones, Castle blinkWall, Streets crowd separation.

## Preuves et captures

Captures plein ecran disponibles dans `reports/patch-1092/screenshots/` :
- `title_screen.png`
- `worldmap.png`
- `level_intro_castle.png`
- `castle_gameplay.png`, `sonic_gameplay.png`, `streets_gameplay.png`, `fighter_gameplay.png`
- `outrun_gameplay.png`, `shinobi_gameplay.png`, `kombat_gameplay.png`, `paperboy_gameplay.png`
- `castle_boss.png`, `sonic_boss.png`, `streets_boss.png`, `fighter_boss.png`
- `outrun_boss.png`, `shinobi_boss.png`, `kombat_boss.png`, `paperboy_boss.png`
- `clear_screen.png`
- `gameover_screen.png`

Crops disponibles dans `reports/patch-1092/screenshots/crops/`, incluant HUD, grid, pickup, boss grid et snake details par univers. Le nombre de captures depasse la recommandation initiale car des crops cibles ont ete ajoutes pour prouver blur/contraste sans modifier le runtime.
