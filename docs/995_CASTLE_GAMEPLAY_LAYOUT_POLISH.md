# PATCH 995 — Castle Gameplay Layout Polish

## Objectif
Améliorer l’intégration visuelle du HUD et du board Castle après PATCH 994.

## Changements
- HUD Castle runtime moins placeholder
- meilleure respiration HUD/board
- board moins massif si nécessaire
- aucun changement de mécanique
- aucun changement d’asset

## Règles conservées
- image = ambiance
- runtime = UI
- Castle reste vertical slice
- les autres univers ne changent pas

## Critères d’acceptation
- npm run build OK
- Castle normal lisible
- Castle boss lisible
- HUD rempli et non placeholder
- board encore confortable sur mobile
- background toujours visible sur les bords
- pickup toujours visible
- sonic_normal non régressé
