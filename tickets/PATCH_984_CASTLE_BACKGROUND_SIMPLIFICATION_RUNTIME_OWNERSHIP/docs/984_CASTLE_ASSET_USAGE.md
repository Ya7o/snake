# 984 — Castle Asset Usage

## Included Castle assets

```txt
castle_system_bg.png
castle_gameplay_bg.png
castle_game_over_bg.png
castle_clear_bg.png
```

Suggested source path in patch:

```txt
src/assets/ui/castle/
```

If the repo uses public assets, move to:

```txt
public/assets/ui/castle/
```

and reference as:

```txt
assets/ui/castle/castle_system_bg.png
assets/ui/castle/castle_gameplay_bg.png
assets/ui/castle/castle_game_over_bg.png
assets/ui/castle/castle_clear_bg.png
```

---

# 1. castle_system_bg.png

Use for:
- Castle Level Intro,
- Castle world briefing,
- Castle menu state if needed.

Runtime overlays:
- panel,
- objective,
- danger,
- primary/secondary buttons.

Do not draw directly over the raw background without panel/scrim if text contrast is weak.

---

# 2. castle_gameplay_bg.png

Use for:
- Castle gameplay only.

Runtime overlays:
- HUD,
- gameplay grid,
- grid border,
- snake,
- pickups,
- hazards,
- boss.

This image was selected because its center is dark and calm.

No old frame HUD should remain.

---

# 3. castle_game_over_bg.png

Use for:
- Castle Game Over.

Runtime overlays:
- dark/purple scrim if needed,
- title,
- subtitle,
- level name,
- retry button,
- map button.

Tone:
- darker,
- haunted,
- tense.

---

# 4. castle_clear_bg.png

Use for:
- Castle Stage Clear,
- Castle Boss Clear,
- World 1 Complete.

Runtime overlays:
- warm/gold scrim if needed,
- title,
- progression message,
- continue button,
- map button.

Tone:
- bright,
- rewarding,
- magical.

---

# Asset validation

All 4 assets:
- contain no text,
- contain no buttons,
- contain no HUD,
- are vertical 9:16,
- match Castle fantasy mood,
- are usable by runtime UI.
