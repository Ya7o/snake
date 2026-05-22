# 983 — Implementation Notes

## Suggested implementation plan

### 1. Create shared UI constants

Example:

```ts
export const GAMEPLAY_HUD_LAYOUT = {
  height: 56,
  paddingX: 10,
};
```

Put this in a small file or constants if appropriate.

---

### 2. Update `HUDRenderer`

Replace:

```ts
const hudH = 34;
```

with shared height.

Make background:

```ts
alpha: 0.96–1.0
```

If the old frame still bleeds, use 1.0.

Increase text size only if it remains readable and fits.

---

### 3. Update `GameScene`

Use the same HUD height in:

```ts
computeGridLayout(...)
```

Add a Castle-specific scrim if needed:

```ts
if (uid === 'castle') {
  this.add.rectangle(
    width / 2,
    Math.max(0, this.layout.y / 2),
    width,
    this.layout.y,
    0x05020d,
    1,
  ).setDepth(9);
}
```

Place it:
- above frame art,
- below HUD text,
- before/around HUDRenderer creation depending on depth setup.

Adjust depth carefully.

---

### 4. Decide frame behavior

If `UniverseFrameRenderer` still reveals old baked top HUD:
- mask it;
- or add a Castle-specific "full frame top header suppression";
- or force Castle gameplay to use runtime fallback frame rather than full-frame image.

Choose the smallest robust change.

Do not edit image files.

---

### 5. Create result layout helper

Possible helper:

```ts
export function renderResultScreen(scene, config) {
  // draw background
  // draw title/subtitle/context
  // draw primary/secondary buttons
}
```

Use in both:
- `GameOverScene`,
- `ClearScene`.

If helper is too much, centralize constants at minimum.

---

### 6. Keep non-Castle fallback

Do not break generic screens for other universes.

Castle can be special-cased for now, but the special case should be clean.

---

### 7. Validate with screenshots

This patch is visual. Build OK is not enough.

Require screenshots before PATCH 990.
