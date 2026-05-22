# 980 — Castle Vertical Slice Directives

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Phase: PHASE 2 — Vertical Slice
Current objective: build 1 complete world first
Selected world: Castle
```

---

## Product goal

Create one world that feels real.

Not perfect.
Not final.
But coherent enough that a tester can understand the game without you explaining it.

---

## Quality target

Aim for:

```txt
80% finished feeling for Castle
30% finished feeling for the rest is acceptable
```

This is deliberate.

A strong vertical slice teaches us what the remaining 7 worlds need.

---

## What “vertical slice” means here

A vertical slice includes:

```txt
map selection
level intro
normal gameplay
mechanic
boss
HUD
clear/fail
progression
light FX
tuning
```

It does not include:
- all worlds,
- all bosses polished,
- final monetization,
- achievements,
- settings,
- perfect art.

---

## Design rule

Castle must teach the player:

```txt
Look for warning.
Avoid active illusion.
Collect objective.
Hit boss when vulnerable.
```

If the player cannot understand that, the slice fails.

---

## Complexity rule

One world.
One mechanic.
One boss pattern family.
One clear loop.

No extra systems.

---

## Priority order

If time is limited:

1. Readable Castle mechanic.
2. Beat-able Castle boss.
3. Clear Level Intro.
4. HUD readability.
5. Clear/fail feedback.
6. Light FX.
7. QA.

Do not spend time polishing secondary worlds.
