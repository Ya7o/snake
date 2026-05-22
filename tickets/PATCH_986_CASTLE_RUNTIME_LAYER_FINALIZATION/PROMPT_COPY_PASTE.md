# PROMPT COPY/PASTE — PATCH 986 CASTLE RUNTIME LAYER FINALIZATION

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/986_PATCH_CASTLE_RUNTIME_LAYER_FINALIZATION.md
docs/986_AUDIT_FINDINGS.md
docs/986_NON_NEGOTIABLE_RUNTIME_RULES.md
docs/986_CASTLE_GAMEPLAY_LAYER_ORDER.md
docs/986_RESULT_SCREEN_FINALIZATION.md
docs/986_IMPLEMENTATION_CHECKLIST.md
docs/986_DEBUGGING_INSTRUCTIONS.md
docs/986_QA_TEST_PLAN.md
docs/986_SCOPE_GUARDRAILS.md
```

## Mission

Stop the repeated Castle UI cleanup loop.

The images are correct. Do not regenerate them.

The remaining issue is render layer ownership.

## Main required fix

For Castle gameplay:

```txt
Do not render legacy frame/header/HUD assets.
```

Castle gameplay must be:

```txt
castle_gameplay_bg
runtime board panel
runtime grid
runtime gameplay objects
runtime HUD
```

No old frame.
No old top header.
No old bars.
No old score zones.

## Required result screen fix

For Castle GameOver/Clear:

```txt
background
runtime title
runtime subtitle
runtime context
primary button
secondary button
```

No empty third slot.
No unused lower panel.
No legacy button placeholder.

## Hard constraints

- No new images.
- No image edits.
- No other universes.
- No title screen redesign.
- No new gameplay.
- No dependencies.
- No broad UI framework rewrite.

## Implementation expectations

1. Locate and disable legacy Castle gameplay frame rendering.
2. Add/ensure runtime board panel behind Castle grid.
3. Ensure HUD height/layer is shared and above gameplay.
4. Ensure result screens draw exactly two buttons.
5. Share result layout between GameOver and Clear if not already done.
6. Document final Castle render path.

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
- exact legacy Castle layer disabled/removed;
- final Castle gameplay layer order;
- result screen cleanup;
- commands run;
- remaining risks.

## Definition of done

- Build passes.
- Castle gameplay has no legacy frame/header/HUD artifacts.
- Castle Stage Clear has no empty slot under `CARTE`.
- Castle Game Over remains clean.
- Intro remains acceptable.
- No scope expansion.
