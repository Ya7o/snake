# 982_PATCH_CASTLE_UI_COHESION_PASS

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — Vertical Slice
Previous patch: 981 — Castle Playtest Tuning & Readability
Current patch: 982 — Castle UI Cohesion Pass
Goal: make Castle visually coherent before extracting the reusable template
Next intended patch: 990 — Vertical Slice Template Extraction
```

---

## Context

Castle is now technically playable:
- Stage 1 exists.
- Illusion walls are readable.
- Warning walls are non-lethal.
- Active walls are lethal.
- Boss weak point works.
- Boss hit feedback exists.
- Clear progression works.

However screenshots show the Castle vertical slice is not yet visually coherent:

1. **Gameplay HUD is too noisy**
   - old decorative HUD elements appear behind runtime text;
   - `CASTLE / STAGE 1 / MAGIC 0/10` is not clean enough;
   - top area feels compressed.

2. **Game Over is generic**
   - current loss screen uses a generic neon red/purple prototype style;
   - it does not feel like Castle.

3. **Clear / Boss Clear needs Castle-specific presentation**
   - current clear feedback works, but should use Castle visual language.

4. **Level Intro is good but dense**
   - text block feels slightly compressed;
   - `CARTE` button is too visually dominant compared to the primary action.

This patch must fix the cohesion before using Castle as a template for the other 7 worlds.

---

# Goal

Make Castle feel like one coherent vertical slice across:

```txt
Level Intro
Gameplay HUD
Game Over
Stage Clear
Boss Clear
Buttons
```

A player should feel they are still in the same Castle world from start to fail/clear.

---

# Included templates

This patch package includes:

```txt
src/assets/ui/castle/castle_game_over_bg.png
src/assets/ui/castle/castle_clear_bg.png
```

Use these assets if they fit the existing asset pipeline.

If the project uses a different asset path, place them according to the current convention and update references.

Important:
- these images are **background/templates**;
- do not bake UI text into them;
- runtime code must draw titles, subtitles, buttons, and dynamic messages.

---

# Required changes

## 1. Integrate Castle Game Over template

Use `castle_game_over_bg.png` for Castle Game Over states.

Runtime text should be drawn on top.

Recommended content:

```txt
title: PERDU
subtitle: L’illusion t’a piégé
primary: REJOUER
secondary: CARTE
```

If text system is centralized, add Castle-specific theme values rather than hardcoding too much in scene logic.

### Acceptance criteria

- [ ] Game Over screen uses Castle visual language when current level/world is Castle.
- [ ] Text remains runtime-rendered, not baked into image.
- [ ] `PERDU` is readable.
- [ ] `REJOUER` is primary.
- [ ] `CARTE` is secondary.
- [ ] Red is used as accent only, not full-screen generic neon.
- [ ] Non-Castle Game Over behavior is not broken.

---

## 2. Integrate Castle Clear template

Use `castle_clear_bg.png` for Castle Stage Clear and Boss Clear states.

Runtime text should be drawn on top.

Recommended variants:

### Stage Clear

```txt
title: STAGE CLEAR
subtitle: Castle Boss débloqué
primary: CONTINUER
secondary: CARTE
```

### Boss Clear

```txt
title: BOSS CLEAR
subtitle: Monde 1 terminé
primary: CONTINUER
secondary: CARTE
```

Use French labels if the rest of the game is currently French. Keep text short.

### Acceptance criteria

- [ ] Stage Clear uses Castle clear template.
- [ ] Boss Clear uses Castle clear template.
- [ ] Runtime text is drawn on top.
- [ ] Clear screen feels brighter/more rewarding than Game Over.
- [ ] Unlock/world complete messages remain visible.
- [ ] Continue flow still works.
- [ ] Map flow still works.

---

## 3. Clean Castle gameplay HUD

The current gameplay screenshot shows a noisy top HUD.

Fix the Castle gameplay HUD so that the player can instantly read:

```txt
CASTLE      STAGE 1      MAGIC 0/10
```

or equivalent.

Requirements:
- remove/cover ghosted score numbers and old decorative bars behind runtime HUD text;
- use a clean opaque or semi-opaque HUD strip;
- keep text large enough for mobile;
- keep high contrast;
- do not reduce gameplay clarity.

Recommended style:

```txt
dark purple/black strip
thin gold/violet border
runtime text in white/gold
```

### Acceptance criteria

- [ ] No ghost text or old score artifacts behind HUD labels.
- [ ] World name is readable.
- [ ] Stage number is readable.
- [ ] Objective counter is readable.
- [ ] HUD does not overlap browser safe area more than current layout.
- [ ] HUD does not hide gameplay.

---

## 4. Improve Castle Level Intro spacing

Do not redesign the whole scene.

Make it more scannable.

Recommended structure:

```txt
JARDIN D’ILLUSION
STAGE 1

