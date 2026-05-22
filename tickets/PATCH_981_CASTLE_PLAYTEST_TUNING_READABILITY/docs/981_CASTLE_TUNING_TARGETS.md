# 981 — Castle Tuning Targets

## Roadmap status

```txt
Phase 2 — Castle Vertical Slice tuning
```

---

# Castle Stage 1 target

The first Castle level should feel:

```txt
clear
fair
slightly tense
not punishing
```

---

# Recommended tuning direction

Current values may be close. Adjust only after reading the code.

Recommended ranges:

```txt
warning duration: generous
active duration: short/medium
max active walls: low
spawn interval: not too fast
objective quota: 8–12
snake speed: forgiving
```

If concrete constants exist, prefer small changes.

Example direction:

```txt
WARNING_TICKS >= ACTIVE_TICKS
MAX_WALLS <= 3
SPAWN_INTERVAL_TICKS gives breathing room
```

Do not overfit without playtest.

---

# Boss target

Castle boss should be beatable in:

```txt
1–3 minutes
```

Recommended:
- boss HP around 3;
- weak-point window generous;
- attack warning visible;
- danger patterns simple.

---

# Session target

World 1 complete:

```txt
3–6 minutes
```

This is enough for mobile.

---

# When to make it easier

Make Castle easier if:
- player dies without knowing why;
- warning is missed repeatedly;
- boss weak point is not understood;
- stage takes more than 3 minutes often;
- retry feels frustrating.

---

# When to make it harder

Make Castle harder only if:
- player clears stage without noticing the mechanic;
- boss can be defeated accidentally;
- no tension exists.

Do not make World 1 hard for ego reasons.
