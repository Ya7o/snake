# Notes d’implémentation — Patch 929

## Diagnostic produit
Le problème n’est pas seulement un zoom insuffisant. C’est un problème de stratégie de layout :
- centrage trop “desktop” ;
- mauvaise utilisation de la hauteur utile ;
- footer qui coûte trop cher visuellement ;
- absence d’un vrai mode mobile-first pour la WorldMap.

## Décision
La bonne direction est :
- un fit mobile dédié ;
- ancrage top-left ;
- scale prioritaire à la map ;
- footer traité à part.

## Point de vigilance
Il ne faut pas casser :
- la tap zone des nodes ;
- les badges / étoiles ;
- le hit testing après scale ;
- les safe areas Android.
