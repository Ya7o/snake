# Notes — layouts variables developer assets

Les nouvelles planches montrent que le pipeline 925 doit être plus prudent.

## Ce qui est stable
- Deux grandes colonnes.
- Preview gameplay à gauche.
- HUD en haut à droite.
- Props / pickups / obstacles / boss à droite.
- Bordures et badges en bas-gauche.
- Palette en bas ou bas-droite.

## Ce qui varie
- Hauteur du logo.
- Taille du HUD.
- Hauteur des sections.
- Nombre de badges.
- Position exacte de la palette.
- Contraste des séparateurs.

## Décision
Le pipeline doit fonctionner avec un manifest par univers.
Pas de crop global unique.
Pas de détection magique.
Les zones ambiguës doivent être signalées.
