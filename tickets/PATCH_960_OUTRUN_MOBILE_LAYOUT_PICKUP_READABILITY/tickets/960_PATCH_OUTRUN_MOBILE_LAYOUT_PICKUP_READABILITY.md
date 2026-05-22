# 960_PATCH_OUTRUN_MOBILE_LAYOUT_PICKUP_READABILITY

## Contexte

Le build mobile portrait présente encore des défauts visibles sur l’univers **OutRun** et sur l’interface de navigation :

1. **En jeu, le cadre gameplay ne “fit” plus correctement l’écran** sur mobile 960 px de large : le contour/frame est partiellement hors champ ou visuellement amputé.
2. **Le pickup clignotant est illisible** : l’effet visuel le rend plus difficile à identifier que les obstacles, ce qui viole une règle produit explicite.
3. **Le menu/bandeau bas du World Map est trop haut** et gaspille de l’espace vertical alors qu’il n’affiche qu’un nom de niveau/univers.
4. Le problème doit être corrigé **sur OutRun comme univers pilote**, puis **audité pour l’ensemble des univers** afin d’éviter un correctif local qui casse ailleurs.

Captures de référence :
- `references/screenshots/960_outrun_ingame_frame_pickup_issue.jpg`
- `references/screenshots/960_worldmap_bottom_band_issue.jpg`

Référentiel projet à respecter : `CLAUDE.md` (mobile portrait prioritaire, grille prioritaire sur le décor, textes lisibles, pickups plus visibles que les obstacles, pas de dépendance inutile, fallback procédural si asset manquant).

---

## Objectif

Livrer un patch ciblé qui :

- restaure un **layout gameplay mobile** propre pour OutRun ;
- améliore fortement la **lisibilité du pickup clignotant** sans dégrader l’identité visuelle OutRun ;
- réduit la **hauteur du bandeau bas du World Map** à **1 ligne utile, éventuellement 2 maximum** ;
- audite les mêmes règles de layout/rendering sur tous les univers pour éviter des divergences de comportement.

---

## Périmètre exact

### À corriger dans le jeu (OutRun en priorité)

#### A. Cadre gameplay / fit écran
- Recalculer le layout portrait pour que **le cadre de jeu complet reste visible** dans la zone utile mobile.
- Préserver la priorité suivante :
  1. lisibilité de la grille,
  2. visibilité du pickup,
  3. visibilité complète du cadre gameplay,
  4. décor/cadre hors grille en dernier.
- Si nécessaire, réduire marges décoratives ou padding autour du board **avant** de réduire la grille utile.
- Le rendu final doit éviter l’effet actuel : cadre tronqué, bottom décor écrasé, ou grille mal centrée.

#### B. Pickup clignotant trop illisible
- Conserver l’idée d’un pickup “clignotant”, **mais sans flicker destructif**.
- Remplacer le clignotement pur ON/OFF par une signalisation plus lisible, par exemple :
  - icône stable visible en continu,
  - halo/pulse léger,
  - contraste renforcé,
  - contour/badge,
  - animation additive douce.
- L’icône doit rester **plus lisible que les obstacles fixes**.
- La voiture fixe OutRun est jugée correcte : **s’en inspirer comme base de lisibilité**.

#### C. HUD in-game compact
- Vérifier que le HUD haut reste compact et ne re-mange pas l’espace vertical gagné.
- Éviter les doublons et le bruit visuel.
- Le bandeau objectif/étape doit tenir sur **une seule ligne utile** si l’information affichée est courte.

### À corriger dans le menu / World Map

#### D. Bandeau bas trop haut
- Réduire la hauteur du panneau inférieur du World Map.
- Cible : **1 ligne de texte visible**, **2 lignes maximum si cas exceptionnel**.
- Le bandeau doit uniquement servir à afficher le nom ou sous-titre utile du niveau/univers courant, sans grand vide vertical.
- Recentrer verticalement le texte dans ce bandeau réduit.

---

## Fichiers à modifier (cibles probables)

> Lire l’implémentation réelle avant édition. Si les noms exacts diffèrent, modifier les équivalents existants sans refonte large.

### Candidats principaux
- `src/scenes/GameScene.ts`
- `src/scenes/WorldMapScene.ts`
- `src/render/HUDRenderer.ts`
- `src/render/GridRenderer.ts`
- `src/render/PickupRenderer.ts`
- `src/render/FrameLayoutRenderer.ts` ou module équivalent de layout gameplay
- `src/config/levels.ts` ou config équivalente si certains labels/metadata conditionnent le HUD
- `src/config/universes.ts` ou config équivalente si le World Map consomme une zone de description paramétrée

