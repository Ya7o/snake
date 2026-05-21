# Crop Quality Rules

## Un crop est `clean` si

- L'objet ou la section est **complet** (aucun coin coupé).
- **Aucun titre de section** n'est inclus (ni celui de la zone ni d'une zone adjacente).
- **Aucune section voisine** n'est présente dans le crop.
- L'objet n'est pas coupé par les bords du rect.
- Le fond autour de l'objet est raisonnable (marge ≤ 20 px sans contenu parasite).
- L'usage prévu est clair et unique.

Vérifier en ouvrant `public/assets/generated/_debug/{univers}_crop_debug.png`.

## Statuts

### clean
Asset utilisable en jeu. Seul statut autorisé dans `clean/`.

### containsLabel
Le crop inclut un texte de titre ou d'étiquette non souhaité (ex. : "OBSTACLES", "BORDURES").  
**Action** : relever `y` ou ajuster `height` pour passer sous le label.

### partial
L'objet ou la section est coupé par les bords du rect.  
**Action** : agrandir le rect ou le déplacer.

### overlapsOtherSection
Le rect capture la fin ou le début d'une section adjacente.  
**Action** : ajuster `y` et/ou `height` pour exclure la zone voisine.

### tooWide
Le rect est beaucoup plus large que l'objet cible, incluant du fond inutile.  
**Action** : réduire `width` et/ou ajuster `x`.

### tooTall
Le rect est beaucoup plus haut que l'objet cible.  
**Action** : réduire `height`.

### ambiguous
La zone est probablement correcte mais non fiable sans revue humaine (ex. : palette sombre).  
**Action** : revue visuelle obligatoire avant promotion.

### missing
Zone attendue mais non définie (`rect: null`).  
**Action** : définir les coordonnées dans `designBoardManifest.ts` et `extractDeveloperAssets.mjs`.

### invalid
Zone définie hors des limites de l'image source.  
**Action** : corriger les coordonnées.

### needsManualCrop
Codex ne peut pas déterminer un crop sûr sans voir l'image.  
**Action** : ouvrir l'image debug, vérifier le rectangle, corriger les coordonnées, puis changer le statut.

## Règle stricte

`DesignBoardManager.getDeveloperExtractedPath()` retourne `null` pour tout statut ≠ `clean`.  
Un crop douteux bloqué vaut mieux qu'un crop mal intégré en jeu.

## Seuil palette JSON

`palette.json` n'est généré que si :
- La zone `palette` est `clean`, **ET**
- Au moins **8 couleurs distinctes** sont extraites de manière fiable.

Sinon : `palette.png` uniquement, statut `ambiguous`.
