# Notes d’analyse

Les exemples fournis montrent que le pipeline actuel extrait des bandes trop grossières.

## Exemples de défauts
- `badges.png` contient le titre `BORDURES`.
- `borders.png` mélange bordures et titres.
- `boss.png` contient la fin d’une autre section.
- `obstacles.png` inclut le label `OBSTACLES`.
- `palette.json` contient seulement 5 couleurs, trop pauvre.
- `gameplayPreview.png` n’est pas un cadre gameplay propre.

## Conclusion
Le pipeline doit devenir un outil de préparation d’assets, pas un générateur automatique aveugle.
