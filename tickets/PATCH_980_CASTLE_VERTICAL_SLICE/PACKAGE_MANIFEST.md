# PATCH 980 — Castle Vertical Slice

## Purpose

This patch starts Phase 2 by producing one polished vertical slice: World 1 / Castle.

The goal is not to polish all 8 worlds.

The goal is to prove the complete game loop with one world that feels coherent, readable, fun, and production-shaped:

```txt
Title → World Map → Castle Level Intro → Castle Gameplay → Castle Boss → Clear/Fail → Progression
```

## Package contents

```txt
PATCH_980_CASTLE_VERTICAL_SLICE/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    980_PATCH_CASTLE_VERTICAL_SLICE.md
  docs/
    980_CASTLE_VERTICAL_SLICE_DIRECTIVES.md
    980_CASTLE_GAME_DESIGN.md
    980_CASTLE_UI_UX_REQUIREMENTS.md
    980_CASTLE_TUNING_REQUIREMENTS.md
    980_CASTLE_QA_TEST_PLAN.md
    980_SCOPE_GUARDRAILS.md
  references/
    screenshots/
      README.md
```

## Roadmap position

This patch belongs to:

```txt
Snake Drive Audit And Game Design Foundations
→ PHASE 2 — vertical slice
→ Create 1 complete world first
```

Selected world:

```txt
World 1 — Castle
```

## Scope

Polish only:
- Castle normal stage,
- Castle boss stage,
- Castle intro/clear/fail presentation,
- Castle HUD readability,
- Castle mechanic readability,
- light FX/juice,
- tuning,
- QA.

Do not expand all worlds.
