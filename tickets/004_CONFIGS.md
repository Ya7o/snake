# Ticket 004 — Configs 8 univers / 16 niveaux / 16 nodes

## Objectif
Créer la configuration data-driven.

## Fichiers à créer
- `src/config/universes.ts`
- `src/config/levels.ts`
- `src/config/mapNodes.ts`
- `src/config/difficulty.ts`
- `src/qa/LevelValidation.ts`

## Fichiers à modifier
- `src/config/types.ts`

## Fichiers interdits
- `src/mechanics/**`

## Contraintes
- 8 univers.
- 16 niveaux.
- 16 nodes.
- 1 normal + 1 boss par univers.
- Mechanic IDs conformes à `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md`.

## Tests
```bash
npm run check
```
