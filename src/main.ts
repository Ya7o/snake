import Phaser from 'phaser';
import { BACKGROUND_COLOR, SCENES } from './config/constants';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { WorldMapScene } from './scenes/WorldMapScene';
import { LevelIntroScene } from './scenes/LevelIntroScene';
import { GameScene } from './scenes/GameScene';
import { ClearScene } from './scenes/ClearScene';
import { GameOverScene } from './scenes/GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: BACKGROUND_COLOR,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    antialias: false,       // sharper pixels, less GPU work on mobile
    pixelArt: true,         // nearest-neighbour scaling
    roundPixels: true,      // no sub-pixel blurring
    powerPreference: 'high-performance',
  },
  input: {
    smoothFactor: 0,        // disable pointer smoothing — rawer, more responsive
    activePointers: 2,      // support two touch points (swipe + second finger)
  },
  disableContextMenu: true, // prevent long-press context menu on Android
  scene: [BootScene, TitleScene, WorldMapScene, LevelIntroScene, GameScene, ClearScene, GameOverScene]
};

// Vite HMR guard — destroy the previous Phaser instance before creating a new one.
// Without this, each hot-reload stacks a new canvas on top of the old one.
declare const __SNAKE_GAME__: Phaser.Game | undefined;

if (typeof __SNAKE_GAME__ !== 'undefined') {
  try { __SNAKE_GAME__.destroy(true, false); } catch { /* ignore */ }
  document.getElementById('app')!.innerHTML = '';
}

const game = new Phaser.Game(config);
(window as unknown as Record<string, unknown>)['__SNAKE_GAME__'] = game;

console.info(`Snake Drive V4 loaded — ${SCENES.BOOT} → ${SCENES.TITLE}`);

// HMR cleanup hook (Vite dev only)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    try { game.destroy(true, false); } catch { /* ignore */ }
    document.getElementById('app')!.innerHTML = '';
  });
}
