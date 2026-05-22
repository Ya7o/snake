# 984 — Implementation Notes

## Suggested implementation path

### 1. Move/copy assets into project convention

If the repo serves assets from `public/assets`, copy:

```txt
src/assets/ui/castle/*.png
```

to:

```txt
public/assets/ui/castle/*.png
```

Then reference them as:

```txt
assets/ui/castle/castle_system_bg.png
assets/ui/castle/castle_gameplay_bg.png
assets/ui/castle/castle_game_over_bg.png
assets/ui/castle/castle_clear_bg.png
```

Do not keep dead duplicate references.

---

### 2. Add theme asset config

Example:

```ts
export const CASTLE_SCREEN_ASSETS = {
  system: 'assets/ui/castle/castle_system_bg.png',
  gameplay: 'assets/ui/castle/castle_gameplay_bg.png',
  gameOver: 'assets/ui/castle/castle_game_over_bg.png',
  clear: 'assets/ui/castle/castle_clear_bg.png',
};
```

Adapt to existing asset loading.

---

### 3. Update LevelIntroScene

For Castle:
- use `castle_system_bg`;
- draw runtime panel;
- draw text;
- draw buttons.

Do not rely on image panels.

---

### 4. Update GameScene

For Castle:
- use `castle_gameplay_bg`;
- remove old full-frame Castle HUD image;
- ensure HUD is runtime-only;
- draw grid panel over background.

Recommended:
- background image at low depth;
- dark grid panel behind grid;
- HUD strip at top;
- grid and gameplay objects above.

---

### 5. Update GameOverScene

For Castle:
- use `castle_game_over_bg`;
- draw runtime title/buttons.

---

### 6. Update ClearScene

For Castle:
- use `castle_clear_bg`;
- draw runtime title/buttons.

---

### 7. Centralize runtime layout

At minimum:
- one HUD height constant;
- one result screen layout config;
- one Castle button style config.

Do not build a giant framework.

---

### 8. Validate screenshots

This patch is only successful after screenshots.
Build OK is not enough.
