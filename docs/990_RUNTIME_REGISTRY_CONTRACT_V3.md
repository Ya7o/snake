# 990 V3 — Runtime Registry Contract

Required registry groups:

```txt
OPENMOJI_ICONS.world
OPENMOJI_ICONS.hud
OPENMOJI_ICONS.pickups
OPENMOJI_ICONS.obstacles
OPENMOJI_ICONS.danger
OPENMOJI_ICONS.boss
OPENMOJI_ICONS.result
CASTLE_V1_OPENMOJI
```

Scenes must use semantic references.

Good:
```ts
CASTLE_V1_OPENMOJI.obstacleFixed
OPENMOJI_ICONS.pickups.key
OPENMOJI_ICONS.hud.pause
```

Bad:
```ts
'1F5DD.svg'
'1F525.svg'
```
