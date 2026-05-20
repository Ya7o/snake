import Phaser from 'phaser';
import { Direction, queueDirection, SnakeState } from '../core/Snake';

// Swipe detected as soon as the finger travels SWIPE_MIN px — no need to lift finger
const SWIPE_MIN = 20;

export class InputSystem {
  private scene: Phaser.Scene;
  private snake: SnakeState | null = null;
  private swipeStart: { x: number; y: number } | null = null;
  private swipeLocked = false;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<string, Phaser.Input.Keyboard.Key> = {};

  // Named callbacks so we can remove exactly our own listeners
  private onDown: (p: Phaser.Input.Pointer) => void;
  private onMove: (p: Phaser.Input.Pointer) => void;
  private onUp: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.onDown = (p: Phaser.Input.Pointer) => {
      this.swipeStart = { x: p.x, y: p.y };
      this.swipeLocked = false;
    };

    // Detect swipe direction as soon as threshold is reached (pointermove)
    // This fires while the finger is still moving — far more responsive than pointerup
    this.onMove = (p: Phaser.Input.Pointer) => {
      if (!p.isDown || !this.swipeStart || this.swipeLocked) return;
      const dx = p.x - this.swipeStart.x;
      const dy = p.y - this.swipeStart.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < SWIPE_MIN) return;
      this.swipeLocked = true;
      const dir: Direction = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'RIGHT' : 'LEFT')
        : (dy > 0 ? 'DOWN' : 'UP');
      if (this.snake) queueDirection(this.snake, dir);
    };

    // Reset on finger lift so next swipe starts fresh
    this.onUp = () => {
      this.swipeStart = null;
      this.swipeLocked = false;
    };

    this.scene.input.on('pointerdown', this.onDown);
    this.scene.input.on('pointermove', this.onMove);
    this.scene.input.on('pointerup', this.onUp);

    this.setupKeyboard();
  }

  bind(snake: SnakeState): void {
    this.snake = snake;
  }

  private setupKeyboard(): void {
    if (!this.scene.input.keyboard) return;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasd = {
      W: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  pollKeyboard(): void {
    if (!this.snake) return;
    const c = this.cursors;
    if (!c) return;
    if (Phaser.Input.Keyboard.JustDown(c.up)    || Phaser.Input.Keyboard.JustDown(this.wasd['W'])) queueDirection(this.snake, 'UP');
    if (Phaser.Input.Keyboard.JustDown(c.down)  || Phaser.Input.Keyboard.JustDown(this.wasd['S'])) queueDirection(this.snake, 'DOWN');
    if (Phaser.Input.Keyboard.JustDown(c.left)  || Phaser.Input.Keyboard.JustDown(this.wasd['A'])) queueDirection(this.snake, 'LEFT');
    if (Phaser.Input.Keyboard.JustDown(c.right) || Phaser.Input.Keyboard.JustDown(this.wasd['D'])) queueDirection(this.snake, 'RIGHT');
  }

  // Call this from scene's shutdown() event to avoid listener accumulation on retry
  destroy(): void {
    this.scene.input.off('pointerdown', this.onDown);
    this.scene.input.off('pointermove', this.onMove);
    this.scene.input.off('pointerup', this.onUp);
    this.snake = null;
  }
}
