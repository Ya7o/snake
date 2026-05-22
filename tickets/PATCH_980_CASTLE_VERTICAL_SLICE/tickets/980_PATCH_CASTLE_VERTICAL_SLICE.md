# 980_PATCH_CASTLE_VERTICAL_SLICE

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — Vertical Slice
Current patch: 980 — Castle Vertical Slice
Goal: 1 complete world polished to 80%
```

---

## Context

Phase 1 is now stable enough.

Recent patches fixed:
- real progression,
- GameScene collision authority,
- danger cells after movement,
- boss weak-point hits after movement,
- boss HP data-driven,
- World Map Play button,
- collision/render separation,
- linear progression debt documented.

Now the project must stop broad stabilization and produce one strong playable proof.

The chosen vertical slice is:

```txt
World 1 — Castle
```

Reason:
- Castle tests mechanics better than OutRun.
- Castle validates illusions, hazards, boss, readability, HUD, feedback, and mobile controls.
- Castle proves the game is more than cosmetic skins.

---

# Goal

Create a polished Castle vertical slice.

Final intended player experience:

```txt
Start game
→ open World Map
→ select Castle Stage 1
→ read clear Level Intro
→ play a readable illusion-based Snake stage
→ clear stage
→ unlock Castle Boss
→ fight boss with clear weak-point rules
→ clear boss
→ return to World Map with progression feedback
```

This should feel like one small finished world, not a prototype sample.

---

# Required focus

This patch must focus on:

1. Castle gameplay readability.
2. Castle illusion mechanic clarity.
3. Castle boss clarity.
4. Castle HUD and feedback.
5. Mobile feel.
6. Light juice/FX.
7. Difficulty tuning.
8. QA.

---

# Files likely to modify

Search actual repo paths before editing.

Likely files:

```txt
src/data/levels.ts
src/data/worlds.ts
src/data/themes.ts
src/scenes/GameScene.ts
src/scenes/LevelIntroScene.ts
src/scenes/WorldMapScene.ts
src/scenes/TitleScene.ts
src/render/*
src/systems/mechanics/CastleIllusionMechanic.ts
src/systems/boss/WitchMirrorBoss.ts
src/systems/boss/*
src/systems/SaveSystem.ts
src/dev/GameplayQAChecks.ts
docs/*
```

---

# Files allowed to create

Only if targeted and useful:

```txt
docs/980_CASTLE_VERTICAL_SLICE_NOTES.md
src/systems/fx/CastleFX.ts
src/ui/CastleHudHints.ts
src/dev/CastleVerticalSliceQAChecks.ts
```

Prefer using existing architecture.

---

# Files forbidden to modify

Do not modify unless essential:

```txt
package.json
vite.config.*
tsconfig.*
public/assets/*
src/assets/*
```

No new generated images in this patch unless the repo already has placeholders intended for them.

---

# Required changes

## 1. Castle stage identity

Castle Stage 1 must have a simple readable identity:

```txt
Mechanic: illusion walls / blinking hazards
Goal: collect enough magic tokens
Threat: avoid appearing illusion walls
```

Do not add multiple mechanics.

### Acceptance criteria

- [ ] Castle Stage 1 has one clear primary gimmick.
- [ ] The gimmick is explained in Level Intro.
- [ ] The gimmick is visible during gameplay.
- [ ] The player can learn it in under 30 seconds.
- [ ] No extra mechanic is added just because it is cool.

---

## 2. Castle mechanic readability

The illusion mechanic must be readable.

Required states:

```txt
inactive / safe
warning / about to appear
active / dangerous
```

If the current implementation has only active/inactive, add a warning state.

Visual language:

```txt
safe = dim / transparent / calm
warning = pulse / blink / glow
active = solid / dangerous / high contrast
```

### Acceptance criteria

- [ ] Player can tell when a wall is safe.
- [ ] Player can tell when a wall is about to become dangerous.
- [ ] Player can tell when a wall is lethal.
- [ ] Active danger cells match `getDangerCells()`.
- [ ] Warning visuals do not kill.
- [ ] No invisible lethal cell exists.

---

## 3. Castle Stage 1 tuning

Tune Castle Stage 1 for a first-world level.

Recommended:

```txt
duration: 60–120 seconds
grid: current project default
target pickups: low/medium
speed: forgiving
hazard cadence: readable
mistake tolerance: high
```

Avoid:
- fast hazards,
- cramped layout,
- too many simultaneous walls,
- boss-level difficulty.

### Acceptance criteria

- [ ] First attempt is learnable.
- [ ] Average clear target is around 1–3 minutes.
- [ ] Early death feels fair.
- [ ] No unavoidable hazard pattern.
- [ ] No softlock.

---

## 4. Castle boss vertical slice

Polish the Castle boss enough to be understandable.

Boss rules must be obvious:

```txt
avoid dangerous mirror/witch pattern
hit weak point when vulnerable
reduce HP
clear at 0 HP
```

Keep boss simple.

Required boss states:

```txt
idle / moving / warning / attacking / vulnerable / hit / defeated
```

These can be lightweight internal states, not a large framework.

### Acceptance criteria

- [ ] Boss weak point is visually readable.
- [ ] Boss danger cells match `getDangerCells()`.
- [ ] Boss weak points match `getWeakPoints()`.
- [ ] `onWeakPointHit()` reduces HP reliably after movement.
- [ ] Boss HP reaches 0 and triggers clear.
- [ ] Boss fight can be completed without hidden knowledge.
- [ ] Boss fight does not rely on official character likeness.

---

## 5. HUD readability

Castle gameplay HUD must show only what matters.

Required information:

```txt
score or tokens collected
target objective
stage name or world
boss HP only during boss
state hint when useful
```

Examples:

```txt
MAGIC 4/10
STAGE 1
DANGER!
BOSS HP 2/3
```

Do not clutter the HUD.

### Acceptance criteria

- [ ] HUD is readable on mobile.
- [ ] Boss HP only appears in boss stage.
- [ ] Normal stage objective is visible.
- [ ] Clear/fail feedback is obvious.
- [ ] No debug-looking labels in normal play.

---

## 6. Level Intro clarity

Castle Level Intro must explain:

For normal stage:
```txt
Objective
Mechanic
Danger
Control reminder
```

For boss:
```txt
Boss objective
Weak point rule
Danger warning
```

Keep intro short.

### Acceptance criteria

- [ ] Normal level intro explains illusion walls.
- [ ] Boss intro explains weak point and danger.
- [ ] Text is short enough for mobile.
- [ ] Player can continue quickly.
- [ ] No wall of text.

---

## 7. Clear / Fail feedback

Stage Clear and Game Over must feel intentional.

Minimum juice:
- short screen shake or flash on death,
- clear banner,
- progression/unlock message,
- button to continue.

Examples:

```txt
STAGE CLEAR
CASTLE BOSS UNLOCKED
TRY AGAIN
```

### Acceptance criteria

- [ ] Death feedback is immediate.
- [ ] Clear feedback is satisfying.
- [ ] Unlock feedback appears after Castle Stage 1.
- [ ] Continue returns to correct screen.
- [ ] Retry works.

---

## 8. Light Castle FX

Add only lightweight runtime FX.

Allowed:
- small sparkle particles,
- subtle pulse on warning walls,
- soft glow on active magic hazards,
- mirror shimmer on weak point,
- minimal screen shake.

Forbidden:
- heavy particle engine,
- new art pipeline,
- complex shaders,
- large animation framework.

### Acceptance criteria

- [ ] FX improve readability, not just decoration.
- [ ] FX do not obscure the Snake grid.
- [ ] Mobile performance remains acceptable.
- [ ] FX can be disabled/reduced easily if needed.

---

## 9. Mobile control validation

Do not redesign controls unless required.

Validate:
- swipes feel responsive,
- no accidental reverse direction,
- buttons do not cover gameplay,
- retry/continue are easy to tap.

### Acceptance criteria

- [ ] Swipe input still works.
- [ ] No reverse-direction bug.
- [ ] UI buttons are tap-friendly.
- [ ] Gameplay area remains unobstructed.

---

## 10. QA checks

Add or extend QA for Castle vertical slice:

- Castle Stage 1 exists.
- Castle Boss exists.
- Castle Stage 1 unlocks Castle Boss.
- Castle Boss has boss HP >= 1.
- Castle mechanic exposes warning/active states or equivalent.
- Castle active danger cells stay inside grid bounds.
- Castle boss exposes danger cells and weak points.
- Castle Stage 1 has valid objective target.
- Build passes.

### Acceptance criteria

- [ ] QA output includes Castle vertical slice checks.
- [ ] QA does not crash.
- [ ] Warnings are actionable.
- [ ] Build passes.

---

# Out of scope

Do not work on:
- Sonic polish,
- Streets polish,
- Fighter polish,
- OutRun polish,
- Shinobi polish,
- Kombat polish,
- Paperboy polish,
- shop,
- economy,
- achievements,
- branching map,
- new background generation,
- audio system overhaul,
- settings menu,
- localization framework.

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

Manual tests:

1. Clear save.
2. Start game.
3. Open World Map.
4. Confirm Castle Stage 1 is unlocked.
5. Confirm Castle Boss is locked.
6. Launch Castle Stage 1.
7. Read Level Intro.
8. Confirm illusion mechanic is understandable.
9. Clear Castle Stage 1.
10. Confirm Castle Boss unlocks.
11. Launch Castle Boss.
12. Hit boss weak point.
13. Confirm HP decreases.
14. Avoid danger cells.
15. Defeat boss.
16. Confirm clear and progression.
17. Retry after death works.
18. Build still passes.

---

# Definition of done

- [ ] Castle Stage 1 feels like a playable first level.
- [ ] Castle illusion mechanic is readable.
- [ ] Castle Boss is understandable and beatable.
- [ ] Level Intro explains both.
- [ ] HUD is readable.
- [ ] Clear/fail feedback is improved.
- [ ] Light FX support readability.
- [ ] Mobile controls still work.
- [ ] Castle progression works.
- [ ] No other worlds are polished in this patch.
- [ ] Build passes.
