# 971_PATCH_PHASE1_STABILIZATION

## Context

PATCH 970 introduced the Phase 1 gameplay foundation:
- 8 worlds,
- 16 normal stages,
- 8 boss stages,
- level intro,
- clear/fail flow,
- mechanic factory,
- base mechanics,
- base boss framework,
- improved mobile controls.

The project now compiles, but several foundation issues must be fixed before building Phase 2.

Current critical issues identified:

1. **World Map progression is fake**
   - `SaveSystem` currently unlocks all nodes by default.
   - The player should start with only the first node unlocked.
   - Clearing a level should unlock exactly the next node.

2. **Danger collision timing is fragile**
   - Some mechanics visually expose danger cells via extra entities, but collision can be checked before the snake moves.
   - The snake may enter a dangerous cell and not die immediately.
   - Collision against active danger cells must be checked after snake movement.

3. **Mechanic context synchronization is fragile**
   - `GameScene` accesses mechanic internals using unsafe casting to reach `ctx`.
   - This must be replaced by a public method on the mechanic base class.

4. **World Map mobile UX is weak**
   - If the player has to double tap a node, the action is not obvious enough.
   - A selected level panel with a visible `PLAY` / `JOUER` button must be added.

5. **Boss HP is not properly data-driven**
   - `LevelConfig` has `bossHp`, but `BaseBoss` uses a hardcoded value.
   - Either use `bossHp` properly or remove it. Prefer using it.

6. **QA checks are incomplete**
   - Add checks for progression, danger interface, boss configs, and level reachability.

---

## Goal

Stabilize the Phase 1 gameplay foundation so Phase 2 can safely build on it.

The final result must be:

```txt
Title → World Map → Level Intro → Gameplay → Clear / Game Over → Progression Update → World Map
```

with:
- real progression,
- reliable death on active hazards,
- clean mechanic API,
- clear mobile level launch,
- consistent boss HP,
- stronger automated QA.

---

## Files likely to modify

The exact paths may differ. Search before editing.

Likely files:

```txt
src/systems/SaveSystem.ts
src/scenes/WorldMapScene.ts
src/scenes/GameScene.ts
src/systems/mechanics/BaseMechanic.ts
src/systems/mechanics/MechanicFactory.ts
src/systems/mechanics/*
src/systems/boss/BaseBoss.ts
src/data/levels.ts
src/data/worlds.ts
src/dev/GameplayQAChecks.ts
src/types/*
```

If names differ, adapt to the existing architecture.

---

## Files allowed to create

Only if useful:

```txt
src/types/GameplayTypes.ts
src/systems/mechanics/DangerCells.ts
src/dev/ProgressionQAChecks.ts
src/dev/DangerQAChecks.ts
```

Prefer modifying existing files over adding new abstractions.

---

## Files forbidden to modify

Do not modify unless absolutely necessary:

```txt
package.json
vite.config.*
tsconfig.*
public/assets/*
src/assets/*
```

No new visual assets in this patch.

---

# Required changes

## 1. Fix initial progression

### Required behavior

On a fresh save:

```ts
unlockedNodes = ['node_1']
clearedNodes = []
```

or equivalent.

Do not unlock all nodes by default.

### Clearing a level

When a level is cleared:
- mark current node as cleared;
- unlock only its configured next node;
- do not unlock unrelated worlds;
- do not relock already unlocked nodes.

### Expected progression

```txt
node_1 clear → node_2 unlocked
node_2 clear → node_3 unlocked
...
boss node clear → next world first node unlocked
```

If the map uses a graph:
- use `nextNodeId`;
- if there are branches, unlock only declared children.

### Acceptance criteria

- [ ] New save starts with only first playable node unlocked.
- [ ] Completing node 1 unlocks node 2.
- [ ] Completing node 2 unlocks node 3.
- [ ] Locked nodes cannot be launched.
- [ ] Previously unlocked nodes remain unlocked.
- [ ] Cleared nodes remain marked as cleared.
- [ ] No code path silently unlocks all nodes.

---

## 2. Add reliable danger-cell collision

### Required behavior

Mechanics and bosses that create active hazards must expose their danger cells in a consistent way.

Add or adapt an interface like:

```ts
export type DangerCell = {
  x: number;
  y: number;
  source?: string;
  lethal?: boolean;
};

export interface MechanicDangerProvider {
  getDangerCells(): DangerCell[];
}
```

This does not need to be overengineered.

### Required GameScene behavior

After the snake moves, check the new snake head against:
- static walls,
- obstacles,
- mechanic danger cells,
- boss danger cells.

Order should be conceptually:

```txt
input
mechanic tick
snake movement
static collision
danger-cell collision
pickup collision
win/fail evaluation
render
```

### Important

Do not rely only on `getExtraEntities()` for collision logic.

Rendering entities and collision entities must be separate concepts.

### Acceptance criteria

