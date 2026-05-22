# 972 — Collision Authority Rules

## Rule 1 — GameScene owns collision outcomes

`GameScene` decides the outcome of:
- death,
- boss damage,
- pickup collection,
- clear/fail transition.

Mechanics and bosses provide state.

They should not normally decide final gameplay transitions.

---

## Rule 2 — Tick updates state only

A mechanic `tick()` should usually do this:

```txt
update timers
toggle active states
spawn or remove logical items
move hazards
return non-collision updates
```

It should not usually do this:

```txt
kill player because snake head is on hazard
clear level
damage boss due to contact
```

Exceptions are allowed only if explicitly justified.

---

## Rule 3 — Render data is not collision data

Keep these concepts separate:

```txt
getExtraEntities() = things to draw
getDangerCells() = things that kill
getWeakPoints() = things that damage boss
```

Never infer lethal collision from decorative render entities.

---

## Rule 4 — Resolve after movement

All important cell interactions should be resolved after the snake head moves.

This makes player input feel fair and predictable.

Correct order:

```txt
tick state
move snake
resolve collision
```

Not:

```txt
resolve collision against old snake position
then move snake
```

---

## Rule 5 — Failure beats reward

If the snake moves into a cell that is both dangerous and rewarding, death should win.

Priority:

```txt
1. game over
2. boss damage / pickup
3. stage clear
```

This prevents unclear edge cases.

---

## Rule 6 — Avoid Phase 2 complexity

Do not add:
- full event queues,
- ECS,
- async gameplay resolution,
- graph progression,
- scripting language.

This patch must keep the project understandable for an amateur developer.
