import Phaser from 'phaser';
import { SCENES, ASSET_KEYS, ASSET_PATHS } from '../config/constants';
import { MAP_NODES } from '../config/mapNodes';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { SaveSystem } from '../systems/SaveSystem';

export class WorldMapScene extends Phaser.Scene {
  private mapContainer!: Phaser.GameObjects.Container;
  private nodeObjects: Phaser.GameObjects.Container[] = [];
  private dragStart = { x: 0, y: 0 };
  private isDragging = false;
  private containerX = 0;
  private containerY = 0;
  private mapImageLoaded = false;

  constructor() {
    super(SCENES.WORLD_MAP);
  }

  preload(): void {
    this.load.on('filecomplete', (key: string) => {
      if (key === ASSET_KEYS.WORLD_MAP) this.mapImageLoaded = true;
    });
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      if (file.key === ASSET_KEYS.WORLD_MAP) {
        console.warn('World map image missing, using procedural fallback');
        this.mapImageLoaded = false;
      }
    });
    this.load.image(ASSET_KEYS.WORLD_MAP, ASSET_PATHS.WORLD_MAP);
  }

  create(): void {
    const { width, height } = this.scale;

    // Dark background
    this.add.rectangle(width / 2, height / 2, width, height, 0x07111f).setDepth(0);

    // Title (fixed HUD — above map container)
    this.add.text(width / 2, 24, 'SNAKE DRIVE V4', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffd86b'
    }).setOrigin(0.5).setDepth(30);

    this.add.text(width / 2, 44, 'WORLD MAP', {
      fontFamily: 'monospace', fontSize: '11px', color: '#888888'
    }).setOrigin(0.5).setDepth(30);

    const mapY = 60;
    const mapW = width;
    const mapH = height - 100;

    this.containerX = 0;
    this.containerY = mapY;
    this.mapContainer = this.add.container(this.containerX, this.containerY).setDepth(1);

    // Layer 1: map image or procedural fallback
    if (this.mapImageLoaded && this.textures.exists(ASSET_KEYS.WORLD_MAP)) {
      const mapImg = this.add.image(mapW / 2, mapH / 2, ASSET_KEYS.WORLD_MAP);
      mapImg.setDisplaySize(mapW, mapH);
      mapImg.setDepth(0);
      this.mapContainer.add(mapImg);
    } else {
      this.drawProceduralMap(mapW, mapH);
    }

    // Layer 2: path lines
    const lineGfx = this.add.graphics().setDepth(1);
    lineGfx.lineStyle(2, 0x2255aa, 0.5);
    for (let i = 0; i < MAP_NODES.length - 1; i++) {
      const a = MAP_NODES[i];
      const b = MAP_NODES[i + 1];
      lineGfx.lineBetween(a.x * mapW, a.y * mapH, b.x * mapW, b.y * mapH);
    }
    this.mapContainer.add(lineGfx);

    // Layer 3: nodes
    const saveData = SaveSystem.load();
    this.nodeObjects = [];

    for (const node of MAP_NODES) {
      const nx = node.x * mapW;
      const ny = node.y * mapH;
      const level = getLevelById(node.levelId);
      if (!level) continue;
      const universe = UNIVERSES[level.universeId];
      const isUnlocked = saveData.unlockedNodes.includes(node.id);
      const isCleared = saveData.clearedLevels.includes(node.levelId);
      const isBoss = level.type === 'boss';

      const nodeContainer = this.add.container(nx, ny).setDepth(2);
      const gfx = this.add.graphics();

      if (isUnlocked) {
        const color = parseInt(universe.palette.primary.replace('#', ''), 16);
        const accentColor = parseInt(universe.palette.accent.replace('#', ''), 16);
        if (isCleared) {
          gfx.fillStyle(color, 0.5);
          gfx.fillCircle(0, 0, isBoss ? 20 : 16);
          gfx.lineStyle(2, accentColor, 0.8);
          gfx.strokeCircle(0, 0, isBoss ? 20 : 16);
        } else {
          gfx.fillStyle(color, 1);
          gfx.fillCircle(0, 0, isBoss ? 20 : 16);
          gfx.lineStyle(3, 0xffffff, 0.9);
          gfx.strokeCircle(0, 0, isBoss ? 22 : 18);
        }
      } else {
        gfx.fillStyle(0x222233, 1);
        gfx.fillCircle(0, 0, 12);
        gfx.lineStyle(1, 0x444455, 0.5);
        gfx.strokeCircle(0, 0, 12);
      }

      nodeContainer.add(gfx);

      const labelStyle = {
        fontFamily: 'monospace',
        fontSize: isBoss ? '11px' : '12px',
        color: isUnlocked ? '#ffffff' : '#444466'
      };
      const lbl = this.add.text(0, 0, isCleared ? '✓' : node.label, labelStyle).setOrigin(0.5);
      nodeContainer.add(lbl);

      if (isUnlocked) {
        const uLbl = this.add.text(0, 26, universe.shortName, {
          fontFamily: 'monospace', fontSize: '9px', color: universe.palette.accent
        }).setOrigin(0.5);
        nodeContainer.add(uLbl);

        nodeContainer.setInteractive(new Phaser.Geom.Circle(0, 0, 24), Phaser.Geom.Circle.Contains);
        nodeContainer.on('pointerdown', () => this.onNodeTap(node.levelId));
      }

      this.mapContainer.add(nodeContainer);
      this.nodeObjects.push(nodeContainer);
    }

    // Drag
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragStart = { x: p.x, y: p.y };
      this.isDragging = false;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!p.isDown) return;
      const dx = p.x - this.dragStart.x;
      const dy = p.y - this.dragStart.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) this.isDragging = true;
      if (this.isDragging) {
        this.mapContainer.x = Phaser.Math.Clamp(this.containerX + dx, -mapW * 0.3, mapW * 0.3);
        this.mapContainer.y = Phaser.Math.Clamp(this.containerY + dy, mapY - mapH * 0.3, mapY + mapH * 0.3);
      }
    });
    this.input.on('pointerup', () => {
      if (!this.isDragging) return;
      this.containerX = this.mapContainer.x;
      this.containerY = this.mapContainer.y;
      this.isDragging = false;
    });

    // HUD bottom
    const cleared = saveData.clearedLevels.length;
    this.add.text(width / 2, height - 20, `Cleared: ${cleared}/16  —  Tap node to play`, {
      fontFamily: 'monospace', fontSize: '11px', color: '#555577'
    }).setOrigin(0.5).setDepth(30);
  }

  private drawProceduralMap(mapW: number, mapH: number): void {
    const gfx = this.add.graphics().setDepth(0);

    // Dark map base
    gfx.fillStyle(0x0a1a2e, 1);
    gfx.fillRect(0, 0, mapW, mapH);

    // Grid dots
    gfx.fillStyle(0x14283c, 1);
    for (let gx = 0; gx < mapW; gx += 28) {
      for (let gy = 0; gy < mapH; gy += 28) {
        gfx.fillCircle(gx, gy, 1);
      }
    }

    // Zone hints matching universe positions
    const zones: Array<[number, number, number, number, number]> = [
      [0.20, 0.12, 80, 60, 0x28180a],  // castle
      [0.61, 0.12, 90, 55, 0x0a2314],  // sonic
      [0.88, 0.29, 60, 70, 0x32320a],  // streets
      [0.61, 0.48, 85, 60, 0x320f0f],  // fighter
      [0.20, 0.54, 80, 60, 0x0a1432],  // outrun
      [0.61, 0.72, 85, 55, 0x0a2323],  // shinobi
      [0.80, 0.80, 65, 60, 0x2d0a23],  // kombat
      [0.39, 0.90, 90, 45, 0x1e1c0a],  // paperboy
    ];
    for (const [cx_n, cy_n, rx, ry, col] of zones) {
      gfx.fillStyle(col, 0.8);
      gfx.fillEllipse(cx_n * mapW, cy_n * mapH, rx * 2, ry * 2);
    }

    this.mapContainer.addAt(gfx, 0);
  }

  private onNodeTap(levelId: string): void {
    if (this.isDragging) return;
    this.scene.start(SCENES.LEVEL_INTRO, { levelId });
  }
}
