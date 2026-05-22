# XXX_PATCH_CASTLE_MOBILE_UI_READABILITY_AUDIT

## Statut
- Type : patch ciblé UI / lisibilité / audit cross-univers
- Priorité : haute
- Univers pilote : `castle`
- Portée secondaire : audit et corrections transversales pour les 8 univers
- Plateforme cible : Android mobile portrait, navigateur avec barres système visibles

## Contexte
Les captures montrent un problème de polish qui n'est pas seulement cosmétique : l'interface nuit à la compréhension immédiate du niveau.

Constats observés :
1. Écran titre : la ligne `8 MONDES · 16 NIVEAUX · 8 BOSS` déborde horizontalement sur mobile étroit.
2. Écran d'introduction Castle : la traduction / formulation est rigide et trop littérale, notamment `MURS CLIGNOTANTS = DANGER`.
3. Gameplay Castle : l'icône de pickup à collecter est trop petite et peu identifiable.
4. Gameplay Castle : les obstacles / murs clignotants n'ont pas de signature visuelle forte ni d'asset obstacle d'univers.
5. Gameplay Castle : la zone de jeu utile semble trop contrainte et ne profite pas assez de la largeur/hauteur disponible.
6. HUD gameplay : l'information `murs clignotants = danger` est affichée deux fois, une fois en règle et une fois en statut mécanique.
7. HUD gameplay : deux lignes de menu en haut prennent trop de hauteur ; une seule ligne suffit.

Point dur : ne pas corriger uniquement Castle en dur. Castle sert de cas visible, mais les systèmes concernés sont transversaux : titre, intro niveau, HUD, layout grille, render pickups/obstacles et textes de `levels`.

## Objectif
Rendre Castle immédiatement lisible sur mobile portrait, puis vérifier que la même logique reste propre sur les 8 univers.

Objectifs mesurables :
- Aucun texte fonctionnel ne déborde à 360 px, 393 px et 430 px de largeur viewport.
- Le HUD gameplay tient sur une seule ligne compacte.
- La règle mécanique n'apparaît pas deux fois dans le HUD.
- Le pickup principal est plus visible que les obstacles.
- Les obstacles dangereux utilisent l'asset obstacle de l'univers quand disponible, avec fallback procédural clair.
- La grille / zone utile de jeu occupe plus d'espace sans mettre de décor détaillé derrière les cellules.
- Castle est corrigé en premier, puis audit rapide des 7 autres univers.

## Fichiers à lire avant modification
Lire les fichiers réels du repo avant patch. Ne pas agir uniquement par recherche globale.

- `CLAUDE.md`
- `src/scenes/TitleScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/GameScene.ts`
- `src/render/HUDRenderer.ts`
- `src/render/GridRenderer.ts`
- `src/render/PickupRenderer.ts`
- `src/render/ObstacleRenderer.ts`
- `src/config/levels.ts`
- `src/config/universes.ts`
- `src/config/constants.ts`
- `src/systems/RuntimeAssetResolver.ts`
- `src/systems/CodexAssetResolver.ts`
- `src/mechanics/CastleIllusionMechanic.ts`
- Les mécaniques des autres univers si leur HUD / obstacles / pickups exposent des textes spécifiques.

## Fichiers à modifier probablement
Liste indicative, à confirmer après lecture du code :

- `src/scenes/TitleScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/GameScene.ts`
- `src/render/HUDRenderer.ts`
- `src/render/GridRenderer.ts`
- `src/render/PickupRenderer.ts`
- `src/render/ObstacleRenderer.ts`
- `src/config/levels.ts`

## Fichiers à créer si utile
Créer uniquement si cela réduit la duplication ou formalise clairement le comportement :

- `src/ui/textFit.ts` ou équivalent : helper local pour réduire automatiquement une taille de police jusqu'à tenir dans une largeur max.
- `docs/mobile-ui-readability-audit.md` : court rapport d'audit des 8 univers après correction.

Ne pas créer de couche UI massive si quelques helpers ciblés suffisent.

## Fichiers / zones interdits
- Ne pas supprimer ou réduire le contenu des 8 univers, 16 niveaux, 8 boss ou WorldMap.
- Ne pas déplacer les mécaniques vers une refonte globale.
- Ne pas ajouter de dépendance.
- Ne pas afficher de planche design brute dans le gameplay.
- Ne pas mettre de décor détaillé derrière les cellules jouables.
- Ne pas masquer le problème de HUD en supprimant les infos utiles du gameplay.
- Ne pas corriger seulement Castle avec des constantes hardcodées si le défaut est commun.

## Patch demandé

