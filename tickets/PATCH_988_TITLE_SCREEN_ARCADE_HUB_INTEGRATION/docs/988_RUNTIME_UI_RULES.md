# 988 — Runtime UI Rules

## Main doctrine

```txt
Assets create atmosphere.
Runtime owns UI.
```

This applies to title screen too.

---

# Assets may provide

- background;
- tokens;
- decorative ambience.

---

# Runtime must provide

- `SNAKE DRIVE`;
- stats text;
- CTA;
- button shapes;
- animation;
- interaction;
- layout;
- responsive scaling.

---

# Do not bake

Do not bake into any image:
- title text;
- `TOUCHER POUR JOUER`;
- `8 MONDES`;
- version number;
- buttons;
- UI labels.

---

# Why

If text is baked:
- localization becomes harder;
- scale breaks on mobile;
- layout is frozen;
- design becomes harder to iterate.

The title screen must stay code-controlled.
