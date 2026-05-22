# 972 — Expected Behavior

## Normal hazard

When a hazard is active and visible:

```txt
snake enters hazard cell → immediate Game Over
```

When a hazard is inactive or purely decorative:

```txt
snake enters cell → no death
```

---

## Mechanic tick

A mechanic tick should be safe to run before movement.

It updates the world state but should not usually kill the player using the old head position.

---

## Boss hazard

When the boss exposes a lethal cell:

```txt
snake enters lethal boss cell → immediate Game Over
```

---

## Boss weak point

When the boss exposes a weak point and the snake enters it:

```txt
boss HP decreases after movement
```

When HP reaches zero:

```txt
stage clear
```

---

## Same-frame conflicts

If the snake enters:
- a pickup cell,
- and a danger cell,

then:

```txt
Game Over wins
```

If the snake damages the boss and also enters danger:

```txt
Game Over wins
```

---

## QA output

QA should produce concise messages:

Good:

```txt
[PASS] Fresh save unlocks only first node
[WARN] Progression is linear by MAP_NODES order — accepted Phase 1 debt
[FAIL] Boss level world_7_boss has invalid bossHp: 0
```

Bad:

```txt
undefined
[object Object]
```