### 1. Écran titre : empêcher le débordement
Dans `TitleScene.ts`, corriger la ligne meta actuellement trop longue.

Comportement attendu :
- Le texte doit tenir dans le cadre intérieur sur mobile étroit.
- Utiliser un `wordWrap` / `maxWidth` ou un helper de fit typographique.
- Si la ligne ne tient pas, préférer une version plus courte ou deux lignes propres :
  - Option recommandée : `8 MONDES · 16 NIVEAUX` puis `8 BOSS`
  - Option acceptable : `8 MONDES / 16 NIVEAUX / 8 BOSS`
- Ne pas réduire le titre `SNAKE` au point de perdre l'identité.

Critères :
- [ ] Aucun caractère n'est coupé à gauche/droite sur 360 px de large.
- [ ] Le texte reste centré dans le cadre.
- [ ] La ligne ne traverse pas les bordures latérales.

### 2. Écran intro niveau : améliorer les textes français
Dans `levels.ts` et/ou l'affichage `LevelIntroScene.ts`, reformuler les textes mécaniques. Les textes doivent être courts, naturels et utiles.

Pour Castle, remplacer l'intention actuelle par quelque chose du type :
- Titre règle court : `MURS FANTÔMES`
- Sous-texte / hint : `Ils apparaissent par pulsations. Avance quand la voie est libre.`
- Objectif : `OBJECTIF : 10` ou `OBJECTIF : 10 GEMMES` selon le vocabulaire du jeu.

Règle de style pour tous les univers :
- Pas de traduction littérale maladroite.
- Pas de phrase longue dans le badge central.
- Le badge règle = 2 à 4 mots maximum.
- Le hint = une phrase simple, actionnable.

Critères :
- [ ] Castle ne montre plus `MURS CLIGNOTANTS = DANGER` sur l'intro.
- [ ] Aucun texte d'intro ne déborde sur 360 px.
- [ ] Les 16 niveaux ont des `ruleText` et `introHint` relus.
- [ ] Le vocabulaire reste cohérent avec l'univers.

### 3. Gameplay : réduire le HUD à une ligne
Dans `HUDRenderer.ts` et son appel depuis `GameScene.ts`, réduire le HUD gameplay.

Comportement attendu :
- Hauteur HUD cible : environ 28 à 34 px, pas 52 px.
- Une seule ligne :
  - gauche : univers court (`CASTLE`, `SONIC`, etc.) ;
  - centre : état mécanique compact OU objectif, mais pas les deux si redondants ;
  - droite : progression (`0/10`, `PV 2/3`, etc.).
- Supprimer la seconde ligne `extraTxt` ou l'intégrer dans la ligne centrale avec priorité.
- Dédupliquer : si `rule` et `extra` portent la même idée, n'afficher qu'une version compacte.

Exemple Castle :
- `CASTLE | MURS FANTÔMES | 0/10`
- ou `CASTLE | DANGER: PULSE | 0/10` si le jeu garde un état dynamique.

Critères :
- [ ] Le HUD n'affiche jamais deux fois la même information mécanique.
- [ ] Le HUD tient en une ligne à 360 px.
- [ ] La hauteur libérée augmente la zone disponible pour la grille.
- [ ] Les infos score / quota / PV restent visibles.

### 4. Gameplay : agrandir et clarifier le pickup principal
Dans `PickupRenderer.ts`, augmenter la lisibilité du pickup.

Comportement attendu :
- Le pickup principal doit être visuellement prioritaire sur obstacles et décor.
- Taille cible : environ `0.85` à `1.05` cellule selon asset, jamais minuscule.
- Ajouter un halo / pulse discret si l'asset est sombre ou petit.
- Conserver un fallback procédural lisible si aucun asset n'est disponible.
- Ne pas rendre le pickup si gros qu'il ressemble à un obstacle ou masque le snake.

Critères :
- [ ] Sur Castle, le collectible est identifiable immédiatement.
- [ ] Le pickup est plus visible que les obstacles.
- [ ] Le rendu reste lisible sur fond grille sombre.
- [ ] Les autres univers gardent une lisibilité équivalente.

### 5. Gameplay : obstacles clignotants avec asset obstacle de l'univers
Dans `ObstacleRenderer.ts` et la mécanique Castle si nécessaire, rendre les murs / obstacles clignotants avec une signature claire.

Comportement attendu :
- Si `assets/universes/[univers]/obstacle_01.png` ou runtime obstacle existe, l'utiliser pour les obstacles dangereux visibles.
- Pour Castle, les murs clignotants doivent être identifiables comme obstacles d'univers, pas seulement comme rectangles abstraits.
- Ajouter une télégraphie : alpha pulsé, contour, signe de danger ou couleur accent, mais sans bruit visuel excessif.
- Quand l'obstacle est en phase inactive / illusion, il doit être moins opaque mais encore compréhensible si le design du niveau l'exige.
- Fallback procédural : carré/tuile avec contour + pulsation, jamais invisible.

