# 980 — Castle Tuning Requirements

## Roadmap status

```txt
Phase 2 — Castle Vertical Slice
Focus: first-world playable tuning
```

---

# Target feel

Castle should be:

```txt
learnable
fair
slightly magical
not punishing
```

This is World 1. Do not tune it like a late-game level.

---

# Recommended values

Adapt to current code.

## Stage 1

```txt
target pickups: 8–12
speed: forgiving
hazard clusters: 1–3
warning duration: clearly visible
active duration: not too long
```

## Boss

```txt
bossHp: 3
attack cadence: slow/medium
weak point window: generous
danger pattern: readable
```

---

# Failure causes

Good failure:
- player ignores warning,
- player panics,
- player greedily goes for pickup.

Bad failure:
- wall appears instantly,
- weak point is unclear,
- danger cell not visible,
- boss hitbox ambiguous,
- controls fight the player.

---

# Tuning rule

If testers die and say:

```txt
I know what I did wrong
```

the tuning is probably good.

If testers die and say:

```txt
What killed me?
```

the design is failing.
