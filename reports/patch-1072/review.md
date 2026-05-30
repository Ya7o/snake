# Review

## Objectif

Définir le système de score minimal.

## Résultat

Le patch définit un score minimal comme objectif secondaire, sans durcir la difficulté : points sur pickups, clear, boss hit, boss clear et bonus temps si disponible. Le best score est prévu localement par niveau via `localStorage`, avec affichage recommandé surtout sur ClearScene et GameOverScene.

## Fichiers modifiés

- reports/patch-1072/review.md
- reports/patch-1072/docs/minimal-score-system-design.md

## Tests / vérifications

Commande lancée :

- `npm run check`

Résultat :

- OK. Build Vite terminé avec le warning Rollup connu `chunk > 500 kB`, non bloquant.

## Captures

Aucune capture requise.

## Documents

- reports/patch-1072/docs/minimal-score-system-design.md

## Limites / risques

Ce patch ne modifie pas le jeu. Il prépare l'implémentation.

## Liens GitHub

- Commit :
- PR :
