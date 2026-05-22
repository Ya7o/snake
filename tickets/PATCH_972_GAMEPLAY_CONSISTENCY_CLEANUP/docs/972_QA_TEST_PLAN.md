# 972 — QA Test Plan

## Automated

Run:

```bash
npm ci
npm run build
```

Then, if scripts exist:

```bash
npm run test
npm run qa
npm run lint
```

Do not create heavy infrastructure for this patch.

---

## Manual Test A — Normal danger

1. Launch a level with an active hazard mechanic.
2. Wait for active state.
3. Move snake into hazard.
4. Confirm immediate Game Over.
5. Repeat with inactive/decorative visual.
6. Confirm no death.

Pass:

```txt
Danger state matches death state.
```

---

## Manual Test B — Boss danger

1. Launch a boss level.
2. Identify boss lethal zone/pattern.
3. Move snake into lethal zone.
4. Confirm immediate Game Over.

Pass:

```txt
Boss hazards kill after movement.
```

---

## Manual Test C — Boss weak point

1. Launch a boss level.
2. Hit weak point/vulnerable cell.
3. Confirm HP decreases.
4. Repeat until HP reaches 0.
5. Confirm stage clear.

Pass:

```txt
Boss damage is reliable and readable.
```

---

## Manual Test D — Conflict priority

If easy to reproduce:

1. Put/observe a pickup and hazard on same target path.
2. Enter the cell.
3. Confirm Game Over wins.

Pass:

```txt
Death has priority over reward.
```

---

## Manual Test E — Regression flow

1. Fresh save.
2. Start node 1.
3. Clear node 1.
4. Return to World Map.
5. Confirm node 2 unlocks.
6. Launch node 2.

Pass:

```txt
PATCH 971 progression still works.
```
