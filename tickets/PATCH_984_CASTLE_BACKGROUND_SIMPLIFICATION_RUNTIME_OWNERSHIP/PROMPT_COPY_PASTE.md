# PROMPT COPY/PASTE — PATCH 984 CASTLE BACKGROUND SIMPLIFICATION & RUNTIME OWNERSHIP

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/984_PATCH_CASTLE_BACKGROUND_SIMPLIFICATION_RUNTIME_OWNERSHIP.md
docs/984_RUNTIME_OWNERSHIP_DOCTRINE.md
docs/984_CASTLE_ASSET_USAGE.md
docs/984_SYSTEM_SCREEN_RUNTIME_LAYOUT.md
docs/984_GAMEPLAY_SCREEN_RUNTIME_LAYOUT.md
docs/984_RESULT_SCREEN_RUNTIME_LAYOUT.md
docs/984_PROMPTS_FOR_FUTURE_UNIVERSES.md
docs/984_QA_TEST_PLAN.md
docs/984_SCOPE_GUARDRAILS.md
docs/984_IMPLEMENTATION_NOTES.md
references/prompts/CASTLE_GENERATION_PROMPTS.md
```

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 2 — Castle Vertical Slice
Patch 984 — Background Simplification & Runtime Ownership
```

## Mission

Replace the fragile Castle UI-baked asset strategy with a clean 4-background model.

Use the included assets:

```txt
src/assets/ui/castle/castle_system_bg.png
src/assets/ui/castle/castle_gameplay_bg.png
src/assets/ui/castle/castle_game_over_bg.png
src/assets/ui/castle/castle_clear_bg.png
```

If the repo uses `public/assets`, move/copy them to:

```txt
public/assets/ui/castle/
```

and update paths.

## Core rule

```txt
Images provide atmosphere.
Runtime owns UI.
```

Runtime must draw:
- HUD,
- panels,
- text,
- buttons,
- grid,
- result messages.

Images must not be treated as layout or UI.

## Required work

1. Castle Intro:
   - use `castle_system_bg`;
   - draw runtime panel/text/buttons.

2. Castle Gameplay:
   - use `castle_gameplay_bg`;
   - remove old full-frame Castle HUD contamination;
   - runtime HUD only;
   - no old score/bar artifacts.

3. Castle Game Over:
   - use `castle_game_over_bg`;
   - runtime text/buttons.

4. Castle Clear / Boss Clear:
   - use `castle_clear_bg`;
   - runtime text/buttons.

5. Runtime layout:
   - central HUD height;
   - shared result screen layout;
   - Castle button style config.

6. Docs:
   - preserve prompts for future universes;
   - document 4-background model.

## Hard constraints

- No new gameplay.
- No new worlds.
- No title redesign.
- No new dependencies.
- No image generation.
- No baked text/buttons.
- No full UI framework rewrite.

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
- asset paths used;
- HUD changes;
- result screen layout changes;
- intro/gameplay/game-over/clear changes;
- docs added;
- commands run;
- remaining risks.

## Definition of done

- Build passes.
- Castle uses the 4-background model.
- Runtime owns all UI.
- Gameplay has no baked HUD artifacts.
- Game Over/Clear/Intro are readable.
- Prompt docs exist for future universes.
- No other universes were expanded.
