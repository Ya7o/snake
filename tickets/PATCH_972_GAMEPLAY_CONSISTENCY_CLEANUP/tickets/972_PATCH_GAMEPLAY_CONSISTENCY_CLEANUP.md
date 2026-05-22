# 972_PATCH_GAMEPLAY_CONSISTENCY_CLEANUP

## Context

The latest build after PATCH 971 compiles and has a much healthier Phase 1 foundation.

However, the gameplay loop still has consistency risks:

1. Some mechanics still perform death checks inside `tick()`.
2. `GameScene` also checks `getDangerCells()` after movement.
3. Bosses sometimes check contact or vulnerability inside their own tick timing.
4. Visual entities and collision entities are not yet fully separated everywhere.
5. QA checks remain too light to catch future regressions.

This can create inconsistent gameplay:
- danger kills may happen before or after movement depending on mechanic;
- boss hits may be delayed by one tick;
- rendered hazards may not match lethal hazards;
- future Phase 2 polish could build on ambiguous rules.

---

## Goal

Clarify gameplay authority.

After this patch:

```txt
Mechanics update state.
Bosses update state.
GameScene resolves collisions after snake movement.
Rendering reads state.
QA verifies the rules.
```

---

# Core rule

## GameScene is the collision authority

`GameScene` must decide:
- wall collision,
- self collision,
- danger collision,
- pickup collection,
- boss hit interaction,
- clear/fail transition.

Mechanics and bosses should not directly trigger death or clear unless the existing architecture absolutely requires it.

They should expose:
- active hazards,
- collectibles/spawn requests,
- boss vulnerable cells/hit zones,
- state updates.

---

# Required changes

## 1. Remove or isolate critical collision checks inside mechanics

Search mechanics for logic equivalent to:

```ts
if (sameCell(ctx.snakeHead, dangerCell)) {
  return { hitDanger: true };
}
```

or similar.

For each case:
- if this is a normal active hazard, move the collision responsibility to `getDangerCells()`;
- if the check is special and must remain, document why in code with a short comment.

Expected mechanic behavior:

```txt
tick() updates timers, hazard state, spawns, visuals.
getDangerCells() exposes lethal cells.
GameScene decides if snake dies.
```

Acceptance criteria:

- [ ] Normal hazards do not kill from `tick()` directly.
- [ ] Normal hazards expose danger cells.
- [ ] Any exception is explicitly commented.
- [ ] Existing gameplay still works.

---

## 2. Standardize boss interaction

Bosses should expose enough information for `GameScene` to resolve interaction consistently.

At minimum, ensure boss API supports:

```ts
getDangerCells(): DangerCell[]
getWeakPoints?(): Cell[]
onWeakPointHit?(): BossHitResult
```

or equivalent naming that fits the codebase.

Do not overengineer.

Expected boss behavior:

```txt
boss.tick() updates pattern/state
GameScene checks snake head after movement
if head hits boss danger cell → death
if head hits weak point/vulnerable cell → boss takes damage
if boss HP <= 0 → clear
```

Acceptance criteria:

- [ ] Boss lethal zones are checked after movement.
- [ ] Boss weak-point hits are checked after movement.
- [ ] Boss damage does not depend only on pre-movement tick timing.
- [ ] Boss defeat still triggers stage clear.
- [ ] Boss HP HUD still works.

---

## 3. Separate rendered extra entities from collision entities

Rendering data must not be treated as collision data by default.

Keep or enforce this distinction:

```txt
getExtraEntities() = visual/rendering support
getDangerCells() = lethal collision support
getWeakPoints() = boss hit support
```

Acceptance criteria:

- [ ] Decorative extra entities do not kill.
- [ ] Lethal entities are exposed through danger cells.
- [ ] Boss weak points are not inferred from decorative rendering.
- [ ] Code comments or types make the distinction clear.

---

## 4. Normalize GameScene resolution order

The conceptual order should be:

