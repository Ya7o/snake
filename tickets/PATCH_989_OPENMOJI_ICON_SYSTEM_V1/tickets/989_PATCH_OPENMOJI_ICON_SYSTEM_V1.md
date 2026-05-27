# 989_PATCH_OPENMOJI_ICON_SYSTEM_V1

## Context

Snake Drive currently uses generated icons/tokens in several places. This creates churn:
- inconsistent icon style,
- repeated image generation,
- over-detailed tokens that become unreadable at small sizes.

For V1, OpenMoji can provide a cleaner and faster icon baseline.

OpenMoji should **not** replace:
- backgrounds,
- gameplay background frames,
- main Snake sprite,
- bosses,
- key universe art.

OpenMoji should be used for:
- world tokens,
- HUD symbols,
- pickups/placeholders,
- menu/result small icons.

---

# Goal

Integrate a small OpenMoji SVG subset into the game.

## Desired result

```txt
public/assets/openmoji/
  world/
  hud/
  pickups/
  result/
```

or `src/assets/openmoji/`, depending on repo convention.

Create a config mapping worlds and UI icons to selected OpenMoji SVGs.

---

# Required work

## 1. Fetch OpenMoji source

Preferred command:

```bash
git clone --depth 1 https://github.com/hfg-gmuend/openmoji.git /tmp/openmoji
```

Do **not** commit the full OpenMoji repo.

---

## 2. Copy only selected assets

Use the manifest:

```txt
scripts/openmoji_subset_manifest.json
```

Copy selected SVG files from the OpenMoji repository into the game.

Recommended destination:

```txt
public/assets/openmoji/
```

or use:

```txt
src/assets/openmoji/
```

if the project imports assets through Vite/bundler.

---

## 3. Add icon registry

Create or update a runtime icon registry, for example:

```ts
export const OPENMOJI_ICONS = {
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
};
```

Adapt naming to the codebase.

---

## 4. Replace only small icons/tokens

Integrate OpenMoji for:
- world map node icons if present;
- title screen token strip;
- HUD icons if useful;
- pickup icons if currently placeholder-level.

Do not replace gameplay-critical sprites unless explicitly safe.

---

## 5. Preserve attribution

Add OpenMoji attribution to:
- README,
- credits/about screen if available,
- or docs/credits.

Suggested text:

```txt
Selected emoji/icon assets by OpenMoji — the open-source emoji and icon project.
License: CC BY-SA 4.0.
https://openmoji.org/
```

---

# Files likely to modify

```txt
src/scenes/TitleScene.ts
src/scenes/WorldMapScene.ts
src/scenes/GameScene.ts
src/data/worlds.ts
src/data/themes.ts
src/ui/*
src/assets/openmoji/*
public/assets/openmoji/*
README.md
docs/*
```

---

# Files allowed to create

```txt
src/assets/openmoji/
public/assets/openmoji/
src/ui/OpenMojiIconRegistry.ts
src/data/iconRegistry.ts
docs/CREDITS.md
```

---

# Files forbidden to modify

Do not modify unless necessary:

```txt
package.json
vite.config.*
tsconfig.*
```

No new runtime dependency unless strictly justified.

---

# Out of scope

Do not:
- replace backgrounds,
- replace Castle gameplay frame/background,
- redesign the title screen layout,
- add new universes,
- add official copyrighted characters/logos,
- vendor the full OpenMoji repo,
- add a huge icon pack to production.

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
- title screen icons load;
- world map icons load if used;
- HUD icons remain readable if used;
- no broken image paths;
- attribution exists.

---

# Definition of done

- [ ] Build passes.
- [ ] Only selected OpenMoji assets are committed.
- [ ] World/token icons use OpenMoji or have a clear fallback.
- [ ] HUD/pickup icons use OpenMoji only where appropriate.
- [ ] Backgrounds and main sprites remain custom.
- [ ] Attribution added.
- [ ] Full OpenMoji repo is not committed.
