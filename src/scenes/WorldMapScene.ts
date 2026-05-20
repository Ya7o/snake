import Phaser from 'phaser';
import { SCENES, ASSET_KEYS, ASSET_PATHS, WORLD_MAP_VIEW } from '../config/constants';
import { MAP_NODES } from '../config/mapNodes';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { SaveSystem } from '../systems/SaveSystem';
import { ARCADE_FONT, addScanlines } from '../render/VfxUtils';

// Source map dimensions — updated from texture metadata if available
const MAP_IMG_W = 1448;
const MAP_IMG_H = 1086;

export class WorldMapScene extends Phaser.Scene {
  private mapContainer!: Phaser.GameObjects.Container;
  private nodeObjects: Phaser.GameObjects.Container[] = [];

  // Pan state
  private isDragging = false;
  private dragStart  = { x: 0, y: 0 };
  private containerX = 0;
  private containerY = 0;

  // Map geometry
  private displayW  = 0;
  private displayH  = 0;
  private mapAreaY  = 0;
  private mapAreaH  = 0;
  private coverScale = 1; // base cover scale used to compute zoom bounds
  private currentZoom = 1;
  private zoomMin = 1;
  private zoomMax = 3;

  // Selection (909: tap = select, START = launch)
  private selectedLevelId: string | null = null;
  private selectedNodeId: string | null = null;
  private lastTapNodeId: string | null = null;
  private lastTapAt = 0;
  private selLevelTxt!: Phaser.GameObjects.Text;
  private selRuleTxt!: Phaser.GameObjects.Text;
  private startBtnBg!: Phaser.GameObjects.Graphics;
  private startBtnTxt!: Phaser.GameObjects.Text;
  private nodeHighlights = new Map<string, Phaser.GameObjects.Graphics>();

  // Native touch — pinch zoom
  private nativeCanvas: HTMLCanvasElement | null = null;
  private pinchDist0  = 0;
  private pinchZoom0  = 1;
  private onPinchStart!: (e: TouchEvent) => void;
  private onPinchMove!:  (e: TouchEvent) => void;

  // Phaser input handlers (stored for cleanup)
  private onPtrDown!: (p: Phaser.Input.Pointer) => void;
  private onPtrMove!: (p: Phaser.Input.Pointer) => void;
  private onPtrUp!:   () => void;

  // 908 debug
  private debugMapOverlay: Phaser.GameObjects.Text | null = null;

  constructor() {
    super(SCENES.WORLD_MAP);
  }

  preload(): void {
    if (!this.textures.exists(ASSET_KEYS.WORLD_MAP)) {
      this.load.on('loaderror', (file: Phaser.Loader.File) => {
        if (file.key === ASSET_KEYS.WORLD_MAP)
          console.warn('[WorldMap] world_map.png introuvable — fallback procédural');
      });
      this.load.image(ASSET_KEYS.WORLD_MAP, ASSET_PATHS.WORLD_MAP);
    }
  }

