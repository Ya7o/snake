# PROMPT COPY/PASTE — PATCH 983 CASTLE RUNTIME LAYOUT REBUILD

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/983_PATCH_CASTLE_RUNTIME_LAYOUT_REBUILD.md
docs/983_AUDIT_FINDINGS.md
docs/983_RUNTIME_LAYOUT_CONTRACT.md
docs/983_GAMEPLAY_HUD_REBUILD.md
docs/983_RESULT_SCREEN_REBUILD.md
docs/983_LEVEL_INTRO_POLISH.md
docs/983_QA_TEST_PLAN.md
docs/983_SCOPE_GUARDRAILS.md
docs/983_IMPLEMENTATION_NOTES.md
```

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 2 — Vertical Slice
Patch 982 improved Castle UI, but screenshots show the runtime layout is still not stable.
Patch 983 must fix the runtime layout architecture before template extraction.
```

## Mission

Stop tweaking individual screen coordinates.

Create a small runtime UI layout contract for Castle:
- clean gameplay HUD,
- no baked HUD artifacts,
- shared result screen layout,
- stable intro spacing.

## Main blocker

The Castle gameplay screenshot still shows old baked HUD artifacts behind runtime text.

This must be fixed.

## Required work

1. Centralize gameplay HUD height/layout.
   - Replace `hudH = 34`.
   - Use roughly 52–60 px for mobile.
   - Use same value in `GameScene.computeGridLayout`.

2. Make Castle gameplay HUD fully clean.
   - Opaque or near-opaque HUD strip.
   - Add top/bottom accent lines.
   - No old score/bars/hearts/numbers visible.
   - Add Castle scrim/mask above frame art if needed.

3. Stop full-frame art from contaminating HUD.
   - Mask top baked header, crop it, or force runtime/fallback frame for Castle.
   - Choose the smallest reliable solution.

4. Create shared result screen layout.
   - Avoid separate duplicated magic percentages in GameOver and Clear.
   - Use a helper or shared constants.
   - Keep text/buttons runtime-rendered.

5. Keep Castle Game Over and Clear themed.
   - Use existing templates.
   - Align text/buttons with shared slots.
   - Keep `REJOUER` / `CONTINUER` primary and `CARTE` secondary.

6. Minor Level Intro polish only.
   - Do not redesign.

7. Add/update screenshot validation checklist.
   - Castle Intro.
   - Castle Gameplay HUD.
   - Castle Game Over.
   - Castle Stage Clear/Boss Clear.

## Hard constraints

- No new image generation.
- No new worlds.
- No new gameplay.
- No title screen redesign.
- No template extraction for all worlds yet.
- No dependencies.
- No large UI framework.
- Keep code understandable.

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

- files changed;
- HUD height/layout changes;
- frame masking/cropping decision;
- result screen layout changes;
- intro changes;
- tests run;
- remaining risks.

## Definition of done

- Build passes.
- Castle gameplay HUD has zero old/baked artifacts visible.
- HUD height and grid layout share one source of truth.
- Castle result screens use shared layout/config.
- Castle Game Over/Clear remain themed.
- Intro remains readable.
- No scope expansion.
- Screenshots must validate before PATCH 990.
