# 990 V3 — Asset Copy And Binding

## Source

Use:

```txt
snake/tmp/emoticon
```

Expected folder:

```txt
snake/tmp/emoticon/color/svg/
```

## Copy command

```bash
node scripts/copy-openmoji-subset.mjs --source snake/tmp/emoticon --dest public/assets/openmoji
```

## Expected output

```txt
assets/openmoji/world/
assets/openmoji/hud/
assets/openmoji/pickups/
assets/openmoji/obstacles/
assets/openmoji/danger/
assets/openmoji/boss/
assets/openmoji/result/
```

The copy script creates:

```txt
OPENMOJI_COPY_REPORT.json
```
