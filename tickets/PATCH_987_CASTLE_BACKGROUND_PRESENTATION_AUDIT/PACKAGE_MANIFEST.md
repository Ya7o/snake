# PATCH 987 — Castle Background Presentation Audit

## Purpose

This patch prepares a targeted Castle visual correction pass focused on presentation quality, not on creating new assets.

It addresses four concrete issues:

1. Background images must be shown fully and cleanly on the screens that use them.
2. The gameplay board must be resized so the frame/background remains visible on the left, right, and bottom.
3. The current top gameplay HUD is visually weak and damages the Castle atmosphere.
4. Fonts, sprite treatment, and text styling must be audited and normalized.

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 1 — Gameplay foundations: done
Phase 1 stabilization — 970 / 971 / 972: done
Phase 2 — Castle Vertical Slice: in progress
Patch 984 — Background Simplification & Runtime Ownership: done
Patch 985 — Legacy UI Removal: partial
Patch 986 — Runtime Layer Finalization: in progress
Patch 987 — Castle Background Presentation Audit: current
Next likely patch: 988 — Castle HUD and Background Layout Pass
```

## Package contents

```txt
PATCH_987_CASTLE_BACKGROUND_PRESENTATION_AUDIT/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    987_PATCH_CASTLE_BACKGROUND_PRESENTATION_AUDIT.md
  docs/
    987_AUDIT_SUMMARY.md
    987_BACKGROUND_PRESENTATION_GUIDELINES.md
    987_GAMEPLAY_BOARD_FRAMING_GUIDELINES.md
    987_HUD_ALTERNATIVES_RECOMMENDATION.md
    987_FONT_SPRITE_AUDIT.md
    987_VISUAL_SYSTEM_RULES.md
    987_IMPLEMENTATION_CHECKLIST.md
    987_QA_SCREENSHOT_GATE.md
    987_SCOPE_GUARDRAILS.md
  references/
    screenshots/
      01_game_over_layout_bug.jpg
      02_gameplay_background_framing_bug.jpg
      03_intro_background_good_but_frame_tight.jpg
      04_stage_clear_layout_overload.jpg
      README.md
```

## Important orientation

The project has been losing time by mixing three concerns:
- asset quality,
- runtime layout,
- legacy render leftovers.

This patch narrows the focus to background composition and runtime presentation quality.

It also challenges the current direction where the top HUD imitates an old arcade strip. That decision currently hurts the Castle aesthetic.
