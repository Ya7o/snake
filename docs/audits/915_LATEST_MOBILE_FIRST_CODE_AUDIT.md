# AUDIT 915 — Latest Mobile-First Code

## Contexte
Audit réalisé sur l'état courant du repo après les corrections récentes : WorldMap réelle, nodes recalibrés, écrans Clear/GameOver mobile-first, suppression des 8 briques du titre, et cadre Castle complet autour de la zone de jeu.

Le ticket 915 est un audit : aucun fichier gameplay/source ne doit être modifié par ce patch.

## Résultat Technique
- `npm run check` passe sur l'état courant.
- Le build Vite passe.
- Warning Vite restant : bundle principal supérieur au seuil 500 kB. Ce n'est pas bloquant pour ce patch, mais à garder en P2.

## Verdict Court
La base mobile est plus propre qu'avant : Clear/GameOver ont maintenant de vrais boutons, le titre ne montre plus les 8 briques disgracieuses, et Castle utilise un vrai cadre illustré. Les risques principaux restent la lisibilité Android et l'ergonomie des scènes intermédiaires : trop de textes fonctionnels sont encore en `Press Start 2P` minuscule, le rendu Phaser est configuré en pixel-art global, et certaines actions tactiles restent trop petites.

## P0 — À Corriger Ensuite

### 1. Rendu global trop pixel brut
Dans `src/main.ts`, le rendu force encore :
- `antialias: false`
- `pixelArt: true`
- `roundPixels: true`

Ce réglage sert bien les sprites pixel-art, mais il dégrade les textes fonctionnels et les boutons. La direction recommandée est un rendu hybride : préserver l'identité rétro des assets, rendre l'UI fonctionnelle plus nette.

Patch recommandé : `916_RENDERER_TEXT_CLARITY_MODERN_RETRO`.

### 2. Typographie fonctionnelle trop petite
Occurrences critiques constatées :
- `src/render/HUDRenderer.ts` : `7px` / `8px`.
- `src/scenes/WorldMapScene.ts` : `3px`, `4px`, `5px`, `7px`.
- `src/scenes/LevelIntroScene.ts` : `7px`, `8px`, `9px`.
- `src/scenes/GameScene.ts` : bouton `< MAP` à `8px`.

Le style arcade doit rester pour les titres et accents, pas pour tous les labels utiles.

Patch recommandé : `917_FUNCTIONAL_TYPOGRAPHY_MOBILE_CLARITY`.

### 3. WorldMap encore trop chargée côté micro-UI
Les nodes sont mieux alignés, et le double tap existe. Restent :
- micro-labels sous nodes illisibles sur Android ;
- bouton START de 22 px trop petit ;
- footer encore très dense ;
- seuil drag de 5 px probablement trop sensible.

Patch recommandé : `919_WORLDMAP_MOBILE_INTERACTION_ECONOMY`.

### 4. Gameplay : action retour map trop faible
Dans `GameScene`, `< MAP` est un simple texte interactif près du bas de l'écran. C'est trop petit et trop proche de la zone de navigation Android.

Patch recommandé : `920_INGAME_MOBILE_SAFE_ACTIONS`.

## P1 — À Corriger Ensuite

### Clear/GameOver
État actuel meilleur :
- `NEXT LEVEL` est une action principale claire.
- `RETRY` est une action principale claire.
- `WORLD MAP` est secondaire.
- Les badges parasites ont été retirés du code.

Reste à valider sur appareil/cache vidé que l'ancien rond jaune vu en capture ne vient pas d'une build servie depuis cache.

Patch recommandé si le problème revient : `918_END_SCREEN_RUNTIME_CLEANUP_AND_BUTTON_POLISH`.

### Bouton mobile commun
`addMobileButton()` est utile mais reste basique :
- pas de disabled state ;
- pas d'anti double-submit ;
- pas de variantes centralisées ;
- pas de min touch size constante ;
- pas de multiline propre.

À faire après les P0 : migrer vers un composant `MobileActionButton`.

### LevelIntro
`LevelIntroScene` garde beaucoup de texte pixel petit et un `TAP TO START`. Pour un flow mobile moderne, il faudrait un bouton clair ou un lancement direct selon contexte.

## P2 — Finition
- Réduire les scanlines sur les écrans avec texte fonctionnel.
- Moderniser les sprites gameplay sans masquer la grille.
- Ajouter option accessibilité texte plus grand / scanlines off.
- Surveiller bundle size si le runtime Android devient lent.

## Séquence De Patchs Recommandée
1. `916_RENDERER_TEXT_CLARITY_MODERN_RETRO`
2. `917_FUNCTIONAL_TYPOGRAPHY_MOBILE_CLARITY`
3. `919_WORLDMAP_MOBILE_INTERACTION_ECONOMY`
4. `920_INGAME_MOBILE_SAFE_ACTIONS`
5. `918_END_SCREEN_RUNTIME_CLEANUP_AND_BUTTON_POLISH`, seulement si le parasite Clear/GameOver réapparaît en runtime.
6. `921_MODERN_RETRO_GAMEPLAY_SPRITES`

## Tests Manuels Android À Faire
- Vider le cache ou utiliser navigation privée.
- Title -> WorldMap -> double tap node -> LevelIntro -> Game.
- Clear -> `NEXT LEVEL`.
- GameOver -> `RETRY`.
- Gameplay Castle : vérifier que le cadre ne masque pas snake/pickups/obstacles.
- Tester largeur 360, 390, 430 px en portrait.

## Questions / Blocages
- Le rendu hybride `pixelArt`/UI nette doit être validé visuellement, car Phaser applique ces options globalement.
- Le rond jaune parasite n'est pas identifiable dans le code actuel après patch 914; s'il existe encore, il faut une capture runtime cache vidé.
- Décision produit : garder `Press Start 2P` seulement pour titres et branding, ou aussi pour quelques labels courts.