```txt
1. read input
2. tick mechanic/boss timers
3. move snake
4. resolve static collisions
5. resolve danger cells
6. resolve boss weak-point hits
7. resolve pickups
8. resolve win/fail/clear
9. render
```

Do not introduce a complex state machine.

A clear sequence in `GameScene.update()` or equivalent is enough.

Acceptance criteria:

- [ ] Danger collision happens after snake movement.
- [ ] Boss hit collision happens after snake movement.
- [ ] Pickup collision happens after snake movement.
- [ ] Clear/fail state is not triggered twice in one tick.
- [ ] Game over has priority over pickup/clear if collision happens same tick.

---

## 5. Strengthen lightweight QA checks

Extend existing QA checks or add small dev checks.

Must check:

### Progression

- [ ] Fresh save equivalent unlocks only first node.
- [ ] No sanitize path unlocks all nodes.
- [ ] Every map node references an existing level.
- [ ] Every level with `mapNodeId` references an existing node.
- [ ] Linear progression debt is documented if next node is derived by array order.

### Mechanics

- [ ] Mechanics with lethal hazards expose `getDangerCells()`.
- [ ] Danger cells stay within grid bounds for sample states if possible.
- [ ] `getExtraEntities()` is not documented as lethal.

### Bosses

- [ ] Every boss level has `bossHp >= 1`.
- [ ] Every boss type exists in factory.
- [ ] Boss exposes danger cells or explicitly has no lethal cells.
- [ ] Boss exposes weak points or an equivalent hit API.

Acceptance criteria:

- [ ] QA runs without crashing.
- [ ] QA output is readable.
- [ ] Warnings are actionable.
- [ ] Build passes.

---

## 6. Document accepted technical debt

Create or update a doc note stating:

```txt
Progression is currently linear by MAP_NODES order.
This is accepted for Phase 1/2.
Do not add branching progression until after vertical slice.
```

Acceptance criteria:

- [ ] Debt is documented.
- [ ] No branching system is implemented in this patch.
- [ ] Future developer knows not to expand progression prematurely.

---

# Files likely to modify

Search actual repo paths before editing.

Likely:

```txt
src/scenes/GameScene.ts
src/systems/mechanics/BaseMechanic.ts
src/systems/mechanics/*
src/systems/boss/BaseBoss.ts
src/systems/boss/*
src/dev/GameplayQAChecks.ts
src/data/levels.ts
src/data/worlds.ts
docs/*
```

---

# Files allowed to create

Only if needed:

```txt
src/types/CollisionTypes.ts
src/dev/CollisionQAChecks.ts
docs/TECH_DEBT_PHASE1.md
```

Prefer modifying existing files if cleaner.

---

# Forbidden

Do not modify:

```txt
public/assets/*
src/assets/*
package.json
vite.config.*
tsconfig.*
```

unless the build genuinely requires it.

No new dependencies.

---

# Out of scope

Do not add:
- new worlds,
- new levels,
- new bosses,
- new visual assets,
- audio,
- economy,
- achievements,
- shop,
- daily rewards,
- procedural generation,
- meta progression,
- full graph progression,
- ECS,
- Redux,
- event bus rewrite.

---

# Tests to run

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

Manual tests:
1. Start fresh save.
2. Verify only first node unlocked.
3. Launch normal level.
4. Enter active hazard: immediate death.
5. Enter inactive/decorative visual: no death.
6. Launch boss level.
7. Hit boss weak point: HP decreases.
8. Enter boss danger cell: immediate death.
9. Reduce boss HP to 0: stage clear.
10. Confirm no double clear / double game over.

---

# Definition of done

- [ ] Build passes.
- [ ] GameScene is the clear collision authority.
- [ ] Mechanics no longer duplicate normal death checks in tick.
- [ ] Boss hit logic is resolved after movement.
- [ ] Danger cells and visual entities are distinct.
- [ ] QA checks are stronger.
- [ ] Linear progression debt is documented.
- [ ] No new content or assets added.
