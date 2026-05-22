# PATCH 972 — Gameplay Consistency Cleanup

## Purpose

This patch is a small stabilization pass after PATCH 971.

PATCH 971 fixed the major foundation issues:
- real progression,
- visible World Map Play button,
- danger cells,
- clean mechanic context sync,
- data-driven boss HP.

PATCH 972 must now remove the remaining gameplay ambiguity:

```txt
Who decides death?
Who decides boss hits?
When are hazards evaluated?
What is logic vs rendering?
```

The goal is to make gameplay collision behavior predictable before Phase 2.

## Package contents

```txt
PATCH_972_GAMEPLAY_CONSISTENCY_CLEANUP/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    972_PATCH_GAMEPLAY_CONSISTENCY_CLEANUP.md
  docs/
    972_COLLISION_AUTHORITY_RULES.md
    972_EXPECTED_BEHAVIOR.md
    972_QA_TEST_PLAN.md
    972_IMPLEMENTATION_NOTES.md
    972_PHASE2_GATE.md
  references/
    screenshots/
      README.md
```

## Scope

This is not Phase 2.

No new content.
No new visuals.
No new worlds.
No new mechanics unless required to standardize existing behavior.

This patch should be short and surgical.
