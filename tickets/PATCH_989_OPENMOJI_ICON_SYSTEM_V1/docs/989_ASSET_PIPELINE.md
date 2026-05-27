# 989 — Asset Pipeline

## Preferred pipeline

Use a temporary clone:

```bash
rm -rf /tmp/openmoji
git clone --depth 1 https://github.com/hfg-gmuend/openmoji.git /tmp/openmoji
```

Then copy only selected SVGs.

---

# Recommended destination

Choose one based on repo convention.

## Option A — public assets

```txt
public/assets/openmoji/
  world/
  hud/
  pickups/
  result/
```

Runtime path:

```txt
assets/openmoji/world/castle.svg
```

## Option B — imported source assets

```txt
src/assets/openmoji/
  world/
  hud/
  pickups/
  result/
```

Use this only if the project already imports assets through the bundler.

---

# Do not commit

Do not commit:

```txt
/tmp/openmoji
openmoji/
all SVGs
all PNGs
OpenMoji repo history
```

Only commit the small selected subset.

---

# Suggested copy workflow

1. Clone OpenMoji.
2. Locate SVGs under:
   ```txt
   /tmp/openmoji/color/svg/
   ```
3. Copy selected icons to project.
4. Rename them semantically:
   ```txt
   castle.svg
   magic.svg
   warning.svg
   ```
5. Add attribution.
6. Build.

---

# Optional automation

This patch includes:

```txt
scripts/openmoji_subset_manifest.json
scripts/fetch_openmoji_subset.sh
```

Codex can update the script to match final chosen SVG filenames/codepoints.
