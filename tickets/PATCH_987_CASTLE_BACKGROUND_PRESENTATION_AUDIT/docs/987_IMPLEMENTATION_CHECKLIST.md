# 987 — Implementation Checklist

## Audit / design
- [ ] Validate full-screen background policy for each Castle screen.
- [ ] Validate recommended board width/height ratios.
- [ ] Validate HUD recommendation (compact capsule row).
- [ ] Validate typography hierarchy.

## For the next implementation patch

### Background presentation
- [ ] Ensure backgrounds use consistent cover/contain strategy as appropriate.
- [ ] Ensure safe zones do not cover focal art.
- [ ] Remove any oversized opaque panels.

### Gameplay board
- [ ] Reduce cell size moderately.
- [ ] Recompute board width/height.
- [ ] Leave visible side margins.
- [ ] Leave visible bottom décor.
- [ ] Separate HUD from board.

### HUD
- [ ] Replace full-width top strip with compact capsule row.
- [ ] Test readability on mobile.
- [ ] Ensure boss-state variation exists.

### Typography
- [ ] Define display title style.
- [ ] Define UI font style.
- [ ] Define button style.
- [ ] Apply consistent scale hierarchy.
