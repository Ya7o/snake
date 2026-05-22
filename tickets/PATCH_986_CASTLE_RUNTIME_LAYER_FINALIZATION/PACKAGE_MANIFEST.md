# PATCH 986 — Castle Runtime Layer Finalization

## Purpose

PATCH 986 is a hard stop to the repeated Castle UI cleanup loop.

The problem is no longer image quality. The Castle assets are good.

The remaining problem is runtime layer ownership and legacy render paths still leaking into Castle gameplay/result screens.

This patch must finalize the layer order and remove the remaining ambiguous render paths.

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
Patch 985 — Castle Legacy UI Removal: partial
Patch 986 — Castle Runtime Layer Finalization: current
Next intended patch: 990 — Vertical Slice Template Extraction
```

## Package contents

```txt
PATCH_986_CASTLE_RUNTIME_LAYER_FINALIZATION/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    986_PATCH_CASTLE_RUNTIME_LAYER_FINALIZATION.md
  docs/
    986_AUDIT_FINDINGS.md
    986_NON_NEGOTIABLE_RUNTIME_RULES.md
    986_CASTLE_GAMEPLAY_LAYER_ORDER.md
    986_RESULT_SCREEN_FINALIZATION.md
    986_IMPLEMENTATION_CHECKLIST.md
    986_DEBUGGING_INSTRUCTIONS.md
    986_QA_TEST_PLAN.md
    986_SCOPE_GUARDRAILS.md
  references/
    screenshots/
      01_castle_game_over_post985.jpg
      02_castle_gameplay_layer_bug_post985.jpg
      03_castle_intro_post985.jpg
      README.md
```

## Important

This is not another aesthetic pass.

This is a render-path cleanup.

If a legacy layer is still visible, remove it from Castle's render path. Do not hide it with another patch layer unless there is no safe alternative.
