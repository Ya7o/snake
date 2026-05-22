# 983 — QA Test Plan

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

# Screenshot validation required

After implementation, collect these four screenshots:

```txt
1. Castle Intro
2. Castle Gameplay HUD
3. Castle Game Over
4. Castle Stage Clear or Boss Clear
```

Do not proceed to PATCH 990 without screenshot validation.

---

# Castle Gameplay HUD QA

Pass if:

- [ ] No old baked score numbers visible.
- [ ] No old baked bars/hearts visible.
- [ ] HUD background is clean.
- [ ] `CASTLE` is readable.
- [ ] `STAGE 1` is readable.
- [ ] `MAGIC 0/10` is readable.
- [ ] Grid starts below HUD.
- [ ] HUD does not cover gameplay.

Fail if:

- [ ] Any old score like `012345` or `098765` remains visible.
- [ ] Any old hud bar remains visible behind text.
- [ ] Text requires zooming to read.

---

# Result Screen QA

Game Over:
- [ ] Castle background visible.
- [ ] `PERDU` readable.
- [ ] Subtitle readable.
- [ ] Primary button clearly gold.
- [ ] Secondary button clearly muted.
- [ ] Buttons not too low.

Clear/Boss Clear:
- [ ] Castle clear background visible.
- [ ] Title readable.
- [ ] Progression message readable.
- [ ] Continue button primary.
- [ ] Map button secondary.

---

# Intro QA

- [ ] Title readable.
- [ ] OBJECTIF readable.
- [ ] DANGER readable.
- [ ] Text not crowded.
- [ ] JOUER dominates.
- [ ] CARTE secondary.

---

# Regression QA

- [ ] Title screen still launches game.
- [ ] World Map still works.
- [ ] Castle Stage 1 launches.
- [ ] Death opens Game Over.
- [ ] Retry works.
- [ ] Stage Clear unlocks boss.
- [ ] Boss Clear still works.
- [ ] Non-Castle universes do not crash.

---

# Pass gate

PATCH 983 passes only if:
- build OK;
- HUD artifacts are gone;
- result screens use shared layout;
- screenshots confirm Castle is cohesive.
