# Notes de contexte — Patch 960 OutRun Mobile Layout / Pickup Readability

## Diagnostic synthétique

Les captures montrent trois problèmes de produit, pas seulement des détails cosmétiques :

1. **Le layout gameplay consomme mal la hauteur utile mobile.**
   Le HUD haut + le décor bas + le cadre autour de la grille créent une composition trop haute. Résultat : le frame paraît mal cadré et la zone basse semble “manger” l’espace disponible.

2. **Le pickup clignotant perd sa hiérarchie visuelle.**
   La voiture obstacle est identifiable immédiatement, alors que le pickup clignotant est moins reconnaissable à cause de l’effet. C’est une erreur de priorisation visuelle : l’élément à collecter doit être plus évident que l’élément à éviter.

3. **Le panneau bas du World Map est surdimensionné.**
   L’espace réservé au label “AUTOROUTE DU SOLEIL” est disproportionné par rapport à son utilité. C’est un gaspillage de verticalité sur écran portrait.

## Direction recommandée

### 1) Layout board-first
Le système de layout doit d’abord résoudre :
- hauteur écran utile,
- hauteur HUD minimale,
- hauteur info-band minimale,
- taille max de la grille/cadre,
- décor restant.

Le board doit rester prioritaire. Si ça ne rentre pas, on compresse d’abord :
- paddings,
- marges internes,
- décor non critique,
- hauteur des panneaux texte.

### 2) Pickup blink lisible
Ne pas utiliser un blink “disparition complète”. Préférer :
- sprite toujours visible,
- pulse alpha léger (ex. 0.75 → 1.0 au lieu de 0 → 1),
- halo doux,
- contour ou badge lumineux,
- micro-scale pulse si besoin.

### 3) World Map bottom bar compact
Le bandeau bas devrait être traité comme un **caption bar** et non comme un panneau de contenu.
- hauteur compacte,
- 1 ligne par défaut,
- 2 lignes max,
- texte centré,
- padding vertical minimal.

## Risque principal

Le vrai risque est de patcher OutRun en dur. Si la source du problème est un calcul partagé (safe-area, scale, anchor, frame padding, bottom info panel), le correctif doit être systémique puis vérifié sur tous les univers.

## Recommandation de validation

Prendre des captures avant/après sur :
- OutRun gameplay ;
- World Map sur OutRun ;
- un second univers avec frame plus chargé (Castle ou Kombat) ;
- un univers plus simple (Sonic / Paperboy) pour vérifier l’absence de régression.
