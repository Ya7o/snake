# 972 — Phase 2 Gate

After PATCH 972, Phase 2 may begin only if these are true:

## Build

- [ ] `npm run build` passes.

## Progression

- [ ] Fresh save unlocks only first node.
- [ ] Clearing a node unlocks only next node.
- [ ] Locked nodes cannot launch.

## Collision

- [ ] Hazards kill after movement.
- [ ] Decorative visuals do not kill.
- [ ] Boss danger kills after movement.
- [ ] Boss weak-point hit works after movement.

## UX

- [ ] World Map Play button remains visible.
- [ ] Level Intro still works.
- [ ] Stage Clear and Game Over still work.

## Scope

- [ ] No new systems were introduced unnecessarily.
- [ ] No assets were added.
- [ ] Linear progression debt is documented.

If all are true, move to:

```txt
PATCH 980 — Phase 2 Vertical Slice
```

Recommended vertical slice world:

```txt
Castle
```

Alternative:

```txt
OutRun
```

Castle tests mechanics better.
OutRun demonstrates polish better.
