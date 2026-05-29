import Phaser from 'phaser';
import { SCENES, ASSET_KEYS, ASSET_PATHS, WORLD_MAP_VIEW } from '../config/constants';
// PATCH 1013A: world map uses new 16:9 minimap asset
const WM_KEY  = ASSET_KEYS.WORLD_MAP_MINIMAP;
const WM_PATH = ASSET_PATHS.WORLD_MAP_MINIMAP;
import { MAP_NODES } from '../config/mapNodes';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { SaveSystem } from '../systems/SaveSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { UI_FONT } from '../render/VfxUtils';

// Source map dimensions — updated from texture metadata if available
// New minimap: world_map_minimap_16_9.png (1672x941)
const MAP_IMG_W = 1672;
const MAP_IMG_H = 941;

export class WorldMapScene extends Phaser.Scene {
  private mapContainer!: Phaser.GameObjects.Container;
  private nodeObjects: Phaser.GameObjects.Container[] = [];

  // Pan state
  private isDragging = false;
  private dragStart  = { x: 0, y: 0 };
  private containerX = 0;
  private containerY = 0;

  // Map geometry
  private sourceW = MAP_IMG_W;
  private sourceH = MAP_IMG_H;
  private cropX = 0;
  private cropY = 0;
  private cropW = MAP_IMG_W;
  private cropH = MAP_IMG_H;
  private displayW  = 0;
  private displayH  = 0;
  private mapAreaY  = 0;
  private mapAreaH  = 0;
  private coverScale = 1; // base cover scale used to compute zoom bounds
  private currentZoom = 1;
  private zoomMin = 1;
  private zoomMax = 3;

  // Selection (tap = select, retap = launch)
  private selectedLevelId: string | null = null;
  private selectedNodeUnlocked = false;

  // Footer UI
  private footerLevelTxt!: Phaser.GameObjects.Text;
  private footerHintTxt!: Phaser.GameObjects.Text;
  private nodeHighlights = new Map<string, Phaser.GameObjects.Graphics>();

