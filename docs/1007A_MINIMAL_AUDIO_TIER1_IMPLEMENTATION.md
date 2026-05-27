# PATCH 1007A — Minimal Audio Tier 1 Implementation

## Objectif

Compléter l'audio Tier 1 avec les trois clés manquantes : `gameOver`, `bossHit`, `bossClear`.
Connecter ces événements au runtime sans modifier les mécaniques gameplay.

---

## Changements

### `src/data/audioRegistry.ts`

Trois clés ajoutées :

```ts
gameOver:  'assets/audio/game_over.wav',
bossHit:   'assets/audio/boss_hit.wav',
bossClear: 'assets/audio/boss_clear.wav',
```

### `src/systems/AudioSystem.ts`

- `gameover()` — remplacé : ne délègue plus à `hit()`. Joue `gameOver` ou fallback tone descendant grave (330→220→110 Hz sawtooth, < 1.2s).
- `bossHit()` — ajouté : joue `bossHit` ou fallback tone court lourd (160 Hz square, < 0.4s).
- `bossClear()` — ajouté : joue `bossClear` ou fallback triple tone ascendant (660→880→1100 Hz triangle, < 1.8s).

Méthodes existantes conservées sans modification : `pickup()`, `danger()`, `hit()`, `clear()`, `uiButton()`.

### `src/scenes/GameScene.ts`

| Méthode | Avant | Après |
|---|---|---|
| `triggerGameOver()` | `AudioSystem.hit()` | `AudioSystem.gameover()` |
| `resolveBossWeakPoint()` | `// TODO audio` | `AudioSystem.bossHit()` |
| `triggerClear()` | `AudioSystem.clear()` toujours | `AudioSystem.bossClear()` si boss, sinon `AudioSystem.clear()` |

---

## Règles conservées

- Pas de BGM.
- Pas de sons par univers.
- Pas de refactor audio complet.
- Fallback tone conservé pour chaque méthode.
- Aucun changement de mécaniques, HP boss, conditions de victoire, assets visuels, niveaux.

---

## Fichiers WAV cibles

| Chemin | Statut |
|---|---|
| `public/assets/audio/game_over.wav` | **Absent** — fallback tone actif |
| `public/assets/audio/boss_hit.wav` | **Absent** — fallback tone actif |
| `public/assets/audio/boss_clear.wav` | **Absent** — fallback tone actif |

Le jeu ne plante pas si ces fichiers sont absents : `AudioSystem.play()` attrape l'échec et déclenche le fallback tone via `.catch(() => fallback?.())`.

---

## Critères d'acceptation

- [x] `npm run build` OK — 0 erreur TypeScript, 60 modules.
- [x] `gameOver` distinct de `collisionHit` (tone différent, méthode distincte).
- [x] `bossHit` déclenché sur `resolveBossWeakPoint()` (TODO résolu).
- [x] `bossClear` déclenché sur `triggerClear()` quand boss (`instanceof BaseBoss`).
- [x] `stageClear` conservé pour les niveaux normaux.
- [x] Aucun crash si les WAV sont absents.
- [x] Aucun changement de gameplay.

---

*Patch appliqué le 2026-05-27. Aucun asset WAV créé dans ce patch.*
