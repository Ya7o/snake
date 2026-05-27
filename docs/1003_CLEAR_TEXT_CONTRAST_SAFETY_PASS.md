# PATCH 1003 — Clear Text Contrast Safety Pass

## Problème

PATCH 1002 a identifié que certains backgrounds Clear lumineux réduisaient la lisibilité des textes runtime :

- **Paperboy boss/clear** : "TOUS LES NIVEAUX TERMINÉS!" affiché en couleur accent jaune (`#f1c40f`) sur fond ciel bleu/blanc — contraste insuffisant
- **Tous univers non-Castle** : nom du prochain niveau en `#d8d8e8` (gris clair) sans stroke — peu lisible sur fonds lumineux (Sonic, Paperboy, OutRun)
- **Tous univers non-Castle** : nom d'univers en `universe.palette.primary` sans stroke — variable selon les univers
- **Titres "STAGE CLEAR" / "BOSS CLEAR"** : accentStr sans stroke — fragile sur fonds saturés

## Changements

Fichier modifié : `src/scenes/ClearScene.ts`

### 1. Titre principal (STAGE CLEAR / BOSS CLEAR)
Ajout de `stroke: '#000000', strokeThickness: isCastle ? 1 : 3` sur le clearTxt principal.
- Castle : stroke 1px (fond sombre, discret)
- Non-Castle : stroke 3px (garantit lisibilité sur tous les fonds)

### 2. Nom d'univers (non-Castle)
Ajout de `stroke: '#000000', strokeThickness: 2`.
- Avant : couleur `universe.palette.primary` seule (ex: vert #27ae60 sur fond Paperboy)
- Après : même couleur + contour noir 2px

### 3. Nom du prochain niveau
- Couleur changée de `#d8d8e8` (gris clair) à `#ffffff` (blanc)
- Ajout de `stroke: '#000000', strokeThickness: 3`
- Résultat : blanc + stroke noir → lisible sur n'importe quel fond

### 4. "TOUS LES NIVEAUX TERMINÉS!" (dernier niveau — paperboy_boss)
Refonte complète du bloc :
- Ajout d'un **backing rectangle semi-transparent** (`0x000000, 0.48`, `borderRadius: 6`) calculé dynamiquement selon la taille du texte
- Couleur changée de `accentStr` (jaune variable) à `#ffffff`
- Ajout de `stroke: '#000000', strokeThickness: 3`
- Avant : jaune sur ciel bleu = illisible
- Après : blanc sur backing sombre + stroke = parfaitement lisible

## Règles conservées

- image = ambiance (aucun changement d'asset)
- runtime = UI (tous les textes restent générés par le code)
- aucun texte baked
- aucun changement d'asset
- aucun changement gameplay
- aucun changement mécaniques
- background toujours visible (overlay = 0.14 inchangé, backing uniquement sur zone texte)

## Critères d'acceptation

- [x] `npm run build` OK — 60 modules, 0 erreur TypeScript
- [x] Paperboy boss/clear : "TOUS LES NIVEAUX TERMINÉS!" lisible sur fond lumineux
- [x] Paperboy normal/clear : "CHAOS DU QUARTIER" lisible sur fond lumineux
- [x] Castle boss/clear : non régressé — stroke 1px sur fond sombre, boutons inchangés
- [x] OutRun boss/clear : titres et textes lisibles sur fond orange/sunset
- [x] Sonic boss/clear : titres et textes lisibles sur fond vert vif
- [x] Pas de clipping — backing dimensionné dynamiquement
- [x] Pas de chevauchement boutons — backing positionné à L.contextY, bouton SUIVANT à L.primaryButtonY (gap ~16% screen)
- [x] Background toujours visible derrière l'UI

## Fichiers modifiés

- `src/scenes/ClearScene.ts`
