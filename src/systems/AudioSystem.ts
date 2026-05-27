// Minimal audio system using WAV assets with tone fallback — never blocks game.
import { AUDIO_REGISTRY, type AudioKey } from '../data/audioRegistry';

const AUDIO_MUTED_KEY = 'snakeDriveV4_audioMuted';

export const AudioSystem = {
  ctx: null as AudioContext | null,
  muted: false,
  cache: new Map<AudioKey, HTMLAudioElement>(),

  init(): void {
    this.muted = this.loadMuted();
    this.preload();
    try {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('[Audio] Web Audio not available');
    }
  },

  preload(): void {
    for (const [key, src] of Object.entries(AUDIO_REGISTRY) as [AudioKey, string][]) {
      if (this.cache.has(key)) continue;
      const audio = new Audio(src);
      audio.preload = 'auto';
      this.cache.set(key, audio);
    }
  },

  resume(): void {
    if (this.muted) return;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },

  isMuted(): boolean {
    return this.muted;
  },

  setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem(AUDIO_MUTED_KEY, muted ? '1' : '0');
    } catch {
      // localStorage can be unavailable in private contexts.
    }
  },

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  },

  play(key: AudioKey, fallback?: () => void): void {
    if (this.muted) return;
    this.preload();
    const original = this.cache.get(key);
    if (!original) {
      fallback?.();
      return;
    }
    try {
      const audio = original.cloneNode(true) as HTMLAudioElement;
      audio.volume = 0.72;
      void audio.play().catch(() => fallback?.());
    } catch {
      fallback?.();
    }
  },

  tone(freq: number, duration: number, gain = 0.15, type: OscillatorType = 'square'): void {
    if (!this.ctx || this.muted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gainNode.gain.setValueAtTime(gain, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // never block
    }
  },

  pickup(): void    { this.play('pickupMagic', () => this.tone(880, 0.08)); },
  danger(): void    { this.play('dangerAlert', () => this.tone(220, 0.15, 0.2, 'sawtooth')); },
  hit(): void       { this.play('collisionHit', () => this.tone(440, 0.1, 0.2, 'square')); },
  gameover(): void  {
    this.play('gameOver', () => {
      // descending tone: 330 → 220 → 110, grave, < 1.2s
      this.tone(330, 0.3, 0.25, 'sawtooth');
      setTimeout(() => this.tone(220, 0.35, 0.22, 'sawtooth'), 280);
      setTimeout(() => this.tone(110, 0.55, 0.2, 'sawtooth'), 600);
    });
  },
  bossHit(): void   {
    this.play('bossHit', () => {
      // heavy short impact, < 0.4s
      this.tone(160, 0.35, 0.28, 'square');
    });
  },
  bossClear(): void {
    this.play('bossClear', () => {
      // double ascending tone, gratifying, < 1.8s
      this.tone(660, 0.18, 0.18, 'triangle');
      setTimeout(() => this.tone(880, 0.22, 0.2, 'triangle'), 200);
      setTimeout(() => this.tone(1100, 0.35, 0.22, 'triangle'), 450);
    });
  },
  clear(): void     { this.play('stageClear', () => { this.tone(660, 0.12); setTimeout(() => this.tone(880, 0.15), 100); }); },
  uiButton(): void  { this.play('uiButton', () => this.tone(520, 0.05, 0.12, 'triangle')); },

  loadMuted(): boolean {
    try {
      return localStorage.getItem(AUDIO_MUTED_KEY) === '1';
    } catch {
      return false;
    }
  },
};
