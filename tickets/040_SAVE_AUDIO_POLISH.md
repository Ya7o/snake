# Ticket 040 — Save, audio minimal et polish première build

## Objectif
Ajouter les systèmes transverses minimaux.

## Fichiers à créer
- `src/systems/SaveManager.ts`
- `src/systems/AudioManager.ts`
- `src/systems/AssetManager.ts`
- `src/systems/DebugManager.ts`

## Fichiers à modifier
- scènes concernées.

## Contraintes
- Audio ne bloque jamais.
- Save localStorage robuste.
- Fallback si localStorage indisponible.

## Tests
```bash
npm run check
```
Manuel : clear, reload, mute.
