# ICON AUDIT -- Snake Drive V4

**Date:** 2026-05-31

## Executive Summary

| Metric | Count |
|--------|-------|
| PNG assets audited | 33 |
| Critique | 0 |
| Moyen | 1 |
| Mineur | 10 |
| OK | 22 |

Castle universe uses SVG/OpenMoji vector assets -- not included in PNG pixel analysis.
**Overall health: GOOD.** No critical issues detected.

---

## Global Findings

1. Large Canvas (1254x1254px): 17 assets flagged as upscale. Handled by LINEAR filter in PickupRenderer.
2. 32x32 pixel art secondary pickups: 6 assets. LINEAR filter makes them appear slightly soft.
3. OutRun wide-canvas car sprites: ~25% top+bottom margin. Intentional (wide car in square canvas).
4. ObstacleRenderer does NOT set LINEAR filter (unlike PickupRenderer). Potential aliasing.

---

## Universe Tables

### CASTLE

> SVG/OpenMoji at 64x64. Roles: magic_star(pickup), gem(bonus), brick/stone/door(obstacles), fire(danger), crystal_ball/skull/crown(boss). Vector -- OK.

### SONIC

| Type | File | WxH | Coverage | MaxMargin% | dx/dy | Severity | Notes |
|------|------|-----|----------|------------|-------|----------|-------|
| pickup_main | pickup_ring.png | 450x450 | 29.7% | 6% | dx=5.0/dy=1.0 | OK | RAS |
| pickup_bonus | pickup_secondary.png | 32x32 | 25.9% | 16% | dx=0.0/dy=0.0 | Mineur | Pixel art suspecte |
| obstacle_normal | obstacle_bumper.png | 1254x1254 | 34.1% | 10% | dx=7.5/dy=-2.5 | OK | Upscale/flou suspecte |
| boss_idle | boss_loop_serpent.png | 1254x1254 | 44.7% | 14% | dx=-1.5/dy=1.5 | OK | Upscale/flou suspecte |
| boss_attack | N/A | | | | | | Not defined |

### STREETS

| Type | File | WxH | Coverage | MaxMargin% | dx/dy | Severity | Notes |
|------|------|-----|----------|------------|-------|----------|-------|
| pickup_main | pickup_street_bonus.png | 1254x1254 | 64.7% | 4% | dx=-27.0/dy=-6.0 | OK | Upscale/flou suspecte |
| pickup_bonus | pickup_secondary.png | 32x32 | 43.1% | 12% | dx=0.0/dy=0.0 | OK | Pixel art suspecte |
| obstacle_normal | obstacle_crowd.png | 1254x1254 | 37.5% | 13% | dx=-9.0/dy=20.0 | OK | Upscale/flou suspecte |
| boss_idle | boss_idle.png | 1254x1254 | 24.3% | 30% | dx=-9.5/dy=-0.5 | Mineur | Upscale/flou suspecte |
| boss_attack | boss_attack.png | 1254x1254 | 31.9% | 15% | dx=-24.0/dy=1.5 | OK | Upscale/flou suspecte |

### FIGHTER

| Type | File | WxH | Coverage | MaxMargin% | dx/dy | Severity | Notes |
|------|------|-----|----------|------------|-------|----------|-------|
| pickup_main | pickup_energy.png | 1254x1254 | 26.2% | 21% | dx=-2.5/dy=-35.0 | Mineur | Upscale/flou suspecte |
| pickup_bonus | pickup_secondary.png | 32x32 | 24.7% | 22% | dx=0.0/dy=0.0 | Mineur | Pixel art suspecte |
| obstacle_normal | obstacle_charge_marker.png | 1254x1254 | 42.6% | 13% | dx=9.5/dy=4.5 | OK | Upscale/flou suspecte |
| boss_idle | boss_idle.png | 1254x1254 | 42.9% | 11% | dx=-2.5/dy=-2.0 | OK | Upscale/flou suspecte |
| boss_attack | boss_attack.png | 1254x1254 | 45.9% | 6% | dx=6.0/dy=-11.5 | OK | Upscale/flou suspecte |

### OUTRUN

| Type | File | WxH | Coverage | MaxMargin% | dx/dy | Severity | Notes |
|------|------|-----|----------|------------|-------|----------|-------|
| pickup_main | pickup_checkpoint.png | 1254x1254 | 38.6% | 12% | dx=-5.0/dy=0.5 | OK | Upscale/flou suspecte |
| pickup_bonus | pickup_secondary.png | 32x32 | 21.5% | 25% | dx=0.0/dy=-0.5 | Mineur | Pixel art suspecte |
| obstacle_normal | obstacle_car.png | 1254x1254 | 31.4% | 26% | dx=-6.5/dy=-2.0 | Mineur | Upscale/flou suspecte |
| boss_idle | boss_idle.png | 1254x1254 | 38.0% | 25% | dx=1.0/dy=4.5 | Mineur | Upscale/flou suspecte |
| boss_attack | boss_attack.png | 1254x1254 | 33.2% | 26% | dx=-8.0/dy=-0.5 | Mineur | Upscale/flou suspecte |

### SHINOBI

