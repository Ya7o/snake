# 984 — QA Test Plan

## Automated

Run:

```bash
npm ci
npm run build
```

If available:

```bash
npm run test
npm run qa
npm run lint
```

---

# Required screenshots after implementation

Take:

```txt
1. Castle Intro
2. Castle Gameplay
3. Castle Game Over
4. Castle Stage Clear or Boss Clear
```

Do not proceed to PATCH 990 without visual validation.

---

# Castle Intro QA

- [ ] Uses `castle_system_bg`.
- [ ] Runtime panel visible.
- [ ] Runtime text readable.
- [ ] No baked UI.
- [ ] `JOUER` primary.
- [ ] `CARTE` secondary.

---

# Castle Gameplay QA

- [ ] Uses `castle_gameplay_bg`.
- [ ] No baked HUD.
- [ ] No old score digits.
- [ ] No old bars/hearts.
- [ ] HUD runtime only.
- [ ] Grid readable.
- [ ] Snake readable.
- [ ] Pickup readable.

---

# Castle Game Over QA

- [ ] Uses `castle_game_over_bg`.
- [ ] Runtime `PERDU` readable.
- [ ] Runtime subtitle readable.
- [ ] Runtime buttons readable.
- [ ] Retry works.
- [ ] Map works.
- [ ] No baked UI.

---

# Castle Clear QA

- [ ] Uses `castle_clear_bg`.
- [ ] Runtime clear title readable.
- [ ] Runtime progression message readable.
- [ ] Continue works.
- [ ] Map works if present.
- [ ] No baked UI.

---

# Regression QA

- [ ] Title screen still works.
- [ ] World Map still works.
- [ ] Castle Stage 1 launches.
- [ ] Castle Boss launches.
- [ ] Death opens Game Over.
- [ ] Stage clear unlocks boss.
- [ ] Boss clear still works.
- [ ] Other universes do not crash.

---

# Pass gate

PATCH 984 passes only if:
- build OK;
- no baked HUD artifacts remain;
- Castle uses the 4-background model;
- runtime owns all UI;
- screenshots validate the result.
