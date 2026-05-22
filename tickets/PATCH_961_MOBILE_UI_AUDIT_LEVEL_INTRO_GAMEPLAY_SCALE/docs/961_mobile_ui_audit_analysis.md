# Audit analyse — Patch 961 Mobile UI Layout

## Problème central

Les derniers screenshots montrent une alternance de deux erreurs opposées :

1. Avant : le frame gameplay pouvait être trop grand ou coupé.
2. Maintenant : certains frames tiennent, mais la scène est trop réduite ou trop basse, avec du vide inutile.

La correction ne doit donc pas être “réduire encore le frame”. Il faut mettre en place un **budget vertical responsive**.

## Analyse par capture

### OutRun gameplay

Symptômes :
- grand vide entre le HUD objectif et le frame principal ;
- gameplay visuellement trop bas ;
- board plus petit que nécessaire ;
- le décor bas est visible, mais au prix d’une perte de présence du jeu.

Conclusion : le patch précédent a probablement ajouté une marge ou une borne de scale trop conservatrice. Il faut recalculer la position Y et l’échelle max à partir de la hauteur réellement disponible.

### Kombat intro

Symptômes :
- panneau mission et boutons positionnés très bas ;
- boutons proches du cadre décoratif inférieur ;
- la composition paraît tassée dans le bas alors que le haut contient beaucoup d’ambiance non interactive.

Conclusion : l’écran d’intro doit être piloté par une zone sûre de contenu interactif. Les boutons ne doivent pas être ancrés au décor bas.

### Shinobi intro

Même famille de problème que Kombat : décor très présent, contenu interactif trop bas. Les boutons doivent rester dans une zone stable et lisible.

### Sonic gameplay

À vérifier comme cas de contrôle : frame lisible, pickup visible, HUD compact. Sonic est utile pour valider que les règles de layout ne sont pas uniquement optimisées pour OutRun.

## Recommandation technique

### Layout gameplay

Créer ou renforcer un calcul du type :

- `safeTop`
- `safeBottom`
- `compactHudHeight`
- `availableGameplayHeight`
- `frameScale = min(maxByWidth, maxByHeight)`
- `frameY = hudBottom + remainingGap / 2`, borné par une marge minimum et maximum

Éviter les grandes constantes fixes du type `topOffset = 120` ou `frameScale = 0.8` non contextualisées.

### Layout intro

Créer une règle :

- zone décorative autorisée ;
- zone contenu mission bornée ;
- zone boutons bornée ;
- compression progressive si hauteur insuffisante.

Ordre de compression conseillé :
1. réduire padding panneau ;
2. réduire gap panneau/boutons ;
3. réduire hauteur bouton dans une limite tactile raisonnable ;
4. remonter la stack ;
5. jamais chevaucher le cadre bas.

## Angles morts à éviter

- Corriger OutRun uniquement en dur.
- Remonter le frame gameplay sans vérifier Castle/Kombat, dont les frames sont plus chargés.
- Rendre les boutons plus petits mais moins tactiles.
- Croire que le décor plein écran est prioritaire : il ne l’est pas. Le gameplay et les CTA passent avant.

## Critère de réussite visuelle

Sur mobile portrait, l’utilisateur doit voir immédiatement :

1. où jouer ;
2. quoi collecter/éviter ;
3. quel bouton toucher ;
4. quel niveau/univers est actif.

Tout élément décoratif qui empêche l’un de ces quatre points doit être compressé ou recadré.
