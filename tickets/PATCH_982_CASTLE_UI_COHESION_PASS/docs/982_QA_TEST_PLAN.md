# 982 — QA Test Plan

## Roadmap status

```txt
Phase 2 — Castle UI Cohesion
Gate before PATCH 990 template extraction
```

---

# Automated

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

# Manual visual QA

## Level Intro

- [ ] Castle background visible.
- [ ] Main panel readable.
- [ ] Text is not too dense.
- [ ] `JOUER` is clearly primary.
- [ ] `CARTE` is clearly secondary.

## Gameplay HUD

- [ ] No ghosted old score behind HUD.
- [ ] `CASTLE` readable.
- [ ] `STAGE 1` readable.
- [ ] `MAGIC 0/10` readable.
- [ ] HUD does not hide snake/grid.

## Game Over

- [ ] Uses `castle_game_over_bg.png`.
- [ ] Runtime title visible.
- [ ] Runtime subtitle visible.
- [ ] Runtime buttons visible.
- [ ] Feels like Castle, not generic neon prototype.
- [ ] `REJOUER` works.
- [ ] `CARTE` works.

## Stage Clear

- [ ] Uses `castle_clear_bg.png`.
- [ ] Stage clear title visible.
- [ ] Boss unlock message visible.
- [ ] Continue works.
- [ ] Map works if present.

## Boss Clear

- [ ] Uses `castle_clear_bg.png`.
- [ ] Boss clear title visible.
- [ ] World complete message visible.
- [ ] Continue/map works.

---

# Regression QA

- [ ] Title screen still works.
- [ ] World Map still works.
- [ ] Castle Stage 1 still launches.
- [ ] Castle Game Over retry still launches level.
- [ ] Castle Stage Clear unlocks boss.
- [ ] Castle Boss still launches.
- [ ] Castle Boss defeat still clears.
- [ ] Non-Castle scenes do not crash.

---

# Pass gate

Do not proceed to PATCH 990 unless:
- HUD is clean;
- Castle Game Over is themed;
- Castle Clear is themed;
- intro is readable;
- buttons are consistent.
