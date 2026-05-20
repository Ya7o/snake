# Ticket 003 — State machine et scènes

## Objectif
Créer le flux officiel : Title → Map → Intro → Game → Clear/GameOver.

## Fichiers à créer
- `src/core/GameState.ts`
- `src/core/StateMachine.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/ClearScene.ts`
- `src/scenes/GameOverScene.ts`

## Fichiers à modifier
- `src/main.ts`
- `src/scenes/TitleScene.ts`
- `src/scenes/WorldMapScene.ts`
- `src/scenes/GameScene.ts`

## Fichiers interdits
- `src/mechanics/**`

## Contraintes
- Retry fonctionne.
- Retour map fonctionne.
- Pas de régression Snake.

## Tests
```bash
npm run check
```
Manuel : parcourir tout le flux.
