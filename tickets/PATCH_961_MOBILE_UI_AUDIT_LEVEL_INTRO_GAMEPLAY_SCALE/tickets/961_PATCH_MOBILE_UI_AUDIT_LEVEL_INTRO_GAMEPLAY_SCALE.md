# 961_PATCH_MOBILE_UI_AUDIT_LEVEL_INTRO_GAMEPLAY_SCALE

## Contexte

Après les derniers correctifs mobile, l’audit visuel montre que certains problèmes ont changé de forme au lieu d’être résolus proprement :

1. **Gameplay OutRun** : le cadre tient mieux, mais le jeu est maintenant trop bas / trop petit dans la zone utile. Un grand vide vertical apparaît entre le HUD top compact et le frame gameplay. Le patch précédent semble avoir sur-corrigé le fit en réduisant trop l’échelle ou en ajoutant trop de marge supérieure.
2. **Level intro Shinobi / Kombat** : le panneau de description et les boutons sont trop bas. Les boutons frôlent ou recouvrent le bas du cadre décoratif. La composition n’est pas assez safe-area aware.
3. **Level intro multi-univers** : le problème n’est pas spécifique à Shinobi/Kombat. Les univers à frame vertical chargé risquent tous d’avoir une stack titre → visuel → panneau → boutons trop haute.
4. **Sonic gameplay** : à contrôler dans le même audit : pickup visible, frame fit, HUD top compact, pas de débordement latéral/décoratif.

Captures de référence :
- `references/screenshots/961_outrun_gameplay_scale_too_small_top_gap.jpg`
- `references/screenshots/961_kombat_level_intro_buttons_low_overlap.jpg`
- `references/screenshots/961_shinobi_level_intro_buttons_low_overlap.jpg` si présent
- `references/screenshots/961_sonic_gameplay_pickup_visibility_frame_check.jpg` si présent

Référence projet : `CLAUDE.md`.

---

## Objectif

Créer un correctif de layout mobile **systémique** :

- récupérer l’espace vertical perdu en gameplay OutRun sans recouper le frame ;
- stabiliser une règle responsive de placement du board/frame ;
- remonter et compacter la zone de panneau + boutons sur les écrans d’intro niveau ;
- auditer tous les univers pour éviter un patch local fragile.

---

## Diagnostic produit

Le problème actuel n’est pas seulement “le cadre ne fit pas”. C’est un problème de **budget vertical** mal arbitré.

### Gameplay
Le layout doit répartir la hauteur disponible dans cet ordre :

1. safe-area navigateur/mobile ;
2. HUD top minimal ;
3. frame gameplay complet ;
4. grille lisible ;
5. décor secondaire.

Le screenshot OutRun montre une marge haute excessive entre le bandeau objectif `OUTRUN / BALISES / 0/10` et le frame gameplay. Ce vide n’apporte aucune information et réduit la taille perçue du board.

### Level intro
Les écrans Shinobi/Kombat montrent une autre faille : le contenu principal est empilé trop bas. Les boutons utilisent une hauteur importante et viennent empiéter sur le cadre décoratif inférieur. Le panneau doit être recentré dans une zone utile, pas simplement ancré bas.

---

## Périmètre exact

### A. Gameplay layout — OutRun pilote, tous univers audités

- Réduire la marge verticale inutile entre HUD top et frame gameplay.
- Permettre au frame/gameplay de reprendre de la hauteur tant qu’il reste entièrement visible.
- Garder la grille prioritaire et lisible.
- Éviter l’effet inverse du patch précédent : ne pas couper le bas du cadre.
- Centraliser les constantes de layout si elles sont dupliquées.

Critère : sur OutRun mobile portrait, le frame doit paraître **pleinement exploité** sans être tronqué.

### B. Level intro layout — Shinobi/Kombat pilotes

- Recalculer la stack verticale : titre univers, décor/hero, panneau mission, boutons.
- Définir une zone safe pour `missionPanel + buttons` qui ne descend jamais dans le décor frame bottom.
- Réduire les hauteurs/paddings si l’écran manque de place.
- Remonter les boutons et éviter tout chevauchement avec le bas du cadre.
- Conserver un espace lisible entre panneau et boutons.

Critère : sur Shinobi et Kombat, les boutons `JOUER` / `CARTE` doivent être intégrés proprement, sans toucher/casser le cadre bas.

### C. Boutons intro

- En mobile portrait, les boutons peuvent rester côte à côte si la largeur est suffisante.
- Si la hauteur est trop contrainte, privilégier :
  - hauteur bouton réduite ;
  - padding réduit ;
  - y-position remontée ;
  - jamais de chevauchement du cadre bas.
