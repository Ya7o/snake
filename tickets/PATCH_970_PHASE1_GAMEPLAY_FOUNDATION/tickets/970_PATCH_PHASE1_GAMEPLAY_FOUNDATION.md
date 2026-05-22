# 970_PATCH_PHASE1_GAMEPLAY_FOUNDATION

## Statut

Patch de cadrage + implémentation Phase 1.

Ce patch est destiné à Claude Code / Codex pour transformer Snake Drive V4 en base de jeu réellement productionnable, sans usine à gaz.

---

## Contexte

Le projet possède déjà :

- 8 univers ;
- 16 niveaux ;
- 8 boss ;
- une World Map ;
- des scènes Phaser séparées ;
- des mécaniques par univers ;
- un système d’assets et de frames par univers.

Le problème actuel n’est pas le manque de contenu visuel. Le problème est le manque de verrouillage gameplay : boucle de jeu, règles communes, progression, boss framework, lisibilité, tests et critères de production.

Ce patch ne doit pas réinventer le jeu. Il doit stabiliser la Phase 1.

---

## Objectif principal

Verrouiller la colonne vertébrale gameplay de Snake Drive V4 :

```txt
START → WORLD MAP → LEVEL INTRO → GAMEPLAY → CLEAR / GAME OVER → WORLD MAP
```

avec :

- une boucle de jeu commune ;
- des objectifs lisibles ;
- une progression stable ;
- des mécaniques d’univers limitées à 1 gimmick fort ;
- des boss simples de type puzzle arcade ;
- des contrôles mobile fiables ;
- des critères de test clairs.

---

## Principe de scope

Le projet reste amateur. Il faut viser :

```txt
simple, jouable, clair, testable
```

Pas :

```txt
système RPG, roguelike, économie complexe, menus multiples, usine à gaz
```

---

## Scope fonctionnel retenu

### Structure finale Phase 1

Conserver le scope actuel :

```txt
8 univers
16 niveaux total
8 boss inclus dans les 16 niveaux
```

Donc :

```txt
1 niveau normal + 1 boss par univers
```

Ne pas étendre à 24 niveaux maintenant.

---

## Boucle de niveau normale

Un niveau normal doit suivre cette règle :

1. le joueur démarre avec un Snake court ;
2. il collecte les pickups de l’univers ;
3. chaque pickup valide augmente le score ;
4. le gimmick de l’univers ajoute un danger lisible ;
5. le niveau est clear quand le quota est atteint ;
6. mort si collision corps / mur / danger actif ;
7. clear débloque le node suivant sur la World Map.

---

## Boucle boss

Un boss ne doit PAS devenir un combat complexe.

Un boss Phase 1 doit être un puzzle arcade :

1. le boss expose une fenêtre de vulnérabilité ;
2. le joueur collecte/touche la bonne cible ;
3. le boss perd 1 PV ;
4. à 0 PV, clear ;
5. les dangers doivent être télégraphiés avant d’être létaux.

Boss recommandé : 3 PV maximum.

---

## Directives par univers

Chaque univers doit avoir 1 gimmick principal. Pas plus.

| Univers | Gimmick Phase 1 | Risque à éviter |
|---|---|---|
| castle | murs illusions / dangers pulsés | morts invisibles |
| sonic | chaînes de rings / rythme rapide | vitesse incontrôlable |
| streets | foule / blockers mobiles | chaos illisible |
| fighter | charge / timing d’impact | faux jeu de combat complexe |
| outrun | lanes / trafic / checkpoints | scrolling trop ambitieux |
| shinobi | vraie cible / leurres | punition injuste |
| kombat | zones télégraphiées / portail | surcharge rouge + morts instantanées |
| paperboy | livraisons / obstacles suburbains | scène trop narrative, gameplay flou |

---

## Fichiers probables à modifier

Inspecter avant modification :

```txt
src/config/types.ts
src/config/levels.ts
src/config/universes.ts
src/config/mapNodes.ts
src/scenes/GameScene.ts
src/scenes/LevelIntroScene.ts
src/scenes/ClearScene.ts
src/scenes/GameOverScene.ts
src/scenes/WorldMapScene.ts
src/mechanics/BaseMechanic.ts
src/mechanics/MechanicFactory.ts
src/mechanics/*.ts
src/mechanics/bosses/*.ts
src/systems/InputSystem.ts
src/systems/SaveSystem.ts
src/render/HUDRenderer.ts
src/qa/QAChecks.ts
```

---

## Fichiers à créer si utile

Créer uniquement si cela simplifie réellement :

```txt
docs/970_PHASE1_GAMEPLAY_DIRECTIVES.md
docs/970_PHASE1_TEST_PLAN.md
src/config/gameplayRules.ts
src/qa/GameplayQAChecks.ts
```

Ne pas créer de gros framework.

---

## Fichiers interdits / zones interdites

Ne pas :

- supprimer les 8 univers ;
- supprimer la World Map ;
- supprimer les mécaniques existantes ;
- remplacer Phaser ;
- ajouter une dépendance ;
- intégrer un nouveau moteur d’état ;
- refondre tout le rendu ;
- ajouter un système d’économie ;
- ajouter du online ;
- modifier massivement les assets ;
- introduire des textes ou boutons baked dans les backgrounds.

---

## Implémentation attendue

### 1. Stabiliser GameScene

Créer ou vérifier une méthode centralisée du type :

```ts
applyMechanicUpdate(update: MechanicUpdate): void
```

Elle doit gérer proprement :

- `hitDanger` ;
- `score` ;
- `addPickup` ;
- `removePickup` ;
- `addWall` ;
- `removeWall` ;
- garde-fous anti doublons ;
- aucune mutation incohérente entre `ctx.pickups`, `this.pickups`, `ctx.walls`, `this.walls`.

