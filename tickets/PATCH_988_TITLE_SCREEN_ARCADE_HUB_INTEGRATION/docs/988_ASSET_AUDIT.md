# 988 — Asset Audit

## Assets included

```txt
title_hub_bg.png
world_token_castle.png
world_token_speed.png
world_token_streets.png
world_token_fighter.png
world_token_outrun.png
world_token_shinobi.png
world_token_kombat.png
world_token_paperboy.png
```

---

# title_hub_bg.png

## Strengths

- Strong “portal between worlds” concept.
- Good visual connection to the 8-universe structure.
- Dark enough to support bright runtime text.
- Premium compared to current generic grid screen.

## Risk

The floating islands are visually rich. If the runtime logo is placed too high or too low, it may compete with the islands.

## Recommendation

Place `SNAKE DRIVE` around upper-middle, not directly over the most detailed islands.

Use a subtle dark scrim behind text only if necessary.

---

# Token audit

The tokens are visually appealing but detailed.

## Main risk

At 32 px they may be unreadable.

## Recommended display size

```txt
56–64 px on mobile
```

If 8 tokens do not fit cleanly in one row:
```txt
use 4 + 4 grid
```

## Token consistency

They share:
- circular/gold frame language,
- jewel accent,
- pixel-art style,
- black transparent-ish surrounding area.

This is good for a unified title screen.

## Potential issue

Some tokens are more literal than others:
- OutRun token includes a car-like object.
- Fighter token includes a fist/energy symbol.
- Kombat token includes dragon/flame-like emblem.

This is acceptable for a prototype, but avoid official names/logos in UI labels.

---

# Recommended file names

Use stable semantic names, not generated names:

```txt
title_hub_bg.png
world_token_castle.png
world_token_speed.png
world_token_streets.png
world_token_fighter.png
world_token_outrun.png
world_token_shinobi.png
world_token_kombat.png
world_token_paperboy.png
```

---

# Asset usage rule

Do not use the tokens as buttons yet unless the world selection is ready.

For title screen v1, use them as:
```txt
visual promise / progression strip
```
