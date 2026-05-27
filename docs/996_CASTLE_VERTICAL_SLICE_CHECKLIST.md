# PATCH 996 — Castle Vertical Slice Checklist

## Statut
Castle est le vertical slice de référence du projet Snake Drive.

## Doctrine validée
Image = ambiance.
Runtime = UI.

Les backgrounds ne doivent pas contenir :
- HUD baked
- boutons baked
- score baked
- grille baked
- texte baked
- personnages centraux baked
- cadres gameplay complets baked

Le runtime doit gérer :
- HUD
- board
- grille
- boutons
- textes
- score
- pickups
- obstacles
- boss
- feedbacks

## Boucle Castle validée
- Title
- WorldMap
- LevelIntro Castle
- Castle normal
- Castle boss
- GameOver Castle
- Clear Castle
- retour WorldMap

## Castle — identité
Thème :
château féerique, forêt magique, nuit bleue/violette, illusions, miroir, sorcière.

Promesse joueur :
Snake classique lisible, avec dangers d'illusion et boss miroir.

## Castle — gameplay normal
Objectif :
collecter 10 éléments magiques.

Règles :
- Snake mobile lisible
- grille prioritaire
- obstacles / illusions visibles
- pickup renforcé par feedback runtime
- pas de décor central intrusif

## Castle — boss
Objectif :
vaincre le boss en réduisant ses HP.

Règles :
- boss lisible
- leurres / dangers lisibles
- HUD indique BOSS HP
- pas de surcharge visuelle

## Castle — HUD
Éléments :
- gauche : univers ou mode
- centre : stage ou boss
- droite : objectif ou HP

À reprendre :
- 3 blocs runtime
- texte court
- contraste élevé
- pas de texte baked

À améliorer plus tard :
- icône légère possible
- micro-animation possible
- meilleur style typographique possible

## Castle — board
À reprendre :
- board runtime
- grille runtime
- fond gameplay séparé
- priorité lisibilité

À ne pas reprendre :
- cadre baked dans l'image
- bordures trop décoratives dans le background
- décor qui passe sous les cases de gameplay

## Castle — backgrounds
Assets utilisés :
- castle_system_bg.png
- castle_gameplay_bg.png
- castle_game_over_bg.png
- castle_clear_bg.png

Règles :
- system_bg : menu / intro / briefing
- gameplay_bg : fond calme, très contraint
- game_over_bg : plus sombre
- clear_bg : plus lumineux / gratifiant

## Castle — pickups
Règles :
- doivent être visibles immédiatement
- peuvent avoir glow runtime
- ne doivent pas dépendre du background
- doivent rester lisibles sur mobile

## Castle — obstacles
Règles :
- silhouette claire
- contraste suffisant
- pas trop petits
- pas trop proches du décor

## Castle — boss / menace
Règles :
- menace unique par univers
- pour Castle : miroir / sorcière / illusion
- éviter d'ajouter plusieurs mécaniques concurrentes

## À reprendre pour tous les univers
- structure scène
- 1 niveau normal + 1 boss
- 4 backgrounds par univers
- HUD runtime
- board runtime
- grille runtime
- pickups spécifiques
- obstacles spécifiques
- menace/boss spécifique
- feedback runtime
- pas d'UI baked dans les images

## Spécifique Castle
- palette bleu nuit / violet / or
- château / forêt magique
- illusion walls
- miroir sorcière
- magie / étoiles / orbes

## À ne pas reproduire dans les prochains univers
- backgrounds gameplay trop illustratifs
- personnages centraux baked
- faux boutons dans les images
- faux textes dans les images
- cadres complets dans les images
- exceptions techniques inutiles
- décor qui gêne la grille

## Critères de validation d'un univers
Un univers est validé si :
- build OK
- niveau normal jouable
- boss jouable
- HUD lisible
- gameplay background non intrusif
- pickups visibles
- obstacles visibles
- GameOver cohérent
- Clear cohérent
- aucun texte baked
- aucun bouton baked
- aucun HUD baked
- retour WorldMap OK

## Décision
Castle est assez stable pour servir de base au template.
Prochaine étape : formaliser les règles universelles et choisir un deuxième univers test.
