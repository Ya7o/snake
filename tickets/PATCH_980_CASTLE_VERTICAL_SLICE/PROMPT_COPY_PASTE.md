# PROMPT COPY/PASTE — PATCH 980 CASTLE VERTICAL SLICE

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/980_PATCH_CASTLE_VERTICAL_SLICE.md
docs/980_CASTLE_VERTICAL_SLICE_DIRECTIVES.md
docs/980_CASTLE_GAME_DESIGN.md
docs/980_CASTLE_UI_UX_REQUIREMENTS.md
docs/980_CASTLE_TUNING_REQUIREMENTS.md
docs/980_CASTLE_QA_TEST_PLAN.md
docs/980_SCOPE_GUARDRAILS.md
```

## Roadmap position

This is:

```txt
Snake Drive Audit And Game Design Foundations
→ PHASE 2 — Vertical Slice
→ World 1 Castle
```

## Mission

Create a polished Castle vertical slice.

Do not polish all 8 worlds.
Do not add new worlds.
Do not add shop/economy/achievements.
Do not redesign the full engine.

The goal is one convincing first world:

```txt
World Map
→ Castle Stage 1 Intro
→ Castle Stage 1 Gameplay
→ Stage Clear
→ Castle Boss Unlock
→ Castle Boss Intro
→ Castle Boss Gameplay
→ Boss Clear
→ Progression feedback
```

## Required work

1. Castle Stage 1:
   - clear objective,
   - readable illusion mechanic,
   - safe/warning/active hazard states,
   - forgiving first-world tuning.

2. Castle Boss:
   - readable danger pattern,
   - readable weak point,
   - boss HP from data,
   - weak-point hit after movement,
   - clear at 0 HP.

3. UI/HUD:
   - mobile-readable objective,
   - boss HP only in boss,
   - short hints,
   - clear/fail feedback.

4. FX:
   - lightweight runtime FX only,
   - warning pulse,
   - active hazard glow,
   - weak-point sparkle,
   - no heavy visual system.

5. QA:
   - Castle Stage 1 exists,
   - Castle Boss exists,
   - Stage 1 unlocks Boss,
   - active danger cells match visuals,
   - warning cells are not lethal,
   - boss weak-point hits work,
   - build passes.

## Hard constraints

- No new dependencies.
- No new generated image assets.
- No broad refactor.
- No all-world polish.
- No branching progression.
- No economy/shop/meta systems.
- Keep it understandable for an amateur developer.

## Commands to run

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

## Report back with

- files changed,
- Castle mechanic changes,
- Castle boss changes,
- UI/HUD changes,
- tuning choices,
- QA checks added,
- commands run,
- remaining risks.

## Definition of done

- Castle Stage 1 feels playable and fair.
- Castle illusion mechanic is readable.
- Castle Boss is beatable and understandable.
- Castle HUD is mobile-readable.
- Clear/fail feedback is improved.
- Castle progression works.
- No other worlds are expanded.
- Build passes.
