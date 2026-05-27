// PATCH 992 example.
// Adapt paths to your actual project convention.

export const AUDIO_REGISTRY = {
  pickupMagic: 'assets/audio/pickup_magic.wav',
  collisionHit: 'assets/audio/collision_hit.wav',
  stageClear: 'assets/audio/stage_clear.wav',
  uiButton: 'assets/audio/ui_button.wav',
  dangerAlert: 'assets/audio/danger_alert.wav',
} as const;

export type AudioKey = keyof typeof AUDIO_REGISTRY;
