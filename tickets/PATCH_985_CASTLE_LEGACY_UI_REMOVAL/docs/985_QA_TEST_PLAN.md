# 985 — QA Test Plan

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

# Manual gameplay QA

1. Launch Castle Stage 1.
2. Inspect top HUD.
3. Confirm no old bars/header are visible.
4. Confirm `CASTLE / STAGE 1 / MAGIC 0/10` is readable.
5. Confirm grid starts below HUD.
6. Confirm gameplay still works.

---

# Manual Stage Clear QA

1. Clear Castle Stage 1.
2. Confirm Stage Clear screen appears.
3. Confirm only `CONTINUER` and `CARTE` buttons appear.
4. Confirm no empty slot below `CARTE`.
5. Confirm `CONTINUER` works.
6. Confirm `CARTE` works.

---

# Manual Game Over QA

1. Lose Castle Stage 1.
2. Confirm Castle Game Over appears.
3. Confirm `REJOUER` works.
4. Confirm `CARTE` works.
5. Confirm no empty slot or old panel stack.

---

# Regression QA

- [ ] Title screen still works.
- [ ] World Map still works.
- [ ] Castle intro works.
- [ ] Castle gameplay works.
- [ ] Castle death works.
- [ ] Castle clear works.
- [ ] Castle boss still launches.
- [ ] Other universes do not crash.

---

# Pass gate

Patch passes only if:
- build OK;
- legacy gameplay header gone;
- result empty slot gone;
- no scope expansion.
