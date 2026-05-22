# PROMPT COPY/PASTE — PATCH 988 TITLE SCREEN ARCADE HUB INTEGRATION

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/988_PATCH_TITLE_SCREEN_ARCADE_HUB_INTEGRATION.md
docs/988_ASSET_AUDIT.md
docs/988_TITLE_SCREEN_LAYOUT.md
docs/988_RUNTIME_UI_RULES.md
docs/988_ANIMATION_GUIDELINES.md
docs/988_FONT_AND_TEXT_RULES.md
docs/988_IMPLEMENTATION_NOTES.md
docs/988_QA_TEST_PLAN.md
docs/988_SCOPE_GUARDRAILS.md
```

## Mission

Replace the current generic prototype title screen with a proper multi-world arcade hub.

Use the included assets:

```txt
src/assets/ui/title/title_hub_bg.png
src/assets/ui/title/world_token_castle.png
src/assets/ui/title/world_token_speed.png
src/assets/ui/title/world_token_streets.png
src/assets/ui/title/world_token_fighter.png
src/assets/ui/title/world_token_outrun.png
src/assets/ui/title/world_token_shinobi.png
src/assets/ui/title/world_token_kombat.png
src/assets/ui/title/world_token_paperboy.png
```

If the project serves assets from `public/assets`, move/copy them there.

## Core rule

```txt
Assets create atmosphere.
Runtime owns UI.
```

Do not bake title, stats, CTA, or buttons into images.

## Required title screen

Runtime text:

```txt
SNAKE DRIVE

8 MONDES · 16 NIVEAUX
8 BOSS À DÉBLOQUER

TOUCHER POUR JOUER
```

Also display the 8 world tokens near the bottom.

## Important

Do not use `V4` as the main visible title.
If needed, demote it to tiny debug/footer text or remove it.

## Suggested layout

```txt
18–30%: SNAKE DRIVE
34–44%: stats
55–65%: CTA
76–88%: tokens
```

## Animation

Add subtle CTA pulse.
No heavy animation.

## Constraints

- No new images.
- No image editing.
- No Castle gameplay changes.
- No other universe gameplay changes.
- No dependencies.

## Commands to run

```bash
npm ci
npm run build
```

If available:

```bash
npm run test
npm run lint
npm run qa
```

## Report back with

- files changed;
- asset paths used;
- title layout details;
- token sizing/layout;
- commands run;
- known limitations.
