# Rendering Sharpness / Canvas Scaling Fix

## Probleme

PATCH 1092 a montre que le flou global venait surtout d'une politique trop uniforme :

- `PickupRenderer` et `ObstacleRenderer` forçaient `FilterMode.LINEAR` sur tous les pickups, obstacles et boss.
- Les petits PNG runtime, notamment les `pickup_secondary.png` 32x32, etaient upscales avec interpolation.
- Les gros sprites runtime 1254x1254 etaient fortement downscales avec un rendu doux.
- Les backgrounds haute resolution ne montraient pas le meme probleme et ne doivent pas etre forces en pixel art.
- Les SVG/OpenMoji sont rasterises comme icones vector-like; les passer brutalement en `NEAREST` risque de creer du crenelage.

## Changements

| Fichier | Changement | Raison |
|---|---|---|
| `src/render/TextureFiltering.ts` | Ajout d'une fonction de politique de filtrage gameplay | Centraliser la decision `NEAREST` vs `LINEAR` sans toucher aux assets |
| `src/render/PickupRenderer.ts` | Remplacement du `FilterMode.LINEAR` systematique par `applyGameplayTextureFilter()` | Rendre les pickups runtime plus nets, surtout les petits PNG |
| `src/render/ObstacleRenderer.ts` | Remplacement du `FilterMode.LINEAR` systematique par `applyGameplayTextureFilter()` | Rendre obstacles et boss runtime moins mous |
| `index.html` | Ajout de `#app canvas { display:block; width:100%; height:100%; }` | Stabiliser la presentation du canvas sans forcer `image-rendering: pixelated` |

## Politique de filtrage

`NEAREST` est utilise pour :

- les textures gameplay runtime avec cle `rt_*` ;
- pickups PNG runtime ;
- secondary pickups PNG runtime ;
- obstacles PNG runtime ;
- boss PNG runtime charges via les chemins runtime.

`LINEAR` est conserve pour :

- les icones SVG/OpenMoji chargees avec des cles `openmoji-*` ;
- les textures inconnues par defaut ;
- les backgrounds haute resolution, qui ne passent pas par ce helper ;
- la WorldMap, qui garde son filtrage explicite.

Pourquoi ne pas tout passer en `pixelArt` ou `image-rendering: pixelated` ?

- Le jeu melange sprites runtime, OpenMoji rasterises et backgrounds haute resolution.
- Une regle globale rendrait les backgrounds et les images UI crénelés.
- Le patch cible donc uniquement les renderers qui dessinent les entites gameplay.

## Resultat attendu

- Sprites runtime plus nets.
- Petites icones runtime moins lissees.
- Boss/obstacles PNG moins mous au rendu.
- OpenMoji/SVG toujours lisibles sans pixellisation excessive.
- Backgrounds non degrades.

## Non-regression

- Gameplay inchange : aucune mecanique, niveau, score, boss ou difficulte modifies.
- Assets inchanges : aucun fichier sous `public/assets/` modifie.
- Mobile/desktop : `Phaser.Scale.RESIZE` et le cap DPR existant restent inchanges.
- Backgrounds : aucune regle globale `pixelated`, pas de changement des loaders backgrounds.

## Captures ciblees

Captures apres patch :

- `reports/patch-1094/screenshots/castle_gameplay_after.png`
- `reports/patch-1094/screenshots/sonic_gameplay_after.png`
- `reports/patch-1094/screenshots/sonic_pickup_crop_after.png`
- `reports/patch-1094/screenshots/kombat_gameplay_after.png`

## Limites

- Les assets source defectueux restent defectueux.
- Les `pickup_secondary.png` 32x32 sont plus nets mais toujours trop petits selon PATCH 1093.
- Le pickup Kombat reste fragile par contraste/palette; ce patch ne remplace pas l'asset.
- Shinobi boss noir reste hors scope : il faut un patch runtime/fallback dedie.
- Les gros PNG 1254x1254 peuvent devenir plus tranches, mais un derivative 128/256px resterait preferable si la DA le demande.
