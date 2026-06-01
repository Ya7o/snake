# Review — PATCH 1104

## Objectif
Afficher le best score du niveau sur l'écran System/Intro avant de lancer le gameplay,
afin que le joueur sache combien battre avant de jouer.

## Résultat
Best score affiché dans le panel infos de `LevelIntroScene` pour tous les univers
(niveaux normaux et boss). Fallback `BEST  —` si aucun record enregistré.

## Fichiers modifiés
- `src/scenes/LevelIntroScene.ts` — import `SaveSystem` + bloc « Best score preview »

## Tests / vérifications

### npm run check
```
✓ 61 modules transformed.
✓ built in 8.04s
0 erreur TypeScript
Warning chunk > 500 kB : attendu, non bloquant.
```

### Lecture best score
- `SaveSystem.getBestScore(levelId)` retourne `0` si aucun record.
- La variable `bestLabel` est calculée avant le rendu :
  - `bestScore > 0` → `BEST  2450`
  - `bestScore === 0` → `BEST  —`

### Vérifications de non-régression
- `SaveSystem.getBestScore` est lecture seule (ne modifie pas le stockage).
- Aucun fichier gameplay, score calculation, HUD in-game, Clear, GameOver touché.

## Captures
Capture Playwright non disponible sans serveur actif.
Le rendu est ancré en bas du panel (`setOrigin(0.5, 1)` à `contentBottomY`) :
garantit l'absence de débordement mobile quelle que soit la hauteur du contenu.

## Documents
- `docs/system-best-score-preview.md`

## Limites / risques
- Pas de test sur device physique — validé structurellement (ancre bas de panel).
- Score affiché brut sans formatage milliers (cohérent avec `BEST : ${bestScore}` de ClearScene).

## Liens GitHub
À compléter après push.
