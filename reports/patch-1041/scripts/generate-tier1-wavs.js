import fs from 'node:fs';
import path from 'node:path';

const sampleRate = 44100;
const outDir = 'public/assets/audio';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function envelope(t, duration, attack = 0.015, release = 0.08) {
  const attackGain = clamp(t / attack, 0, 1);
  const releaseGain = clamp((duration - t) / release, 0, 1);
  return Math.min(attackGain, releaseGain);
}

function noise(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return (state / 0xffffffff) * 2 - 1;
  };
}

function writeWav(fileName, duration, renderSample) {
  const frameCount = Math.floor(sampleRate * duration);
  const dataSize = frameCount * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < frameCount; i++) {
    const t = i / sampleRate;
    const sample = clamp(renderSample(t, duration), -1, 1);
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, fileName), buffer);
}

function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

writeWav('game_over.wav', 1.05, (t, duration) => {
  const segment = t < 0.34 ? 0 : t < 0.68 ? 1 : 2;
  const base = [330, 220, 110][segment];
  const localT = t - segment * 0.34;
  const wobble = 1 + 0.015 * Math.sin(2 * Math.PI * 7 * t);
  return 0.36 * envelope(localT, 0.34, 0.01, 0.16) * sine(base * wobble, t);
});

writeWav('boss_hit.wav', 0.32, (() => {
  const nextNoise = noise(0xb055);
  return (t, duration) => {
    const drop = 180 - 70 * (t / duration);
    const body = Math.sign(sine(drop, t)) * 0.38;
    const grit = nextNoise() * 0.18 * Math.exp(-t * 18);
    return envelope(t, duration, 0.003, 0.18) * (body + grit);
  };
})());

writeWav('boss_clear.wav', 1.35, (t, duration) => {
  const notes = [
    { start: 0.00, freq: 660, len: 0.22 },
    { start: 0.24, freq: 880, len: 0.26 },
    { start: 0.52, freq: 1100, len: 0.34 },
    { start: 0.88, freq: 1320, len: 0.34 },
  ];
  let sample = 0;
  for (const note of notes) {
    if (t >= note.start && t < note.start + note.len) {
      const localT = t - note.start;
      sample += 0.24 * envelope(localT, note.len, 0.01, 0.12) * sine(note.freq, localT);
      sample += 0.08 * envelope(localT, note.len, 0.01, 0.12) * sine(note.freq * 2, localT);
    }
  }
  return sample * envelope(t, duration, 0.01, 0.2);
});

console.log('Generated public/assets/audio/game_over.wav');
console.log('Generated public/assets/audio/boss_hit.wav');
console.log('Generated public/assets/audio/boss_clear.wav');
