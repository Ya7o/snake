# 985 — Acceptance Screenshot Gate

## Before PATCH 990

These screenshots are mandatory.

Do not proceed to template extraction unless they pass.

---

# 1. Castle Gameplay

Must show:
- runtime HUD only;
- no red/blue old bars;
- no old score digits;
- no old hearts;
- readable grid;
- readable objective.

Fail if:
- any old header artifact remains.

---

# 2. Castle Stage Clear

Must show:
- `STAGE CLEAR`;
- progression message;
- `CONTINUER`;
- `CARTE`;
- no empty third slot;
- no legacy panel stack.

Fail if:
- empty rectangle exists below `CARTE`.

---

# 3. Castle Game Over

Must show:
- `PERDU`;
- subtitle;
- `REJOUER`;
- `CARTE`;
- Castle-themed background;
- no empty slot.

---

# 4. Castle Intro

Optional but recommended.

Must show:
- `JOUER` primary;
- `CARTE` secondary;
- readable objective and danger text.

---

# Pass decision

PATCH 990 can begin only if:
- gameplay screenshot is clean;
- result screens have no legacy slots;
- Castle feels like background + runtime UI.
