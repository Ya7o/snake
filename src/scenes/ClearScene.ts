import Phaser from 'phaser';
import { UNIVERSE_RESULT_SCREEN_ASSETS, SCENES } from '../config/constants';
import { getLevelById, resolveLevelId } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { MAP_NODES } from '../config/mapNodes';
import { RESULT_SCREEN_LAYOUT, CASTLE_RESULT_THEME, getUniverseButtons } from '../ui/RuntimeUILayout';
import { ARCADE_FONT, UI_FONT, addMobileButton, drawConsoleFrame, flashScreen } from '../render/VfxUtils';
import { SaveSystem } from '../systems/SaveSystem';

export interface ClearData {
  levelId: string;
  score?: number;
  bestScore?: number;
  previousBest?: number;
  isNewRecord?: boolean;
}

export class ClearScene extends Phaser.Scene {
  private levelId = 'castle_normal';

  constructor() {
    super(SCENES.CLEAR);
  }

  init(data: ClearData): void {
    this.levelId = resolveLevelId(data);
  }

  preload(): void {
    const level = getLevelById(this.levelId);
    if (!level) return;
    const univBg = UNIVERSE_RESULT_SCREEN_ASSETS[level.universeId];
    if (univBg && !this.textures.exists(univBg.clear.key)) {
      this.load.image(univBg.clear.key, univBg.clear.url);
    }
  }