| Type | File | WxH | Coverage | MaxMargin% | dx/dy | Severity | Notes |
|------|------|-----|----------|------------|-------|----------|-------|
| pickup_main | pickup_shuriken.png | 256x256 | 26.9% | 10% | dx=-2.0/dy=-3.0 | OK | RAS |
| pickup_bonus | pickup_secondary.png | 32x32 | 16.8% | 28% | dx=-0.5/dy=0.5 | Moyen | Couverture opaque tres faible (16.8%); Pixel art suspecte |
| obstacle_normal | obstacle_decoy.png | 251x256 | 58.9% | 0% | dx=-0.5/dy=-0.5 | OK | RAS |
| boss_idle | boss_shadow_ninja.png | 256x250 | 58.4% | 0% | dx=-0.5/dy=-0.5 | OK | RAS |
| boss_attack | N/A | | | | | | Not defined |

### KOMBAT

| Type | File | WxH | Coverage | MaxMargin% | dx/dy | Severity | Notes |
|------|------|-----|----------|------------|-------|----------|-------|
| pickup_main | pickup_finish_token.png | 1254x1254 | 50.2% | 10% | dx=-1.5/dy=-15.5 | OK | Upscale/flou suspecte |
| pickup_bonus | pickup_secondary.png | 32x32 | 36.8% | 16% | dx=0.0/dy=0.0 | Mineur | Pixel art suspecte |
| obstacle_normal | obstacle_fatal_zone.png | 235x256 | 67.6% | 0% | dx=-0.5/dy=-0.5 | OK | RAS |
| boss_idle | boss_idle.png | 1254x1254 | 56.1% | 7% | dx=-5.0/dy=-9.5 | OK | Upscale/flou suspecte |
| boss_attack | boss_attack.png | 1254x1254 | 51.1% | 14% | dx=-1.0/dy=0.0 | OK | Upscale/flou suspecte |

### PAPERBOY

| Type | File | WxH | Coverage | MaxMargin% | dx/dy | Severity | Notes |
|------|------|-----|----------|------------|-------|----------|-------|
| pickup_main | pickup_newspaper.png | 256x191 | 46.8% | 0% | dx=-0.5/dy=-0.5 | OK | RAS |
| pickup_bonus | pickup_secondary.png | 32x32 | 43.1% | 12% | dx=0.0/dy=0.0 | OK | Pixel art suspecte |
| obstacle_normal | obstacle_dog.png | 1254x1254 | 42.6% | 11% | dx=-1.5/dy=-16.5 | OK | Upscale/flou suspecte |
| boss_idle | boss_neighborhood_chaos.png | 256x233 | 70.3% | 0% | dx=-0.5/dy=-0.5 | OK | RAS |
| boss_attack | N/A | | | | | | Not defined |
| mailbox | mailbox.png | 1254x1254 | 24.1% | 24% | dx=-1.5/dy=-1.0 | Mineur | Upscale/flou suspecte |

---

## Critical Issues

_None detected._

## Moyen Issues (1)

**shinobi/pickup_secondary** (pickup_secondary.png, 32x32, 16.8% coverage)
Very thin icon -- barely visible at gameplay cell size.
Recommendation: Replace with more solid design (target ~40% opaque coverage).

## Mineur Issues (10)

- **sonic/pickup_bonus** (pickup_secondary.png): Pixel art suspecte
- **streets/boss_idle** (boss_idle.png): Upscale/flou suspecte
- **fighter/pickup_main** (pickup_energy.png): Upscale/flou suspecte
- **fighter/pickup_bonus** (pickup_secondary.png): Pixel art suspecte
- **outrun/pickup_bonus** (pickup_secondary.png): Pixel art suspecte
- **outrun/obstacle_normal** (obstacle_car.png): Upscale/flou suspecte
- **outrun/boss_idle** (boss_idle.png): Upscale/flou suspecte
- **outrun/boss_attack** (boss_attack.png): Upscale/flou suspecte
- **kombat/pickup_bonus** (pickup_secondary.png): Pixel art suspecte
- **paperboy/mailbox** (mailbox.png): Upscale/flou suspecte

---

## Renderer Analysis

### PickupRenderer
| Property | Value |
|----------|-------|
| Default maxSizeScale | 1.9x cell |
| OutRun maxSizeScale | 2.35x cell |
| Shinobi maxSizeScale | 2.05x cell |
| Shinobi offset | +0.02x / +0.04y |
| Filter mode | FilterMode.LINEAR (explicit) |

### ObstacleRenderer
| Property | Value |
|----------|-------|
| OpenMoji obstacle scale | 1.9x cell |
| Default obstacle scale | 1.70x cell |
| Default boss scale | 1.75x cell |
| crimeLord / turboRival | 1.82x cell |
| chaosObstacle | 1.60x cell |
| Filter mode | NOT set (Phaser default) |

---

## Prioritized Recommendations

### P1 -- Gameplay Impact

**P1.1 shinobi/pickup_secondary (MOYEN):** Replace with icon having ~40% opaque coverage.

**P1.2 ObstacleRenderer LINEAR filter:** Add setFilter(FilterMode.LINEAR) in fitImageInCell().

### P2 -- Size / Centering / Readability

**P2.1 streets/boss_idle:** Crop to reduce side margins from ~29% to <15%.

**P2.2 fighter/pickup_main:** Add fighter entry in PICKUP_IMAGE_PROFILES with offsetYCells:+0.04.

**P2.3 OutRun obstacle/boss:** Add outrun RUNTIME_OBSTACLE_ICON_SCALE_BY_TYPE entry (scale ~2.0).

**P2.4 All pickup_secondary (32x32):** Consider NEAREST filter or replace with higher-res artwork.

### P3 -- Aesthetics / Consistency

**P3.1 Resolution inconsistency:** Shinobi/Kombat/Paperboy = 256px, others = 1254px. Standardize to 512px+.

**P3.2 paperboy/mailbox:** Low priority -- crop to reduce 24% side margins.
