# PATCH 984 — Castle Background Simplification & Runtime Ownership

## Purpose

PATCH 984 replaces the fragile Castle screen approach based on UI-baked images with a cleaner background-first strategy.

The new rule:

```txt
Images provide atmosphere.
Runtime owns UI.
```

That means:
- no text baked into images,
- no buttons baked into images,
- no HUD baked into images,
- no panel layout baked into images.

The patch includes a validated 4-background Castle asset set:
- system/menu/intro background,
- gameplay background,
- game-over background,
- clear/success background.

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 1 — Gameplay foundations: done
Phase 1 stabilization — 970 / 971 / 972: done
Phase 2 — Vertical Slice: in progress
Patch 980 — Castle Vertical Slice: done
Patch 981 — Castle Tuning/Readability: done
Patch 982 — Castle UI Cohesion: partial
Patch 983 — Castle Runtime Layout Rebuild: proposed
Patch 984 — Castle Background Simplification & Runtime Ownership: current
Next intended patch: 990 — Vertical Slice Template Extraction
```

## Package contents

```txt
PATCH_984_CASTLE_BACKGROUND_SIMPLIFICATION_RUNTIME_OWNERSHIP/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md
  tickets/
    984_PATCH_CASTLE_BACKGROUND_SIMPLIFICATION_RUNTIME_OWNERSHIP.md
  docs/
    984_RUNTIME_OWNERSHIP_DOCTRINE.md
    984_CASTLE_ASSET_USAGE.md
    984_SYSTEM_SCREEN_RUNTIME_LAYOUT.md
    984_GAMEPLAY_SCREEN_RUNTIME_LAYOUT.md
    984_RESULT_SCREEN_RUNTIME_LAYOUT.md
    984_PROMPTS_FOR_FUTURE_UNIVERSES.md
    984_QA_TEST_PLAN.md
    984_SCOPE_GUARDRAILS.md
    984_IMPLEMENTATION_NOTES.md
  references/
    prompts/
      CASTLE_GENERATION_PROMPTS.md
    assets/
      castle/
        castle_system_bg.png
        castle_gameplay_bg.png
        castle_game_over_bg.png
        castle_clear_bg.png
  src/
    assets/
      ui/
        castle/
          castle_system_bg.png
          castle_gameplay_bg.png
          castle_game_over_bg.png
          castle_clear_bg.png
```

## Included assets

Validated Castle assets:

```txt
castle_system_bg.png
castle_gameplay_bg.png
castle_game_over_bg.png
castle_clear_bg.png
```

They are included in both:
- `references/assets/castle/` for documentation/review;
- `src/assets/ui/castle/` as suggested integration location.

If the project uses `public/assets`, move them there and update paths.

## Build requirement

After implementation:

```bash
npm ci
npm run build
```
