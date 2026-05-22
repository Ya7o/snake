# 985 — Result Screen Cleanup

## Main problem

Stage Clear still shows an empty legacy slot below `CARTE`.

This is either:
- an inactive third button,
- a leftover placeholder,
- an old panel drawn by the previous layout,
- or a background/container that should no longer exist.

Remove it.

---

# Required result layout

All Castle result screens should have:

```txt
title
subtitle
optional context
primary button
secondary button
```

Only two buttons.

No third slot.

---

# Game Over

Expected:

```txt
PERDU
L’illusion t’a piégé
JARDIN D’ILLUSION
[REJOUER]
[CARTE]
```

---

# Stage Clear

Expected:

```txt
STAGE CLEAR
Castle Boss débloqué
MIROIR SORCIÈRE
[CONTINUER]
[CARTE]
```

or similar.

No empty rectangle under `CARTE`.

---

# Boss Clear

Expected:

```txt
BOSS CLEAR
Monde 1 terminé
[CONTINUER]
[CARTE]
```

No empty rectangle under `CARTE`.

---

# Implementation target

If there is duplicated code in:
- `GameOverScene`,
- `ClearScene`,

replace with:
- shared layout constants,
- or a small helper.

Do not build a big framework.

---

# Pass condition

Screenshots must show:
- one primary button,
- one secondary button,
- no unused panel.
