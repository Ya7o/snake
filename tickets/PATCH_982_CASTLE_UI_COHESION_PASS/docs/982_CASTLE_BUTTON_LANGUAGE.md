# 982 — Castle Button Language

## Goal

Castle buttons must feel like part of the same UI family.

---

# Primary action

Used for:

```txt
JOUER
REJOUER
CONTINUER
```

Style:
- gold / warm yellow;
- strong border;
- high contrast text;
- subtle magic/fantasy feel.

---

# Secondary action

Used for:

```txt
CARTE
```

Style:
- dark violet/black;
- thinner border;
- lower visual priority;
- still readable.

---

# Danger

Do not make the primary retry button fully red.

Game Over can use red for:
- frame accent,
- title accent,
- small glow.

But `REJOUER` should remain a primary action in the Castle language.

---

# Tap target

Mobile buttons should remain large.

Recommended minimum:

```txt
height >= 56 CSS px
```

or equivalent canvas scale.

---

# Consistency rule

If `JOUER` is gold in intro, `REJOUER` and `CONTINUER` should also feel like the same action family.
