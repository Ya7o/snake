# Score Breakdown Clear/GameOver

## Objectif

Rendre le score final compréhensible sur les écrans de fin en ajoutant une ligne de décomposition compacte montrant d'où viennent les points principaux.

## Changement

| Fichier | Changement | Raison |
|---|---|---|
| `src/scenes/GameScene.ts` | Ajout `pickupCount` et `bossHitCount` (champs + reset + incréments) | Source des données breakdown |
| `src/scenes/GameScene.ts` | Transmission `pickupCount`/`bossHitCount` dans sceneData Clear et GameOver | Passage des données |
| `src/scenes/ClearScene.ts` | Import `SCORE_VALUES`, ajout `pickupCount`/`bossHitCount` dans `ClearData`, ligne breakdown + renommage `SCORE` → `TOTAL` | Affichage breakdown Clear |
| `src/scenes/GameOverScene.ts` | Ajout champs dans `GameOverData`, renommage `SCORE` → `TOTAL` | Cohérence terminologie |

## Catégories

| Catégorie | Source | Affichée |
|---|---|---|
| PICKUPS | `pickupCount × 100` | Oui — niveau normal, format `PICKUPS +1000` |
| BOSS | `bossHitCount × 250` | Oui — niveau boss, format `BOSS +750` |
| TOTAL | `runtimeScore` (déjà calculé) | Oui — `TOTAL : X` (remplace `SCORE : X`) |
| TEMPS | `timeBonus` (déjà passé) | Oui — `+420 TEMPS` (existant) |
| BEST | `SaveSystem.getBestScore()` | Oui — `BEST : X` (existant) |
| CLEAR bonus (+500/+1000) | Inclus dans TOTAL | Non isolé — visible dans la différence PICKUPS→TOTAL |
| NOUVEAU RECORD | `isNewRecord` | Oui (existant) |

## Layout Clear

**Niveau normal (ex : 10 pickups, 42s temps restant, nouveau record) :**
```
PICKUPS +1000      ← nouvelle ligne breakdown (12px, #aaaacc)
TOTAL : 1960       ← était "SCORE :" (16px, blanc)
+420 TEMPS         ← existant (12px, accent)
BEST : 1960        ← existant (16px, accent)
NOUVEAU RECORD     ← existant (12px, blanc)
```
5 lignes × 22px + 14px = 124px de panel.

**Niveau normal minimal (0 pickups, pas de timeBonus, pas de record) :**
```
TOTAL : 500        ← 1 seule ligne TOTAL (clear bonus seulement)
BEST : 500
```
Pas de ligne breakdown (pickupCount = 0). Comportement identique à avant.

**Niveau boss (ex : 3 boss hits) :**
```
BOSS +750          ← nouvelle ligne breakdown (12px, #aaaacc)
TOTAL : 1750       ← était "SCORE :" (inclut BOSS_CLEAR +1000)
BEST : 2000
```
3 lignes × 22px + 14px = 80px.

**Comportement nouveau record :** inchangé — ligne `NOUVEAU RECORD` ajoutée si `isNewRecord`.
**Boutons CONTINUER / REJOUER / CARTE :** inchangés.

## Layout Boss Clear

- Breakown line `BOSS +N` visible si `bossHitCount > 0`
- `TOTAL :` inclut BOSS_CLEAR +1000 — la différence (1000) est implicitement le clear bonus
- Pas de time bonus pour les boss (déjà codé dans triggerClear)
- Propre et non surchargé

## Layout GameOver

- `SCORE :` renommé en `TOTAL :` — seul changement
- Pas de ligne breakdown (layout trop serré entre score panel et level name)
- `scoreY ≈ H * 0.48`, `levelY ≈ H * 0.58` — seulement ~50-60px de marge, insuffisant pour ajouter une ligne de 22px sans risquer un chevauchement avec le level name sur petit écran
- Données `pickupCount`/`bossHitCount` reçues dans l'interface pour utilisation future (PATCH suivant si demandé)

## Non-régression

- **Replay** : `pickupCount = 0`, `bossHitCount = 0` dans `GameScene.create()` — reset garanti
- **Continue** : bouton CONTINUER inchangé
- **Map** : bouton CARTE inchangé
- **Best score** : `SaveSystem.recordBestScore()` non modifié — calcul et stockage identiques
- **Mobile** : panel auto-sizé (lineH = 22px × lineCount) — s'adapte à la hauteur disponible

## Limites

- Pas de grade, pas de médaille
- Breakdown limité à 1 ligne (pickup OU boss, jamais les deux simultanément sauf Paperboy boss — edge case non prioritaire)
- Paperboy boss : affiche `BOSS +N` (bossHitCount), les pickups normaux ignorés dans le breakdown (voir note)
- GameOver : breakdown non affiché (trop serré), seulement TOTAL et BEST
- Validation mobile réelle recommandée pour le panel à 5 lignes
