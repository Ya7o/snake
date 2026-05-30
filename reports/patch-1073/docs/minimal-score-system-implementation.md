# Minimal Score System Implementation

## Objectif

Ajouter score + best score local sans durcir le jeu.

## Barème

| Événement | Points | Implémenté |
|---|---:|---:|
| Pickup collecté | +100 | oui |
| Niveau normal terminé | +500 | oui |
| Boss touché | +250 | oui |
| Boss vaincu | +1000 | oui |
| Bonus temps restant | +10 par seconde | non |
| GameOver | score affiché sans bonus clear | oui |

Le bonus temps est reporté : le timer de niveau n'est pas exposé comme temps restant clair et stable pour ce patch minimal.

## Persistance

- clé `localStorage` : `snakeDriveV4.bestScores` ;
- structure : objet JSON `{ [levelId]: bestScore }` ;
- lecture tolérante : valeur absente, invalide ou ancienne ignorée sans crash ;
- écriture seulement si le score courant dépasse le best score connu ;
- `?resetProgress=1` supprime la progression et les best scores pour garder un reset propre ;
- `SaveSystem.reset()` supprime aussi les best scores.

## Affichage

- ClearScene : affiche `SCORE`, `BEST` et `NOUVEAU RECORD` quand le score bat l'ancien best.
- GameOver : affiche `SCORE` et `BEST`.
- HUD gameplay : inchangé pour éviter d'alourdir le template.

## Changements

| Fichier | Changement | Raison |
|---|---|---|
| `src/config/constants.ts` | ajout de `SCORE_VALUES` | centraliser le barème minimal |
| `src/scenes/GameScene.ts` | ajout `runtimeScore`, points pickup/boss/clear, passage des données aux scènes | scorer sans toucher au quota ni à la difficulté |
| `src/scenes/GameOverScene.ts` | affichage `SCORE` + `BEST` | donner un retour même en échec |
| `src/systems/SaveSystem.ts` | best scores locaux + reset | persistance locale par niveau |
| `reports/patch-1073/review.md` | rapport de contrôle | flux GitHub-first |
| `reports/patch-1073/screenshots/` | captures mobiles | validation visuelle |

## Limites

- pas de leaderboard ;
- pas de grades ;
- pas de monnaie, boutique ou upgrades ;
- bonus temps reporté ;
- test mobile réel nécessaire ;
- les captures sont générées par scènes pilotées en Playwright, pas par une partie complète jouée manuellement.
