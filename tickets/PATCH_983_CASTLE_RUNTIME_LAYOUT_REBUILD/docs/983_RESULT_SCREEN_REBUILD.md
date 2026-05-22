# 983 — Result Screen Rebuild

## Problem

GameOverScene and ClearScene are now visually better, but their layouts are still independently handcrafted.

This will fail when scaling to 8 universes.

---

# Required result screen approach

Use a shared result layout helper or shared layout constants.

Minimum acceptable:

```ts
const layout = RESULT_SCREEN_LAYOUT;
```

Better:

```ts
renderResultScreen(this, {
  backgroundKey,
  title,
  subtitle,
  context,
  primaryLabel,
  secondaryLabel,
  theme,
  onPrimary,
  onSecondary,
});
```

Do not build a big UI framework.

---

# Castle Game Over

Use:

```txt
background: castle_game_over_bg
title: PERDU
subtitle: L’illusion t’a piégé
context: level.name
primary: REJOUER
secondary: CARTE
```

---

# Castle Clear

Use:

```txt
background: castle_clear_bg
title: STAGE CLEAR or BOSS CLEAR
subtitle: Castle Boss débloqué or Monde 1 terminé
context: next level name if useful
primary: CONTINUER
secondary: CARTE
```

---

# Layout rules

- Primary button must be dominant.
- Secondary button must be lower priority.
- No button should sit too low under mobile browser controls.
- Do not duplicate result coordinates in multiple places.

---

# Validation

Take screenshots of:
- Game Over,
- Stage Clear,
- Boss Clear.

They should look like one family.

If Clear and Game Over feel like different systems, patch fails.
