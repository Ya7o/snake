# Universe Template Rules — Snake Drive

## Structure obligatoire d'un univers

Chaque univers doit contenir :
- 1 niveau normal
- 1 niveau boss
- 1 mécanique principale
- 1 type de pickup principal
- 1 famille d'obstacles
- 1 menace/boss
- 4 backgrounds
- 1 palette
- 1 ambiance audio

## Backgrounds obligatoires

Nom standard :
- {universe}_system_bg.png
- {universe}_gameplay_bg.png
- {universe}_game_over_bg.png
- {universe}_clear_bg.png

## Règles gameplay_bg

Le gameplay background doit :
- être calme
- avoir un centre peu détaillé
- éviter les gros éléments latéraux coupés
- ne contenir aucune UI
- ne contenir aucun texte
- ne contenir aucun bouton
- ne contenir aucune grille
- servir d'ambiance uniquement

## Runtime obligatoire

Le runtime gère :
- HUD
- board
- grille
- score
- objectifs
- boutons
- transitions
- feedbacks
- effets pickups
- effets boss

## Variables par univers

Chaque univers peut changer :
- palette
- matériaux UI
- pickups
- obstacles
- boss
- background
- sons
- noms des objectifs
- feedbacks visuels

## Non variables

Ne doivent pas changer entre univers :
- flow des scènes
- logique mobile portrait
- lisibilité prioritaire
- structure 1 normal + 1 boss
- doctrine image/runtime
- règles de validation

## Ordre recommandé de déclinaison

1. Castle
2. OutRun
3. Streets
4. Shinobi
5. Paperboy
6. Fighter
7. Sonic
8. Kombat

OutRun est recommandé en deuxième univers car il permet de tester un thème très différent avec bonne respiration visuelle.

## Gate avant nouvel univers

Avant de commencer un autre univers :
- Castle checklist validée
- gameplay Castle accepté
- template rules créées
- aucun bug bloquant Castle
- pas de dette visuelle critique sur HUD/board

Validation finale :
Lancer npm run build.

Retour attendu :
- fichiers créés
- build OK ou erreur
- aucun changement de code
