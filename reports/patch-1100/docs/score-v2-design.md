# Score V2 Design

## Problème

Le score (`runtimeScore`) est calculé pendant tout le gameplay mais reste invisible jusqu'à l'écran Clear/GameOver. Le joueur ne voit jamais évoluer son score en temps réel, ce qui rend les pickups peu gratifiants et le bonus temps incompréhensible. Le HUD affiche uniquement la progression vers le quota (`X/10`), pas le score lui-même.

---

## Score actuel

Deux variables coexistent dans `GameScene` :

| Variable | Rôle | Affiché HUD | Affiché fin |
|---|---|---|---|
| `this.score` | Progression gameplay (quota/clear) | Oui (`X/10`) | Non |
| `this.runtimeScore` | Score d'affichage / leaderboard | Non | Oui (Clear + GameOver) |

### Événements scorés actuels

| Événement | `runtimeScore` | `this.score` | Fichier | Ligne |
|---|---:|---:|---|---|
| Pickup collecté (standard) | +100 | +1 | GameScene.ts | 497 |
| Pickup Fighter (charge move) | +100 | +2 | FighterChargeMechanic.ts | 59 |
| Pickup Paperboy (ramassage journal) | +100 | +0 | PaperboyDeliveryMechanic.ts | 63 |
| Livraison Paperboy (dépôt) | +100 | +1 | PaperboyDeliveryMechanic.ts | 59 |
| Boss — weak point touché | +250 | 0 | GameScene.ts | 628 |
| Stage clear (niveau normal) | +500 | 0 | GameScene.ts | 690 |
| Boss clear | +1000 | 0 | GameScene.ts | 690 |
| Bonus temps (niveaux normaux seult.) | +10×s_restantes | 0 | GameScene.ts | 692 |

### Best score

Stocké en localStorage sous la clé `snakeDriveV4.bestScores`, format `Record<levelId, number>`. Mis à jour à `triggerGameOver()` et `triggerClear()`. Structure indépendante du save progress.

### Reset

`this.score = 0` et `this.runtimeScore = 0` dans `GameScene.create()`. Le replay relance la scène → reset automatique des deux variables.

### Affichage Clear/GameOver

`ClearScene` reçoit : `score`, `bestScore`, `previousBest`, `isNewRecord`, `timeBonus`. `GameOverScene` reçoit : `score`, `bestScore`. Tout est déjà branché — seul le score in-game manque.

---

## Décisions Score V2

- **Score visible in-game** : `runtimeScore` affiché dans le HUD pendant le gameplay (PATCH 1101).
- **Popups de score** : feedback immédiat `+100`, `+250` etc. au moment de l'événement (PATCH 1102 — non implémenté maintenant).
- **Breakdown Clear/GameOver** : décomposition pickups / boss / temps (PATCH 1103 — non implémenté maintenant).
- **Bonus temps** : basé sur le temps restant (`120s - elapsed`), jamais sur le temps écoulé. Formule actuelle conservée : `floor(remainingMs/1000) × 10`. Correct.
- **Pas de blocage progression** : le score n'influence jamais le déblocage de niveaux. La progression reste sur `this.score vs quota`.
- **Barème V2** : les valeurs `SCORE_VALUES` actuelles sont conservées telles quelles pour 1101. Pas de modification du barème dans ce cycle.

---

## HUD in-game

### Contexte HUD actuel

Trois capsules horizontales :
- **Gauche** (`leftW ≈ 96px`) : nom univers court, ARCADE_FONT.
- **Centre** (`cW` restant) : texte règle mécanique (`ruleText`), UI_FONT 700.
- **Droite** (`rightW ≈ 100px`) : progression ou HP, UI_FONT 700.

La capsule droite affiche actuellement :
- Niveau normal : `X/10` (this.score / quota)
- Niveau boss : `HP X/3` (boss.getHp / maxHp)
- Niveau Castle normal : `MAGIC X/10`

### Règle HUD Score V2

**Niveau normal** — capsule droite : format combiné `X/10 · 1200`
- `X/10` reste indispensable : c'est la condition de clear, le joueur doit la voir.
- `· 1200` ajoute le runtimeScore à droite, séparateur `·`.
- Si la capsule déborde (score > 9999 + quota > 9), fall-back sur `X/10` seul (pas de régression).
- Implémentation : passer `runtimeScore` au HUDRenderer et construire la chaîne combinée.

