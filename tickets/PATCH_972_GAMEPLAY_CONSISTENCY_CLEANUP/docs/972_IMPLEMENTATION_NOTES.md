# 972 — Implementation Notes

## Suggested approach

### Step 1 — inspect collision flow

Open `GameScene` and find the update loop.

Identify:
- input handling,
- mechanic tick,
- snake movement,
- wall/self collision,
- danger collision,
- pickup logic,
- boss logic,
- clear/game over transitions.

Do not rewrite everything.

Just make the order explicit and safe.

---

### Step 2 — define minimal collision helpers

If existing helpers exist, reuse them.

Useful helpers:

```ts
sameCell(a, b)
isInsideGrid(cell)
containsCell(cells, head)
```

Do not add a large collision engine.

---

### Step 3 — normalize mechanics

For each mechanic:
- keep visual generation in `getExtraEntities()`;
- expose lethal cells in `getDangerCells()`;
- remove normal `hitDanger` returns caused by old-head collision if redundant;
- leave comments only for justified exceptions.

Good comment example:

```ts
// Exception: this mechanic triggers damage from a timed global effect, not cell collision.
```

---

### Step 4 — normalize bosses

Bosses can remain simple.

Minimum useful API:

```ts
getDangerCells(): DangerCell[]
getWeakPoints(): Cell[]
damage(amount?: number): BossHitResult
```

Or equivalent existing names.

Avoid a complex boss framework.

---

### Step 5 — GameScene resolution priority

Recommended final priority:

```ts
if (staticCollision || dangerCollision) {
  triggerGameOver();
  return;
}

if (bossWeakPointHit) {
  damageBoss();
  if (bossDefeated) {
    triggerClear();
    return;
  }
}

if (pickupHit) {
  collectPickup();
}

if (objectiveComplete) {
  triggerClear();
}
```

Adapt to current code.

---

### Step 6 — QA

Add static QA checks where simple.

Do not simulate full gameplay unless already supported.

Good QA for this patch:
- map/level references;
- boss HP values;
- factory entries;
- first node unlock behavior;
- danger API presence;
- documented linear progression debt.

---

## Important warning

Do not try to solve future branching progression in this patch.

Current linear progression is acceptable if documented.

Phase 2 needs a stable vertical slice, not a full campaign graph system.
