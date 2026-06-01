import Phaser from 'phaser';
import { UNIVERSE_RESULT_SCREEN_ASSETS, SCENES, SCORE_VALUES } from '../config/constants';
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
  timeBonus?: number;
  pickupCount?: number;
  bossHitCount?: number;
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
    const isShortPortrait = H < 700 && H > W;
    const actionTextY = H * (isShortPortrait ? 0.58 : 0.62);
    const continueButtonY = H * (isShortPortrait ? 0.64 : 0.63);
    const replayButtonY = H * 0.76;
    const mapButtonY = H * 0.85;
    const secondaryButtonH = Math.min(42, Math.max(36, Math.floor(H * 0.05)));
    const addFittedText = (
      x: number,
      y: number,
      text: string,
      fontSize: number,
      maxWidth: number,
      style: Phaser.Types.GameObjects.Text.TextStyle,
    ): Phaser.GameObjects.Text => {
      const label = this.add.text(x, y, text, {
        ...style,
        fontSize: `${fontSize}px`,
      }).setOrigin(0.5).setDepth(6);
      let fittedFont = fontSize;
      while (label.width > maxWidth && fittedFont > 10) {
        fittedFont -= 1;
        label.setFontSize(fittedFont);
      }
      return label;
    };

    // Success title
    const titleFontSize = Math.min(22, Math.floor(W * 0.058));
    const title = level?.type === 'boss' ? 'BOSS VAINCU' : 'NIVEAU RÉUSSI';
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

    // Univers name for non-Castle boss clear (no subTitle)
    if (level?.type === 'boss' && !subTitle && universe && !isCastle) {
      this.add.text(W / 2, H * L.subtitleY, universe.name.toUpperCase(), {
        fontFamily: UI_FONT,
        fontSize: `${Math.min(13, Math.floor(W * 0.034))}px`,
        fontStyle: '700',
        color: universe.palette.primary,
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5).setDepth(6);
    }

    const score = Math.max(0, Math.floor(data?.score ?? 0));
    const storedBest = SaveSystem.getBestScore(levelId);
    const bestScore = Math.max(0, Math.floor(data?.bestScore ?? storedBest));
    const previousBest = Math.max(0, Math.floor(data?.previousBest ?? storedBest));
    const isNewRecord = data?.isNewRecord ?? (score > previousBest && score === bestScore);
    const timeBonus = Math.max(0, Math.floor(data?.timeBonus ?? 0));
    const hasTimeBonus = timeBonus > 0;
    const pickupCount = Math.max(0, data?.pickupCount ?? 0);
    const bossHitCount = Math.max(0, data?.bossHitCount ?? 0);
    const isBossLevel = level?.type === 'boss';
    const breakdownScore = isBossLevel
      ? bossHitCount * SCORE_VALUES.BOSS_HIT
      : pickupCount * SCORE_VALUES.PICKUP;
    const breakdownLabel = isBossLevel
      ? (bossHitCount > 0 ? `BOSS +${breakdownScore}` : '')
      : (pickupCount > 0 ? `PICKUPS +${breakdownScore}` : '');
    const hasBreakdown = breakdownLabel.length > 0;
    const clearBonusAmount = isBossLevel ? SCORE_VALUES.BOSS_CLEAR : SCORE_VALUES.STAGE_CLEAR;
    const clearBonusLabel = isBossLevel ? `VAINCU +${clearBonusAmount}` : `STAGE +${clearBonusAmount}`;
    const scoreY = H * (isShortPortrait ? 0.47 : 0.49);
    const scoreFont = Math.min(16, Math.floor(W * 0.039));
    const breakdownFont = Math.min(12, Math.floor(W * 0.03));
    const timeBonusFont = Math.min(12, Math.floor(W * 0.03));
    const recordFont = Math.min(12, Math.floor(W * 0.03));
    const scorePanelW = Math.min(340, W * 0.78);
    const lineH = 22;
    const lineCount = 3 + (hasBreakdown ? 1 : 0) + (hasTimeBonus ? 1 : 0) + (isNewRecord ? 1 : 0);
    const scorePanelH = lineCount * lineH + 14;
    const lineStart = scoreY - ((lineCount - 1) / 2) * lineH;
    const scoreMaxTextW = scorePanelW - 24;
    const scorePanel = this.add.graphics().setDepth(5);
    scorePanel.fillStyle(0x000000, 0.46);
    scorePanel.fillRoundedRect(W / 2 - scorePanelW / 2, scoreY - scorePanelH / 2, scorePanelW, scorePanelH, 6);
    scorePanel.lineStyle(1, accentHex, 0.46);
    scorePanel.strokeRoundedRect(W / 2 - scorePanelW / 2, scoreY - scorePanelH / 2, scorePanelW, scorePanelH, 6);
    let li = 0;
    if (hasBreakdown) {
      addFittedText(W / 2, lineStart + li++ * lineH, breakdownLabel, breakdownFont, scoreMaxTextW, {
        fontFamily: UI_FONT,
        fontStyle: '700',
        color: '#aaaacc',
        stroke: '#000000',
        strokeThickness: 1,
      });
    }
    addFittedText(W / 2, lineStart + li++ * lineH, clearBonusLabel, breakdownFont, scoreMaxTextW, {
      fontFamily: UI_FONT,
      fontStyle: '700',
      color: isCastle ? CT.titleClear : accentStr,
      stroke: '#000000',
      strokeThickness: 1,
    });
    addFittedText(W / 2, lineStart + li++ * lineH, `TOTAL : ${score}`, scoreFont, scoreMaxTextW, {
      fontFamily: UI_FONT,
      fontStyle: '800',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    });
    if (hasTimeBonus) {
      addFittedText(W / 2, lineStart + li++ * lineH, `+${timeBonus} TEMPS`, timeBonusFont, scoreMaxTextW, {
        fontFamily: UI_FONT,
        fontStyle: '700',
        color: accentStr,
        stroke: '#000000',
        strokeThickness: 1,
      });
    }
    addFittedText(W / 2, lineStart + li++ * lineH, `BEST : ${bestScore}`, scoreFont, scoreMaxTextW, {
      fontFamily: UI_FONT,
      fontStyle: '800',
      color: isCastle ? CT.titleClear : accentStr,
      stroke: '#000000',
      strokeThickness: 2,
    });
    if (isNewRecord) {
      addFittedText(W / 2, lineStart + li++ * lineH, 'NOUVEAU RECORD', recordFont, scoreMaxTextW, {
        fontFamily: UI_FONT,
        fontStyle: '800',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      });
    }

    // Next level
    const currentNode = MAP_NODES.find(n => n.levelId === levelId);
    const nodeIndex = currentNode ? MAP_NODES.findIndex(n => n.id === currentNode.id) : -1;
    const nextNode  = nodeIndex >= 0 && nodeIndex < MAP_NODES.length - 1 ? MAP_NODES[nodeIndex + 1] : null;
    const nextLevel = nextNode ? getLevelById(nextNode.levelId) : null;

    if (nextLevel) {
      addMobileButton(this, {
        x: W / 2,
        y: continueButtonY,
        width: Math.min(260, W * L.primaryButtonW),
        height: L.primaryButtonH,
        label: 'CONTINUER',
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

      addFittedText(W / 2, continueButtonY + L.primaryButtonH / 2 + 18, `PROCHAIN : ${nextLevel.name.toUpperCase()}`, Math.min(13, Math.floor(W * 0.033)), W * 0.82, {
        fontFamily: UI_FONT,
        fontStyle: '700',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      });
    } else {
      const endFontSize = Math.min(15, Math.floor(W * 0.038));
      const endBlockH = endFontSize * 2 + 4 + 16;
      const endBacking = this.add.graphics().setDepth(5);
      endBacking.fillStyle(0x000000, 0.48);
      endBacking.fillRoundedRect(W * 0.12, actionTextY - endBlockH / 2, W * 0.76, endBlockH, 6);
      this.add.text(W / 2, actionTextY, 'TOUS LES MONDES\nTERMINES !', {
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

    // Separator between continue and secondary actions.
    const sep = this.add.graphics().setDepth(5);
    sep.lineStyle(1, buttons.primaryFill, 0.35);
    sep.lineBetween(W * 0.2, H * 0.71, W * 0.8, H * 0.71);

    // Replay button
    addMobileButton(this, {
      x: W / 2,
      y: replayButtonY,
      width: Math.min(230, W * 0.5),
      height: secondaryButtonH,
      label: 'REJOUER',
      fillColor: buttons.secondaryFill,
      pressedFillColor: buttons.secondaryPressed,
      strokeColor: buttons.secondaryStroke,
      textColor: buttons.secondaryText,
      onClick: () => {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.GAME, { levelId });
        });
      },
    });

    // Map button
    addMobileButton(this, {
      x: W / 2,
      y: mapButtonY,
      width: Math.min(210, W * L.secondaryButtonW),
      height: secondaryButtonH,
      label: 'CARTE',
      fillColor: buttons.secondaryFill,
      pressedFillColor: buttons.secondaryPressed,
      strokeColor: buttons.secondaryStroke,
      textColor: buttons.secondaryText,
      onClick: () => {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.WORLD_MAP, { levelId: this.levelId });
        });
      },
    });

    this.cameras.main.fadeIn(200, 0, 0, 0);
  }
}
