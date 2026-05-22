# 988_PATCH_TITLE_SCREEN_ARCADE_HUB_INTEGRATION

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — UI System / Vertical Slice
Current patch: 988 — Title Screen Arcade Hub Integration
Goal: replace generic prototype title screen with a reusable multi-world arcade hub title screen
```

---

## Context

The current title screen is readable but weak:

```txt
SNAKE
DRIVE V4
8 MONDES · 16 NIVEAUX
8 BOSS
TOUCHER POUR JOUER
```

It still looks like a prototype placeholder.

The rest of the project is moving toward:
- runtime-owned UI,
- background-first visual identity,
- 8 interchangeable worlds,
- retro mobile arcade feel.

The title screen must now communicate that direction.

---

# Goal

Create a new title screen that acts as a **global arcade hub**.

The player should understand in 2 seconds:

```txt
1. This is a retro Snake game.
2. It has multiple worlds.
3. It is mobile/tap friendly.
4. The game has progression: worlds, levels, bosses.
```

---

# Included assets

Use:

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

If the repo serves assets from `public/assets`, move/copy them to:

```txt
public/assets/ui/title/
```

and update asset paths.

---

# Required design

## 1. Background

Use:

```txt
title_hub_bg.png
```

Full-screen background.

It is an arcade portal between worlds. It should remain visible and not be covered by huge panels.

Runtime must add only light overlays if readability requires it.

Acceptance criteria:
- [ ] background visible;
- [ ] no massive opaque panel over it;
- [ ] center remains usable for runtime logo and CTA;
- [ ] no text baked into image.

---

## 2. Logo

Render runtime text:

```txt
SNAKE DRIVE
```

Recommended:
- `SNAKE` dominant;
- `DRIVE` below or same line depending on layout;
- no `V4` in main title.

Do not use `V4` as a main visible brand.

Optional small build marker:
```txt
PROTOTYPE BUILD
```
only if useful and very small.

Acceptance criteria:
- [ ] title says `SNAKE DRIVE`;
- [ ] no `V4` as main title;
- [ ] logo text is runtime-rendered;
- [ ] title is readable on mobile.

---

## 3. Progression line

Use:

```txt
8 MONDES · 16 NIVEAUX
8 BOSS À DÉBLOQUER
```

or compact:

```txt
8 MONDES · 16 NIVEAUX · 8 BOSS
```

Acceptance criteria:
- [ ] progression promise is visible;
- [ ] not too verbose;
- [ ] not competing with main logo.

---

## 4. CTA

Use:

```txt
TOUCHER POUR JOUER
```

Recommended:
- runtime capsule button;
- subtle pulse animation;
- gold/violet/cyan palette.

Acceptance criteria:
- [ ] CTA clearly tappable;
- [ ] pulse subtle, not distracting;
- [ ] tap starts game or opens intended next screen.

---

## 5. 8 world tokens

Show the 8 world tokens in a row or 2-row responsive layout.

Default mobile layout:
```txt
8 tokens in one row if width allows
or
4 + 4 rows if needed
```

Recommended token size:
```txt
56–64 px
```

Do not force 32 px: generated tokens are detailed and may become unreadable too small.

Acceptance criteria:
- [ ] all 8 tokens visible;
- [ ] tokens do not overlap CTA;
- [ ] tokens are readable enough;
- [ ] tokens feel like optional world promise, not primary navigation unless intended.

---

# Suggested vertical layout

```txt
Top 8–12%:
  breathing room / background visible

20–28%:
  SNAKE DRIVE

34–42%:
  8 MONDES · 16 NIVEAUX
  8 BOSS À DÉBLOQUER

56–64%:
  TOUCHER POUR JOUER

76–86%:
  8 world tokens
```

Adapt for actual safe area / browser UI.

---

# Runtime ownership rules

Do not bake:
- title,
- CTA,
- stats,
- button,
- labels.

Runtime owns:
- text,
- positions,
- scale,
- animation,
- interactions.

---

# Files likely to modify

Search actual repo structure.

Likely:

```txt
src/scenes/TitleScene.ts
src/scenes/BootScene.ts
src/scenes/PreloadScene.ts
src/ui/*
src/config/*
src/data/worlds.ts
src/assets/ui/title/*
public/assets/ui/title/*
```

---

# Files forbidden to modify

Do not modify unless necessary:

```txt
package.json
vite.config.*
tsconfig.*
```

Do not add dependencies.

Do not touch Castle gameplay in this patch.

---

# Out of scope

Do not work on:
- Castle gameplay layout,
- Castle result screens,
- other gameplay universes,
- world map redesign,
- audio,
- save systems,
- settings,
- achievements.

---

# Tests

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

Manual:
- load title screen;
- tap CTA;
- verify navigation;
- test portrait mobile viewport.

---

# Definition of done

- [ ] Build passes.
- [ ] New title screen uses `title_hub_bg`.
- [ ] Runtime logo says `SNAKE DRIVE`.
- [ ] `V4` removed from main brand.
- [ ] CTA visible and tappable.
- [ ] 8 world tokens visible.
- [ ] No text baked into images.
- [ ] No Castle gameplay changes.
