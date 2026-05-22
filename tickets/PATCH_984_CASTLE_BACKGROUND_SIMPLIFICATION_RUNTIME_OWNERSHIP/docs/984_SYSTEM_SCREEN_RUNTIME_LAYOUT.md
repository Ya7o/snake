# 984 — System Screen Runtime Layout

## Applies to

```txt
Level Intro
World briefing
Game Over
Stage Clear
Boss Clear
```

---

# Background usage

Use full-screen background with cover scaling.

Do not distort aspect ratio.

Use optional overlay:

```txt
dark scrim for readability
warm glow for clear
red/purple tint for game over
```

---

# Runtime panel

The panel should be drawn by code.

Recommended panel style for Castle:
- dark violet fill,
- alpha 0.82–0.92,
- gold/violet border,
- rounded corners if supported,
- enough padding.

---

# Runtime buttons

Primary:
- gold / warm magic;
- high contrast text.

Secondary:
- dark violet;
- purple border;
- lower priority.

---

# Suggested relative layout

Use relative positions rather than hardcoded image slots.

```txt
titleY: 0.22–0.28
subtitleY: 0.34–0.40
panelY: 0.44–0.58
primaryButtonY: 0.68–0.74
secondaryButtonY: 0.80–0.86
```

Adjust by screen type, but keep consistent across screens.

---

# Important

The background should never dictate exact button positions.

Runtime layout does.