**Niveau boss** — capsule droite : format combiné `HP X/3 · 500`
- `HP X/3` reste pour l'information combat.
- `· 500` affiche les points accumulés (boss hits).
- Fall-back sur `HP X/3` si débordement.

**Castle normal** — capsule droite : `MAGIC X/10 · 1200` ou `MAGIC X/10` si trop long.

**Format compact mobile** :
- `X/10·1200` (sans espaces) si la capsule est petite (viewport < 360px).
- Taille de fonte : déjà `MOBILE_UI.LABEL_MIN`, ne pas descendre sous `MOBILE_UI.CAPTION_MIN`.

**Règle anti-surcharge** :
- Ne jamais tronquer la partie progress/HP.
- Tronquer ou supprimer la partie score si débordement détecté.
- Le score in-game est informatif ; la progression vers le quota reste prioritaire.

**Boss uniquement** :
- `runtimeScore` n'inclut ici que les `BOSS_HIT × 250` accumulés — c'est lisible et motivant.
- `BOSS_CLEAR +1000` est ajouté seulement au moment du clear, donc ne s'affiche pas in-game.

---

## Barème V2 recommandé

Barème actuel conservé pour 1101 (pas de modification des constantes) :

| Action | Points | Statut |
|---|---:|---|
| Pickup collecté | +100 | Actif — conservé |
| Boss weak point hit | +250 | Actif — conservé |
| Stage clear (bonus à la fin) | +500 | Actif — conservé |
| Boss clear (bonus à la fin) | +1000 | Actif — conservé |
| Bonus temps restant (normal) | +10 × s | Actif — conservé |
| Livraison Paperboy | +100 | Actif via pickup sur cellule dépôt |
| Objectif complet (quota plein) | via +500 STAGE_CLEAR | Actif — inclus dans clear |
| Malus mort | 0 | Aucun malus — décision maintenue |

---

## Breakdown futur (PATCH 1103)

Catégories prévues pour ClearScene / GameOverScene :

| Catégorie | Source | Exemple |
|---|---|---|
| Pickups | runtimeScore cumulé au fil des ate=true | `× 10 pickups = 1000` |
| Clear bonus | STAGE_CLEAR ou BOSS_CLEAR | `+500` ou `+1000` |
| Boss hits | cumul BOSS_HIT | `× 3 hits = 750` |
| Livraisons Paperboy | subset pickups (delivery cell) | `× 5 = 500` |
| Bonus temps | timeBonus calculé à triggerClear | `+420 (42s × 10)` |
| Objectif complet | inclus dans clear | — |

Pour implémenter le breakdown, il faudra catégoriser les événements (ajouter des compteurs intermédiaires) — prévu PATCH 1103, pas maintenant.

---

## Plan d'implémentation

### 1101 — In-Game Score HUD
- Exposer `runtimeScore` au `HUDRenderer.update()` (nouvel argument `runtimeScore`).
- Modifier `HUDRenderer.update()` pour construire la chaîne combinée `X/10 · runtimeScore`.
- Couvrir normal level, boss level, Castle.
- Fall-back si débordement.
- Vérifier replay reset à 0.

### 1102 — Score Popups
- Afficher un texte flottant `+100`, `+250`, `+1000` au moment de l'événement.
- Position : au-dessus de la cellule collectée / boss weak point.
- Animation montée + fade, durée courte.
- Ne pas gêner la grille ni les capsules.
- Implémenté dans GameScene via un système de particules-texte léger.

### 1103 — Score Breakdown Clear/GameOver
- Ajouter compteurs par catégorie dans GameScene (pickups, boss_hits, deliveries).
- Passer ces compteurs dans les données de scène Clear/GameOver.
- Afficher un tableau de breakdown dans les deux scènes résultat.
- Ne pas modifier la structure SaveSystem pour ce cycle.

---

## Risques

| Risque | Niveau | Mitigation |
|---|---|---|
| Surcharge capsule droite sur petit écran | Moyen | Fall-back `X/10` si débordement |
| Popups masquant la grille | Moyen | Pas dans 1101 — prévu 1102 avec règle de positionnement |
| Score farming (niveaux répétés) | Faible | Best score par niveau, pas de classement global |
| Bonus temps mal compris | Faible | Affiché séparément dans ClearScene déjà |
| Écrans Clear/GameOver fragiles | Faible | 1101 ne touche pas ClearScene ni GameOverScene |
| runtimeScore boss faible (pas de BOSS_CLEAR in-game) | Info | Normal — BOSS_CLEAR ajouté à triggerClear(), visible à l'écran résultat |
