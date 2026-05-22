# 983 — Audit Findings

## Roadmap status

```txt
Phase 2 — Castle Vertical Slice
Problem: Castle is playable, but UI system is still unstable visually
```

---

# Screenshot findings

## 1. Castle Game Over

Improved compared to before:
- Castle background is used.
- `PERDU` is readable.
- `REJOUER` is primary and gold.
- `CARTE` is secondary.

Remaining issues:
- layout still feels manually placed;
- title/subtitle/level name could be grouped more intentionally;
- bottom area is close to mobile browser overlay depending on viewport;
- this screen is acceptable but should be governed by a shared result layout.

Verdict:

```txt
Good direction, but needs runtime layout contract.
```

---

## 2. Castle Gameplay HUD

This is the main blocker.

Observed:
- old score numbers still visible behind the HUD;
- old decorative HUD bars still visible;
- clean runtime text sits on top of a contaminated background;
- HUD strip is too small to fully own the top area.

Code evidence:
- `HUDRenderer.ts` uses `hudH = 34`;
- `GameScene.ts` passes `34` to `computeGridLayout`;
- `UniverseFrameRenderer.ts` uses full-frame artwork for Castle;
- Castle frame asset includes baked HUD-like art.

Verdict:

```txt
Not ready for template extraction.
```

This must be fixed structurally.

---

## 3. Castle Level Intro

Improved:
- `OBJECTIF` and `DANGER` sections help.
- `JOUER` is dominant.
- `CARTE` is secondary.

Remaining issues:
- text is still slightly heavy, but acceptable;
- not the main blocker.

Verdict:

```txt
Good enough after minor spacing polish.
```

---

## 4. Title screen

Still generic:
- not Castle-specific;
- uses old arcade neon hub.

This is visible in user screenshots, but should not be fixed in PATCH 983.

Verdict:

```txt
Later global shell polish, not Castle blocker.
```

---

# Code findings

## HUDRenderer.ts

Problem:
```ts
const hudH = 34;
this.bg = scene.add.rectangle(..., 0x000000, 0.88)
```

Why fragile:
- 34 px is too small on mobile;
- opacity 0.88 still lets old baked art show;
- hardcoded height is not shared with `GameScene`.

Expected:
- central HUD height constant;
- 52–60 px mobile height;
- fully opaque or near-opaque background;
- same value used by grid layout.

---

## GameScene.ts

Problem:
```ts
computeGridLayout(width, height, GRID_COLS, GRID_ROWS, 34, ...)
```

Why fragile:
- grid layout does not know real HUD height;
- HUD and grid can diverge;
- old frame header can remain visible above/behind HUD.

Expected:
- use shared `GAMEPLAY_HUD_HEIGHT`;
- reserve space above grid;
- optionally draw Castle HUD mask before/behind runtime HUD.

---

## UniverseFrameRenderer.ts

Problem:
```ts
FULL_FRAME_INNER_RECT = { x: 156 / 941, y: 252 / 1672, ... }
```

and full frame mapping.

Why fragile:
- assumes full image frame is safe around HUD;
- Castle frame contains old baked UI header;
- image art is being treated as runtime-safe layout.

Expected:
- either mask top frame header;
- or crop top frame safely;
- or use runtime frame for Castle gameplay.

---

## GameOverScene.ts / ClearScene.ts

Problem:
- both use separate magic percentages;
- layout is duplicated;
- future worlds will drift.

Expected:
- small shared result layout/config;
- not a huge UI framework;
- one helper is enough.

---

# Root cause

The issue is not one color, one button, or one coordinate.

The root cause is:

```txt
The project mixes baked UI art with runtime UI without a strict ownership rule.
```

Correct rule:

```txt
Images provide atmosphere.
Runtime owns layout, text, HUD, buttons, and gameplay state.
```

PATCH 983 enforces that rule for Castle.
