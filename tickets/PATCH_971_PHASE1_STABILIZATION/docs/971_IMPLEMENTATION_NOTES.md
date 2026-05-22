# 971 — Implementation Notes

## Suggested implementation path

### 1. Inspect save system

Find where default save is created.

Replace any logic that does this:

```ts
unlockedNodes: MAP_NODES.map(node => node.id)
```

with first-node-only unlock.

Example:

```ts
const FIRST_NODE_ID = 'node_1';

unlockedNodes: [FIRST_NODE_ID]
```

If there is already a map config, derive the first node from config instead of hardcoding, but do not overengineer.

---

### 2. Fix sanitize logic

Sanitize should:
- remove invalid node ids,
- preserve valid unlocked nodes,
- ensure first node is always unlocked,
- not add all nodes.

Good sanitize behavior:

```txt
if no valid unlocked node exists → unlock first node
else preserve current valid progression
```

Bad sanitize behavior:

```txt
add every map node to unlockedNodes
```

---

### 3. Add danger-cell interface

Keep it small.

Possible type:

```ts
export type Cell = { x: number; y: number };

export type DangerCell = Cell & {
  source?: string;
  lethal?: boolean;
};
```

Possible base method:

```ts
getDangerCells(): DangerCell[] {
  return [];
}
```

Mechanics without hazards do not need custom logic.

Mechanics with hazards override it.

---

### 4. Check danger after snake movement

In `GameScene`, after the snake head position changes, call something like:

```ts
const head = this.snake.getHead();
const dangerCells = [
  ...this.mechanic.getDangerCells(),
  ...this.boss?.getDangerCells?.() ?? [],
];

if (dangerCells.some(cell => cell.x === head.x && cell.y === head.y)) {
  this.triggerGameOver('danger');
}
```

Adapt to existing architecture.

Important: avoid allocating too much every frame if the existing code is performance-sensitive, but do not prematurely optimize.

---

### 5. Add public context sync

In `BaseMechanic`:

```ts
syncContext(patch: Partial<MechanicContext>): void {
  this.ctx = {
    ...this.ctx,
    ...patch,
  };
}
```

or equivalent.

Then in `GameScene`:

```ts
this.mechanic.syncContext({
  snakeHead,
  score,
  elapsedMs,
  ...
});
```

No unsafe casting.

---

### 6. World Map Play button

Reuse existing UI drawing style.

Do not create a new UI framework.

A simple footer/panel is enough:

```txt
Selected: Level Name
World: Castle
Type: Stage/Boss
[JOUER]
```

If locked:

```txt
[VERROUILLÉ]
```

---

### 7. Boss HP

Find boss creation.

Pass `levelConfig.bossHp`.

Fallback:

```ts
const hp = Math.max(1, levelConfig.bossHp ?? 3);
```

---

## Avoid these mistakes

Do not:
- unlock all nodes in dev mode unless explicitly gated by a debug flag;
- make danger collision depend on rendered sprites;
- introduce a large event system;
- duplicate progression in multiple places;
- add new art;
- add new mechanics.

---

## Good final shape

After this patch, Phase 2 can safely focus on:
- vertical slice,
- juice,
- one world polish,
- menu polish,
- audio,
- tuning.

But not before this stabilization is complete.
