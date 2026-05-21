# AUDIT 949 — Gameplay balance

## Verdict
Le code expose les éléments nécessaires au gameplay, mais l'équilibrage doit être validé par test réel.

## Points contrôlés
- vitesse / tick / delay : 248 signaux
- score / combo / chain : 181 signaux
- collisions / obstacles : 637 signaux
- victoire / défaite : 330 signaux
- niveaux / boss : 889 signaux

## Risques P0/P1/P2
- P0 : collision incompréhensible ou mort injuste.
- P1 : difficulté trop brutale entre niveaux.
- P1 : boss plus confus que difficile.
- P2 : scoring pas assez valorisant.

## Corrections recommandées
- Créer une table de difficulté pour les 16 niveaux.
- Tester vitesse Snake, taille grille, nombre d'obstacles et objectifs par niveau.
- Noter tous les décès injustes ou incompréhensibles.
- Calibrer progression : premiers niveaux courts, boss plus lisibles, difficulté graduelle.
