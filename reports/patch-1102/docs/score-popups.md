# Score Popups

## Objectif

Afficher un feedback immédiat quand le joueur gagne des points, via un texte court qui monte et s'efface en ~650 ms.

## Changement

| Fichier | Changement | Raison |
|---|---|---|
| `src/scenes/GameScene.ts` | Import `UI_FONT` depuis VfxUtils | Nécessaire pour style popup |
| `src/scenes/GameScene.ts` | Méthode privée `spawnScorePopup(text, col, row)` | Affiche un texte flottant au-dessus de la cellule |
| `src/scenes/GameScene.ts` | Appel `spawnScorePopup('+100', head.col, head.row)` sur `result.ate` | Feedback pickup |
| `src/scenes/GameScene.ts` | Appel `spawnScorePopup('+250', head.col, head.row)` sur boss weak point hit | Feedback boss hit |

## Événements couverts

| Événement | Popup | Position | Notes |
|---|---|---|---|
| Pickup collecté | `+100` | Cellule de la tête (= cellule du pickup) | Tous univers, y compris Paperboy delivery |
| Boss weak point hit | `+250` | Cellule de la tête | Tous univers boss |
| Stage clear | — | — | Transition immédiate, popup non ajouté : ClearScene affiche le score complet |
| Boss clear | — | — | Idem, BOSS_CLEAR +1000 visible à l'écran résultat |
| Bonus temps | — | — | Calculé à triggerClear(), non ajouté |

## Règles visuelles

- **Durée** : 650 ms (tween alpha 0 + montée Y)
- **Animation** : monte de `cellH × 0.5` à `cellH × 2.0` au-dessus de la cellule, alpha 0 à la fin
- **Ease** : `Power1` — linéaire légèrement accélérée
- **Position initiale** : `px, py - cellH × 0.5` (centré au-dessus de la cellule consommée)
- **Couleur** : `#ffe066` (or chaud) + stroke `#000000` épaisseur 3 → lisible sur fonds sombres et clairs
- **Fonte** : `UI_FONT` (Arial), `fontStyle: '800'`, `fontSize: 13px`
- **Depth** : `GAMEPLAY_LAYERS.GAMEPLAY_FX = 70` — au-dessus des objets jeu, sous le HUD
- **Destruction** : `popup.destroy()` dans `onComplete` — aucun objet résiduel

## Mobile

- Police système (Arial) → rendu garanti sur Android
- Taille 13px — lisible sans grossir
- Stroke 3px — contraste sur fond quelconque
- Durée 650 ms — assez court pour ne pas polluer l'écran entre deux pickups rapides

## Non-régression

- **Score total** : aucun changement du calcul — `spawnScorePopup` est read-only, ne touche pas `runtimeScore` ni `this.score`
- **Best score** : inchangé — `SaveSystem` non touché
- **Gameplay** : aucune modification de mécanique, quota, clear condition
- **HUD** : aucune modification de `HUDRenderer`
- **ClearScene/GameOverScene** : aucune modification

## Limites

- Pas de combo multiplier
- Pas de breakdown
- Popup stage/boss clear non ajouté (transition trop rapide, redondant avec écran résultat)
- Validation sur device mobile réel recommandée
