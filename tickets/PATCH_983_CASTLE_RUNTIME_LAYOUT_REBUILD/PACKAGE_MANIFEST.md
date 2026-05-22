# PATCH 983 — Castle Runtime Layout Rebuild

## Purpose

PATCH 982 improved Castle visually, but the latest screenshots reveal the real issue:

The project is still trying to fix UI cohesion by patching individual scenes and image backgrounds.
That approach is not stable enough.

PATCH 983 must stop the cycle of small visual fixes and introduce a small **runtime layout contract** for Castle screens.

This is still a targeted patch:
- no new worlds,
- no new gameplay,
- no new image generation,
- no broad engine rewrite.

But it must be more structural than previous visual tweaks.

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 1 — Gameplay foundations: done
Phase 1 stabilization — 970 / 971 / 972: done
Phase 2 — Vertical Slice: in progress
Patch 980 — Castle Vertical Slice: done
Patch 981 — Castle Tuning/Readability: done
Patch 982 — Castle UI Cohesion Pass: done but incomplete
Patch 983 — Castle Runtime Layout Rebuild: current
Next intended patch: 990 — Vertical Slice Template Extraction
```

## Package contents

```txt
PATCH_983_CASTLE_RUNTIME_LAYOUT_REBUILD/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    983_PATCH_CASTLE_RUNTIME_LAYOUT_REBUILD.md
  docs/
    983_AUDIT_FINDINGS.md
    983_RUNTIME_LAYOUT_CONTRACT.md
    983_GAMEPLAY_HUD_REBUILD.md
    983_RESULT_SCREEN_REBUILD.md
    983_LEVEL_INTRO_POLISH.md
    983_QA_TEST_PLAN.md
    983_SCOPE_GUARDRAILS.md
    983_IMPLEMENTATION_NOTES.md
  references/
    screenshots/
      01_castle_game_over_post982.jpg
      02_castle_gameplay_hud_post982.jpg
      03_castle_level_intro_post982.jpg
      04_title_screen_context_post982.jpg
      README.md
```

## Main decision

Do not keep tweaking coordinates separately in each scene.

Create a small shared runtime layout contract for Castle/result screens and gameplay HUD.

## Build requirement

After implementation:

```bash
npm ci
npm run build
```
