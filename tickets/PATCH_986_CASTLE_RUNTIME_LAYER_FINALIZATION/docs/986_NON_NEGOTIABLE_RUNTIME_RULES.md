# 986 — Non-Negotiable Runtime Rules

## Rule 1 — No legacy frame for Castle gameplay

Castle gameplay must not use any frame image that contains:
- HUD,
- score,
- bars,
- headers,
- button-like panels,
- old UI ornaments.

If an old frame asset contains UI, it is forbidden in Castle gameplay.

---

## Rule 2 — The background is passive

`castle_gameplay_bg.png` is atmosphere only.

It must not define:
- grid position,
- HUD,
- buttons,
- score,
- panels.

---

## Rule 3 — Runtime owns the board

The gameplay board must be drawn by code:
- board panel,
- grid border,
- grid lines,
- dark backing.

---

## Rule 4 — Runtime owns HUD

HUD is code:
- strip,
- labels,
- objective,
- boss HP.

No image layer may draw inside HUD space.

---

## Rule 5 — Result screens have no unused slots

If a button is not used, do not draw its container.

Exactly:
- primary action,
- secondary action.

No third ghost container.

---

## Rule 6 — Do not solve layer bugs with more art

No new image generation.
No image edits.

Fix the render path.
