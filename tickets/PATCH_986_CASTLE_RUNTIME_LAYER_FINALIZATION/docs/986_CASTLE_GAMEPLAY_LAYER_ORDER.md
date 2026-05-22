# 986 — Castle Gameplay Layer Order

## Target composition

Castle gameplay must use this conceptual order.

```txt
Depth 0   castle_gameplay_bg
Depth 10  optional global gameplay scrim
Depth 20  runtime board panel
Depth 30  runtime grid background
Depth 40  runtime grid lines
Depth 50  snake / pickups / hazards / boss
Depth 70  FX
Depth 80  HUD strip
Depth 90  HUD text
```

Exact depth values may vary, but order must not.

---

# Background

Use:

```txt
castle_gameplay_bg.png
```

Full-screen cover.

It should sit behind everything.

---

# Board panel

Draw code-owned board panel.

Recommended:
- dark violet/black rectangle;
- alpha around 0.90–0.96;
- border violet/gold;
- slight shadow if supported.

The board panel should define the grid area visually.

---

# Grid

Draw grid above board panel.

Do not let background texture replace grid panel.

---

# Gameplay objects

Snake, pickups, hazards, boss objects above grid.

---

# HUD

HUD is above all gameplay layers.

Recommended:
- height 56 px or current centralized value;
- opaque dark strip;
- gold top/bottom line;
- text left/center/right.

---

# Forbidden

Do not draw:
- old full frame;
- old header;
- old score bar;
- old HP bar;
- old arcade top strip.

---

# Required code decision

The patch should contain a clear line/branch equivalent to:

```ts
if (themeId === 'castle') {
  // Skip legacy frame renderer. Castle uses runtime board + runtime HUD.
} else {
  // Existing frame path for other worlds remains.
}
```

Adapt to existing code.
