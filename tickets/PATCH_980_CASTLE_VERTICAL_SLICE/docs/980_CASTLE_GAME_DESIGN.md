# 980 — Castle Game Design

## Roadmap status

```txt
Phase 2 — Vertical Slice
World 1 — Castle
Purpose: prove core gameplay, not content volume
```

---

# World fantasy

Castle is about:

```txt
illusion
magic walls
mirror danger
fairy-tale tension
```

It should feel mysterious, but not confusing.

---

# Normal stage

## Player goal

Collect magic tokens until the objective is met.

Example:

```txt
MAGIC 0/10
```

When target is reached:

```txt
STAGE CLEAR
```

or exit opens if the game already uses exits.

---

## Main mechanic

Illusion walls.

States:

```txt
SAFE
WARNING
ACTIVE
```

### SAFE

- visible as faint magic outline or hidden.
- not lethal.

### WARNING

- pulse/blink/glow.
- tells player the cell is about to become dangerous.
- not lethal yet.

### ACTIVE

- solid/high-contrast magic wall.
- lethal via `getDangerCells()`.

---

## Pattern design

First-world readable cadence:

```txt
safe: long enough to understand
warning: at least one clear beat
active: short enough to avoid trapping too long
```

Avoid random unfairness.

Prefer predictable pulses.

---

## Difficulty

Castle Stage 1 should be forgiving.

Allowed pressure:
- one or two illusion clusters,
- slow cadence,
- generous warning.

Avoid:
- many hazards at once,
- instant activation,
- unavoidable walls,
- dense maze.

---

# Boss stage

## Boss fantasy

Generic magical witch/mirror threat.

Avoid official likeness.

Recommended concept:

```txt
Mirror apparition / shadow witch silhouette
```

---

## Boss loop

```txt
1. Boss creates mirror danger pattern.
2. Player avoids active danger cells.
3. Boss reveals weak point.
4. Player touches weak point with snake head.
5. Boss loses 1 HP.
6. Repeat until 0 HP.
```

---

## Boss HP

Recommended first boss:

```txt
bossHp: 3
```

Do not raise unless testing proves too easy.

---

## Boss states

Simple state machine:

```txt
IDLE
WARNING
ATTACKING
VULNERABLE
HIT
DEFEATED
```

This can be implemented simply.

No complex AI.

---

## Boss readability

Weak point must be visually distinct from danger.

Example:

```txt
danger = purple/red active magic
weak point = bright gold/white mirror shard
```

---

# Session duration

Expected full world clear:

```txt
Castle Stage 1: 1–3 minutes
Castle Boss: 1–3 minutes
```

Total first world:

```txt
3–6 minutes
```

This is appropriate for mobile.
