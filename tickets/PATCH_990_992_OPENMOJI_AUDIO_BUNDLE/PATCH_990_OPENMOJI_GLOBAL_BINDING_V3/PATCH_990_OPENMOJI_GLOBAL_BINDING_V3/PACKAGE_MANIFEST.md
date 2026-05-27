# PATCH 990 V3 — OpenMoji Global Binding + Castle Quick Wins

## Purpose

Updated version of PATCH 990.

This V3 supersedes:
- PATCH_990_OPENMOJI_GLOBAL_BINDING.zip
- PATCH_990_OPENMOJI_GLOBAL_BINDING_V2.zip

It includes:
- world icons,
- HUD icons,
- pickups,
- obstacles,
- danger/hazards,
- boss-event indicators,
- result symbols,
- Castle quick wins: key, pause, shield, bonus/perfect star.

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 2 — UI System / Asset Simplification
990 V1 — superseded
990 V2 — superseded
990 V3 — current OpenMoji patch
991 — Castle Universe 1 Design System: apply after 990 V3
```

## Package contents

```txt
PATCH_990_OPENMOJI_GLOBAL_BINDING_V3/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md

  tickets/
    990_PATCH_OPENMOJI_GLOBAL_BINDING_V3.md

  docs/
    990_GLOBAL_ICON_POLICY_V3.md
    990_ICON_SELECTION_TABLE_V3.md
    990_CASTLE_QUICK_WINS.md
    990_OBSTACLE_DANGER_BOSS_BINDING_V3.md
    990_ASSET_COPY_AND_BINDING_V3.md
    990_RUNTIME_REGISTRY_CONTRACT_V3.md
    990_QA_AND_ACCEPTANCE_V3.md
    990_DO_NOT_TOUCH_V3.md

  scripts/
    openmoji_selected_icons_manifest.json
    copy-openmoji-subset.mjs
    generate-openmoji-registry.mjs

  src/data/
    openmojiIconRegistry.example.ts

  src/ui/
    OpenMojiIcon.example.ts

  references/
    OPENMOJI_LOCAL_CLONE_NOTES.md
```
