# PATCH 988 — Title Screen Arcade Hub Integration

## Purpose

Replace the current generic placeholder title screen with a proper Snake Drive global start screen.

The title screen must communicate:

```txt
retro Snake
multi-world arcade hub
mobile tap-to-play
```

This patch uses the generated `title_hub_bg` and 8 world tokens, while keeping all logo, text, buttons, and interactions rendered by runtime code.

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 1 — Gameplay foundations: done
Phase 1 stabilization — 970 / 971 / 972: done
Phase 2 — UI System / Castle Vertical Slice: in progress
Patch 984 — Castle Background Simplification: done
Patch 985 — Legacy UI Removal: partial
Patch 986 — Castle Runtime Layer Finalization: in progress
Patch 987 — Castle Background Presentation Audit: done
Patch 988 — Title Screen Arcade Hub Integration: current
Next likely patch: 989 — Title Screen Polish / Asset Simplification if needed
Then: 990 — Vertical Slice Template Extraction, only after Castle + Title are stable
```

## Package contents

```txt
PATCH_988_TITLE_SCREEN_ARCADE_HUB_INTEGRATION/
  PROMPT_COPY_PASTE.md
  PACKAGE_MANIFEST.md

  tickets/
    988_PATCH_TITLE_SCREEN_ARCADE_HUB_INTEGRATION.md

  docs/
    988_ASSET_AUDIT.md
    988_TITLE_SCREEN_LAYOUT.md
    988_RUNTIME_UI_RULES.md
    988_ANIMATION_GUIDELINES.md
    988_FONT_AND_TEXT_RULES.md
    988_IMPLEMENTATION_NOTES.md
    988_QA_TEST_PLAN.md
    988_SCOPE_GUARDRAILS.md

  references/
    assets/
      title/
        title_hub_bg.png
        world_token_castle.png
        world_token_speed.png
        world_token_streets.png
        world_token_fighter.png
        world_token_outrun.png
        world_token_shinobi.png
        world_token_kombat.png
        world_token_paperboy.png

  src/
    assets/
      ui/
        title/
          title_hub_bg.png
          world_token_castle.png
          world_token_speed.png
          world_token_streets.png
          world_token_fighter.png
          world_token_outrun.png
          world_token_shinobi.png
          world_token_kombat.png
          world_token_paperboy.png
```

## Main rule

```txt
Background and tokens are assets.
Logo, title text, stats, CTA, layout, animations and interaction are runtime-owned.
```

Do not bake text into images.

## Included assets

- title_hub_bg.png
- world_token_castle.png
- world_token_speed.png
- world_token_streets.png
- world_token_fighter.png
- world_token_outrun.png
- world_token_shinobi.png
- world_token_kombat.png
- world_token_paperboy.png
