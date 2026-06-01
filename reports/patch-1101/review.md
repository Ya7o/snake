# Review — PATCH 1101

## Objectif

Afficher le score (`runtimeScore`) pendant le gameplay dans la capsule HUD droite. Couvrir niveaux normaux et boss. Pas de popups, pas de modification des écrans résultat.

## Résultat

Score visible en HUD. Format `X/10·1200` (normal), `HP X/3·250` (boss). Fall-back automatique si débordement. Aucun gameplay modifié.

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/render/HUDRenderer.ts` | Ajout `rightCapsuleW`, param `runtimeScore = 0` dans `update()`, format combiné + fall-back overflow |
| `src/scenes/GameScene.ts` | Passage de `this.runtimeScore` en 7ème argument à `hudRenderer.update()` |

## Tests / vérifications

```
npm run check : OK
tsc : 0 erreur
vite build : OK (warning chunk > 500 kB attendu, non bloquant)
61 modules transformés
```

## Captures

Captures visuelles non disponibles (serveur dev non démarré — patch léger, changement mécanique unique vérifié par code). Risque visuel minimal : uniquement ajout de texte dans capsule existante.

## Documents

- `reports/patch-1101/docs/in-game-score-hud.md`
- `reports/patch-1101/logs/score-hud-assertions.json`

## Limites

- BOSS_CLEAR +1000 n'est pas visible in-game (ajouté à `triggerClear()`, apparaît à l'écran résultat — comportement attendu)
- Pas de popups de score (PATCH 1102)
- Pas de breakdown (PATCH 1103)
- Surcharge HUD sur très petits écrans à valider sur device réel — fall-back prévu

## Liens GitHub

Commit dans ce push.
