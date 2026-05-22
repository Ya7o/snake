# 984 — Gameplay Screen Runtime Layout

## Applies to

```txt
Castle gameplay
Castle boss gameplay
```

---

# Main rule

Gameplay screen must not use any asset with baked HUD.

Use:

```txt
castle_gameplay_bg.png
```

as a passive atmosphere layer only.

---

# Runtime layers

Recommended order:

```txt
1. background image
2. gameplay dark scrim if needed
3. HUD strip
4. gameplay grid background
5. grid lines
6. frame/border if runtime-drawn
7. snake/pickups/hazards
8. FX
```

---

# HUD

Use a centralized height.

Recommended:

```txt
height: 56 px
```

or scale equivalent.

HUD text:

```txt
CASTLE      STAGE 1      MAGIC 0/10
```

Boss:

```txt
CASTLE BOSS      HP 2/3
```

---

# Grid readability

Grid must remain dominant.

If the background is too visible under the grid:
- add dark grid panel;
- reduce background alpha;
- increase grid contrast.

---

# Do not

Do not show:
- old score digits,
- old health bars,
- baked HUD frame,
- decorative header over HUD,
- any text from image.
