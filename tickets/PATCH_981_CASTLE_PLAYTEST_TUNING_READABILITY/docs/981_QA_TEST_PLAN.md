# 981 — QA Test Plan

## Roadmap status

```txt
Phase 2 — Patch 981
QA focus: Castle readability and tuning
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

# Static QA additions

Add or extend checks for:

## Castle mechanic

- [ ] warning duration exists and is > 0.
- [ ] active duration exists and is > 0.
- [ ] warning duration is not shorter than active unless intentionally documented.
- [ ] max walls is within first-world range.
- [ ] active danger cells are separate from warning cells.
- [ ] warning cells are not returned as lethal danger cells.

## Castle boss

- [ ] boss HP >= 1.
- [ ] weak points exposed during vulnerable state.
- [ ] danger cells exposed during attack state.
- [ ] weak point and danger cells are not identical in the same state unless documented.

## Castle progression

- [ ] Castle Stage 1 unlocks Castle Boss.
- [ ] Castle Boss clear gives World 1 completion feedback or equivalent.

---

# Manual QA

## Stage readability

1. Launch Castle Stage 1.
2. Wait for warning wall.
3. Enter warning cell if possible.
4. Confirm no death.
5. Wait for active wall.
6. Enter active cell.
7. Confirm immediate death.

## Boss readability

1. Launch Castle Boss.
2. Wait for vulnerable state.
3. Identify weak point visually.
4. Hit weak point.
5. Confirm HP decrease and feedback.
6. Enter danger cell.
7. Confirm death.

## Clear flow

1. Clear Castle Stage 1.
2. Confirm Boss unlock message.
3. Clear Castle Boss.
4. Confirm World 1 Complete message.
5. Return to map.

---

# Pass gate

Patch passes if:
- build OK,
- Castle warning/active are visually distinct,
- boss weak point is obvious,
- hit/death/clear feedback is readable,
- no new scope added.
