# 990 V3 — QA And Acceptance

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

# Required checks

- [ ] `world/` icons copied.
- [ ] `hud/` icons copied.
- [ ] `pickups/` icons copied.
- [ ] `obstacles/` icons copied.
- [ ] `danger/` icons copied.
- [ ] `boss/` icons copied.
- [ ] `result/` icons copied.
- [ ] Key/pause/shield/star icons exist or have fallback.
- [ ] Registry includes `CASTLE_V1_OPENMOJI`.
- [ ] Build passes.
- [ ] No full OpenMoji repo committed.
- [ ] No backgrounds or main sprites replaced.

---

# Screenshot checks after integration

Send:
```txt
1. Title screen / world icons
2. Castle gameplay with pickup and obstacle if visible
3. Pause/result screen if pause/play/home icons are visible
```
