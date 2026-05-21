# Manual crop workflow

## Étape 1
Lancer l’extraction en mode debug.

## Étape 2
Ouvrir `public/assets/generated/_debug/{univers}_crop_debug.png`.

## Étape 3
Vérifier chaque rectangle :
- objet complet ;
- pas de titre parasite ;
- pas de section voisine ;
- pas de coupe ;
- marges propres.

## Étape 4
Corriger les coordonnées dans `src/assets/designBoardManifest.ts`.

## Étape 5
Relancer extraction + audit.

## Étape 6
Valider seulement les assets `clean`.

## Décision produit
Un crop douteux vaut mieux bloqué que mal intégré en jeu.
