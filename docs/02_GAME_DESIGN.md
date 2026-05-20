# 02 — Game Design

## Structure

- 8 univers.
- 16 niveaux.
- Chaque univers : 1 niveau normal + 1 boss.
- Tous les niveaux accessibles depuis la world map.
- Progression par clear/badges.

## Boucle de jeu

World map → intro niveau → gameplay Snake → clear/game over → retry ou map.

## Snake de base

- déplacement automatique sur grille ;
- contrôle swipe/clavier ;
- pas de demi-tour instantané ;
- pickup objectif ;
- collision danger/corps/mur = défaite ;
- quota atteint ou boss vaincu = victoire.

## Critère de stabilité première build

Tout doit être jouable, même avec assets fallback.
Le polish peut venir après audit.
