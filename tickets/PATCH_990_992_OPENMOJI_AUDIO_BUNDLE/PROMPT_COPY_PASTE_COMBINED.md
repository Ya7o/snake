# PROMPT COPY/PASTE — APPLY PATCH 990 V3 THEN 992

You are working on Snake Drive V4.

Apply these patches in order:

```txt
1. PATCH_990_OPENMOJI_GLOBAL_BINDING_V3
2. PATCH_992_AUDIO_FEEDBACK_SYSTEM_V1
```

Do not apply PATCH 991.

## Step 1 — OpenMoji

Open:

```txt
PATCH_990_OPENMOJI_GLOBAL_BINDING_V3/PROMPT_COPY_PASTE.md
```

Follow its instructions.

Important:
- use local OpenMoji clone at `snake/tmp/emoticon`;
- create OpenMoji subset;
- generate registry;
- expose Castle V1 OpenMoji keys;
- do not touch backgrounds, Snake movement, collision, or gameplay logic.

## Step 2 — Audio

Open:

```txt
PATCH_992_AUDIO_FEEDBACK_SYSTEM_V1/PROMPT_COPY_PASTE.md
```

Follow its instructions.

Use only currently necessary sounds:

```txt
pickup_magic.wav
collision_hit.wav
stage_clear.wav
ui_button.wav
danger_alert.wav
```

## Final validation

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
- OpenMoji icons copied;
- missing/fallback OpenMoji icons;
- audio files copied;
- registry paths;
- event hooks added;
- build result.
