# PROMPT COPY/PASTE — PATCH 982 CASTLE UI COHESION PASS

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/982_PATCH_CASTLE_UI_COHESION_PASS.md
docs/982_CASTLE_UI_COHESION_DIRECTIVES.md
docs/982_CASTLE_SCREEN_TEMPLATE_SPEC.md
docs/982_CASTLE_HUD_REQUIREMENTS.md
docs/982_CASTLE_BUTTON_LANGUAGE.md
docs/982_QA_TEST_PLAN.md
docs/982_SCOPE_GUARDRAILS.md
```

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 2 — Vertical Slice
Patch 980 — Castle Vertical Slice: done
Patch 981 — Castle Playtest Tuning & Readability: done
Patch 982 — Castle UI Cohesion Pass: current
Next intended patch: 990 — Vertical Slice Template Extraction
```

## Mission

Make the Castle vertical slice visually coherent before extracting the reusable template.

Use the included templates:

```txt
src/assets/ui/castle/castle_game_over_bg.png
src/assets/ui/castle/castle_clear_bg.png
```

If the repo uses another asset convention, move them accordingly.

## Required work

1. Castle Game Over:
   - use Castle game-over template;
   - render text/buttons at runtime;
   - show `PERDU`, subtitle, `REJOUER`, `CARTE`.

2. Castle Stage Clear / Boss Clear:
   - use Castle clear template;
   - render text/buttons at runtime;
   - show stage/boss clear messages and progression feedback.

3. Castle Gameplay HUD:
   - remove/cover ghosted old HUD elements;
   - make `CASTLE / STAGE / MAGIC` immediately readable;
   - keep mobile-safe layout.

4. Castle Level Intro:
   - make text more scannable;
   - reduce density;
   - make `JOUER` dominant and `CARTE` secondary.

5. Castle Buttons:
   - primary actions = gold/warm magic;
   - secondary actions = dark violet/muted;
   - red only as Game Over accent.

## Hard constraints

- Do not add new gameplay.
- Do not add new worlds.
- Do not create all-world result templates.
- Do not bake text into images.
- Do not add new dependencies.
- Do not broadly refactor scene architecture.
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
- asset paths used;
- Game Over changes;
- Clear/Boss Clear changes;
- HUD cleanup changes;
- intro/button changes;
- tests run;
- remaining risks.

## Definition of done

- Castle Intro is readable.
- Castle Gameplay HUD is clean.
- Castle Game Over uses provided Castle template.
- Castle Stage Clear uses provided Castle template.
- Castle Boss Clear uses provided Castle template.
- Runtime text/buttons remain editable in code.
- Castle buttons are visually consistent.
- Build passes.
