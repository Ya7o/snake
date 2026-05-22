# PROMPT COPY/PASTE — PATCH 985 CASTLE LEGACY UI REMOVAL

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/985_PATCH_CASTLE_LEGACY_UI_REMOVAL.md
docs/985_AUDIT_FINDINGS.md
docs/985_LEGACY_UI_REMOVAL_DIRECTIVES.md
docs/985_CASTLE_GAMEPLAY_CLEANUP.md
docs/985_RESULT_SCREEN_CLEANUP.md
docs/985_ACCEPTANCE_SCREENSHOT_GATE.md
docs/985_QA_TEST_PLAN.md
docs/985_SCOPE_GUARDRAILS.md
docs/985_IMPLEMENTATION_NOTES.md
```

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 2 — Castle Vertical Slice
Patch 984 integrated the correct background model.
Patch 985 must remove old Castle UI layers that are still visible.
```

## Mission

Remove legacy Castle UI artifacts.

Do not mask them if they can be disabled.
Do not regenerate images.
Do not add new features.

## Main blockers to fix

1. Castle Gameplay:
   - old red/blue bars are still visible under HUD;
   - old header/frame still appears;
   - disable/remove that legacy frame/header for Castle.

2. Castle Stage Clear:
   - empty rectangle appears under `CARTE`;
   - remove unused third slot/legacy panel.

3. Result Screens:
   - use one clean runtime layout for Game Over / Clear;
   - exactly one primary button and one secondary button.

## Required result

Castle gameplay composition:

```txt
castle_gameplay_bg
runtime HUD
runtime grid panel
runtime grid border
runtime gameplay objects
```

Castle result composition:

```txt
castle_game_over_bg or castle_clear_bg
runtime title
runtime subtitle
runtime context
runtime primary button
runtime secondary button
```

## Hard constraints

- No new images.
- No image edits.
- No other universes.
- No title screen redesign.
- No new gameplay.
- No dependencies.
- No broad UI framework rewrite.

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
- which legacy Castle frame/header was removed or disabled;
- how Stage Clear empty slot was removed;
- result layout changes;
- tests run;
- remaining risks.

## Definition of done

- Build passes.
- Castle gameplay has no old header/HUD artifacts.
- Castle Stage Clear has no empty slot below `CARTE`.
- Game Over remains clean.
- Intro remains acceptable.
- No scope expansion.