OBJECTIF
Collecte 10 éclats magiques.

DANGER
Les murs brillent avant d’apparaître.
```

Keep copy short.

Button hierarchy:
- `JOUER` = dominant;
- `CARTE` = secondary, less visually dominant.

### Acceptance criteria

- [ ] Intro text is less dense.
- [ ] Objective and danger are easier to scan.
- [ ] `JOUER` is clearly primary.
- [ ] `CARTE` is clearly secondary.
- [ ] Background remains visible but does not overpower the panel.

---

## 5. Harmonize Castle button language

For Castle:

```txt
primary action = gold / warm magic
secondary action = dark violet / muted
danger accent = red only for loss state emphasis
```

Apply consistently to:
- `JOUER`,
- `REJOUER`,
- `CONTINUER`,
- `CARTE`.

### Acceptance criteria

- [ ] Primary actions share a consistent Castle style.
- [ ] Secondary actions share a consistent Castle style.
- [ ] Game Over primary button is not generic red unless red is only an accent.
- [ ] Buttons are tap-friendly.
- [ ] Button labels remain runtime-rendered.

---

## 6. Keep templates reusable

Do not create one-off code that only works for Castle in a messy way.

Preferred approach:
- theme-aware screen config;
- background per theme and state;
- shared SystemResultScene / ClearScene / GameOverScene logic if already present.

Avoid:
- duplicating whole scenes;
- hardcoding image coordinates all over the code;
- adding all-world changes.

### Acceptance criteria

- [ ] Castle-specific assets are referenced through a clean theme/config path or minimal conditional.
- [ ] Same layout can later be reused for other worlds.
- [ ] No broad template extraction yet.
- [ ] Code remains understandable.

---

# Files likely to modify

Search current repo structure.

Likely:

```txt
src/scenes/GameScene.ts
src/scenes/ClearScene.ts
src/scenes/GameOverScene.ts
src/scenes/LevelIntroScene.ts
src/scenes/WorldMapScene.ts
src/render/*
src/data/themes.ts
src/data/worlds.ts
src/assets/ui/castle/*
src/dev/GameplayQAChecks.ts
```

If there is no `GameOverScene.ts`, adapt to the existing fail scene.

---

# Files provided by this patch

```txt
src/assets/ui/castle/castle_game_over_bg.png
src/assets/ui/castle/castle_clear_bg.png
```

Move them if the project has a different convention.

---

# Files forbidden to modify

Do not modify unless required:

```txt
package.json
vite.config.*
tsconfig.*
public/assets/*
```

Do not regenerate images in this patch.

---

# Out of scope

Do not add:
- new gameplay mechanics,
- new worlds,
- new levels,
- new bosses,
- all-world UI skins,
- economy,
- achievements,
- settings menu,
- localization framework,
- audio system,
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

Manual tests:

1. Launch Castle Stage 1 intro.
2. Confirm intro is readable and `JOUER` dominates.
3. Start gameplay.
4. Confirm HUD has no ghosted old score artifacts.
5. Confirm `MAGIC 0/10` is readable.
6. Lose the level.
7. Confirm Game Over uses Castle template.
8. Confirm `REJOUER` works.
9. Confirm `CARTE` works.
10. Clear Castle Stage 1.
11. Confirm Stage Clear uses Castle clear template.
12. Confirm Boss unlock message visible.
13. Clear Castle Boss.
14. Confirm Boss Clear uses Castle clear template.
15. Confirm World 1 complete visible.
16. Confirm non-Castle screens are not broken.

---

# Definition of done

- [ ] Castle Intro is more readable.
- [ ] Castle Gameplay HUD is clean.
- [ ] Castle Game Over uses provided template.
- [ ] Castle Stage Clear uses provided template.
- [ ] Castle Boss Clear uses provided template.
- [ ] Castle buttons share a coherent style.
- [ ] Text/buttons are runtime-rendered, not baked into images.
- [ ] Build passes.
- [ ] No new content scope added.
