# PATCH 982 — Castle UI Cohesion Pass

## Purpose

This patch fixes Castle UI cohesion before extracting the reusable vertical-slice template.

The Castle gameplay loop is technically valid after patches 980/981, but screenshots show visual inconsistency between:
- Castle Level Intro,
- Castle Gameplay HUD,
- Game Over,
- Stage Clear / Boss Clear.

PATCH 982 must make Castle feel like one coherent world.

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 1 — Gameplay foundations: done
Phase 1 stabilization — 970 / 971 / 972: done
Phase 2 — Vertical Slice: in progress
Patch 980 — Castle Vertical Slice: done
Patch 981 — Castle Playtest Tuning & Readability: done
Patch 982 — Castle UI Cohesion Pass: current
Next intended patch: 990 — Vertical Slice Template Extraction
```

## Package contents

```txt
PATCH_982_CASTLE_UI_COHESION_PASS/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    982_PATCH_CASTLE_UI_COHESION_PASS.md
  docs/
    982_CASTLE_UI_COHESION_DIRECTIVES.md
    982_CASTLE_SCREEN_TEMPLATE_SPEC.md
    982_CASTLE_HUD_REQUIREMENTS.md
    982_CASTLE_BUTTON_LANGUAGE.md
    982_QA_TEST_PLAN.md
    982_SCOPE_GUARDRAILS.md
  references/
    screenshots/
      README.md
    templates/
      castle/
        castle_game_over_bg.png
        castle_clear_bg.png
  src/
    assets/
      ui/
        castle/
          castle_game_over_bg.png
          castle_clear_bg.png
```

## Included assets

Two generated Castle system-screen templates are provided:

```txt
castle_game_over_bg.png
castle_clear_bg.png
```

They are included twice:
- under `references/templates/castle/` as reference material;
- under `src/assets/ui/castle/` as a suggested copy destination.

If the repo uses a different asset folder, move them to the existing project convention.

## Scope

This is a UI cohesion patch for Castle only.

No new worlds.
No new gameplay mechanics.
No broad engine refactor.
No all-world template extraction yet.
