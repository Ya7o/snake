# 984 — Runtime Ownership Doctrine

## Core rule

```txt
Images provide atmosphere.
Runtime owns UI.
```

This rule is now the foundation for Snake Drive's visual system.

---

# What images may contain

Images may contain:
- landscape,
- atmosphere,
- color palette,
- environmental silhouettes,
- mood,
- decorative props,
- depth,
- world identity.

---

# What images must not contain

Images must not contain:
- text,
- HUD,
- scores,
- health bars,
- buttons,
- button labels,
- panels that must align perfectly,
- required CTA slots,
- objective labels,
- fake UI.

---

# What runtime owns

Runtime owns:
- all text,
- all buttons,
- all panels,
- all HUD,
- all gameplay grid,
- result messages,
- overlays,
- screen state,
- interaction.

---

# Why this matters

Previous iterations failed because artwork tried to carry layout.

That caused:
- misaligned buttons,
- baked HUD contamination,
- old score artifacts,
- scene-specific patches.

Runtime ownership prevents this.

---

# Required architecture direction

For each universe, use the 4-background model:

```txt
universe_system_bg
universe_gameplay_bg
universe_game_over_bg
universe_clear_bg
```

The code then applies:
- shared layouts,
- theme colors,
- runtime panels,
- runtime buttons,
- runtime HUD.

---

# Consequence for future universes

When generating Sonic, Streets, Fighter, OutRun, Shinobi, Kombat, Paperboy:

Do not generate complete UI screens.

Generate only background images.

The UI should be the same system with different:
- backgrounds,
- palette,
- accent colors,
- small iconography if needed.
