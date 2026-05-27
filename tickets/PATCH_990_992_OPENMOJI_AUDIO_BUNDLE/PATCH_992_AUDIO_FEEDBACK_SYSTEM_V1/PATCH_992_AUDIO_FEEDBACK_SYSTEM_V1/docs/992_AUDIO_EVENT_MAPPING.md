# 992 — Audio Event Mapping

| Event | Key | File | Required |
|---|---|---|---|
| Primary pickup collected | `pickupMagic` | `pickup_magic.wav` | yes |
| Snake death / collision | `collisionHit` | `collision_hit.wav` | yes |
| Stage clear | `stageClear` | `stage_clear.wav` | yes |
| Button press | `uiButton` | `ui_button.wav` | yes |
| Danger appears | `dangerAlert` | `danger_alert.wav` | if danger event exists |

## Hook guidance

### Pickup

Call after pickup is confirmed.

```ts
playSound('pickupMagic');
```

### Collision

Call once when death state is entered.

```ts
playSound('collisionHit');
```

Avoid replaying every frame.

### Stage clear

Call once when clear state is entered.

```ts
playSound('stageClear');
```

### Button

Call on button press/tap.

```ts
playSound('uiButton');
```

### Danger

Call when danger appears or warning begins.

```ts
playSound('dangerAlert');
```

Do not call continuously while danger is active.
