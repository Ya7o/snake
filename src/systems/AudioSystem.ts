// Minimal audio system using Web Audio API — never blocks game
export const AudioSystem = {
  ctx: null as AudioContext | null,

  init(): void {
    try {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('[Audio] Web Audio not available');
    }
  },

  resume(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },

  tone(freq: number, duration: number, gain = 0.15, type: OscillatorType = 'square'): void {
    if (!this.ctx) return;
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

  pickup(): void    { this.tone(880, 0.08); },
  danger(): void    { this.tone(220, 0.15, 0.2, 'sawtooth'); },
  hit(): void       { this.tone(440, 0.1, 0.2, 'square'); },
  gameover(): void  { this.tone(110, 0.4, 0.2, 'sawtooth'); },
  clear(): void     { this.tone(660, 0.12); setTimeout(() => this.tone(880, 0.15), 100); },
};
