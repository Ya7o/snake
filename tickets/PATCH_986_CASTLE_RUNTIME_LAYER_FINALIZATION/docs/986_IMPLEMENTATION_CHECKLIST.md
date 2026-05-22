# 986 — Implementation Checklist

## Before editing

- [ ] Locate Castle background config.
- [ ] Locate Castle gameplay render path.
- [ ] Locate frame renderer calls.
- [ ] Locate HUD renderer.
- [ ] Locate Clear/GameOver button rendering.

---

# Gameplay cleanup

- [ ] Confirm whether `UniverseFrameRenderer` runs for Castle.
- [ ] Disable it for Castle gameplay if it draws old UI.
- [ ] Add runtime board panel.
- [ ] Add runtime board border.
- [ ] Ensure grid draws above board panel.
- [ ] Ensure gameplay objects draw above grid.
- [ ] Ensure HUD draws above all gameplay layers.
- [ ] Confirm no old frame/header asset appears.

---

# Result cleanup

- [ ] Find source of lower empty panel/slot.
- [ ] Remove unused third slot.
- [ ] Ensure only primary/secondary buttons are drawn.
- [ ] Share result layout between GameOver and Clear.

---

# Docs

- [ ] Document final Castle render path.
- [ ] Update QA screenshot gate.

---

# Build

- [ ] `npm ci`
- [ ] `npm run build`

---

# Screenshots

- [ ] Castle Gameplay.
- [ ] Castle Game Over.
- [ ] Castle Stage Clear.
