# 984_PATCH_CASTLE_BACKGROUND_SIMPLIFICATION_RUNTIME_OWNERSHIP

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — Vertical Slice
Current patch: 984 — Castle Background Simplification & Runtime Ownership
Goal: fix asset/UI strategy before template extraction
Next patch if validated: 990 — Vertical Slice Template Extraction
```

---

## Context

After several iterations, the Castle UI problem is now clear.

The issue is not only bad placement or one HUD bug.

The root problem is:

```txt
The project mixes UI-baked artwork with runtime UI.
```

This causes:
- button alignment drift;
- old HUD artifacts behind runtime HUD;
- scene-specific coordinate hacks;
- images that try to define layout;
- code fighting the art.

PATCH 984 changes the strategy.

Instead of using screen images with built-in panels, button slots, and implied layout, Castle now uses simple atmospheric backgrounds.

Runtime code must draw:
- HUD;
- panels;
- text;
- buttons;
- overlays;
- result messages;
- gameplay grid.

---

# Goal

Implement Castle as the reference model for future universes:

```txt
4 background images per universe
+
runtime-owned UI layout
```

For Castle:

```txt
castle_system_bg.png
castle_gameplay_bg.png
castle_game_over_bg.png
castle_clear_bg.png
```

This becomes the model for other universes later.

---

# Included images

Use these assets:

```txt
src/assets/ui/castle/castle_system_bg.png
src/assets/ui/castle/castle_gameplay_bg.png
src/assets/ui/castle/castle_game_over_bg.png
src/assets/ui/castle/castle_clear_bg.png
```

If the current project uses another convention, move them accordingly.

Recommended runtime URLs if copied to public:

```txt
assets/ui/castle/castle_system_bg.png
assets/ui/castle/castle_gameplay_bg.png
assets/ui/castle/castle_game_over_bg.png
assets/ui/castle/castle_clear_bg.png
```

---

# Required changes

## 1. Replace old Castle system-screen backgrounds

Use:

```txt
castle_system_bg.png
```

for:
- Castle Level Intro,
- Castle world/briefing screens if applicable.

Do not use old Castle intro images with baked panels if runtime panels already exist.

Runtime must draw:
- level title,
- stage label,
- objective,
- danger,
- buttons.

Acceptance criteria:

- [ ] Castle intro uses new clean system background.
- [ ] No baked panel or button is required by the image.
- [ ] Runtime panel/text/buttons remain editable.
- [ ] `JOUER` remains primary.
- [ ] `CARTE` remains secondary.

---

## 2. Replace old Castle gameplay background/frame strategy

Use:

```txt
castle_gameplay_bg.png
```

as the Castle gameplay background.

Runtime must draw:
- HUD,
- grid,
- grid border,
- snake,
- pickups,
- obstacles,
- boss/hazards.

Do not rely on old full-frame art that contains baked score/HUD elements.

Acceptance criteria:

- [ ] No baked HUD remains visible.
- [ ] No old score digits visible.
- [ ] No old bars/hearts visible.
- [ ] Gameplay grid is readable.
- [ ] Castle atmosphere remains visible around/behind grid.
- [ ] Runtime HUD is the only HUD.

---

## 3. Replace Castle Game Over with new background strategy

Use:

```txt
castle_game_over_bg.png
```

for Castle Game Over.

Runtime draws:

```txt
PERDU
L’illusion t’a piégé
JARDIN D’ILLUSION or current level name
REJOUER
CARTE
```

Runtime also draws:
- panel/scrim if needed,
- button backgrounds,
- overlay tint if needed.

Acceptance criteria:

- [ ] Game Over uses new background.
- [ ] No baked text.
- [ ] No baked buttons.
- [ ] Runtime buttons align consistently.
- [ ] Game Over feels Castle-specific.
- [ ] Retry and Map still work.

---

## 4. Replace Castle Clear/Boss Clear with new background strategy

Use:

```txt
castle_clear_bg.png
```

for:
- Stage Clear,
- Boss Clear,
- World Complete.

Runtime draws:

```txt
STAGE CLEAR
Castle Boss débloqué
CONTINUER
CARTE
```

or:

```txt
BOSS CLEAR
Monde 1 terminé
CONTINUER
CARTE
```

Acceptance criteria:

- [ ] Stage Clear uses new clear background.
- [ ] Boss Clear uses new clear background.
- [ ] Runtime text is readable.
- [ ] Runtime buttons align consistently.
- [ ] Clear feels more rewarding than Game Over.
- [ ] Continue/Map still work.

---

## 5. Introduce or enforce runtime UI ownership

Create or update small shared UI helpers/configs.

Possible files:

```txt
src/ui/RuntimeUILayout.ts
src/ui/ResultScreenRenderer.ts
src/ui/ThemeScreenAssets.ts
src/ui/CastleUITheme.ts
```

Keep this small.

Runtime must own:
- title positions,
- panel sizes,
- button sizes,
- button colors,
- HUD height,
- HUD text,
- result screen layout.

Acceptance criteria:

- [ ] No scene depends on image button slots.
- [ ] No text is baked into images.
- [ ] HUD height is centralized.
- [ ] Result screen layout is shared between Game Over and Clear.
- [ ] Castle UI is theme-driven enough to duplicate later.

---

## 6. Simplify Castle HUD

The HUD must be runtime-only.

Recommended:
- height: 52–60 px;
- dark opaque/semi-opaque strip;
- gold/violet accent line;
- left/center/right text.

Normal stage:

```txt
CASTLE      STAGE 1      MAGIC 0/10
```

Boss stage:

```txt
CASTLE BOSS      HP 2/3
```

Acceptance criteria:

- [ ] No old HUD artifacts.
- [ ] HUD readable in screenshots.
- [ ] Grid starts below HUD.
- [ ] HUD does not hide gameplay.
- [ ] Same HUD height used by layout and renderer.

---

## 7. Document the future-universe image prompts

This patch must include a document preserving the prompts and the asset doctrine so that the same style can be regenerated for the next universes.

Required docs:
- `docs/984_PROMPTS_FOR_FUTURE_UNIVERSES.md`
- `references/prompts/CASTLE_GENERATION_PROMPTS.md`

Acceptance criteria:

- [ ] Prompt document exists.
- [ ] It explains the 4-image model.
- [ ] It includes reusable prompt templates.
- [ ] It includes the exact Castle prompt variants used or approximated.
- [ ] It explains how to adapt prompts to another universe.

---

# Files likely to modify

Search current repo structure.

Likely:

```txt
src/scenes/LevelIntroScene.ts
src/scenes/GameScene.ts
src/scenes/GameOverScene.ts
src/scenes/ClearScene.ts
src/render/HUDRenderer.ts
src/render/UniverseFrameRenderer.ts
src/render/GridRenderer.ts
src/data/themes.ts
src/data/worlds.ts
src/ui/*
src/assets/ui/castle/*
public/assets/ui/castle/*
docs/*
```

---

# Files allowed to create

```txt
src/ui/RuntimeUILayout.ts
src/ui/ResultScreenRenderer.ts
src/ui/ThemeScreenAssets.ts
src/ui/CastleUITheme.ts
docs/984_CASTLE_SCREENSHOT_VALIDATION.md
```

Only create what is useful.

---

# Files forbidden to modify

Do not modify unless necessary:

```txt
package.json
vite.config.*
tsconfig.*
```

No dependencies.

Do not regenerate images.

---

# Out of scope

Do not work on:
- Sonic,
- Streets,
- Fighter,
- OutRun,
- Shinobi,
- Kombat,
- Paperboy,
- Title screen redesign,
- new gameplay,
- new levels,
- new bosses,
- economy,
- achievements,
- audio system,
- localization framework,
- template extraction for all worlds.

---

# Tests to run

```bash
npm ci
npm run build
```

If available:

```bash
npm run test
npm run qa
npm run lint
```

Manual screenshots required:
1. Castle Level Intro.
2. Castle Gameplay.
3. Castle Game Over.
4. Castle Stage Clear or Boss Clear.

---

# Definition of done

- [ ] Build passes.
- [ ] Castle uses the new 4-background model.
- [ ] Runtime owns all UI.
- [ ] Castle gameplay has no baked HUD artifacts.
- [ ] Castle intro is readable.
- [ ] Castle Game Over is themed and clean.
- [ ] Castle Clear/Boss Clear is themed and clean.
- [ ] Prompt documentation exists for future universes.
- [ ] No other universes were changed.
- [ ] Ready for audit before PATCH 990.