  create(data: ClearData): void {
    const { width, height } = this.scale;
    const W = width, H = height;
    const levelId = resolveLevelId(data) || this.levelId;
    const level = getLevelById(levelId);
    const universe = level ? UNIVERSES[level.universeId] : null;
    const isCastle = level?.universeId === 'castle';
    const bgColor   = universe ? parseInt(universe.palette.bg.replace('#', ''), 16) : 0x000000;
    const accentStr = universe?.palette.accent ?? '#ffd86b';
    const accentHex = parseInt(accentStr.replace('#', ''), 16);
    const primaryHex = universe ? parseInt(universe.palette.primary.replace('#', ''), 16) : 0x888888;

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, bgColor).setDepth(0);
    const univBg = UNIVERSE_RESULT_SCREEN_ASSETS[level?.universeId ?? ''];
    if (univBg && this.textures.exists(univBg.clear.key)) {
      const bg = this.add.image(W / 2, H / 2, univBg.clear.key).setDepth(1);
      bg.setScale(Math.max(W / bg.width, H / bg.height));
      this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.14).setDepth(2);
    }

    // Gold flash on enter
    flashScreen(this, accentHex, 0.6, 350);

    // Sparkle particles (procedural stars)
    const sparks = this.add.graphics().setDepth(3);
    const sparkData: Array<{ x: number; y: number; r: number; a: number; va: number }> = [];
    for (let i = 0; i < 28; i++) {
      sparkData.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.7,
        r: Math.random() * 3 + 1,
        a: Math.random(),
        va: (Math.random() * 0.03 + 0.01) * (Math.random() < 0.5 ? 1 : -1),
      });
    }
    this.time.addEvent({
      delay: 40,
      repeat: 50,
      callback: () => {
        sparks.clear();
        for (const s of sparkData) {
          s.a += s.va;
          if (s.a > 1) { s.a = 1; s.va *= -1; }
          if (s.a < 0) { s.a = 0; s.va *= -1; }
          sparks.fillStyle(accentHex, s.a);
          sparks.fillCircle(s.x, s.y, s.r);
        }
      },
    });

    if (!isCastle) {
      // Console frame
      drawConsoleFrame(this, W * 0.06, H * 0.07, W * 0.88, H * 0.86, accentHex, primaryHex, 4);
    }

    const L = RESULT_SCREEN_LAYOUT;
    const CT = CASTLE_RESULT_THEME;
    const buttons = getUniverseButtons(level?.universeId ?? 'castle');

    // Success title
    const titleFontSize = Math.min(22, Math.floor(W * 0.058));
    const title = level?.type === 'boss' ? 'BOSS VAINCU' : 'NIVEAU REUSSI';
    const subTitle = level?.id === 'castle_normal'
      ? 'BOSS DU CHÂTEAU DÉBLOQUÉ'
      : level?.id === 'castle_boss'
        ? 'MONDE 1 TERMINÉ'
        : null;

    this.add.text(W / 2 + 3, H * L.titleY + 3, title, {
      fontFamily: ARCADE_FONT,
      fontSize: `${titleFontSize}px`,
      color: '#886600',
    }).setOrigin(0.5).setDepth(5);

    const clearTxt = this.add.text(W / 2, H * L.titleY, title, {
      fontFamily: ARCADE_FONT,
      fontSize: `${titleFontSize}px`,
      color: isCastle ? CT.titleClear : accentStr,
      stroke: '#000000',
      strokeThickness: isCastle ? 1 : 3,
    }).setOrigin(0.5).setDepth(6);

    this.tweens.add({
      targets: clearTxt,
      alpha: 0.78,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Universe name (non-Castle only)
    if (universe && !isCastle && level?.type !== 'boss') {
      this.add.text(W / 2, H * L.subtitleY, universe.name.toUpperCase(), {
        fontFamily: UI_FONT,
        fontSize: `${Math.min(13, Math.floor(W * 0.034))}px`,
        fontStyle: '700',
        color: universe.palette.primary,
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5).setDepth(6);
    }

    if (subTitle) {
      this.add.text(W / 2, H * L.subtitleY, subTitle, {
        fontFamily: UI_FONT,
        fontSize: `${Math.min(isCastle ? 18 : 15, Math.floor(W * (isCastle ? 0.046 : 0.038)))}px`,
        fontStyle: '800',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(6);
    }

    // Boss defeated badge (non-Castle universes with no subTitle)
    if (level?.type === 'boss' && !subTitle) {
      const badgeGfx = this.add.graphics().setDepth(5);
      badgeGfx.fillStyle(0xe74c3c, 0.9);
      badgeGfx.fillRoundedRect(W / 2 - 70, H * L.subtitleY - 11, 140, 22, 4);

      this.add.text(W / 2, H * L.subtitleY, 'BOSS VAINCU !', {
        fontFamily: UI_FONT,
        fontSize: '13px',
        fontStyle: '800',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(6);
    }

    const score = Math.max(0, Math.floor(data?.score ?? 0));
    const storedBest = SaveSystem.getBestScore(levelId);
    const bestScore = Math.max(0, Math.floor(data?.bestScore ?? storedBest));
    const previousBest = Math.max(0, Math.floor(data?.previousBest ?? storedBest));
    const isNewRecord = data?.isNewRecord ?? (score > previousBest && score === bestScore);
    const scoreY = H * 0.405;
    const scoreFont = Math.min(16, Math.floor(W * 0.041));
    const recordFont = Math.min(12, Math.floor(W * 0.031));
    const scorePanel = this.add.graphics().setDepth(5);
    scorePanel.fillStyle(0x000000, 0.46);
    scorePanel.fillRoundedRect(W * 0.18, scoreY - 27, W * 0.64, isNewRecord ? 60 : 44, 6);
    scorePanel.lineStyle(1, accentHex, 0.46);
    scorePanel.strokeRoundedRect(W * 0.18, scoreY - 27, W * 0.64, isNewRecord ? 60 : 44, 6);
    this.add.text(W / 2, scoreY - 10, `SCORE : ${score}`, {
      fontFamily: UI_FONT,
      fontSize: `${scoreFont}px`,
      fontStyle: '800',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(6);
    this.add.text(W / 2, scoreY + 10, `BEST : ${bestScore}`, {
      fontFamily: UI_FONT,
      fontSize: `${scoreFont}px`,
      fontStyle: '800',
      color: isCastle ? CT.titleClear : accentStr,
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(6);
    if (isNewRecord) {
      this.add.text(W / 2, scoreY + 29, 'NOUVEAU RECORD', {
        fontFamily: UI_FONT,
        fontSize: `${recordFont}px`,
        fontStyle: '800',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5).setDepth(6);
    }

    // Next level
    const currentNode = MAP_NODES.find(n => n.levelId === levelId);
    const nodeIndex = currentNode ? MAP_NODES.findIndex(n => n.id === currentNode.id) : -1;
    const nextNode  = nodeIndex >= 0 && nodeIndex < MAP_NODES.length - 1 ? MAP_NODES[nodeIndex + 1] : null;
    const nextLevel = nextNode ? getLevelById(nextNode.levelId) : null;

    if (nextLevel) {
      this.add.text(W / 2, H * L.contextY, nextLevel.name.toUpperCase(), {
        fontFamily: UI_FONT,
        fontSize: `${Math.min(17, Math.floor(W * 0.044))}px`,
        fontStyle: '700',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5).setDepth(6);

      addMobileButton(this, {
        x: W / 2,
        y: H * L.primaryButtonY,
        width: Math.min(260, W * L.primaryButtonW),
        height: L.primaryButtonH,
        label: isCastle ? 'CONTINUER' : 'SUIVANT',
        primary: true,
        fillColor: buttons.primaryFill,
        pressedFillColor: buttons.primaryPressed,
        strokeColor: buttons.primaryStroke,
        textColor: buttons.primaryText,
        onClick: () => {
          this.cameras.main.fadeOut(200, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.LEVEL_INTRO, { levelId: nextNode!.levelId });
          });
        },
      });
    } else {
      const endFontSize = Math.min(15, Math.floor(W * 0.038));
      const endBlockH = endFontSize * 2 + 4 + 16;
      const endBacking = this.add.graphics().setDepth(5);
      endBacking.fillStyle(0x000000, 0.48);
      endBacking.fillRoundedRect(W * 0.12, H * L.contextY - endBlockH / 2, W * 0.76, endBlockH, 6);
      this.add.text(W / 2, H * L.contextY, 'TOUS LES MONDES\nTERMINÉS !', {
        fontFamily: UI_FONT,
        fontSize: `${endFontSize}px`,
        fontStyle: '800',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center',
        lineSpacing: 4,
      }).setOrigin(0.5).setDepth(6);
    }

    // Separator between primary and secondary buttons — mirrors GameOverScene layout
    const sep = this.add.graphics().setDepth(5);
    sep.lineStyle(1, buttons.primaryFill, 0.35);
    sep.lineBetween(W * 0.2, H * L.separatorY, W * 0.8, H * L.separatorY);

    // Map button
    addMobileButton(this, {
      x: W / 2,
      y: H * L.secondaryButtonY,
      width: Math.min(210, W * L.secondaryButtonW),
      height: L.secondaryButtonH,
      label: 'CARTE',
      fillColor: buttons.secondaryFill,
      pressedFillColor: buttons.secondaryPressed,
      strokeColor: buttons.secondaryStroke,
      textColor: buttons.secondaryText,
      onClick: () => {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.WORLD_MAP);
        });
      },
    });

    this.cameras.main.fadeIn(200, 0, 0, 0);
  }
}
