# Notes d’implémentation — Patch 923

## Intention
Ce patch ne doit pas lancer une refonte complète. Il corrige d’abord ce qui se voit immédiatement sur Android : débordements, mauvais fit, surcouches parasites, manque de compréhension, et priorité insuffisante donnée au plateau de jeu.

## Priorité réelle
1. Ne plus casser la lisibilité mobile.
2. Nettoyer la WorldMap.
3. Rendre l’intro utile et en français.
4. Faire fitter les cadres sans que le décor mange la grille.

## Sonic
L’exemple Sonic montre bien le problème produit :
- intro encore en anglais ;
- mécanique peu comprise ;
- cadre décoratif trop envahissant.

La correction doit donc être à la fois UX, texte et layout.

## WorldMap
Le problème n’est pas seulement le zoom. C’est aussi la hiérarchie visuelle :
- cadre de map pas assez visible ;
- bouton `START` inutile ;
- trop de couches d’icônes ;
- badges boss parasites.

## Cadres de gameplay
Le décor doit habiller le jeu, pas voler le plateau.
La règle est simple :
- zone de jeu d’abord ;
- décor ensuite ;
- aucun élément décoratif ne doit mordre sur la zone jouable.