### Créations possibles si nécessaires
- petits helpers utilitaires de layout responsive dans `src/render/` ou `src/utils/`
- petite note de suivi dans `docs/`

---

## Fichiers interdits / à ne pas toucher

- ne pas supprimer ni casser la World Map ;
- ne pas supprimer ni dégrader les 8 univers / 16 niveaux / 8 boss ;
- ne pas introduire de nouvelle dépendance ;
- ne pas remplacer le style OutRun par une UI générique ;
- ne pas mettre un décor détaillé derrière la grille jouable ;
- ne pas corriger OutRun en dur si la cause est un système partagé ;
- ne pas laisser un bandeau bas géant “temporaire”.

---

## Critères d’acceptation (checklist)

### Gameplay layout
- [ ] Sur mobile portrait ~960 px, le cadre gameplay OutRun est visible entièrement ou de façon clairement cadrée sans impression de découpe cassée.
- [ ] La grille reste le centre visuel principal.
- [ ] La zone décorative basse (voiture / route / frame) ne mange pas la lisibilité de la grille.
- [ ] Aucun élément essentiel du board n’est hors écran.

### Pickup / obstacles
- [ ] Le pickup clignotant est identifiable immédiatement.
- [ ] Le pickup reste visible même pendant son animation.
- [ ] Le pickup est plus lisible que les obstacles.
- [ ] Les obstacles conservent leur identité visuelle propre.

### HUD
- [ ] Le HUD haut n’occupe pas inutilement plus d’espace après patch.
- [ ] Les informations critiques restent lisibles en portrait.
- [ ] Pas de duplication inutile dans la ligne supérieure.

### World Map / menu bas
- [ ] Le bandeau bas du World Map est significativement réduit.
- [ ] Le texte du nom de niveau/univers tient sur 1 ligne dans le cas nominal.
- [ ] 2 lignes maximum si un cas exceptionnel l’exige.
- [ ] L’espace libéré bénéficie visuellement à la carte.

### Audit multi-univers
- [ ] Vérification rapide des 8 univers pour s’assurer que la logique de layout/pickup n’introduit pas de régression.
- [ ] Si un univers nécessite un traitement spécifique, il est documenté explicitement.

---

## Contraintes

- Patch ciblé, pas de refonte globale si un correctif de système suffit.
- Priorité Android portrait.
- Garder les polices fonctionnelles lisibles.
- Garder le style modern-retro existant.
- Prévoir un fallback procédural si un asset spécifique de pickup/effet manque.
- Favoriser une animation lisible plutôt qu’un effet “arcade” agressif.

---

## Hors scope

- Refonte complète du World Map.
- Refonte artistique complète d’OutRun.
- Rework des mécaniques de drift / checkpoint.
- Refonte générale des 8 HUD si non nécessaire.
- Ajout de nouvelles features hors bugfix UX/layout.

---

## Consignes d’exécution

1. Lire les fichiers réellement responsables du layout gameplay, du HUD, du rendu pickup et du World Map.
2. Identifier la cause système du mauvais fit mobile (padding, scale, safe-area, frame bounds, board anchor, décor bottom).
3. Corriger **OutRun** en priorité, puis vérifier les autres univers.
4. Réduire le bandeau bas World Map de manière propre et centraliser la hauteur si elle est codée en dur.
5. Rendre le pickup clignotant lisible sans disparition brutale.
6. Lancer `npm run check`.
7. Documenter les fichiers modifiés, les fallbacks et les limites restantes.
8. Ne laisser aucun serveur lancé.

---

## Tests demandés

### Test layout gameplay
- lancer le jeu en mobile portrait / viewport proche 960 px ;
- ouvrir OutRun ;
- vérifier que le cadre gameplay n’est plus perçu comme coupé ;
- vérifier que la grille reste lisible.

### Test pickup
- sur un niveau OutRun avec pickup clignotant :
  - vérifier l’identification immédiate ;
  - vérifier la différence claire entre pickup et obstacle ;
  - vérifier que l’animation n’efface pas l’icône.

### Test World Map
- ouvrir la carte ;
- sélectionner plusieurs univers dont OutRun ;
- vérifier que le bandeau bas prend 1 ligne la plupart du temps ;
- vérifier qu’il ne cache pas inutilement la map.

### Régression rapide multi-univers
- ouvrir au moins Castle, Sonic, OutRun, Shinobi, Kombat ;
- vérifier que le layout portrait reste cohérent ;
- vérifier que les pickups importants restent plus visibles que les obstacles.

---

## Livrable attendu

Un patch propre et ciblé avec :
- code modifié minimal ;
- `npm run check` OK ;
- liste des fichiers touchés ;
- courte note de validation manuelle ;
- mention explicite des éventuels fallbacks.
