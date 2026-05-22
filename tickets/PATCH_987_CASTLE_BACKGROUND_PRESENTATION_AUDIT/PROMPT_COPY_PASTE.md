# PROMPT COPY/PASTE — PATCH 987 CASTLE BACKGROUND PRESENTATION AUDIT

You are working on the Snake Drive V4 repository.

Read and apply the audit package:

```txt
tickets/987_PATCH_CASTLE_BACKGROUND_PRESENTATION_AUDIT.md
docs/987_AUDIT_SUMMARY.md
docs/987_BACKGROUND_PRESENTATION_GUIDELINES.md
docs/987_GAMEPLAY_BOARD_FRAMING_GUIDELINES.md
docs/987_HUD_ALTERNATIVES_RECOMMENDATION.md
docs/987_FONT_SPRITE_AUDIT.md
docs/987_VISUAL_SYSTEM_RULES.md
docs/987_IMPLEMENTATION_CHECKLIST.md
docs/987_QA_SCREENSHOT_GATE.md
docs/987_SCOPE_GUARDRAILS.md
```

## Mission

Prepare and/or implement a Castle visual presentation pass.

Main goals:
1. let the background images be properly visible on Castle screens;
2. resize/reframe gameplay so the board does not consume the whole image;
3. replace the ugly full-width top HUD strip with a better solution;
4. normalize fonts, sprites, and text roles for Castle.

## Key design conclusions

### Backgrounds
Treat them as compositions, not wallpaper.

### Gameplay board
Reduce cell size moderately and allow larger visible margins.

Starting target:
```txt
board width: ~82% of screen
board height: ~63% of screen
bottom reveal: ~18%
```

### HUD
Default recommendation:
```txt
Compact capsule row
[ CASTLE ] [ STAGE 1 ] [ MAGIC 0/10 ]
```

### Typography
Use a role hierarchy:
- display/title pixel font,
- UI label pixel font,
- stronger button text style,
- smaller readable body text.

## Constraints
- no new images required in this patch,
- no other universes,
- no gameplay mechanics,
- no dependency changes.

## Report back with
- files changed,
- chosen HUD approach,
- final board ratios,
- font decisions,
- screenshots requested in `docs/987_QA_SCREENSHOT_GATE.md`.
