# Screen + Score Pre-Release Audit

## Résumé
**Verdict global : PASS avec réserve**

Le jeu est navigable de bout en bout. Tous les boutons fonctionnent. Le score est correctement séparé de la progression HP. Le best score persiste via localStorage. Un problème P1 (mention "PROTOTYPE BUILD") et six P2 (typographie, breakdown score incomplet, UX tap) doivent être traités avant release.

---

## Écrans

| Écran | Résultat | Problèmes | Priorité |
|---|---|---|---|
| TitleScene | PASS avec réserve | "PROTOTYPE BUILD" visible en footer | P1 |
| WorldMapScene | PASS | Navigation tap/retap fonctionnelle, pas de bouton JOUER | — |
| LevelIntroScene (System) | PASS avec réserve | Tap-anywhere peut démarrer par accident ; BEST `—` peut sembler cassé | P2 |
| GameScene HUD | PASS | 4 capsules bien séparées (univers / règle / progression / score) | — |
| ClearScene | PASS avec réserve | "NIVEAU REUSSI" sans accent ; bonuses STAGE_CLEAR+500 et BOSS_CLEAR+1000 invisibles | P2 |
| Boss ClearScene | PASS avec réserve | Titre "BOSS VAINCU" + badge "BOSS VAINCU !" doublé (non-Castle) | P2 |
| GameOverScene | PASS avec réserve | Cause text "ENCORE UNE FOIS" générique tous univers | P2 |

---

## Score

| Fonction | Résultat | Problèmes | Priorité |
|---|---|---|---|
| BEST avant niveau (LevelIntro) | ✓ PASS | Affichage `BEST  —` si 0 (tiret double espace) | P2 |
| Capsule score in-game (HUD) | ✓ PASS | Séparée de HP/progression, mise à jour en temps réel | — |
| Score séparé de HP/progression | ✓ PASS | Capsule droite = score runtime ; capsule milieu-droite = HP ou quota | — |
| Popup +100 pickup | ✓ PASS | Spawn et animation floating up | — |
| Popup +250 boss hit | ✓ PASS | Spawn et animation floating up | — |
| Breakdown PICKUPS (ClearScene) | ✓ PASS | Affiché si pickupCount > 0 | — |
| Breakdown STAGE_CLEAR +500 | ✗ ABSENT | Bonus +500 ajouté silencieusement, non visible | P2 |
| Breakdown BOSS_CLEAR +1000 | ✗ ABSENT | Bonus +1000 ajouté silencieusement, non visible | P2 |
| Time Bonus | ✓ PASS | Affiché si > 0 (formule 120s max) | — |
| BEST in ClearScene | ✓ PASS | Affiché avec couleur accentuée ; "NOUVEAU RECORD" si dépassement | — |
| TOTAL + BEST in GameOverScene | ✓ PASS | Deux lignes dans panneau score | — |
| Reset score au replay | ✓ PASS | `runtimeScore = 0` dans `GameScene.create()` | — |
| Persistance best score | ✓ PASS | localStorage séparé (`snakeDriveV4.bestScores`) | — |

---

## Boutons

| Bouton | Écran | Résultat | Notes |
|---|---|---|---|
| APPUYER POUR JOUER (CTA) | TitleScene | ✓ | Pointer + clavier (keydown) |
| JOUER | LevelIntroScene | ✓ | Fade → GameScene |
| CARTE | LevelIntroScene | ✓ | Retour WorldMap avec `levelId` |
| Tap anywhere | LevelIntroScene | ⚠ | Déclenche startLevel si aucun GO reçu ; risque accidentel |
| CONTINUER | ClearScene | ✓ | → LevelIntro du niveau suivant |
| REJOUER | ClearScene | ✓ | → GameScene même niveau |
| CARTE | ClearScene | ✓ | Retour WorldMap avec `levelId` |
| REJOUER | GameOverScene | ✓ | → GameScene même niveau |
| CARTE | GameOverScene | ✓ | Retour WorldMap avec `levelId` |

---

## Problèmes à corriger

| ID | Problème | Impact | Priorité | Patch recommandé |
|---|---|---|---|---|
| SCR-01 | "PROTOTYPE BUILD" footer visible dans TitleScene | Texte non-release visible par utilisateurs | **P1** | Supprimer ou remplacer par version/date |
| SCR-02 | "NIVEAU REUSSI" sans accent (ClearScene titre) | Faute typographique visible | P2 | Corriger en "NIVEAU RÉUSSI" |
| SCR-03 | STAGE_CLEAR +500 invisible dans breakdown ClearScene | Joueur ne comprend pas d'où vient le total | P2 | Ajouter ligne `STAGE +500` dans le panneau score |
| SCR-04 | BOSS_CLEAR +1000 invisible dans breakdown ClearScene | Idem boss clear | P2 | Ajouter ligne `BOSS VAINCU +1000` dans le panneau score |
| SCR-05 | Cause text "ENCORE UNE FOIS" générique pour tous univers non-Castle (GameOver) | Manque personnalité, même texte × 7 univers | P2 | Adapter par univers ou supprimer la ligne |
| SCR-06 | LevelIntroScene tap-anywhere démarre le niveau | Peut lancer accidentellement sur mobile | P2 | Restreindre ou ajouter 300ms debounce |
| SCR-07 | Boss ClearScene non-Castle : titre "BOSS VAINCU" + badge "BOSS VAINCU !" (doublon) | Redondance visuelle | P2 | Supprimer badge quand titre = BOSS VAINCU pour non-Castle |

---

## Détail technique

### Structure du score runtime
```
runtimeScore = 0                          // reset GameScene.create()
runtimeScore += SCORE_VALUES.PICKUP       // +100 par pickup
runtimeScore += SCORE_VALUES.BOSS_HIT     // +250 par hit boss
runtimeScore += SCORE_VALUES.STAGE_CLEAR  // +500 sur triggerClear normal
runtimeScore += SCORE_VALUES.BOSS_CLEAR   // +1000 sur triggerClear boss
runtimeScore += timeBonus                 // +10 × secondes restantes (hors boss)
```

### HUD 4-capsules
```
| [UNIVERS] | [RÈGLE / ÉTAT] | [X/10 ou HP ♥♥♡] | [SCORE] |
  20% W       ~35% W           18.5% W               21.5% W
```
- Capsule SCORE est bien distincte de la capsule HP/progression ✓
- Font ARCADE_FONT (pixel) pour univers, UI_FONT (sans-serif) pour règle/score ✓

### Persistance best score
- Stocké dans `snakeDriveV4.bestScores` (clé localStorage séparée)
- Mis à jour dans `triggerClear()` et `triggerGameOver()`
- Relu au démarrage de LevelIntroScene via `SaveSystem.getBestScore(levelId)`
