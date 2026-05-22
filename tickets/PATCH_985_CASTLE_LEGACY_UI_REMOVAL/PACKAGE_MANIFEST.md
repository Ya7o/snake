# PATCH 985 — Castle Legacy UI Removal

## Purpose

PATCH 984 correctly introduced the new 4-background Castle model and the doctrine:

```txt
Images provide atmosphere.
Runtime owns UI.
```

However, post-984 screenshots show that the code still stacks new backgrounds on top of older Castle UI/frame layers.

PATCH 985 must remove those legacy UI layers instead of hiding them.

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 1 — Gameplay foundations: done
Phase 1 stabilization — 970 / 971 / 972: done
Phase 2 — Castle Vertical Slice: in progress
Patch 980 — Castle Vertical Slice: done
Patch 981 — Castle Tuning/Readability: done
Patch 982 — Castle UI Cohesion: partial
Patch 983 — Runtime Layout Rebuild: proposed
Patch 984 — Background Simplification & Runtime Ownership: integrated
Patch 985 — Castle Legacy UI Removal: current
Next intended patch: 990 — Vertical Slice Template Extraction
```

## Package contents

```txt
PATCH_985_CASTLE_LEGACY_UI_REMOVAL/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    985_PATCH_CASTLE_LEGACY_UI_REMOVAL.md
  docs/
    985_AUDIT_FINDINGS.md
    985_LEGACY_UI_REMOVAL_DIRECTIVES.md
    985_CASTLE_GAMEPLAY_CLEANUP.md
    985_RESULT_SCREEN_CLEANUP.md
    985_ACCEPTANCE_SCREENSHOT_GATE.md
    985_QA_TEST_PLAN.md
    985_SCOPE_GUARDRAILS.md
    985_IMPLEMENTATION_NOTES.md
  references/
    screenshots/
      01_castle_stage_clear_legacy_slots.jpg
      02_castle_game_over_post984.jpg
      03_castle_gameplay_legacy_header.jpg
      04_castle_intro_post984.jpg
      README.md
```

## Main instruction

Do not patch over legacy UI layers.

Remove or disable them for Castle.