- [ ] A visible active hazard kills immediately when the snake enters it.
- [ ] Inactive hazard visuals do not kill.
- [ ] Extra decorative entities do not kill unless exposed as danger cells.
- [ ] Boss hazards use the same danger-cell logic or a clearly equivalent path.
- [ ] Collision is checked after snake movement.

---

## 3. Replace unsafe mechanic context access

### Current issue

Avoid code similar to:

```ts
const ctx = (this.mechanic as unknown as { ctx: unknown })['ctx']
```

### Required behavior

Add a public method to `BaseMechanic`, for example:

```ts
syncContext(patch: Partial<MechanicContext>): void {
  this.ctx = {
    ...this.ctx,
    ...patch,
  };
}
```

or:

```ts
updateRuntimeContext(ctx: MechanicContext): void
```

Use the naming that best matches the existing code.

### Acceptance criteria

- [ ] `GameScene` does not access private/protected mechanic internals.
- [ ] No bracket access to `ctx`.
- [ ] No `unknown as { ctx: ... }` workaround.
- [ ] Context updates are routed through a public mechanic method.
- [ ] Existing mechanics still compile without duplicated context code.

---

## 4. Add World Map selected-node launch UX

### Required behavior

World Map must not rely only on double tap.

Add a clear selected-node footer or panel:

```txt
[Selected level name]
[World / Stage / Boss info]
[JOUER]
```

Button behavior:
- if selected node is unlocked: launch level intro;
- if selected node is locked: disabled, label `LOCKED` or `VERROUILLÉ`.

Double tap can remain as shortcut.

### Acceptance criteria

- [ ] Tapping a node selects it.
- [ ] Selected node information is visible.
- [ ] A visible Play button launches unlocked selected level.
- [ ] Locked selected node cannot be launched.
- [ ] Double tap still works if already implemented.
- [ ] Mobile usability is better than relying on hidden gesture.

---

## 5. Make boss HP data-driven

### Required behavior

If `LevelConfig` contains `bossHp`, `BaseBoss` must use it.

Example:

```ts
constructor(ctx: BossContext) {
  this.maxHp = ctx.levelConfig.bossHp ?? 3;
  this.hp = this.maxHp;
}
```

Adapt to the existing architecture.

### Acceptance criteria

- [ ] Boss HP comes from level data.
- [ ] Missing `bossHp` falls back safely to 3.
- [ ] HUD displays current boss HP correctly.
- [ ] Boss death triggers stage clear.
- [ ] QA warns if a boss level has invalid HP.

---

## 6. Strengthen QA checks

Add or extend QA checks to validate:

### Progression

- [ ] New save unlocks only first node.
- [ ] Every non-final node has a valid next node or child unlock rule.
- [ ] Every referenced next node exists.
- [ ] No map node points to missing level config.
- [ ] No level config is unreachable unless intentionally marked debug.

### Danger cells

- [ ] Mechanics with active hazards expose `getDangerCells()` or equivalent.
- [ ] `getExtraEntities()` is not used as the only collision source for lethal hazards.
- [ ] Danger cells remain inside grid bounds.

### Boss

- [ ] Every boss level has valid `bossHp >= 1`.
- [ ] Every boss level has a boss type/factory entry.
- [ ] Every boss can report defeat state.

### Acceptance criteria

- [ ] QA script runs without crashing.
- [ ] QA output is readable.
- [ ] Build still passes.
- [ ] Any warnings are actionable.

---

# Constraints

## Keep it amateur-friendly

Do not introduce:
- ECS,
- Redux,
- complex state machines,
- event bus rewrite,
- dependency injection framework,
- large folder reorganization.

Prefer:
- direct functions,
- small interfaces,
- clear data structures,
- existing architecture.

## Keep patch narrow

Do not add:
- new universes,
- new art,
- audio,
- economy,
- shop,
- achievements,
- daily rewards,
- procedural generation,
- analytics.

## Respect existing architecture

Do not rewrite the engine. Stabilize it.

---

# Tests to run

Minimum:

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

1. Clear browser/local save.
2. Start new game.
3. Confirm only node 1 is unlocked.
4. Select node 1.
5. Confirm Play button appears and launches.
6. Clear node 1.
7. Return to map.
8. Confirm node 2 is unlocked and node 3 is still locked.
9. Enter a level with active hazard.
10. Move snake into active hazard.
11. Confirm immediate death.
12. Enter a boss level.
13. Confirm HP shown.
14. Hit boss until HP reaches 0.
15. Confirm stage clear.

---

# Definition of done

Patch is done only when:

- [ ] Build passes.
- [ ] Real progression works.
- [ ] Danger collision is reliable.
- [ ] Mechanic context sync is clean.
- [ ] World Map has explicit Play button.
- [ ] Boss HP is data-driven.
- [ ] QA checks are expanded.
- [ ] No new assets were added.
- [ ] No broad refactor was introduced.
- [ ] Manual test path works from new save to node 2 unlock.
