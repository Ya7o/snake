# 982 — Castle Screen Template Spec

## Included files

```txt
castle_game_over_bg.png
castle_clear_bg.png
```

Recommended destination:

```txt
src/assets/ui/castle/
```

If the project uses `public/assets`, move according to current conventions.

---

# Asset role

These are not final screens.

They are visual backgrounds/templates.

Runtime code must draw:
- titles,
- subtitles,
- buttons,
- dynamic messages,
- score/progression labels.

---

# Expected usage

## Game Over

Background:

```txt
castle_game_over_bg.png
```

Runtime text:

```txt
PERDU
L’illusion t’a piégé
REJOUER
CARTE
```

## Stage Clear

Background:

```txt
castle_clear_bg.png
```

Runtime text:

```txt
STAGE CLEAR
Castle Boss débloqué
CONTINUER
CARTE
```

## Boss Clear

Background:

```txt
castle_clear_bg.png
```

Runtime text:

```txt
BOSS CLEAR
Monde 1 terminé
CONTINUER
CARTE
```

---

# Layout expectations

Both templates are portrait mobile visual layouts with:
- top header slot,
- main message area,
- primary button zone,
- secondary button zone.

Do not reposition runtime UI wildly between loss and clear.

Keep consistent coordinates.

---

# Important caution

The generated templates may not perfectly match the exact CSS/game canvas coordinate system.

If necessary:
- crop/scale using object-fit cover;
- place runtime panels/buttons with relative percentages;
- do not distort image aspect ratio.

---

# Suggested runtime zones

Use relative placement to survive device differences.

```txt
title area: 18–32% screen height
message area: 34–50%
primary button: 66–75%
secondary button: 78–86%
```

Adapt to the existing scene layout.

---

# Visual validation

A template is integrated correctly if:
- background supports text instead of fighting it;
- no baked text conflicts with runtime text;
- buttons align with visible slots;
- screen reads as Castle instantly.
