# Ticket 020 — Implémenter les 8 mécaniques et 8 boss

## Objectif
Créer toutes les mécaniques normales et boss.

## Fichiers à créer
- `src/mechanics/MechanicRegistry.ts`
- `src/mechanics/CastleIllusion.ts`
- `src/mechanics/RingChains.ts`
- `src/mechanics/CrowdBlockers.ts`
- `src/mechanics/ChargeMove.ts`
- `src/mechanics/LaneDrift.ts`
- `src/mechanics/FocusMode.ts`
- `src/mechanics/FatalZones.ts`
- `src/mechanics/DeliveryTargets.ts`
- `src/mechanics/bosses/WitchMirror.ts`
- `src/mechanics/bosses/LoopSerpent.ts`
- `src/mechanics/bosses/CrimeLord.ts`
- `src/mechanics/bosses/FinalChallenger.ts`
- `src/mechanics/bosses/TurboRival.ts`
- `src/mechanics/bosses/ShadowNinja.ts`
- `src/mechanics/bosses/DragonGate.ts`
- `src/mechanics/bosses/NeighborhoodChaos.ts`

## Fichiers à modifier
- `src/scenes/GameScene.ts`
- `src/render/RenderBoss.ts`
- `src/render/RenderObstacles.ts`
- `src/render/RenderPickups.ts`

## Contraintes
Respecter `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md`.

## Tests
```bash
npm run check
```
Manuel : lancer 16 niveaux.
