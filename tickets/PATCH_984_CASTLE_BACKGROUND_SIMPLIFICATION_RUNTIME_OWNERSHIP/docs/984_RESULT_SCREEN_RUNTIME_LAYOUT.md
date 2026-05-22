# 984 — Result Screen Runtime Layout

## Applies to

```txt
Game Over
Stage Clear
Boss Clear
World Complete
```

---

# Required shared approach

Game Over and Clear should use the same result screen layout helper or constants.

Do not duplicate unrelated coordinate systems.

---

# Suggested config

```ts
export const RESULT_SCREEN_LAYOUT = {
  titleY: 0.26,
  subtitleY: 0.38,
  contextY: 0.48,
  primaryButtonY: 0.68,
  secondaryButtonY: 0.81,
  primaryButtonW: 0.72,
  secondaryButtonW: 0.58,
};
```

Adapt to actual canvas scaling.

---

# Game Over copy

```txt
PERDU
L’illusion t’a piégé
JARDIN D’ILLUSION
REJOUER
CARTE
```

---

# Stage Clear copy

```txt
STAGE CLEAR
Castle Boss débloqué
CONTINUER
CARTE
```

---

# Boss Clear copy

```txt
BOSS CLEAR
Monde 1 terminé
CONTINUER
CARTE
```

---

# Priority

Game Over:
- clarity and retry.

Clear:
- progression and reward.

Both:
- runtime text;
- runtime buttons;
- background only for mood.
