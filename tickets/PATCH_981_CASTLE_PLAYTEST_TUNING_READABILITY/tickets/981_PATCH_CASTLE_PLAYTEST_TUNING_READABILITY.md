# 981_PATCH_CASTLE_PLAYTEST_TUNING_READABILITY

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — Vertical Slice
Previous patch: 980 — Castle Vertical Slice
Current patch: 981 — Castle Playtest Tuning & Readability
Goal: make Castle understandable and satisfying for a first player
```

---

## Context

PATCH 980 created a credible Castle vertical slice:
- Castle Stage 1 has a clear objective.
- Castle illusion walls have `ghost → warning → active` states.
- Castle danger cells are lethal only when active.
- Castle Boss exposes danger cells and weak points.
- Clear feedback shows boss unlock/world complete.
- Build passes.

But build success is not enough.

The next risk is:

```txt
The game works technically, but a new player does not understand what killed them or how to beat the boss.
```

PATCH 981 must improve readability and feel without adding scope.

---

# Goal

Make Castle feel playable, readable, and fair.

A fresh player should understand within 30 seconds:

```txt
walls warn before becoming dangerous
active walls kill
collect the objective
boss weak point can be hit
boss danger must be avoided
```

---

# Required changes

## 1. Tune illusion wall timings

Review current constants such as:

```ts
SAFE_TICKS
WARNING_TICKS
ACTIVE_TICKS
SPAWN_INTERVAL_TICKS
MAX_WALLS
```

or their equivalent.

Target first-world feel:

```txt
warning: generous
active: short/medium
safe: long enough to breathe
max simultaneous walls: low
```

Recommended direction:
- Increase warning time if deaths feel confusing.
- Keep active time readable but not oppressive.
- Avoid too many simultaneous walls.
- Avoid wall spawns adjacent to unavoidable snake paths if possible.

### Acceptance criteria

- [ ] Player has enough time to react to warning walls.
- [ ] Warning state is visibly different from active state.
- [ ] Active state duration is not frustrating.
- [ ] No invisible or instant lethal wall.
- [ ] First level feels fair, not punishing.

---

## 2. Improve warning/active visual feedback

Do not add new image assets.

Use runtime drawing/FX only.

Improve state readability:

```txt
ghost = faint / transparent / calm
warning = pulsing / blinking / bright outline
active = solid / high-contrast / dangerous
```

Allowed:
- alpha pulse,
- outline thickness change,
- small sparkle,
- color shift,
- screen-space glow if already easy.

Forbidden:
- particle engine rewrite,
- complex shader,
- generated art,
- covering the grid.

### Acceptance criteria

- [ ] Warning cells are obvious.
- [ ] Active cells look lethal.
- [ ] Warning cells do not look lethal.
- [ ] FX do not hide the Snake or grid.
- [ ] Mobile readability is improved.

---

## 3. Improve Castle boss weak-point clarity

The boss weak point must be obvious when vulnerable.

Use simple runtime feedback:
- brighter color,
- pulse,
- sparkle,
- short label,
- outline,
- arrow/marker if existing UI supports it.

Possible short hint:

```txt
FRAPPE
```

or:

```txt
HIT!
```

Keep it short.

### Acceptance criteria

- [ ] Weak point is visually distinct from boss danger.
- [ ] Player can identify what to touch.
- [ ] Weak point only appears or pulses when valid.
- [ ] Weak point collision matches `getWeakPoints()`.
- [ ] No official character likeness is introduced.

---

## 4. Improve boss hit feedback

When the player hits the boss weak point:

Minimum feedback:
- boss HP visibly decreases;
- brief flash or shake;
- sound placeholder or comment if audio is not implemented;
- short hit visual.

Do not add audio system in this patch.

### Acceptance criteria

- [ ] Boss hit is immediately noticeable.
- [ ] HP decrease is clear.
- [ ] Boss vulnerable state cannot be mistaken for danger.
- [ ] Boss defeat feedback is satisfying enough for vertical slice.

---

## 5. Improve death and clear micro-feedback

No big scene rewrite.

Add or improve:
- short flash on death,
- subtle screen shake if existing system supports it,
- clear banner timing,
- unlock message clarity.

Acceptance criteria:

- [ ] Death feels immediate and understandable.
- [ ] Stage Clear feels intentional.
- [ ] Castle Boss unlock message is visible.
- [ ] World 1 complete message is visible.
- [ ] Retry/Map options still work.

---

## 6. Add playtest checklist support

Add or update docs/dev notes with a simple checklist for human testing.

Checklist must answer:

```txt
Did the player understand the wall warning?
Did the player know what killed them?
Did the player know what to collect?
Did the player understand the boss weak point?
Was the boss beatable without explanation?
Was the session too long or too short?
```

### Acceptance criteria

- [ ] Playtest checklist exists in docs or dev notes.
- [ ] It is short and usable.
- [ ] It focuses on Castle, not all 8 worlds.

---

## 7. Add/extend QA checks

Extend lightweight QA to validate Castle tuning assumptions where possible.

Check:
- warning duration > 0;
- active duration > 0;
- max walls within first-world limit;
- Castle boss HP valid;
- Castle boss weak points exposed;
- Castle normal objective valid;
- active danger cells are separate from warning cells.

### Acceptance criteria

- [ ] QA output includes Castle readability/tuning checks.
- [ ] QA does not crash.
- [ ] Build passes.

---

# Files likely to modify

Search actual repo paths first.

Likely:

```txt
src/systems/mechanics/CastleIllusionMechanic.ts
src/systems/boss/WitchMirrorBoss.ts
src/scenes/GameScene.ts
src/scenes/ClearScene.ts
src/scenes/LevelIntroScene.ts
src/render/*
src/dev/GameplayQAChecks.ts
docs/*
```

---

# Files allowed to create

Only if useful:

```txt
docs/981_CASTLE_PLAYTEST_RESULTS_TEMPLATE.md
src/systems/fx/CastleMicroFeedback.ts
src/dev/CastleReadabilityQAChecks.ts
```

Prefer existing files.

---

# Files forbidden to modify

Do not modify unless absolutely necessary:

```txt
package.json
vite.config.*
tsconfig.*
public/assets/*
src/assets/*
```

---

# Out of scope

Do not add:
- new worlds,
- new Castle stages,
- new bosses,
- all-world balancing,
- new image assets,
- audio system,
- economy,
- shop,
- achievements,
- branching progression,
- settings menu,
- localization framework,
- major engine refactor.

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

Manual test:
1. Clear save.
2. Launch Castle Stage 1.
3. Observe warning walls.
4. Confirm warning is understandable before death.
5. Enter warning wall: no death.
6. Enter active wall: immediate death.
7. Clear Castle Stage 1.
8. Launch Castle Boss.
9. Identify weak point without external explanation.
10. Hit weak point and confirm feedback.
11. Defeat boss.
12. Confirm World 1 Complete.
13. Retry and Map buttons still work.

---

# Definition of done

- [ ] Castle Stage 1 is more readable than PATCH 980.
- [ ] Warning walls are clear and fair.
- [ ] Active walls feel dangerous and consistent.
- [ ] Boss weak point is obvious.
- [ ] Boss hit feedback is visible.
- [ ] Death/clear feedback is improved.
- [ ] Playtest checklist exists.
- [ ] QA checks include Castle tuning/readability.
- [ ] Build passes.
- [ ] No new content scope added.
