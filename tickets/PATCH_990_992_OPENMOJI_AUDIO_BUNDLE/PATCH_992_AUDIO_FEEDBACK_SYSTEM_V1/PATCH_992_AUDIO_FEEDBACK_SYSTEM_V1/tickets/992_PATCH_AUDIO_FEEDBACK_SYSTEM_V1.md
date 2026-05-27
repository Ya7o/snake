# 992_PATCH_AUDIO_FEEDBACK_SYSTEM_V1

## Mission

Integrate the currently necessary V1 audio feedback into Snake Drive.

Use only these sounds now:

```txt
pickup_magic.wav
collision_hit.wav
stage_clear.wav
ui_button.wav
danger_alert.wav
```

Do not integrate optional/future sounds yet.

---

# Required audio events

| Runtime event | Sound |
|---|---|
| Snake collects Castle magic / primary pickup | `pickup_magic.wav` |
| Snake collides / dies | `collision_hit.wav` |
| Stage is completed | `stage_clear.wav` |
| Button is pressed | `ui_button.wav` |
| Danger appears / warning starts | `danger_alert.wav` |

---

# Required implementation

## 1. Copy audio assets

Preferred destination:

```txt
public/assets/audio/
```

If the project uses bundled imports instead, use:

```txt
src/assets/audio/
```

The patch provides both copies.

## 2. Create audio registry

Create or adapt:

```txt
src/data/audioRegistry.ts
```

Suggested keys:

```txt
pickupMagic
collisionHit
stageClear
uiButton
dangerAlert
```

## 3. Add audio manager / helper

Create or adapt a lightweight runtime helper.

It should support:

```txt
preload/load audio
playSound(key)
mute/unmute if already supported
safe fallback if audio fails
no crash on missing file
```

## 4. Bind events

Bind only the current gameplay events:

```txt
pickupMagic -> pickup collection
collisionHit -> death/collision
stageClear -> clear/victory
uiButton -> runtime button press
dangerAlert -> danger/warning event
```

If one event does not yet exist, leave a TODO and do not invent mechanics.

---

# Guardrails

Do not:
- add background music;
- add soundtrack system;
- add audio settings screen unless already exists;
- add optional sounds;
- change core gameplay logic;
- change collision behavior;
- change stage progression;
- create new mechanics.

---

# Definition of done

- [ ] Necessary audio files exist in the project.
- [ ] Audio registry exists.
- [ ] Runtime can play sound by semantic key.
- [ ] Pickup plays `pickup_magic.wav`.
- [ ] Collision/death plays `collision_hit.wav`.
- [ ] Stage clear plays `stage_clear.wav`.
- [ ] Button press plays `ui_button.wav`.
- [ ] Danger alert plays `danger_alert.wav` if danger event exists.
- [ ] Build passes.
