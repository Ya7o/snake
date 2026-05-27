// PATCH 992 example.
// Lightweight browser audio helper.
// If the project uses Phaser, adapt these keys to this.load.audio / this.sound.play.

import { AUDIO_REGISTRY, type AudioKey } from '../data/audioRegistry';

const cache = new Map<AudioKey, HTMLAudioElement>();
let muted = false;

export function preloadAudio() {
  for (const [key, src] of Object.entries(AUDIO_REGISTRY) as [AudioKey, string][]) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    cache.set(key, audio);
  }
}

export function setAudioMuted(value: boolean) {
  muted = value;
}

export function playSound(key: AudioKey) {
  if (muted) return;

  const original = cache.get(key);
  if (!original) return;

  try {
    const audio = original.cloneNode(true) as HTMLAudioElement;
    audio.volume = 0.75;
    void audio.play();
  } catch {
    // Audio must never crash gameplay.
  }
}
