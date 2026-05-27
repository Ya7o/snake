# 989 — QA Test Plan

## Automated

```bash
npm ci
npm run build
```

If available:

```bash
npm run test
npm run lint
npm run qa
```

---

# Asset QA

- [ ] Only selected OpenMoji SVGs exist in repo.
- [ ] Full OpenMoji repo is not committed.
- [ ] No huge asset folder added.
- [ ] Filenames are semantic.
- [ ] Broken paths do not occur.

---

# Visual QA

## Title screen
- [ ] Tokens/icons render.
- [ ] Tokens are readable at display size.
- [ ] Icons do not overpower title.

## World map
- [ ] Icons render if used.
- [ ] Locked/unlocked state still readable.
- [ ] Icons do not break selection.

## HUD
- [ ] Icons are readable if used.
- [ ] Text remains primary.
- [ ] No clutter.

---

# Attribution QA

- [ ] README or docs include OpenMoji attribution.
- [ ] License mention exists.
- [ ] Link to OpenMoji exists.

---

# Regression QA

- [ ] Title screen still starts the game.
- [ ] World Map still works.
- [ ] Gameplay still works.
- [ ] Build passes.
