# 988 — Title Screen Layout

## Goal

The title screen should no longer feel like a placeholder.

It must introduce the whole game.

---

# Recommended layout

For portrait mobile:

```txt
0–12%:
  background breathing room

18–30%:
  SNAKE DRIVE

34–44%:
  8 MONDES · 16 NIVEAUX
  8 BOSS À DÉBLOQUER

55–65%:
  TOUCHER POUR JOUER

76–88%:
  8 world tokens
```

---

# Logo

Text:
```txt
SNAKE DRIVE
```

Recommended style:
- pixel display font;
- green/yellow main fill;
- violet/cyan shadow;
- subtle glow;
- not too large to avoid hiding portal.

---

# Stats

Option A:
```txt
8 MONDES · 16 NIVEAUX
8 BOSS À DÉBLOQUER
```

Option B:
```txt
8 MONDES · 16 NIVEAUX · 8 BOSS
```

Recommendation:
Use Option A if vertical space allows.

---

# CTA

Text:
```txt
TOUCHER POUR JOUER
```

Style:
- capsule;
- dark fill;
- cyan/violet/gold border;
- subtle pulse.

---

# Tokens

Option A:
```txt
8 tokens in one row
```

Option B:
```txt
4 tokens + 4 tokens
```

Recommendation:
Use one row only if each token can remain at least 48 px.
Prefer 56–64 px if possible.

---

# Safe area

Avoid placing important UI too close to:
- browser top bar,
- Android navigation bar,
- bottom gesture/navigation area.

Respect actual canvas/safe-area calculations if already available.
