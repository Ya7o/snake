# In-Game Score HUD

## Objectif

Afficher le score (`runtimeScore`) pendant le gameplay dans la capsule HUD droite, sans masquer la progression vers le quota ni casser les capsules existantes.

## Changement

| Fichier | Changement | Raison |
|---|---|---|
| `src/render/HUDRenderer.ts` | Ajout param `runtimeScore = 0` à `update()`, construction du format combiné `X/10·1200`, stockage `rightCapsuleW`, fall-back si débordement | Exposer runtimeScore sans casser le layout |
| `src/scenes/GameScene.ts` | Passage de `this.runtimeScore` comme 7ème argument à `hudRenderer.update()` | Source de la donnée |

## Règle HUD

### Normal level
- Capsule droite affiche : `X/10·1200` (progressStr + `·` + runtimeScore)
- Si `runtimeScore === 0` (début de partie) : affiche uniquement `X/10` — pas de `·0` superflu
- Fall-back si `scoreTxt.width > rightCapsuleW - 8` : revient à `X/10` seul

### Boss level
- Capsule droite affiche : `HP X/3·500` (HP + runtimeScore boss hits accumulés)
- BOSS_CLEAR (+1000) n'est ajouté qu'à `triggerClear()` — non visible in-game (s'affiche à l'écran résultat)
- Fall-back identique si débordement

### Castle normal
- Format : `MAGIC X/10·1200` ou `MAGIC X/10` si trop long

### Format compact mobile
- Séparateur `·` (point médian U+00B7, compact et lisible)
- Fonte `MOBILE_UI.LABEL_MIN = 12px`, déjà conforme mobile
- Fall-back automatique → pas de régression sur petits écrans

## Vérifications

- **Score initial** : `runtimeScore = 0` au démarrage → capsule affiche `X/10` (pas de `·0`)
- **Score après pickup** : `runtimeScore += 100` à chaque `ate=true` → capsule mise à jour au prochain tick
- **Score boss** : `runtimeScore += 250` à chaque `resolveBossWeakPoint()` → capsule met à jour `HP X/3·250`
- **Replay** : `this.runtimeScore = 0` dans `GameScene.create()` → reset garanti au replay
- **Best score** : non modifié pendant gameplay — `recordBestScore()` n'est appelé qu'à `triggerGameOver()` et `triggerClear()`

## Non-régression

- **Gameplay** : aucune modification des mécaniques, barème, quota, clear condition
- **HUD capsules** : capsule droite agrandie dynamiquement si place, fall-back sinon — pas de layout cassé
- **ClearScene/GameOverScene** : aucun changement — reçoivent toujours `runtimeScore` via scène data
- **Mobile** : fall-back automatique si texte trop large — priorité donnée à la progression `X/10`

## Limites

- Pas de popups de score (prévu PATCH 1102)
- Pas de breakdown sur écrans résultat (prévu PATCH 1103)
- BOSS_CLEAR +1000 invisible in-game (normal — ajouté seulement à triggerClear)
- Risque surcharge HUD à valider sur mobile réel (fall-back prévu)
