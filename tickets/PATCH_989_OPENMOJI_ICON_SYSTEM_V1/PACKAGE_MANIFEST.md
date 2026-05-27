# PATCH 989 — OpenMoji Icon System for V1

## Purpose

Use OpenMoji as a controlled, lightweight icon system for Snake Drive V1.

This patch does **not** replace backgrounds, gameplay frames, the Snake sprite, or boss sprites.

It introduces OpenMoji only for:
- world tokens,
- HUD icons,
- pickup/menu icon placeholders,
- simple result-screen symbols.

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 2 — UI System / Asset Simplification
Previous patch: 988 — Title Screen Arcade Hub Integration
Current patch: 989 — OpenMoji Icon System for V1
Goal: simplify small icons/tokens while keeping backgrounds and core sprites custom
```

## Package contents

```txt
PATCH_989_OPENMOJI_ICON_SYSTEM_V1/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    989_PATCH_OPENMOJI_ICON_SYSTEM_V1.md
  docs/
    989_OPENMOJI_USAGE_STRATEGY.md
    989_ICON_MAPPING.md
    989_ASSET_PIPELINE.md
    989_LICENSE_ATTRIBUTION.md
    989_IMPLEMENTATION_NOTES.md
    989_QA_TEST_PLAN.md
    989_SCOPE_GUARDRAILS.md
  scripts/
    fetch_openmoji_subset.sh
    openmoji_subset_manifest.json
  references/
    OPENMOJI_SOURCE.md
```

## External dependency strategy

Do not vendor the whole OpenMoji repository into the app.

Codex should:
1. fetch or clone OpenMoji temporarily,
2. copy only the selected SVG assets,
3. commit only the selected subset and attribution docs.
