# PATCH 993 — Castle Vertical Slice Template

## Objectif

Castle sert de vertical slice et de template pour les autres univers.

## Doctrine

Image = ambiance.
Runtime = UI.

## À reprendre pour tous les univers

- structure de scènes
- runtime buttons
- runtime HUD
- runtime board panel
- 1 niveau normal + 1 boss
- background system / gameplay / game over / clear
- pickups / obstacles / danger / boss event
- feedback audio et visuel
- lisibilité mobile prioritaire

## Spécifique Castle

- thème château féerique
- illusion walls
- witch mirror boss
- palette nuit bleue/violet/or
- OpenMoji Castle actuellement utilisés pour pickups/obstacles/boss

## À ne pas reprendre

- exceptions Castle non nécessaires
- backgrounds trop illustratifs
- textes baked
- cadres baked
- personnages baked
- boutons baked
- HUD baked
- assets legacy non utilisés

## Règles du gameplay background Castle

Le fichier castle_gameplay_bg.png doit être :
- fond d’ambiance uniquement
- sans HUD
- sans grille
- sans bouton
- sans texte
- sans cadre complet
- centre calme
- détails surtout sur bords/haut/bas
- assez sombre pour garder la grille lisible

## Critères d’acceptation

- npm run build passe
- Castle normal affiche castle_gameplay_bg derrière le board runtime
- Castle boss affiche aussi castle_gameplay_bg derrière le board runtime
- Le board runtime reste au-dessus du background
- La grille reste lisible
- Le snake, les pickups, les obstacles et le boss restent lisibles
- Les autres univers ne changent pas
- ?debugLayers=1 affiche une information cohérente