Aujourd’hui, `MechanicUpdate` expose ces champs mais `GameScene` ne les applique pas tous explicitement. Soit on les applique, soit on réduit l’interface. Pour Phase 1, la solution recommandée est de les appliquer proprement.

---

### 2. Stabiliser BaseMechanic

Vérifier que chaque mechanic respecte :

- `onInit()` initialise son état ;
- `tick()` ne tue jamais sans télégraphie sauf collision Snake classique ;
- `onPickupCollected()` ne modifie pas le score de façon ambiguë ;
- `getExtraEntities()` retourne des entités lisibles ;
- `getHudExtra()` reste court.

---

### 3. Normaliser la difficulté

Créer ou documenter une matrice simple :

| Type | Speed cible | Quota/PV | Durée cible |
|---|---:|---:|---:|
| normal facile | 160–175ms | 8–10 | 2–3 min |
| normal rapide | 130–150ms | 10–15 | 2–3 min |
| boss | 150–180ms | 3 PV | 2–4 min |

Ne pas rendre tous les niveaux difficiles. Le premier monde doit être pédagogique.

---

### 4. Renforcer LevelIntro

Chaque intro doit afficher clairement :

- nom du monde / niveau ;
- règle en 3 mots max ;
- objectif ;
- hint court ;
- bouton jouer ;
- bouton carte.

Critique : aucun joueur ne doit mourir sans avoir compris la règle.

---

### 5. Renforcer HUD

Le HUD doit afficher uniquement :

- univers court ;
- règle courte ;
- score/quota ou PV boss ;
- extra mechanic très court.

Pas de surcharge.

---

### 6. Contrôles mobile

Vérifier `InputSystem` :

- swipes fiables ;
- pas de reverse instantané interdit ;
- clavier conservé pour debug ;
- pas d’écouteurs accumulés après retry ;
- zone tactile compatible portrait mobile.

---

### 7. Progression / Save

Vérifier `SaveSystem.markCleared()` :

- clear d’un niveau débloque uniquement le node suivant ;
- boss clear débloque l’univers suivant ;
- retry ne corrompt pas la progression ;
- reset local possible si déjà présent, sinon ne pas ajouter d’UI complexe.

---

### 8. Debug gameplay léger

Ajouter si utile un paramètre :

```txt
?debugGameplay=1
```

Affichage minimal :

- levelId ;
- mechanic ;
- score/quota ou boss HP ;
- pickups count ;
- walls/extra entities count ;
- speedMs ;
- tickCount.

Pas de panneau lourd.

---

## Critères d’acceptation cochables

### Build

- [ ] `npm install` fonctionne si nécessaire.
- [ ] `npm run check` passe.
- [ ] Aucun nouveau warning TypeScript critique.
- [ ] Aucune dépendance ajoutée.

### Flow

- [ ] TitleScene lance correctement la World Map ou le premier niveau selon le flow existant.
- [ ] WorldMap affiche les nodes.
- [ ] LevelIntro affiche règle + objectif + hint.
- [ ] Jouer lance le bon niveau.
- [ ] Clear unlock le node suivant.
- [ ] GameOver permet retry ou retour map.

### Gameplay normal

- [ ] Chaque niveau normal peut être clear.
- [ ] Chaque niveau normal peut être perdu.
- [ ] Les pickups restent visibles.
- [ ] Le quota est compréhensible.
- [ ] Les dangers actifs sont lisibles.
- [ ] Aucun danger spécial ne tue sans télégraphie.

### Boss

- [ ] Chaque boss a 3 PV ou une valeur explicitement documentée.
- [ ] Chaque boss peut être battu.
- [ ] Chaque boss peut tuer le joueur.
- [ ] Les fenêtres de vulnérabilité sont lisibles.
- [ ] Les patterns restent simples.

### Mobile

- [ ] Test manuel en portrait autour de 390x844 CSS pixels.
- [ ] Test manuel en portrait autour de 430x932 CSS pixels.
- [ ] Les contrôles swipe sont fiables.
- [ ] Les textes principaux sont lisibles.
- [ ] Le HUD ne masque pas la grille.

### Scope

- [ ] Le patch ne crée pas de nouveau monde.
- [ ] Le patch ne crée pas de système complexe.
- [ ] Le patch ne change pas le positionnement artistique.
- [ ] Le patch ne remplace pas tous les backgrounds.

---

## Tests demandés

Exécuter :

```bash
npm run check
```

Puis test manuel :

```bash
npm run dev -- --host 0.0.0.0
```

Tester au minimum :

```txt
castle_normal
castle_boss
sonic_normal
outrun_normal
shinobi_normal
kombat_boss
paperboy_boss
```

Si le lancement direct par levelId n’existe pas, ne pas construire une grosse UI de debug. Utiliser le flow actuel World Map.

---

## Sortie attendue de Claude Code / Codex

Répondre avec :

1. résumé des fichiers modifiés ;
2. décisions prises ;
3. éléments non changés volontairement ;
4. résultat de `npm run check` ;
5. limites restantes ;
6. prochaines étapes recommandées.

---

## Hors scope explicite

Ne pas traiter maintenant :

- nouveaux backgrounds ;
- refonte TitleScreen ;
- refonte complète World Map ;
- audio complet ;
- monétisation ;
- achievements ;
- skin shop ;
- analytics ;
- multilingue ;
- packaging store ;
- équilibrage final parfait.

---

## Note de direction

L’objectif n’est pas de rendre le jeu final.

L’objectif est de rendre le jeu :

```txt
jouable de bout en bout,
compréhensible,
stable,
facile à continuer.
```
