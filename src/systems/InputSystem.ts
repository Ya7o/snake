import Phaser from 'phaser';
import { Direction, queueDirection, SnakeState } from '../core/Snake';

// Swipe fires as soon as the finger travels SWIPE_MIN px — no need to lift
const SWIPE_MIN = 18;

export class InputSystem {
  private scene: Phaser.Scene;
  private snake: SnakeState | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private wasd: Record<string, Phaser.Input.Keyboard.Key> = {};

  // Native DOM touch bypass — lower latency than Phaser's input pipeline
  private nativeCanvas: HTMLCanvasElement | null = null;
  private touchStart: { x: number; y: number } | null = null;
  private touchLocked = false;

  private onNativeTouchStart: (e: TouchEvent) => void;
  private onNativeTouchMove: (e: TouchEvent) => void;
  private onNativeTouchEnd: () => void;

  // Phaser pointer fallback (desktop/pointer devices)
  private swipeStart: { x: number; y: number } | null = null;
  private swipeLocked = false;
  private onDown: (p: Phaser.Input.Pointer) => void;
  private onMove: (p: Phaser.Input.Pointer) => void;
  private onUp: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // --- Native touch (bypasses Phaser pipeline for minimum latency) ---
    this.onNativeTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      this.touchStart = { x: t.clientX, y: t.clientY };
      this.touchLocked = false;
    };

    this.onNativeTouchMove = (e: TouchEvent) => {
      // 907 — prevent scroll/overscroll while swiping in game
      e.preventDefault();
      if (!this.touchStart || this.touchLocked) return;
      const t = e.touches[0];
      const dx = t.clientX - this.touchStart.x;
      const dy = t.clientY - this.touchStart.y;
      if (Math.sqrt(dx * dx + dy * dy) < SWIPE_MIN) return;
      this.touchLocked = true;
      const dir: Direction = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'RIGHT' : 'LEFT')
        : (dy > 0 ? 'DOWN' : 'UP');
      if (this.snake) queueDirection(this.snake, dir);
    };

    this.onNativeTouchEnd = () => {
      this.touchStart = null;
      this.touchLocked = false;
    };

    // Attach to the actual canvas element
    this.nativeCanvas = scene.game.canvas;
    if (this.nativeCanvas) {
      this.nativeCanvas.addEventListener('touchstart', this.onNativeTouchStart, { passive: true });
      // 907 — passive: false so preventDefault() works to block page scroll during swipe
      this.nativeCanvas.addEventListener('touchmove',  this.onNativeTouchMove,  { passive: false });
      this.nativeCanvas.addEventListener('touchend',   this.onNativeTouchEnd,   { passive: true });
    }

    // --- Phaser pointer fallback (mouse / pointer devices, also catches touch on non-native path) ---
    this.onDown = (p: Phaser.Input.Pointer) => {
      if (p.wasTouch) return; // handled by native listener
      this.swipeStart = { x: p.x, y: p.y };
      this.swipeLocked = false;
    };

    this.onMove = (p: Phaser.Input.Pointer) => {
      if (p.wasTouch || !p.isDown || !this.swipeStart || this.swipeLocked) return;
      const dx = p.x - this.swipeStart.x;
      const dy = p.y - this.swipeStart.y;
      if (Math.sqrt(dx * dx + dy * dy) < SWIPE_MIN) return;
      this.swipeLocked = true;
      const dir: Direction = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'RIGHT' : 'LEFT')
        : (dy > 0 ? 'DOWN' : 'UP');
      if (this.snake) queueDirection(this.snake, dir);
    };

    this.onUp = () => {
      this.swipeStart = null;
      this.swipeLocked = false;
    };

    scene.input.on('pointerdown', this.onDown);
    scene.input.on('pointermove', this.onMove);
    scene.input.on('pointerup',   this.onUp);

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

  destroy(): void {
    if (this.nativeCanvas) {
      this.nativeCanvas.removeEventListener('touchstart', this.onNativeTouchStart);
      this.nativeCanvas.removeEventListener('touchmove',  this.onNativeTouchMove);
      this.nativeCanvas.removeEventListener('touchend',   this.onNativeTouchEnd);
    }
    this.scene.input.off('pointerdown', this.onDown);
    this.scene.input.off('pointermove', this.onMove);
    this.scene.input.off('pointerup',   this.onUp);
    this.snake = null;
  }
}