  // Animated tweens
  private selectionPulseTween: Phaser.Tweens.Tween | null = null;
  private panTween: Phaser.Tweens.Tween | null = null;

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
    if (!this.textures.exists(WM_KEY)) {
      this.load.on('loaderror', (file: Phaser.Loader.File) => {
        if (file.key === WM_KEY)
          console.warn('[WorldMap] world_map_minimap_16_9.png introuvable — fallback procédural');
      });
      this.load.image(WM_KEY, WM_PATH);
    }
  }

  create(): void {
    const { width: W, height: H } = this.scale;

    // ── Background ────────────────────────────────────────────────────────
    this.add.rectangle(W / 2, H / 2, W, H, 0x060d18).setDepth(0);

    // ── Map area (reserves bottom footer) ────────────────────────────────
    this.mapAreaY = 0;
    this.mapAreaH = H - WORLD_MAP_VIEW.FOOTER_H;

    const hasMapTex = this.textures.exists(WM_KEY);
    let imgW = MAP_IMG_W, imgH = MAP_IMG_H;
    if (hasMapTex) {
      const src = this.textures.get(WM_KEY).getSourceImage() as HTMLImageElement;
      if (src?.width > 0) { imgW = src.width; imgH = src.height; }
    }
    this.sourceW = imgW;
    this.sourceH = imgH;
    this.cropX = hasMapTex ? WORLD_MAP_VIEW.CROP_LEFT : 0;
    this.cropY = hasMapTex ? WORLD_MAP_VIEW.CROP_TOP : 0;
    this.cropW = Math.max(1, imgW - this.cropX - (hasMapTex ? WORLD_MAP_VIEW.CROP_RIGHT : 0));
    this.cropH = Math.max(1, imgH - this.cropY - (hasMapTex ? WORLD_MAP_VIEW.CROP_BOTTOM : 0));

    const safeW = Math.max(1, W - WORLD_MAP_VIEW.MAP_SAFE_PAD * 2);
    const safeH = Math.max(1, this.mapAreaH - WORLD_MAP_VIEW.MAP_SAFE_PAD * 2);
    const scaleByW = safeW / this.cropW;
    const scaleByH = safeH / this.cropH;
    // Portrait mobile: cover (fill height, pan horizontally). Landscape: contain.
    this.coverScale = H > W
      ? Math.max(scaleByW, scaleByH)
      : Math.min(scaleByW, scaleByH);

    this.displayW = Math.round(this.cropW * this.coverScale);
    this.displayH = Math.round(this.cropH * this.coverScale);

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
      this.textures.get(WM_KEY).setFilter(Phaser.Textures.FilterMode.LINEAR);
      const mapImg = this.add.image(0, 0, WM_KEY);
      mapImg.setCrop(this.cropX, this.cropY, this.cropW, this.cropH);
      mapImg.setScale(this.coverScale);
      this.mapContainer.add(mapImg);
    } else {
      console.warn('[WorldMap] Texture absente — fallback procédural');
      this.drawProceduralMap(W, this.mapAreaH);
      this.displayW = W;
      this.displayH = this.mapAreaH;
    }

    // ── Nodes ─────────────────────────────────────────────────────────────
    const saveData = SaveSystem.load();
    this.nodeObjects = [];
    this.nodeHighlights.clear();

    for (const node of MAP_NODES) {
      const nx = this.mapX(node.x);
      const ny = this.mapY(node.y);
      const level = getLevelById(node.levelId);
      if (!level) continue;

      const isUnlocked = saveData.unlockedNodes.includes(node.id);
      const isCleared = saveData.clearedLevels.includes(node.levelId);
      const isBoss     = level.type === 'boss';

      const r = isBoss ? WORLD_MAP_VIEW.NODE_R_BOSS : WORLD_MAP_VIEW.NODE_R_NORMAL;

      const nodeContainer = this.add.container(nx, ny).setDepth(3);

      // The source map already contains labels, paths, circles and boss stars.
      // Runtime nodes are invisible hit targets; only the selected node gets a highlight.
      // For nodes whose art is missing a yellow circle, draw one explicitly.
      if (node.drawCircle) {
        const circleGfx = this.add.graphics();
        this.drawMapCoin(circleGfx, r);
        nodeContainer.add(circleGfx);
      }

      if (!isUnlocked) {
        const lockedGfx = this.add.graphics();
        this.drawLockedNodeMarker(lockedGfx, r);
        nodeContainer.add(lockedGfx);
      } else if (isCleared) {
        const clearedGfx = this.add.graphics();
        this.drawClearedNodeMarker(clearedGfx, r);
        nodeContainer.add(clearedGfx);
      }

      const hlGfx = this.add.graphics();
      hlGfx.setVisible(false);
      nodeContainer.add(hlGfx);
      this.nodeHighlights.set(node.id, hlGfx);

      nodeContainer.setInteractive(new Phaser.Geom.Circle(0, 0, Math.max(WORLD_MAP_VIEW.NODE_R_HIT, r * 2)), Phaser.Geom.Circle.Contains);
      nodeContainer.on('pointerup', () => this.handleNodeTap(node.levelId, node.id, isUnlocked));
      this.mapContainer.add(nodeContainer);
      this.nodeObjects.push(nodeContainer);
    }

    // ── Drag ─────────────────────────────────────────────────────────────
    this.onPtrDown = (p: Phaser.Input.Pointer) => {
      if (p.id > 1) return;
      if (this.panTween) {
        this.panTween.stop();
        this.panTween = null;
        this.containerX = this.mapContainer.x;
        this.containerY = this.mapContainer.y;
      }
      this.dragStart  = { x: p.x, y: p.y };
      this.isDragging = false;
    };
    this.onPtrMove = (p: Phaser.Input.Pointer) => {
      if (!p.isDown || p.id > 1) return;
      const dx = p.x - this.dragStart.x;
      const dy = p.y - this.dragStart.y;
      if (Math.abs(dx) > WORLD_MAP_VIEW.DRAG_THRESHOLD_PX || Math.abs(dy) > WORLD_MAP_VIEW.DRAG_THRESHOLD_PX) this.isDragging = true;
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
    // Always center on first node (portrait or landscape); user pans to explore.
    this.centerOnNode(MAP_NODES[0]?.id);
    this.clampContainer();

    // ── ?debugMap=1 ───────────────────────────────────────────────────────
    if (new URLSearchParams(window.location.search).get('debugMap') === '1') {
      this.createDebugOverlay(hasMapTex, imgW, imgH, WM_KEY);
    }

    // ── Footer panel ──────────────────────────────────────────────────────
    const footerY = H - WORLD_MAP_VIEW.FOOTER_H;
    this.add.rectangle(W / 2, footerY + WORLD_MAP_VIEW.FOOTER_H / 2, W, WORLD_MAP_VIEW.FOOTER_H, 0x060d18, 0.97)
      .setDepth(6);
    // Separator line
    const sepGfx = this.add.graphics().setDepth(7);
    sepGfx.lineStyle(1, 0x2a3050, 1);
    sepGfx.lineBetween(0, footerY, W, footerY);

    // Compact footer: level name (shifted up slightly to leave room for hint)
    this.footerLevelTxt = this.add.text(W / 2, footerY + 13, 'CHOISIS UN NIVEAU', {
      fontFamily: UI_FONT,
      fontSize: `${Math.min(13, Math.floor(W * 0.033))}px`,
      fontStyle: '700',
      color: '#666688',
      align: 'center',
    }).setOrigin(0.5, 0.5).setDepth(7);

    // Launch hint — shown only when an unlocked node is selected
    this.footerHintTxt = this.add.text(W / 2, footerY + 30, 'RETAPE POUR LANCER', {
      fontFamily: UI_FONT,
      fontSize: `${Math.min(10, Math.floor(W * 0.026))}px`,
      fontStyle: '400',
      color: '#444466',
      align: 'center',
    }).setOrigin(0.5, 0.5).setDepth(7).setAlpha(0.75).setVisible(false);

    const firstUnlocked = MAP_NODES.find(node => saveData.unlockedNodes.includes(node.id)) ?? MAP_NODES[0];
    if (firstUnlocked) this.selectNode(firstUnlocked.levelId, firstUnlocked.id, saveData.unlockedNodes.includes(firstUnlocked.id));

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

    const targetX = this.mapX(node.x);
    const targetY = this.mapY(node.y);
    this.mapContainer.x = this.scale.width / 2 - targetX * this.currentZoom;
    this.mapContainer.y = this.mapAreaY + this.mapAreaH / 2 - targetY * this.currentZoom;
  }

  private mapX(normalizedSourceX: number): number {
    const sourceX = normalizedSourceX * this.sourceW;
    return (sourceX - this.cropX - this.cropW / 2) * this.coverScale;
  }

  private mapY(normalizedSourceY: number): number {
    const sourceY = normalizedSourceY * this.sourceH;
    return (sourceY - this.cropY - this.cropH / 2) * this.coverScale;
  }

  private handleNodeTap(levelId: string, nodeId: string, isUnlocked: boolean): void {
    if (this.isDragging) return;

    // If the same unlocked node was already explicitly selected by the user, launch it.
    // No time window: a slow retap works just as well as an immediate double-tap.
    if (isUnlocked && this.selectedLevelId === levelId && this.lastTapNodeId === nodeId) {
      AudioSystem.uiButton();
      this.launchLevel(levelId);
      return;
    }

    // First tap (or tapping a different node): select it.
    this.lastTapNodeId = nodeId;
    this.lastTapAt = this.time.now;
    this.selectNode(levelId, nodeId, isUnlocked);
    this.panToNode(nodeId);
  }

  private selectNode(levelId: string, nodeId: string, isUnlocked: boolean): void {
    this.selectedLevelId = levelId;
    this.selectedNodeUnlocked = isUnlocked;
    const level = getLevelById(levelId);
    if (!level) return;
    const universe = UNIVERSES[level.universeId];

    // Footer update
    if (isUnlocked) {
      const typeLabel = level.type === 'boss' ? 'BOSS' : 'NIVEAU';
      this.footerLevelTxt.setText(`${level.name.toUpperCase()} · ${typeLabel}`).setColor(universe.palette.accent);
      this.footerHintTxt.setVisible(true);
    } else {
      this.footerLevelTxt.setText('VERROUILLÉ').setColor('#777788');
      this.footerHintTxt.setVisible(false);
    }
    this.updateFooterButton(isUnlocked, universe.palette.accent);

    // Stop previous pulse and clear all highlights
    if (this.selectionPulseTween) { this.selectionPulseTween.stop(); this.selectionPulseTween = null; }
    for (const [nid, hl] of this.nodeHighlights.entries()) {
      if (nid === nodeId) {
        const isBossSelected = level.type === 'boss';
        hl.clear();
        // Soft glow halo
        hl.fillStyle(isUnlocked ? 0xffd86b : 0x8888aa, 0.18);
        hl.fillCircle(0, 0, WORLD_MAP_VIEW.NODE_R_HIT + 5);
        // Outer ring
        hl.lineStyle(2, isUnlocked ? 0xffffff : 0x555566, 0.65);
        hl.strokeCircle(0, 0, WORLD_MAP_VIEW.NODE_R_HIT + 3);
        // Inner shape (bright accent ring)
        hl.lineStyle(3, isUnlocked ? 0xffd86b : 0x888899, 1.0);
        if (isBossSelected) {
          this.drawStar(hl, 0, 0, WORLD_MAP_VIEW.NODE_R_HIT * 0.55, WORLD_MAP_VIEW.NODE_R_HIT * 0.27, false);
        } else {
          hl.strokeCircle(0, 0, WORLD_MAP_VIEW.NODE_R_HIT * 0.55);
        }
        hl.setVisible(true);
        // Pulse animation on unlocked nodes
        if (isUnlocked) {
          hl.setAlpha(1);
          this.selectionPulseTween = this.tweens.add({
            targets: hl,
            alpha: { from: 0.55, to: 1 },
            duration: 680,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
        } else {
          hl.setAlpha(0.7);
        }
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

  private launchLevel(levelId: string): void {
    this.cameras.main.fadeOut(200, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENES.LEVEL_INTRO, { levelId });
    });
  }

  private updateFooterButton(_isUnlocked: boolean, _accent: string): void {
    // no button — launch via double-tap on node
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

  private drawMapCoin(gfx: Phaser.GameObjects.Graphics, r: number): void {
    gfx.fillStyle(0x120900, 0.9);
    gfx.fillCircle(1, 1, r + 2);
    gfx.fillStyle(0x4a2a00, 1);
    gfx.fillCircle(0, 0, r + 1.5);
    gfx.fillStyle(0xffc21a, 1);
    gfx.fillCircle(0, 0, r);
    gfx.fillStyle(0xffe56a, 0.95);
    gfx.fillCircle(-r * 0.28, -r * 0.32, r * 0.48);
    gfx.lineStyle(1, 0x7a4100, 0.95);
    gfx.strokeCircle(0, 0, r - 0.5);
    gfx.lineStyle(1, 0xfff1a6, 0.65);
    gfx.beginPath();
    gfx.arc(-r * 0.05, -r * 0.08, r * 0.66, Phaser.Math.DegToRad(205), Phaser.Math.DegToRad(325), false);
    gfx.strokePath();
  }

  private drawLockedNodeMarker(gfx: Phaser.GameObjects.Graphics, r: number): void {
    const markerR = r + 4;
    gfx.fillStyle(0x03040a, 0.72);
    gfx.fillCircle(0, 0, markerR);
    gfx.lineStyle(2, 0x8a8fa8, 0.85);
    gfx.strokeCircle(0, 0, markerR);
    gfx.lineBetween(-markerR * 0.45, -markerR * 0.45, markerR * 0.45, markerR * 0.45);
    gfx.lineBetween(markerR * 0.45, -markerR * 0.45, -markerR * 0.45, markerR * 0.45);
  }

  private drawClearedNodeMarker(gfx: Phaser.GameObjects.Graphics, r: number): void {
    const markerR = r + 5;
    gfx.lineStyle(2, 0x7cff9d, 0.95);
    gfx.strokeCircle(0, 0, markerR);
    gfx.lineStyle(2, 0xffffff, 0.85);
    gfx.lineBetween(-markerR * 0.45, 0, -markerR * 0.1, markerR * 0.34);
    gfx.lineBetween(-markerR * 0.1, markerR * 0.34, markerR * 0.52, -markerR * 0.38);
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

  private createDebugOverlay(hasTexture: boolean, imgW: number, imgH: number, key = WM_KEY): void {
    const saveData = SaveSystem.load();
    const lines = [
      '[debugMap=1]',
      `texture: ${hasTexture ? key + ' LOADED (' + imgW + 'x' + imgH + ')' : 'FALLBACK'}`,
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

  private panToNode(nodeId: string): void {
    const node = MAP_NODES.find(n => n.id === nodeId);
    if (!node) return;

    const W = this.scale.width;
    const targetX = W / 2 - this.mapX(node.x) * this.currentZoom;
    const targetY = this.mapAreaY + this.mapAreaH / 2 - this.mapY(node.y) * this.currentZoom;

    const b = this.panBounds();
    const clampedX = Phaser.Math.Clamp(targetX, b.minX, b.maxX);
    const clampedY = Phaser.Math.Clamp(targetY, b.minY, b.maxY);

    if (this.panTween) { this.panTween.stop(); }
    this.panTween = this.tweens.add({
      targets: this.mapContainer,
      x: clampedX,
      y: clampedY,
      duration: 300,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.containerX = this.mapContainer.x;
        this.containerY = this.mapContainer.y;
        this.panTween = null;
      },
    });
  }

  private doShutdown(): void {
    if (this.selectionPulseTween) { this.selectionPulseTween.stop(); this.selectionPulseTween = null; }
    if (this.panTween) { this.panTween.stop(); this.panTween = null; }
    this.input.off('pointerdown', this.onPtrDown);
    this.input.off('pointermove', this.onPtrMove);
    this.input.off('pointerup',   this.onPtrUp);
    if (this.nativeCanvas) {
      this.nativeCanvas.removeEventListener('touchstart', this.onPinchStart);
      this.nativeCanvas.removeEventListener('touchmove',  this.onPinchMove);
    }
  }
}
