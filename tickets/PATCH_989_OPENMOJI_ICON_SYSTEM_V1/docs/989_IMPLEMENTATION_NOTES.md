# 989 — Implementation Notes

## Suggested implementation sequence

### 1. Clone OpenMoji temporarily

```bash
rm -rf /tmp/openmoji
git clone --depth 1 https://github.com/hfg-gmuend/openmoji.git /tmp/openmoji
```

### 2. Inspect available files

```bash
ls /tmp/openmoji/color/svg | head
```

Search for likely codepoints or use OpenMoji metadata.

### 3. Copy selected SVGs

Use semantic filenames:

```txt
world/castle.svg
world/speed.svg
world/streets.svg
world/fighter.svg
world/outrun.svg
world/shinobi.svg
world/kombat.svg
world/paperboy.svg
```

### 4. Add registry

Create an icon registry:

```ts
export const ICONS = {
  world: {
    castle: 'assets/openmoji/world/castle.svg',
    speed: 'assets/openmoji/world/speed.svg',
    streets: 'assets/openmoji/world/streets.svg',
    fighter: 'assets/openmoji/world/fighter.svg',
    outrun: 'assets/openmoji/world/outrun.svg',
    shinobi: 'assets/openmoji/world/shinobi.svg',
    kombat: 'assets/openmoji/world/kombat.svg',
    paperboy: 'assets/openmoji/world/paperboy.svg',
  },
  hud: {
    magic: 'assets/openmoji/hud/magic.svg',
    warning: 'assets/openmoji/hud/warning.svg',
    boss: 'assets/openmoji/hud/boss.svg',
  },
};
```

### 5. Integrate lightly

Use icons in:
- title token row,
- world map node icons,
- HUD label icons if visually helpful.

Do not replace every existing sprite blindly.

### 6. Add attribution

Update README or `docs/CREDITS.md`.

### 7. Test

```bash
npm ci
npm run build
```