- Ne pas rendre les boutons minuscules : ils doivent rester utilisables tactilement.

### D. Audit multi-univers

Vérifier au minimum :
- Castle intro + gameplay ;
- Sonic gameplay ;
- OutRun gameplay + intro ;
- Shinobi intro ;
- Kombat intro ;
- Paperboy si frame/intro différent.

---

## Fichiers à inspecter / modifier probablement

> Lire les fichiers réels avant modification. Ne pas inventer une architecture parallèle.

- `src/scenes/GameScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/WorldMapScene.ts` si navigation retour impactée
- `src/render/HUDRenderer.ts`
- `src/render/GridRenderer.ts`
- `src/render/PickupRenderer.ts`
- `src/render/FrameRenderer.ts` ou équivalent
- `src/config/universes.ts`
- `src/config/levels.ts`
- tout helper existant de layout/responsive

---

## Fichiers interdits / contraintes fortes

- Ne pas supprimer les 8 univers, 16 niveaux, 8 boss ou la World Map.
- Ne pas ajouter de dépendance.
- Ne pas mettre de décor détaillé derrière la grille jouable.
- Ne pas hardcoder uniquement Shinobi/Kombat/OutRun si la cause est commune.
- Ne pas agrandir le frame au prix d’une grille illisible.
- Ne pas faire disparaître les boutons sous le navigateur mobile.
- Ne pas lancer de serveur permanent.

---

## Critères d’acceptation

### Gameplay OutRun
- [ ] Le grand vide entre le HUD top et le frame gameplay est supprimé ou fortement réduit.
- [ ] Le frame gameplay reste visible sans coupe évidente.
- [ ] La grille est plus grande ou mieux exploitée qu’avant patch.
- [ ] Le HUD top reste compact.
- [ ] Aucun décor secondaire ne prend la priorité sur le board.

### Sonic gameplay
- [ ] Frame et grille restent lisibles en portrait.
- [ ] Pickup / anneau visible immédiatement.
- [ ] Pas de clipping décoratif gênant.
- [ ] Pas de duplication inutile du HUD.

### Shinobi/Kombat intro
- [ ] Le panneau mission ne pousse plus les boutons dans le cadre bas.
- [ ] Les boutons sont tactiles, lisibles, non chevauchés.
- [ ] Le contenu reste centré dans la zone utile.
- [ ] Le titre univers reste lisible.
- [ ] Le décor d’ambiance reste secondaire.

### Audit univers
- [ ] Les 8 univers passent une revue rapide intro/gameplay.
- [ ] Les exceptions sont documentées.
- [ ] Le correctif est expliqué comme règle de layout, pas comme bricolage par univers.

---

## Hors scope

- Refonte artistique complète des frames.
- Redesign complet des HUD.
- Modification des mécaniques de niveau.
- Ajout de nouveaux assets non nécessaires.
- Refonte complète de la World Map sauf si un helper de safe-area est partagé.

---

## Consignes d’exécution

1. Lire `CLAUDE.md` puis les scènes/renderers concernés.
2. Identifier où sont calculés :
   - hauteur HUD top ;
   - position/scale du frame gameplay ;
   - zone utile de la grille ;
   - position du mission panel intro ;
   - position/taille des boutons intro.
3. Remplacer les constantes fragiles par un calcul responsive borné.
4. Corriger OutRun gameplay comme cas pilote.
5. Corriger Shinobi/Kombat intro comme cas pilotes.
6. Auditer les autres univers.
7. Lancer `npm run check`.
8. Fournir : fichiers modifiés, logique appliquée, résultat check, limites.

---

## Tests manuels demandés

### Viewport mobile
Tester sur viewport proche des captures : Android portrait, largeur autour de 360-430 CSS px selon scaling navigateur.

### Scénarios
- OutRun gameplay : vérifier suppression du vide vertical et frame non coupé.
- Sonic gameplay : vérifier frame + pickup.
- Shinobi intro : vérifier panneau/boutons.
- Kombat intro : vérifier panneau/boutons.
- Castle intro/gameplay : vérifier absence de régression.
- Paperboy ou autre univers chargé : vérifier absence de régression.

---

## Sortie attendue

Réponse finale du dev agent :

- résumé court ;
- fichiers modifiés ;
- captures ou observations avant/après si possible ;
- `npm run check` OK ou erreur détaillée ;
- fallbacks/limites.