  create(): void {
    const { width: W, height: H } = this.scale;

    // ── Background ────────────────────────────────────────────────────────
    this.add.rectangle(W / 2, H / 2, W, H, 0x060d18).setDepth(0);

    // ── HUD top — compact to leave the reference map visually dominant ────
    const hudH = WORLD_MAP_VIEW.HEADER_H;
    this.add.rectangle(W / 2, hudH / 2, W, hudH, 0x000000, 0.92).setDepth(20).setScrollFactor(0);
    this.add.rectangle(W / 2, 1, W, 2, 0xffd86b, 1).setDepth(21).setScrollFactor(0);
    this.add.rectangle(W / 2, hudH, W, 1, 0x1a2a44, 1).setDepth(21).setScrollFactor(0);

    this.add.text(W / 2, 8, 'SNAKE DRIVE V4', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(7, Math.floor(W * 0.02))}px`,
      color: '#ffd86b',
    }).setOrigin(0.5).setDepth(22).setScrollFactor(0);

    this.add.text(W / 2, 23, 'WORLD MAP', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(5, Math.floor(W * 0.014))}px`,
      color: '#444466',
    }).setOrigin(0.5).setDepth(22).setScrollFactor(0);

    // ── HUD bottom — compact, but with enough room for the selected rule ──
    const footH = WORLD_MAP_VIEW.FOOTER_H;
    const footY  = H - footH;
    this.add.rectangle(W / 2, H - footH / 2, W, footH, 0x000000, 0.92).setDepth(20).setScrollFactor(0);
    this.add.rectangle(W / 2, footY, W, 1, 0x1a2a44, 1).setDepth(21).setScrollFactor(0);

    // Level name + rule (filled on tap)
    this.selLevelTxt = this.add.text(W / 2, footY + 12, '- TAP A NODE -', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(7, Math.floor(W * 0.019))}px`,
      color: '#555577',
    }).setOrigin(0.5).setDepth(22).setScrollFactor(0);

    this.selRuleTxt = this.add.text(W / 2, footY + 24, '', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(5, Math.floor(W * 0.014))}px`,
      color: '#888899',
    }).setOrigin(0.5).setDepth(22).setScrollFactor(0);

    // START button
    const btnW = Math.min(160, W * 0.46);
    const btnY  = footY + 40;
    const btnH  = 22;
    this.startBtnBg = this.add.graphics().setDepth(22).setScrollFactor(0);
    this.renderStartBtn(W, btnY, btnW, btnH, false);

    this.startBtnTxt = this.add.text(W / 2, btnY + btnH / 2, 'START ▶', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(7, Math.floor(W * 0.019))}px`,
      color: '#333355',
    }).setOrigin(0.5).setDepth(23).setScrollFactor(0);

    this.add.zone(W / 2, btnY + btnH / 2, btnW, btnH)
      .setInteractive().setDepth(24).setScrollFactor(0)
      .on('pointerdown', () => this.launchSelected());

    // Hint
    this.add.text(W / 2, H - 8, 'PINCH ZOOM  ·  DRAG MAP  ·  TAP SELECT', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(5, Math.floor(W * 0.013))}px`,
      color: '#222244',
    }).setOrigin(0.5).setDepth(22).setScrollFactor(0);

    // ── Map area ─────────────────────────────────────────────────────────
    this.mapAreaY = hudH + 1;
    this.mapAreaH = footY - this.mapAreaY;

    // 909 KEY FIX: use COVER scale (Math.max) instead of contain (Math.min)
    // This fills the viewport — no black bands. Overflow is explored by drag/pinch.
    const hasMapTex = this.textures.exists(ASSET_KEYS.WORLD_MAP);
    let imgW = MAP_IMG_W, imgH = MAP_IMG_H;
    if (hasMapTex) {
      const src = this.textures.get(ASSET_KEYS.WORLD_MAP).getSourceImage() as HTMLImageElement;
      if (src?.width > 0) { imgW = src.width; imgH = src.height; }
    }

    const scaleByW = W          / imgW;
    const scaleByH = this.mapAreaH / imgH;
    this.coverScale = Math.max(scaleByW, scaleByH); // COVER: fills the useful viewport

    this.displayW = Math.round(imgW * this.coverScale);
    this.displayH = Math.round(imgH * this.coverScale);

    this.zoomMin = WORLD_MAP_VIEW.MIN_ZOOM;
    this.zoomMax = WORLD_MAP_VIEW.MAX_ZOOM;
    this.currentZoom = WORLD_MAP_VIEW.INITIAL_ZOOM;

    const mapCenterY = this.mapAreaY + this.mapAreaH / 2;
    this.containerX = W / 2;
    this.containerY = mapCenterY;
    this.mapContainer = this.add.container(this.containerX, this.containerY).setDepth(1);

    // ── Geometry mask — prevents overflow into HUD areas ──────────────────
    const maskGfx = this.make.graphics({});
    maskGfx.fillRect(0, this.mapAreaY, W, this.mapAreaH);
    this.mapContainer.setMask(maskGfx.createGeometryMask());

    // ── Map image or fallback ─────────────────────────────────────────────
    if (hasMapTex) {
      this.textures.get(ASSET_KEYS.WORLD_MAP).setFilter(Phaser.Textures.FilterMode.LINEAR);
      const mapImg = this.add.image(0, 0, ASSET_KEYS.WORLD_MAP);
      mapImg.setDisplaySize(this.displayW, this.displayH);
      this.mapContainer.add(mapImg);
    } else {
      console.warn('[WorldMap] Texture absente — fallback procédural');
      this.drawProceduralMap(W, this.mapAreaH);
      this.displayW = W;
      this.displayH = this.mapAreaH;
    }

    // ── Path lines ────────────────────────────────────────────────────────
    const lineGfx = this.add.graphics().setDepth(2);
    for (let i = 0; i < MAP_NODES.length - 1; i++) {
      const a = MAP_NODES[i], b = MAP_NODES[i + 1];
      const ax = (a.x - 0.5) * this.displayW;
      const ay = (a.y - 0.5) * this.displayH;
      const bx = (b.x - 0.5) * this.displayW;
      const by = (b.y - 0.5) * this.displayH;
      const dist = Math.hypot(bx - ax, by - ay);
      const segs = Math.max(2, Math.floor(dist / 10));
      for (let s = 0; s < segs; s++) {
        if (s % 2 === 0) {
          const t1 = s / segs, t2 = (s + 0.6) / segs;
          lineGfx.lineStyle(1, 0xffd86b, 0.5);
          lineGfx.lineBetween(
            ax + (bx - ax) * t1, ay + (by - ay) * t1,
            ax + (bx - ax) * t2, ay + (by - ay) * t2,
          );
        }
      }
    }
    this.mapContainer.add(lineGfx);

    // ── Nodes ─────────────────────────────────────────────────────────────
    const saveData = SaveSystem.load();
    this.nodeObjects = [];
    this.nodeHighlights.clear();

    for (const node of MAP_NODES) {
      const nx = (node.x - 0.5) * this.displayW;
      const ny = (node.y - 0.5) * this.displayH;
      const level = getLevelById(node.levelId);
      if (!level) continue;

      const universe  = UNIVERSES[level.universeId];
      const isUnlocked = saveData.unlockedNodes.includes(node.id);
      const isCleared  = saveData.clearedLevels.includes(node.levelId);
      const isBoss     = level.type === 'boss';

      const color     = parseInt(universe.palette.primary.replace('#', ''), 16);
      const accentCol = parseInt(universe.palette.accent.replace('#', ''), 16);
      const r = isBoss ? WORLD_MAP_VIEW.NODE_R_BOSS : WORLD_MAP_VIEW.NODE_R_NORMAL;

      const nodeContainer = this.add.container(nx, ny).setDepth(3);
      const gfx = this.add.graphics();

      if (isUnlocked) {
        if (isCleared) {
          gfx.fillStyle(0x071020, 0.82);
          gfx.fillCircle(0, 0, r);
          gfx.lineStyle(2, accentCol, 0.95);
          gfx.strokeCircle(0, 0, r + 1);
          gfx.lineStyle(2, 0xffffff, 0.95);
          gfx.lineBetween(-r * 0.45, 0, -r * 0.1, r * 0.45);
          gfx.lineBetween(-r * 0.1, r * 0.45, r * 0.5, -r * 0.45);
        } else {
          gfx.fillStyle(0x071020, 0.86);
          gfx.fillCircle(0, 0, r + 1);
          gfx.lineStyle(2, color, 0.95);
          gfx.strokeCircle(0, 0, r + 1);
          gfx.fillStyle(accentCol, 0.92);
          if (isBoss) {
            this.drawStar(gfx, 0, 0, r - 1, Math.max(3, r * 0.42), true);
          } else {
            gfx.fillCircle(0, 0, Math.max(3, r * 0.45));
          }
        }
      } else {
        gfx.fillStyle(0x060812, 0.7);
        gfx.fillCircle(0, 0, r);
        gfx.lineStyle(2, 0x5a5a72, 0.55);
        gfx.strokeCircle(0, 0, r);
        gfx.lineStyle(1, 0x222238, 0.8);
        gfx.lineBetween(-r * 0.45, -r * 0.45, r * 0.45, r * 0.45);
      }
      nodeContainer.add(gfx);

      if (isUnlocked) {
        // Universe name below node
        const uLbl = this.add.text(0, r + 6, universe.shortName, {
          fontFamily: ARCADE_FONT, fontSize: '4px', color: universe.palette.accent,
        }).setOrigin(0.5);
        nodeContainer.add(uLbl);

        // Boss badge — compact
        if (isBoss) {
          const bBg = this.add.graphics();
          bBg.fillStyle(0xcc1111, 0.95);
          bBg.fillRoundedRect(-9, -r - 8, 18, 7, 2);
          nodeContainer.add(bBg);
          nodeContainer.add(this.add.text(0, -r - 4.5, 'BOSS', {
            fontFamily: ARCADE_FONT, fontSize: '3px', color: '#ffee88',
          }).setOrigin(0.5));
        }

        // Selection highlight (hidden until selected)
        const hlGfx = this.add.graphics();
        hlGfx.setVisible(false);
        nodeContainer.add(hlGfx);
        this.nodeHighlights.set(node.id, hlGfx);

      } else {
        const hlGfx = this.add.graphics();
        hlGfx.setVisible(false);
        nodeContainer.add(hlGfx);
        this.nodeHighlights.set(node.id, hlGfx);
      }

      nodeContainer.setInteractive(new Phaser.Geom.Circle(0, 0, WORLD_MAP_VIEW.NODE_R_HIT), Phaser.Geom.Circle.Contains);
      nodeContainer.on('pointerup', () => this.handleNodeTap(node.levelId, node.id, isUnlocked));
      this.mapContainer.add(nodeContainer);
      this.nodeObjects.push(nodeContainer);
    }

    // ── Drag ─────────────────────────────────────────────────────────────
    this.onPtrDown = (p: Phaser.Input.Pointer) => {
      if (p.id > 1) return;
      this.dragStart  = { x: p.x, y: p.y };
      this.isDragging = false;
    };
    this.onPtrMove = (p: Phaser.Input.Pointer) => {
      if (!p.isDown || p.id > 1) return;
      const dx = p.x - this.dragStart.x;
      const dy = p.y - this.dragStart.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) this.isDragging = true;
      if (this.isDragging) {
        const b = this.panBounds();
        this.mapContainer.x = Phaser.Math.Clamp(this.containerX + dx, b.minX, b.maxX);
        this.mapContainer.y = Phaser.Math.Clamp(this.containerY + dy, b.minY, b.maxY);
      }
    };
    this.onPtrUp = () => {
      if (this.isDragging) {
        this.containerX = this.mapContainer.x;
        this.containerY = this.mapContainer.y;
      }
      this.isDragging = false;
    };
    this.input.on('pointerdown', this.onPtrDown);
    this.input.on('pointermove', this.onPtrMove);
    this.input.on('pointerup',   this.onPtrUp);

    // ── Pinch zoom ────────────────────────────────────────────────────────
    this.nativeCanvas = this.game.canvas;
    this.onPinchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        this.pinchDist0 = Math.hypot(
          e.touches[1].clientX - e.touches[0].clientX,
          e.touches[1].clientY - e.touches[0].clientY,
        );
        this.pinchZoom0 = this.currentZoom;
      }
    };
    this.onPinchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || this.pinchDist0 <= 0) return;
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY,
      );
      const newZoom = Phaser.Math.Clamp(
        this.pinchZoom0 * (dist / this.pinchDist0),
        this.zoomMin,
        this.zoomMax,
      );
      if (newZoom !== this.currentZoom) {
        this.currentZoom = newZoom;
        this.mapContainer.setScale(this.currentZoom);
        this.updateNodeScreenScale();
        this.clampContainer();
      }
    };
    if (this.nativeCanvas) {
      this.nativeCanvas.addEventListener('touchstart', this.onPinchStart, { passive: true });
      this.nativeCanvas.addEventListener('touchmove',  this.onPinchMove,  { passive: true });
    }

    this.mapContainer.setScale(this.currentZoom);
    this.updateNodeScreenScale();
    this.centerOnNode(MAP_NODES[0]?.id);
    this.clampContainer();

    // ── ?debugMap=1 ───────────────────────────────────────────────────────
    if (new URLSearchParams(window.location.search).get('debugMap') === '1') {
      this.createDebugOverlay(hasMapTex, imgW, imgH);
    }

    addScanlines(this, 0.035, 30);
    this.cameras.main.fadeIn(280, 0, 0, 0);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.doShutdown());
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private panBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    const sw = this.displayW * this.currentZoom;
    const sh = this.displayH * this.currentZoom;
    const W = this.scale.width;
    const mapTop = this.mapAreaY;
    const mapBottom = this.mapAreaY + this.mapAreaH;
    const centerX = W / 2;
    const centerY = this.mapAreaY + this.mapAreaH / 2;

    const minX = sw <= W ? centerX : W - sw / 2;
    const maxX = sw <= W ? centerX : sw / 2;
    const minY = sh <= this.mapAreaH ? centerY : mapBottom - sh / 2;
    const maxY = sh <= this.mapAreaH ? centerY : mapTop + sh / 2;

    return { minX, maxX, minY, maxY };
  }

  private clampContainer(): void {
    const b = this.panBounds();
    this.mapContainer.x = Phaser.Math.Clamp(this.mapContainer.x, b.minX, b.maxX);
    this.mapContainer.y = Phaser.Math.Clamp(this.mapContainer.y, b.minY, b.maxY);
    this.containerX = this.mapContainer.x;
    this.containerY = this.mapContainer.y;
  }

  private centerOnNode(nodeId?: string): void {
    const node = MAP_NODES.find(n => n.id === nodeId) ?? MAP_NODES[0];
    if (!node) return;

    const targetX = (node.x - 0.5) * this.displayW;
    const targetY = (node.y - 0.5) * this.displayH;
    this.mapContainer.x = this.scale.width / 2 - targetX * this.currentZoom;
    this.mapContainer.y = this.mapAreaY + this.mapAreaH / 2 - targetY * this.currentZoom;
  }

  private renderStartBtn(W: number, btnY: number, btnW: number, btnH: number, active: boolean): void {
    this.startBtnBg.clear();
    this.startBtnBg.fillStyle(active ? 0x183018 : 0x0d1020, 1);
    this.startBtnBg.fillRoundedRect(W / 2 - btnW / 2, btnY, btnW, btnH, 4);
    this.startBtnBg.lineStyle(1, active ? 0x44cc44 : 0x1a2240, active ? 0.95 : 0.6);
    this.startBtnBg.strokeRoundedRect(W / 2 - btnW / 2, btnY, btnW, btnH, 4);
  }

  private handleNodeTap(levelId: string, nodeId: string, isUnlocked: boolean): void {
    if (this.isDragging) return;

    const now = this.time.now;
    const isDoubleTap = this.lastTapNodeId === nodeId && now - this.lastTapAt <= WORLD_MAP_VIEW.DOUBLE_TAP_MS;
    this.lastTapNodeId = nodeId;
    this.lastTapAt = now;

    this.selectNode(levelId, nodeId, isUnlocked);
    if (isUnlocked && isDoubleTap) {
      this.launchLevel(levelId);
    }
  }

  private selectNode(levelId: string, nodeId: string, isUnlocked: boolean): void {
    this.selectedLevelId = isUnlocked ? levelId : null;
    this.selectedNodeId = nodeId;
    const level = getLevelById(levelId);
    if (!level) return;
    const universe = UNIVERSES[level.universeId];

    // Footer update
    if (isUnlocked) {
      this.selLevelTxt
        .setText(`${level.name.toUpperCase()}`)
        .setColor(universe.palette.accent);
      this.selRuleTxt.setText(`${level.ruleText}  ·  DOUBLE TAP TO PLAY`);
    } else {
      this.selLevelTxt
        .setText('LOCKED')
        .setColor('#777788');
      this.selRuleTxt.setText('CLEAR PREVIOUS STAGE TO OPEN');
    }

    // Activate START button
    const { width: W, height: H } = this.scale;
    const btnW = Math.min(160, W * 0.46);
    const btnY = H - WORLD_MAP_VIEW.FOOTER_H + 40;
    this.renderStartBtn(W, btnY, btnW, 22, isUnlocked);
    this.startBtnTxt.setColor(isUnlocked ? '#ffd86b' : '#333355');

    // Highlight selected node, clear others
    for (const [nid, hl] of this.nodeHighlights.entries()) {
      if (nid === nodeId) {
        const isBossSelected = level.type === 'boss';
        hl.clear();
        hl.lineStyle(2, isUnlocked ? 0xffd86b : 0x777788, isUnlocked ? 1 : 0.7);
        if (isBossSelected) {
          this.drawStar(hl, 0, 0, WORLD_MAP_VIEW.NODE_R_HIT * 0.58, WORLD_MAP_VIEW.NODE_R_HIT * 0.28, false);
        } else {
          hl.strokeCircle(0, 0, WORLD_MAP_VIEW.NODE_R_HIT * 0.58);
        }
        hl.lineStyle(1, isUnlocked ? 0xffffff : 0x555566, 0.55);
        hl.strokeCircle(0, 0, WORLD_MAP_VIEW.NODE_R_HIT * 0.75);
        hl.setVisible(true);
      } else {
        hl.setVisible(false);
      }
    }

    if (this.debugMapOverlay) {
      const lines = this.debugMapOverlay.text.split('\n');
      const idx = lines.findIndex(l => l.startsWith('selected:'));
      const line = `selected: ${levelId}`;
      if (idx >= 0) lines[idx] = line; else lines.push(line);
      this.debugMapOverlay.setText(lines.join('\n'));
    }
  }

  private launchSelected(): void {
    if (!this.selectedLevelId) return;
    this.launchLevel(this.selectedLevelId);
  }

  private launchLevel(levelId: string): void {
    this.cameras.main.fadeOut(200, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENES.LEVEL_INTRO, { levelId });
    });
  }

  private updateNodeScreenScale(): void {
    const scale = 1 / this.currentZoom;
    for (const node of this.nodeObjects) {
      node.setScale(scale);
    }
  }

  private drawStar(
    gfx: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    outerR: number,
    innerR: number,
    filled: boolean,
  ): void {
    const points: Phaser.Geom.Point[] = [];
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? outerR : innerR;
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      points.push(new Phaser.Geom.Point(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius,
      ));
    }
    if (filled) gfx.fillPoints(points, true);
    else gfx.strokePoints(points, true);
  }

  private drawProceduralMap(mapW: number, mapH: number): void {
    const gfx = this.add.graphics().setDepth(0);
    gfx.fillStyle(0x061020, 1);
    gfx.fillRect(-mapW / 2, -mapH / 2, mapW, mapH);
    gfx.lineStyle(1, 0x0d2240, 1);
    for (let x = -mapW / 2; x < mapW / 2; x += 24) gfx.lineBetween(x, -mapH / 2, x, mapH / 2);
    for (let y = -mapH / 2; y < mapH / 2; y += 24) gfx.lineBetween(-mapW / 2, y, mapW / 2, y);
    this.mapContainer.addAt(gfx, 0);
  }

  private createDebugOverlay(hasTexture: boolean, imgW: number, imgH: number): void {
    const saveData = SaveSystem.load();
    const lines = [
      '[debugMap=1]',
      `texture: ${hasTexture ? 'LOADED (' + imgW + 'x' + imgH + ')' : 'FALLBACK'}`,
      `cover scale: ${this.coverScale.toFixed(3)}`,
      `display: ${this.displayW}x${this.displayH}`,
      `initialZoom: ${this.currentZoom}  range: ${this.zoomMin}..${this.zoomMax}`,
      `nodes: ${MAP_NODES.length}  unlocked: ${saveData.unlockedNodes.length}`,
      'selected: (none)',
    ];
    this.debugMapOverlay = this.add.text(4, this.mapAreaY + 4, lines.join('\n'), {
      fontFamily: 'monospace', fontSize: '8px', color: '#00ff88',
      backgroundColor: '#000000cc', padding: { x: 4, y: 2 },
    }).setDepth(30).setScrollFactor(0);
  }

  private doShutdown(): void {
    this.input.off('pointerdown', this.onPtrDown);
    this.input.off('pointermove', this.onPtrMove);
    this.input.off('pointerup',   this.onPtrUp);
    if (this.nativeCanvas) {
      this.nativeCanvas.removeEventListener('touchstart', this.onPinchStart);
      this.nativeCanvas.removeEventListener('touchmove',  this.onPinchMove);
    }
  }
}
