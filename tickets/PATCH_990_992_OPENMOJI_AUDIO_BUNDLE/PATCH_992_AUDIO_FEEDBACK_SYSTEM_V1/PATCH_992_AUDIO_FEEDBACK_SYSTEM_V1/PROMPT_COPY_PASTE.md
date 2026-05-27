# PROMPT COPY/PASTE — PATCH 992 AUDIO FEEDBACK SYSTEM V1

You are working on Snake Drive V4.

Apply this patch:

```txt
tickets/992_PATCH_AUDIO_FEEDBACK_SYSTEM_V1.md
docs/992_AUDIO_POLICY.md
docs/992_AUDIO_EVENT_MAPPING.md
docs/992_AUDIO_RUNTIME_CONTRACT.md
docs/992_AUDIO_QA_CHECKLIST.md
docs/992_DO_NOT_TOUCH.md
public/assets/audio/*.wav
src/assets/audio/*.wav
src/data/audioRegistry.example.ts
src/audio/audioManager.example.ts
references/AUDIO_MANIFEST_992.json
```

## Mission

Integrate only the necessary V1 sound effects used today.

Use these sounds now:

```txt
pickup_magic.wav
collision_hit.wav
stage_clear.wav
ui_button.wav
danger_alert.wav
```

Do not integrate optional future sounds.

## Preferred asset destination

```txt
public/assets/audio/
```

If the project uses bundled imports, use:

```txt
src/assets/audio/
```

The patch provides both.

## Required runtime keys

```txt
pickupMagic
collisionHit
stageClear
uiButton
dangerAlert
```

## Required event hooks

```txt
pickupMagic  -> when Snake collects primary Castle pickup
collisionHit -> when Snake dies/collides
stageClear   -> when stage is completed
uiButton     -> when button is pressed
dangerAlert  -> when danger/warning appears, only if the event exists
```

## Guardrails

Do not:
- add background music;
- add optional future sounds;
- create new mechanics;
- change Snake movement;
- change collision rules;
- change progression;
- touch OpenMoji;
- touch backgrounds.

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
- where audio files were copied;
- registry path;
- event hooks connected;
- build result;
- any sound intentionally not connected.