Critères :
- [ ] Castle utilise l'asset obstacle si disponible.
- [ ] Les obstacles clignotants ont une identité visuelle distincte du pickup.
- [ ] La phase dangereuse est compréhensible sans lire le HUD.
- [ ] Pas de décor détaillé derrière les cellules.

### 6. Gameplay : étirer intelligemment la zone de jeu
Dans `GameScene.ts` / `GridRenderer.ts`, revoir le calcul de layout.

Constat fragile : la grille ne doit pas seulement être « plus grande ». Si elle devient trop grande sans respecter le HUD, les barres navigateur mobile, les cadres et le snake, on perdra la lisibilité. Le bon objectif est : maximiser la cellule jouable dans l'espace réellement disponible.

Comportement attendu :
- Calculer la taille de cellule à partir de l'espace disponible après HUD compact et marge basse.
- Exploiter davantage la largeur viewport : éviter les ratios fixes trop conservateurs type `0.68` si le cadre permet mieux.
- Garder un minimum de marge pour le cadre d'univers.
- Le cadre doit accompagner la grille, pas manger la majorité de l'écran.
- La grille reste prioritaire : elle doit être lisible avant le décor du cadre.

Critères :
- [ ] Sur Castle, la zone jouable paraît nettement plus grande que dans la capture actuelle.
- [ ] Aucun élément HUD ne chevauche la grille.
- [ ] Le cadre reste visible, mais ne domine pas la grille.
- [ ] Testé sur 360x740, 393x851, 430x932.

### 7. Audit cross-univers
Après correction Castle, auditer les autres univers :

- `sonic`
- `streets`
- `fighter`
- `outrun`
- `shinobi`
- `kombat`
- `paperboy`

Pour chaque univers, vérifier :
- HUD une ligne.
- Textes intro naturels et courts.
- Pickup visible.
- Obstacle / danger identifiable.
- Grille prioritaire sur décor.
- Aucun débordement texte.

Créer `docs/mobile-ui-readability-audit.md` si l'audit révèle des ajustements ou exceptions.

## Contraintes
- TypeScript strict.
- Pas de dépendance.
- Patch ciblé, pas refonte générale.
- Préserver les assets existants et fallbacks procéduraux.
- Ne pas lancer de serveur si ce n'est pas nécessaire.
- Exécuter `npm run check` après modification.

## Hors scope
- Refaire la direction artistique complète.
- Changer les règles de gameplay Castle.
- Modifier la progression, sauvegarde, world map ou boss design.
- Ajouter de nouveaux assets générés.
- Recalibrer tous les niveaux de difficulté.
- Changer l'orientation cible mobile portrait.

## Tests obligatoires

### Commandes
```bash
npm run check
```

### Tests manuels viewport
Tester au minimum :
- 360 x 740 portrait
- 393 x 851 portrait
- 430 x 932 portrait

### Parcours manuel
1. Ouvrir l'écran titre.
2. Vérifier la ligne `8 MONDES / 16 NIVEAUX / 8 BOSS` ou équivalent.
3. Aller à Castle.
4. Ouvrir l'intro niveau Castle.
5. Vérifier formulation, non-débordement, bouton `JOUER`, bouton `CARTE`.
6. Lancer Castle.
7. Vérifier HUD une ligne, absence de doublon.
8. Vérifier taille pickup.
9. Vérifier murs/obstacles clignotants et asset obstacle.
10. Refaire un passage rapide sur chaque univers.

## Critères d'acceptation finaux
- [ ] `npm run check` passe.
- [ ] Titre mobile sans débordement.
- [ ] Intro Castle reformulée et lisible.
- [ ] HUD gameplay compact en une ligne.
- [ ] Plus aucune duplication de règle dans HUD Castle.
- [ ] Pickup Castle nettement plus visible.
- [ ] Obstacles Castle utilisant asset obstacle ou fallback procédural distinct.
- [ ] Grille / zone utile agrandie sans nuire à la lisibilité.
- [ ] Audit des 8 univers documenté ou résumé dans le compte rendu.
- [ ] Aucun univers, niveau, boss ou WorldMap supprimé.

## Compte rendu attendu après exécution
Le compte rendu doit lister :
- fichiers modifiés ;
- logique de déduplication HUD ;
- choix de textes Castle ;
- stratégie asset obstacle / fallback ;
- résultat `npm run check` ;
- univers audités et anomalies restantes éventuelles.
