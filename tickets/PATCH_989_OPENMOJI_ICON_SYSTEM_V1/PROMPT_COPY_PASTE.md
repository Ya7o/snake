# PROMPT COPY/PASTE — PATCH 989 OPENMOJI ICON SYSTEM FOR V1

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/989_PATCH_OPENMOJI_ICON_SYSTEM_V1.md
docs/989_OPENMOJI_USAGE_STRATEGY.md
docs/989_ICON_MAPPING.md
docs/989_ASSET_PIPELINE.md
docs/989_LICENSE_ATTRIBUTION.md
docs/989_IMPLEMENTATION_NOTES.md
docs/989_QA_TEST_PLAN.md
docs/989_SCOPE_GUARDRAILS.md
scripts/openmoji_subset_manifest.json
```

## Mission

Integrate OpenMoji as a small V1 icon system.

Use it for:
- world tokens,
- HUD icons,
- pickup/menu placeholders,
- result screen symbols.

Do not use it for:
- backgrounds,
- main Snake sprite,
- boss sprites,
- gameplay frames,
- premium large art.

## Fetch OpenMoji

Use a temporary shallow clone:

```bash
rm -rf /tmp/openmoji
git clone --depth 1 https://github.com/hfg-gmuend/openmoji.git /tmp/openmoji
```

Do not commit the full OpenMoji repository.

## Asset selection

Use `scripts/openmoji_subset_manifest.json` and `docs/989_ICON_MAPPING.md` as the selection guide.

OpenMoji SVG filenames are usually codepoint-based. After cloning, locate the correct files in:

```txt
/tmp/openmoji/color/svg/
```

Copy only selected assets into the game with semantic names.

Recommended destination:

```txt
public/assets/openmoji/
  world/
  hud/
  pickups/
  result/
```

or `src/assets/openmoji/` if the repo convention prefers imports.

## Runtime integration

Create or update an icon registry.

Use icons in title/world map/HUD only where they improve clarity.

## Attribution

Add attribution to README or docs/CREDITS.md:

```txt
Selected emoji/icon assets by OpenMoji — the open-source emoji and icon project.
License: CC BY-SA 4.0.
https://openmoji.org/
```

## Hard constraints

- Do not commit full OpenMoji repo.
- Do not add huge asset folders.
- Do not replace backgrounds.
- Do not replace main sprites/bosses.
- Do not add dependencies unless strictly justified.
- Build must pass.

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

- exact OpenMoji source method used;
- icons copied;
- destination paths;
- files changed;
- where icons are displayed;
- attribution location;
- commands run;
- remaining risks.
