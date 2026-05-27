# 992 — Audio Runtime Contract

## Required behavior

The audio runtime must be safe.

It should:
- never crash if a sound file is missing;
- avoid overlapping death/clear sounds repeatedly;
- allow future mute support;
- use semantic keys, not raw filenames across scenes.

---

# Semantic keys

```txt
pickupMagic
collisionHit
stageClear
uiButton
dangerAlert
```

Good:

```ts
playSound('pickupMagic');
```

Bad:

```ts
playSound('pickup_magic.wav');
```

---

# Suggested registry

```ts
export const AUDIO_REGISTRY = {
  pickupMagic: 'assets/audio/pickup_magic.wav',
  collisionHit: 'assets/audio/collision_hit.wav',
  stageClear: 'assets/audio/stage_clear.wav',
  uiButton: 'assets/audio/ui_button.wav',
  dangerAlert: 'assets/audio/danger_alert.wav',
} as const;
```

If using Vite/public assets, paths may need leading slash:

```ts
'/assets/audio/pickup_magic.wav'
```

Adapt to existing repo conventions.
