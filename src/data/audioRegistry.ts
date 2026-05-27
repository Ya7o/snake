export const AUDIO_REGISTRY = {
  pickupMagic: 'assets/audio/pickup_magic.wav',
  collisionHit: 'assets/audio/collision_hit.wav',
  stageClear: 'assets/audio/stage_clear.wav',
  uiButton: 'assets/audio/ui_button.wav',
  dangerAlert: 'assets/audio/danger_alert.wav',
  gameOver: 'assets/audio/game_over.wav',
  bossHit: 'assets/audio/boss_hit.wav',
  bossClear: 'assets/audio/boss_clear.wav',
} as const;

export type AudioKey = keyof typeof AUDIO_REGISTRY;
