# 986 — QA Test Plan

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

# Manual QA — Castle Gameplay

1. Launch Castle Stage 1.
2. Inspect top HUD.
3. Confirm HUD is the only HUD.
4. Inspect grid area.
5. Confirm no old frame/header remains.
6. Confirm board panel is clean.
7. Confirm snake and pickup are readable.
8. Confirm gameplay works.

Pass:
```txt
No legacy visual layer remains in Castle gameplay.
```

---

# Manual QA — Game Over

1. Lose Castle Stage 1.
2. Confirm Game Over appears.
3. Confirm no unused slot.
4. Confirm `REJOUER` works.
5. Confirm `CARTE` works.

---

# Manual QA — Stage Clear

1. Clear Castle Stage 1.
2. Confirm Stage Clear appears.
3. Confirm no empty rectangle under `CARTE`.
4. Confirm `CONTINUER` works.
5. Confirm `CARTE` works.

---

# Regression QA

- [ ] Title screen still works.
- [ ] World Map still works.
- [ ] Castle intro still works.
- [ ] Castle gameplay still works.
- [ ] Castle Game Over still works.
- [ ] Castle Stage Clear still works.
- [ ] Castle boss still works.
- [ ] Other universes do not crash.

---

# Screenshot gate

Send screenshots:
- Castle Gameplay.
- Castle Game Over.
- Castle Stage Clear.

PATCH 990 is blocked until these are clean.
