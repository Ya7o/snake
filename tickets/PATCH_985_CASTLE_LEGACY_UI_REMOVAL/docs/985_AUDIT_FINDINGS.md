# 985 — Audit Findings

## Roadmap status

```txt
Phase 2 — Castle Vertical Slice
Patch 984 integrated the correct assets, but legacy UI is still visible.
```

---

# Screenshot 1 — Stage Clear

Observation:
- `STAGE CLEAR` is readable.
- `Castle Boss débloqué` is readable.
- `CONTINUER` is readable.
- `CARTE` is readable.

Problem:
- an empty rectangle/panel appears below `CARTE`;
- there are too many stacked panel structures;
- the screen still feels partly driven by old result-screen slots.

Conclusion:

```txt
Stage Clear is close, but not clean enough for template extraction.
```

---

# Screenshot 2 — Game Over

Observation:
- Game Over is now Castle-themed.
- `PERDU` is readable.
- `REJOUER` and `CARTE` work visually.
- Much better than the old generic neon screen.

Minor issue:
- still check that result layout is shared with Clear.

Conclusion:

```txt
Game Over is validable if shared layout is preserved.
```

---

# Screenshot 3 — Gameplay

Observation:
- runtime HUD is readable:
  `CASTLE / STAGE 1 / MAGIC 0/10`.

Problem:
- legacy red/blue bars and old header content are still visible under the HUD;
- this violates runtime ownership;
- it also proves old full-frame/header art is still being drawn.

Conclusion:

```txt
Gameplay is the main blocker.
```

---

# Screenshot 4 — Intro

Observation:
- Intro uses the new background well.
- Panel and buttons are acceptable.
- Text is readable.

Conclusion:

```txt
Intro should not be redesigned now.
```

---

# Root cause

The code likely integrated the 984 backgrounds **in addition to** old layers instead of **replacing** old layers.

The fix must be removal/disable, not another overlay.

Correct rule:

```txt
If an old asset contains baked HUD or inactive button slots, Castle must not render it.
```
