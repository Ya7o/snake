# PROMPT COPY/PASTE — PATCH 990 V3 OPENMOJI GLOBAL BINDING + CASTLE QUICK WINS

You are working on Snake Drive V4.

This patch supersedes all previous PATCH 990 versions.

The user has already cloned OpenMoji locally here:

```txt
snake/tmp/emoticon
```

Apply:

```txt
tickets/990_PATCH_OPENMOJI_GLOBAL_BINDING_V3.md
docs/990_GLOBAL_ICON_POLICY_V3.md
docs/990_ICON_SELECTION_TABLE_V3.md
docs/990_CASTLE_QUICK_WINS.md
docs/990_OBSTACLE_DANGER_BOSS_BINDING_V3.md
docs/990_ASSET_COPY_AND_BINDING_V3.md
docs/990_RUNTIME_REGISTRY_CONTRACT_V3.md
docs/990_QA_AND_ACCEPTANCE_V3.md
docs/990_DO_NOT_TOUCH_V3.md
scripts/openmoji_selected_icons_manifest.json
scripts/copy-openmoji-subset.mjs
scripts/generate-openmoji-registry.mjs
```

## Mission

Globally bind a controlled OpenMoji subset for:

```txt
world icons
HUD icons
pickups
obstacles
danger/hazards
boss-event markers
result icons
Castle quick wins: key, pause, shield, bonus/perfect star
```

## Step 1 — Copy selected SVGs

Run:

```bash
node scripts/copy-openmoji-subset.mjs --source snake/tmp/emoticon --dest public/assets/openmoji
```

If the repo uses `src/assets`, adapt destination.

## Step 2 — Generate registry

Run:

```bash
node scripts/generate-openmoji-registry.mjs --out src/data/openmojiIconRegistry.ts --root assets/openmoji
```

## Step 3 — Bind Castle V1

Use `CASTLE_V1_OPENMOJI` for:

```txt
world           -> 🏰
stage           -> 🚩
pickup magic    -> ✨
bonus gem       -> 💎
rare orb        -> 🔮
key unlock      -> 🗝️
shield powerup  -> 🛡️
bonus/perfect   -> 🌟 / ⭐
fixed obstacle  -> 🧱
alt obstacle    -> 🪨
door/gate       -> 🚪
danger fire     -> 🔥
warning         -> ⚠️
boss event      -> 🔮
boss danger     -> 💀
boss reward     -> 👑
pause           -> ⏸️
play/continue   -> ▶️
home/menu       -> 🏠
clear           -> 🏆
```

Replace current placeholder icons/images only where safe.

## Hard guardrails

Do not touch:
- backgrounds;
- Snake sprites;
- boss character sprites;
- gameplay board/grid;
- core gameplay logic;
- movement/collision/progression;
- title background;
- full OpenMoji clone.

Do not create new mechanics just because an icon exists.

## Test

Run:

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

## Report back

Report:
- files changed;
- icons copied;
- missing/fallback icons;
- whether key/pause/shield/star icons were created;
- where Castle icons are referenced;
- build result.
