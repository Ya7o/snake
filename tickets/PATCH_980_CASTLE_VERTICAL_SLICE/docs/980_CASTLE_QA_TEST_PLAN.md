# 980 — Castle QA Test Plan

## Roadmap status

```txt
Phase 2 — Castle Vertical Slice
Gate: Castle must feel coherent before other worlds are polished
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

# QA checks to add or extend

## Castle data

- [ ] Castle Stage 1 exists.
- [ ] Castle Boss exists.
- [ ] Castle Stage 1 has valid objective.
- [ ] Castle Boss has `bossHp >= 1`.
- [ ] Castle Stage 1 unlocks Castle Boss.
- [ ] Castle Boss completion is possible.

## Castle mechanic

- [ ] Illusion mechanic has safe/warning/active states or equivalent.
- [ ] Warning cells are not lethal.
- [ ] Active cells are lethal.
- [ ] Active danger cells stay inside grid bounds.
- [ ] No invisible danger cells.

## Castle boss

- [ ] Boss exposes danger cells.
- [ ] Boss exposes weak points.
- [ ] Weak point hits reduce HP.
- [ ] HP 0 triggers clear.
- [ ] Danger cells kill after movement.

---

# Manual test — fresh run

1. Clear save.
2. Start game.
3. Open World Map.
4. Confirm Castle Stage 1 unlocked.
5. Confirm Castle Boss locked.
6. Launch Castle Stage 1.
7. Read intro.
8. Play until first illusion warning.
9. Verify warning is readable.
10. Enter active wall.
11. Verify immediate death.
12. Retry.
13. Clear Castle Stage 1.
14. Confirm Castle Boss unlocks.
15. Launch Castle Boss.
16. Hit weak point.
17. Confirm HP decreases.
18. Defeat boss.
19. Confirm world clear feedback.

---

# Manual test — readability

Ask or simulate a fresh player.

They should understand within 30 seconds:

```txt
walls warn before appearing
active walls kill
collect target
boss weak point can be hit
```

If not, improve intro/HUD/FX before adding content.

---

# Pass gate

Patch passes if:

- [ ] build OK,
- [ ] Castle Stage 1 playable,
- [ ] Castle Boss beatable,
- [ ] mechanic readable,
- [ ] progression works,
- [ ] HUD readable,
- [ ] no major regression to map/title/gameplay loop.
