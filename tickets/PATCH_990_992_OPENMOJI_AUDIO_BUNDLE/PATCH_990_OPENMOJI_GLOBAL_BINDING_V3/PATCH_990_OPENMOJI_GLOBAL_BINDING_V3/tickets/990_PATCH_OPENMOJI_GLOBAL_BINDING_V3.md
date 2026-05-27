# 990_PATCH_OPENMOJI_GLOBAL_BINDING_V3

## Mission

Use the local OpenMoji clone to wire a complete V1 icon system across Snake Drive, including Castle quick wins.

Local clone expected:

```txt
snake/tmp/emoticon
```

---

# What changed vs V2

V2 added obstacles/danger/boss.

V3 adds useful Castle V1 quick wins:

```txt
🗝️ key / unlock
⏸️ pause
🛡️ shield
🌟 bonus / perfect
▶️ play
🏠 home
🚪 door / gate
```

These are still small functional icons, not a new art direction.

---

# Required implementation

## 1. Copy selected OpenMoji SVGs

Run:

```bash
node scripts/copy-openmoji-subset.mjs --source snake/tmp/emoticon --dest public/assets/openmoji
```

Expected output groups:

```txt
world/
hud/
pickups/
obstacles/
danger/
boss/
result/
```

## 2. Generate registry

Run:

```bash
node scripts/generate-openmoji-registry.mjs --out src/data/openmojiIconRegistry.ts --root assets/openmoji
```

## 3. Bind Castle V1 set

Use:

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

## 4. Replace small placeholders only

Replace where safe:
- title/world token icons;
- world selection icons;
- HUD micro-icons;
- pickup placeholders;
- obstacle placeholders;
- danger markers;
- boss-event markers;
- result screen icons.

Do not replace:
- backgrounds;
- Snake sprites;
- boss character sprites;
- gameplay board;
- title background.

---

# Definition of done

- [ ] Selected SVG subset copied.
- [ ] Registry includes all V3 groups and Castle quick wins.
- [ ] Castle V1 can reference pickup/obstacle/danger/boss/key/shield/pause/play/home icons.
- [ ] No full OpenMoji repo committed.
- [ ] Build passes.
