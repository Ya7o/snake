# 983 — Runtime Layout Contract

## Goal

Stop per-scene layout drift.

Define a small runtime layout contract for Castle vertical slice screens.

This is not a framework.

It is a minimal shared agreement.

---

# Required concepts

## Gameplay HUD

One shared value:

```ts
GAMEPLAY_HUD_HEIGHT
```

Recommended:

```txt
52–60 px on current mobile viewport
```

Same value must be used by:
- `HUDRenderer`,
- `GameScene.computeGridLayout`,
- any HUD mask/scrim.

---

## Result screen slots

Define shared relative slots for Game Over and Clear.

Example:

```txt
titleY: 0.25
subtitleY: 0.36
contextY: 0.47
primaryButtonY: 0.65
secondaryButtonY: 0.82
```

This can be adjusted, but must be shared.

Do not let GameOverScene and ClearScene drift independently.

---

# Suggested config shape

Adapt naming to repo style.

```ts
export const RESULT_SCREEN_LAYOUT = {
  titleY: 0.25,
  subtitleY: 0.36,
  contextY: 0.47,
  primaryButtonY: 0.65,
  separatorY: 0.73,
  secondaryButtonY: 0.82,
  primaryButtonW: 0.72,
  secondaryButtonW: 0.58,
  primaryButtonH: 58,
  secondaryButtonH: 46,
};
```

---

# Castle result theme

Suggested:

```ts
export const CASTLE_RESULT_THEME = {
  primaryFill: 0xf6c45c,
  primaryPressed: 0xffd982,
  primaryStroke: 0xffefad,
  primaryText: '#1c1025',
  secondaryFill: 0x180a2a,
  secondaryPressed: 0x24123d,
  secondaryStroke: 0x8b4bff,
  secondaryText: '#e6d8ff',
  titleLoss: '#ff6b5f',
  titleClear: '#f6c45c',
};
```

---

# Ownership rule

Runtime owns:
- title,
- subtitle,
- context label,
- buttons,
- button labels,
- HUD.

Images own:
- background mood,
- decoration,
- empty panels,
- ambience.

---

# Acceptance

Patch passes only if:
- Castle HUD is clean;
- result screens share layout;
- no text is baked into images;
- no old baked HUD is visible.
