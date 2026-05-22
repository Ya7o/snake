# 986 — Result Screen Finalization

## Target composition

Result screens must be:

```txt
background
optional scrim
title
subtitle
context
primary button
secondary button
```

Nothing else.

---

# Castle Game Over

Use:
```txt
castle_game_over_bg.png
```

Runtime:
```txt
PERDU
L’illusion t’a piégé
JARDIN D’ILLUSION
REJOUER
CARTE
```

---

# Castle Stage Clear

Use:
```txt
castle_clear_bg.png
```

Runtime:
```txt
STAGE CLEAR
Castle Boss débloqué
MIROIR SORCIÈRE
CONTINUER
CARTE
```

---

# Castle Boss Clear

Use:
```txt
castle_clear_bg.png
```

Runtime:
```txt
BOSS CLEAR
Monde 1 terminé
CONTINUER
CARTE
```

---

# Layout

Use one shared layout.

Suggested:
```txt
titleY: 0.25
subtitleY: 0.37
contextY: 0.48
primaryY: 0.66
secondaryY: 0.79
```

Do not draw a placeholder at `0.88` if no third action exists.

---

# Button rule

Primary:
- gold.

Secondary:
- dark violet.

No unused background panel.

---

# Pass condition

Stage Clear screenshot has:
- no empty rectangle under `CARTE`;
- no third slot;
- no unused legacy panel.
