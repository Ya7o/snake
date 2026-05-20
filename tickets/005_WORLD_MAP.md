# Ticket 005 — World map mobile

## Objectif
Créer la map navigable.

## Fichiers à créer
- `src/worldmap/MapCamera.ts`
- `src/worldmap/MapRenderer.ts`
- `src/worldmap/MapInput.ts`

## Fichiers à modifier
- `src/scenes/WorldMapScene.ts`
- `src/config/mapNodes.ts`

## Fichiers interdits
- `src/core/Snake.ts`
- `src/mechanics/**`

## Contraintes
- Drag.
- Pinch.
- Tap node = sélection seulement.
- START = lancement.
- Pas de double tap.
- Tous les niveaux accessibles.

## Tests
```bash
npm run check
```
Manuel : drag, pinch, select, start.
