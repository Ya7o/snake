# 981 — Castle Readability Rules

## Rule 1 — Warning must be non-lethal

A warning wall exists to teach.

```txt
warning = danger soon
active = danger now
```

If warning kills, the design fails.

---

## Rule 2 — Active must be unmistakable

Active walls must look more dangerous than warning walls.

Use:
- stronger opacity,
- stronger outline,
- sharper color,
- pulsing glow.

---

## Rule 3 — No invisible danger

Every lethal Castle cell must be visible.

If `getDangerCells()` returns a cell, the player should have a visual clue.

---

## Rule 4 — Weak point must contrast with danger

Boss danger and boss weak point must not share the same visual language.

Example:

```txt
danger = purple/red
weak point = gold/white/blue bright
```

Exact colors can follow existing palette.

---

## Rule 5 — Feedback must be immediate

When the player dies:
```txt
instant clear feedback
```

When the boss is hit:
```txt
instant hit feedback
```

When the stage clears:
```txt
clear message
```

No ambiguity.

---

## Rule 6 — FX must serve gameplay

FX is only useful if it improves comprehension.

Bad FX:
- hides grid,
- distracts from snake,
- makes warning/active harder to tell apart.

Good FX:
- pulse on warning,
- flash on hit,
- glow on active danger.
