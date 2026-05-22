# 980 Castle Vertical Slice Notes

## Scope

Patch 980 focuses only on World 1 Castle.

## Castle Stage 1

- Objective remains 10 magic pickups.
- Speed is forgiving at 175ms per tick.
- Blink walls now use a slower readable cadence:
  - safe ghost: 7 ticks,
  - warning: 6 ticks,
  - active danger: 4 ticks.
- At most 3 blink walls are alive at once.
- Warning walls render but are not returned by `getDangerCells()`.
- Only active walls are lethal.

## Castle Boss

Witch Mirror uses a small readable loop:

1. idle,
2. warning,
3. attacking danger mirrors,
4. vulnerable real mirror,
5. hit or repeat.

Only attacking fake mirrors are lethal. The real mirror is a weak point only during the vulnerable state, so no hidden weak-point hit is required.

## UI

- Castle normal HUD uses `STAGE 1` with `MAGIC x/10`.
- Castle boss HUD uses `BOSS` with `BOSS HP x/3`.
- Castle intro copy explains objective, wall warning and timing.
- Castle clear messages call out boss unlock and world completion.

## QA

`src/qa/GameplayQAChecks.ts` now includes Castle vertical-slice data, progression and API checks.
