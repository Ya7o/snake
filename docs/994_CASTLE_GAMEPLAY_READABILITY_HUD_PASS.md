# PATCH 994 — Castle Gameplay Readability & HUD Pass

## Objectif
Améliorer la lisibilité et la personnalité du gameplay Castle après le branchement du background PATCH 993.

## Changements
- overlay global Castle ajusté
- éventuel dim local sous board/grid
- HUD Castle rendu moins placeholder
- pickup Castle renforcé par feedback runtime léger

## Règles conservées
- image = ambiance
- runtime = UI
- aucun texte baked
- aucun bouton baked
- aucune grille baked
- aucune modification des autres univers

## Critères d’acceptation
- npm run build OK
- Castle normal reste lisible
- Castle boss reste lisible
- background Castle est visible mais ne concurrence pas la grille
- HUD haut lisible et non placeholder
- pickup visible sur mobile
- autres univers inchangés
