# Review — PATCH 1100

## Objectif

Audit et design du système Score V2 avant implémentation. Définir précisément la formule, l'affichage HUD in-game, le barème, et le plan de déploiement en 3 patches (1101/1102/1103).

## Résultat

Design Score V2 complet. Aucun code modifié. Tous les livrables créés.

## Fichiers modifiés

Aucun fichier source modifié. Création uniquement :

| Fichier | Type | Contenu |
|---|---|---|
| `reports/patch-1100/review.md` | Rapport | Ce fichier |
| `reports/patch-1100/docs/score-v2-design.md` | Design doc | Système complet Score V2 |
| `reports/patch-1100/logs/current-score-inventory.json` | Log | Inventaire JSON du système score actuel |

## Tests / vérifications

```
npm run check : OK
tsc : 0 erreur
vite build : OK (warning chunk > 500 kB attendu, non bloquant)
61 modules transformés
```

## Captures

Aucune capture — patch documentation/design.

## Documents

- `reports/patch-1100/docs/score-v2-design.md` — design complet
- `reports/patch-1100/logs/current-score-inventory.json` — inventaire score actuel

## Analyse du score actuel

**Deux variables dans GameScene :**
- `this.score` : progression gameplay (quota/clear check), affiché en HUD sous forme `X/10`
- `this.runtimeScore` : score d'affichage (leaderboard), invisible pendant le jeu, visible uniquement à Clear/GameOver

**Barème actuel (SCORE_VALUES en constants.ts) :**

| Événement | runtimeScore | Où |
|---|---:|---|
| Pickup collecté | +100 | GameScene:497 |
| Boss weak point hit | +250 | GameScene:628 |
| Stage clear | +500 | triggerClear() |
| Boss clear | +1000 | triggerClear() |
| Bonus temps restant | +10 × s | triggerClear() |

**Best score :** localStorage `snakeDriveV4.bestScores`, par niveau, mis à jour à GameOver et Clear.

## Décisions Score V2

- Score visible in-game via capsule HUD droite — format `X/10 · 1200` (normal) / `HP X/3 · 500` (boss)
- Popups de score différés en PATCH 1102
- Breakdown Clear/GameOver différé en PATCH 1103
- Bonus temps basé sur temps restant (déjà correct)
- Aucun malus mort maintenu
- Barème actuel conservé pour 1101 — pas de modification des constantes

## Plan d'implémentation

- **1101** — In-Game Score HUD : exposer `runtimeScore` au HUDRenderer, format combiné capsule droite
- **1102** — Score Popups : textes flottants `+100`, `+250` au moment des événements
- **1103** — Score Breakdown : décomposition par catégorie dans ClearScene/GameOverScene

## Limites / risques

- Capsule droite ~100px : fall-back `X/10` seul si débordement avec grand score
- BOSS_CLEAR +1000 s'ajoute à triggerClear() — non visible in-game (correct, s'affiche à l'écran résultat)
- Breakdown nécessitera des compteurs supplémentaires dans GameScene (prévu 1103)

## Liens GitHub

Commit dans ce push.
