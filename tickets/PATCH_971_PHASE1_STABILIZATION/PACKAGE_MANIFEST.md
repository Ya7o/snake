# PATCH 971 — Phase 1 Stabilization

## Purpose

This patch stabilizes the Phase 1 gameplay foundation after PATCH 970.

It must fix the fragile parts before any Phase 2 work:
- real world-map progression,
- reliable danger collision,
- clean `GameScene` ↔ `Mechanic` API,
- obvious mobile World Map start flow,
- boss HP data consistency,
- stronger QA checks.

## Package contents

```txt
PATCH_971_PHASE1_STABILIZATION/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    971_PATCH_PHASE1_STABILIZATION.md
  docs/
    971_STABILIZATION_DIRECTIVES.md
    971_EXPECTED_BEHAVIOR.md
    971_QA_TEST_PLAN.md
    971_IMPLEMENTATION_NOTES.md
  references/
    screenshots/
      README.md
```

## Scope

This is a corrective stabilization patch.

It is not a visual patch.
It is not a content expansion.
It is not Phase 2.
