# PATCH 1001 — OutRun Gameplay Layout Compliance

## Problème

OutRun gameplay était techniquement branché (background chargé, aucun fond noir inattendu) mais mal équilibré verticalement :

- **Grand vide noir en bas** : grille positionnée en haut de l'écran (Y_BIAS = 0.08), 49% de l'écran était vide sous la grille
- **Background OutRun peu visible** : le coucher de soleil et les palmiers étaient masqués derrière la grille ; seules de fines marges latérales étaient visibles
- **Cellules trop petites** : FRAME_GRID_WIDTH = 0.72 contraignait le cellSize à ~17px, rendant la grille peu confortable sur mobile

## Changements

Fichier modifié : `src/scenes/GameScene.ts`

| Constante | Avant | Après |
|---|---|---|
| `FRAME_GRID_WIDTH['outrun']` | `0.72` | `0.78` |
| `FRAME_GRID_Y_BIAS['outrun']` | `0.08` | `0.42` |

**FRAME_GRID_Y_BIAS** contrôle quelle fraction de l'espace vertical restant est allouée au-dessus de la grille (`topGap = remainingH * verticalBias`). Passer de 0.08 à 0.42 centre la grille et expose le coucher de soleil / les palmiers dans la zone supérieure de l'écran.

**FRAME_GRID_WIDTH** passe de 0.72 à 0.78, augmentant le cellSize de ~17px à ~19px (mobile 390px) pour une grille plus confortable, tout en conservant des marges latérales visibles (~22% des côtés exposent le background).

## Résultat visuel

- Le coucher de soleil et les palmiers OutRun sont clairement visibles au-dessus de la grille
- La zone sombre inférieure correspond à la route — ambiance cohérente avec l'univers OutRun
- La grille reste centrée dans la portion active de l'écran
- Le HUD reste lisible en haut (OUTRUN | BALISES | 0/10 ou BOSS HP)

## Règles conservées

- image = ambiance (background = `outrun_gameplay_bg.png`, aucun changement)
- runtime = UI (HUD texte, aucun élément baked)
- aucun changement gameplay
- aucun changement mécaniques
- aucun changement Castle
- aucun changement autres univers

## Fichiers modifiés

- `src/scenes/GameScene.ts` — constantes `FRAME_GRID_WIDTH` et `FRAME_GRID_Y_BIAS` pour `outrun` uniquement

## Critères d'acceptation

- [x] `npm run build` OK — 60 modules, 0 erreur TypeScript
- [x] OutRun normal gameplay : coucher de soleil visible, grille centrée, HUD lisible
- [x] OutRun boss gameplay : même layout, HUD boss lisible (PV / BOSS HP 3/3)
- [x] Pas de grand vide noir dominant (void bas réduit de 49% à ~26% de l'écran)
- [x] Grille toujours lisible — cellSize ~19px mobile
- [x] Snake / pickup / obstacles lisibles
- [x] Castle normal gameplay non régressé — aucun changement
