# 982 — Castle HUD Requirements

## Current problem

Gameplay screenshot shows HUD text over old decorative elements:
- ghosted score numbers,
- bars,
- background artifacts,
- cramped layout.

This is not acceptable as the model for future worlds.

---

# Required Castle gameplay HUD

The player must read in under 0.5 seconds:

```txt
CASTLE
STAGE 1
MAGIC 0/10
```

or equivalent.

---

# Recommended layout

```txt
┌───────────────────────────────┐
│ CASTLE     STAGE 1    MAGIC 0/10 │
└───────────────────────────────┘
```

Use:
- dark strip,
- high contrast text,
- gold/violet accent,
- no old HUD text behind it.

---

# Boss HUD

Boss stage should show:

```txt
CASTLE BOSS
BOSS HP 2/3
```

or equivalent.

Do not show normal objective if not relevant.

---

# Visual rules

- No decorative score digits behind runtime text.
- No invisible overlap.
- No tiny text.
- Avoid mixing old baked HUD and runtime HUD.
- If an image frame has baked HUD, cover it with an opaque/semi-opaque runtime strip.

---

# Acceptance test

Take a mobile screenshot.

If someone must zoom or squint to read objective, it fails.
