# Crop quality rules

## Un crop est `clean` si
- l’objet ou la section est complète ;
- aucun titre de section précédente n’est inclus ;
- aucune section voisine n’est incluse ;
- l’objet n’est pas coupé ;
- le fond autour est raisonnable ;
- l’usage prévu est clair.

## Statuts

### clean
Asset utilisable.

### containsLabel
Le crop contient un label/titre non souhaité.

### partial
L’objet ou la section est coupé.

### overlapsOtherSection
Le crop contient plusieurs sections.

### tooWide / tooTall
Le crop contient trop de fond ou trop d’éléments inutiles.

### ambiguous
La zone est probablement correcte, mais non fiable sans revue humaine.

### missing
Zone attendue absente.

### invalid
Zone invalide ou hors image.

### needsManualCrop
Codex ne peut pas déterminer un crop sûr.

## Règle stricte
`DesignBoardManager` ne doit exposer par défaut que les assets `clean`.
