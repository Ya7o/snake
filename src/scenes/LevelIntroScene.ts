import Phaser from 'phaser';
import { SCENES, UNIVERSE_RESULT_SCREEN_ASSETS } from '../config/constants';
import { getLevelById, resolveLevelId } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { MENU_THEMES, MenuTheme } from '../config/menuThemes';
import { ARCADE_FONT, UI_FONT, addMobileButton, flashScreen } from '../render/VfxUtils';
import { CASTLE_OPENMOJI_ICON_ASSETS, getCastleOpenMojiBadge } from '../ui/OpenMojiIconRegistry';

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export interface LevelIntroData {
  levelId: string;
}

export class LevelIntroScene extends Phaser.Scene {
  private introLevelId = '';

  constructor() {
    super(SCENES.LEVEL_INTRO);
  }

  init(data: LevelIntroData): void {
    this.introLevelId = resolveLevelId(data);
  }

  preload(): void {
    const level = getLevelById(this.introLevelId);
    if (!level) return;

    const uid = level.universeId;
    const isBoss = level.type === 'boss';
    const univBg = UNIVERSE_RESULT_SCREEN_ASSETS[uid];

    if (univBg) {
      const bgSlot = isBoss && univBg.bossSystem ? univBg.bossSystem : univBg.system;
      if (!this.textures.exists(bgSlot.key)) this.load.image(bgSlot.key, bgSlot.url);
    }

    if (uid === 'castle') {
      const svgSize = Math.round(64 * Math.min(window.devicePixelRatio || 1, 2));
      for (const icon of CASTLE_OPENMOJI_ICON_ASSETS) {
        if (!this.textures.exists(icon.key)) this.load.svg(icon.key, icon.url, { width: svgSize, height: svgSize });
      }
    }
  }

  create(data: LevelIntroData): void {
    const { width: W, height: H } = this.scale;
    const levelId = resolveLevelId(data) || this.introLevelId;
    const level = getLevelById(levelId);
    if (!level) { this.scene.start(SCENES.WORLD_MAP); return; }

    const universe = UNIVERSES[level.universeId];
    const theme: MenuTheme = MENU_THEMES[level.universeId] ?? MENU_THEMES.castle;
    const isBoss = level.type === 'boss';
    const isCastle = level.universeId === 'castle';

    // ── Background ────────────────────────────────────────────────────────────
    this.add.rectangle(W / 2, H / 2, W, H, theme.colors.panelBg).setDepth(0);

    const univBg = UNIVERSE_RESULT_SCREEN_ASSETS[level.universeId];
    const bgKey = isBoss && univBg?.bossSystem
      ? univBg.bossSystem.key
      : univBg?.system.key;
    if (bgKey && this.textures.exists(bgKey)) {
      const bgImg = this.add.image(W / 2, H / 2, bgKey).setDepth(1);
      bgImg.setScale(Math.max(W / bgImg.width, H / bgImg.height));
    }
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.22).setDepth(2);

    // ── Layout slots (CODEX percentages) ─────────────────────────────────────
    const maxW     = Math.min(W, 480);
    const offsetX  = (W - maxW) / 2;
    const panelPad = maxW * 0.13;
    const panelX   = offsetX + panelPad;
    const panelW   = maxW * 0.74;
    const centerX  = W / 2;

    // Header, mission card and action bar are solved as reserved zones.
    const titleCenterY = H * 0.095;
    const btnH = H < 720 ? 46 : 50;
    const btnGap = 12;
    const actionSafeBottom = Math.max(72, H * 0.105);
    const btnRowY = H - actionSafeBottom - btnH / 2;
    const actionTopY = btnRowY - btnH / 2;
    const panelGap = H < 720 ? 10 : 14;
    const panelBottomY = actionTopY - panelGap;
    const desiredPanelTopY = isCastle ? H * 0.56 : (isBoss ? H * 0.54 : H * 0.58);
    const minPanelH = isCastle ? (isBoss ? 174 : 158) : (isBoss ? 148 : 116);
    const infoPanelTopY = clamp(desiredPanelTopY, H * 0.46, panelBottomY - minPanelH);
    const panelH = Math.max(minPanelH, panelBottomY - infoPanelTopY);

    // ── Header title ──────────────────────────────────────────────────────────
    const titleStr = isBoss ? `${universe.shortName} — BOSS` : universe.name;
    const titleTextColor = theme.colors.titleHex ?? theme.colors.primaryHex;
    this.add.text(centerX, titleCenterY, titleStr.toUpperCase(), {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.max(11, Math.min(16, Math.floor(W * 0.032)))}px`,
      color: titleTextColor,
      align: 'center',
      wordWrap: { width: maxW * 0.76, useAdvancedWrap: true },
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5).setDepth(10);

    // ── Info panel background ──────────────────────────────────────────────────
    const panelGfx = this.add.graphics().setDepth(9);
    panelGfx.fillStyle(theme.colors.panelBg, theme.colors.panelAlpha);
    panelGfx.fillRoundedRect(panelX, infoPanelTopY, panelW, panelH, 8);
    panelGfx.lineStyle(2, theme.colors.primary, 0.85);
    panelGfx.strokeRoundedRect(panelX, infoPanelTopY, panelW, panelH, 8);

    // Inner glow line
    panelGfx.lineStyle(1, theme.colors.primary, 0.22);
    panelGfx.strokeRoundedRect(panelX + 4, infoPanelTopY + 4, panelW - 8, panelH - 8, 6);

    // ── Panel content ─────────────────────────────────────────────────────────
    const nameSize = Math.max(10, Math.min(13, Math.floor(W * 0.030)));
    const bodySize = Math.max(12, Math.min(15, Math.floor(W * 0.037)));
    const contentBottomY = infoPanelTopY + panelH - 18;
    let textY = infoPanelTopY + (H < 720 ? 12 : 16);

    if (isBoss) {
      const bGfx = this.add.graphics().setDepth(10);
      bGfx.fillStyle(0xe74c3c, 1);
      bGfx.fillRoundedRect(centerX - 34, textY, 68, 18, 4);
      this.add.text(centerX, textY + 9, 'BOSS', {
        fontFamily: 'Arial, sans-serif', fontSize: '11px', fontStyle: '700', color: '#ffffff',
      }).setOrigin(0.5, 0.5).setDepth(11);
      textY += H < 720 ? 22 : 26;
    }

    // Level name
    this.add.text(centerX, textY, level.name.toUpperCase(), {
      fontFamily: UI_FONT,
      fontSize: `${Math.max(13, nameSize + 2)}px`,
      fontStyle: '800',
      color: theme.colors.primaryHex,
      align: 'center',
      fixedWidth: panelW - 32,
      wordWrap: { width: panelW - 32, useAdvancedWrap: true },
    }).setOrigin(0.5, 0).setDepth(10);
    textY += nameSize + (H < 720 ? 14 : 16);

    if (isCastle) {
      this.add.text(centerX, textY, level.ruleText, {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${Math.max(11, Math.min(13, Math.floor(W * 0.031)))}px`,
        fontStyle: '900',
        color: '#f7d77a',
        align: 'center',
      }).setOrigin(0.5, 0).setDepth(10);
      textY += H < 720 ? 24 : 28;
    }

    if (isCastle) {
      const sectionLabelSize = Math.max(10, Math.min(12, Math.floor(W * 0.030)));
      const sectionTextSize = Math.max(12, Math.min(14, Math.floor(W * 0.035)));
      const objectiveText = isBoss
        ? `Touche le miroir ${level.bossHp ?? 3} fois.`
        : `Collecte ${level.quota ?? 10} éclats magiques.`;
      const dangerText = isBoss
        ? 'Évite les reflets maudits.'
        : "Les murs brillent avant d'apparaître.";
      const drawSection = (label: string, text: string): void => {
        this.add.text(centerX, textY, label, {
          fontFamily: 'Arial, sans-serif',
          fontSize: `${sectionLabelSize}px`,
          fontStyle: '900',
          color: theme.colors.primaryHex,
          align: 'center',
        }).setOrigin(0.5, 0).setDepth(10);
        textY += sectionLabelSize + 3;
        this.add.text(centerX, textY, text, {
          fontFamily: 'Arial, sans-serif',
          fontSize: `${sectionTextSize}px`,
          fontStyle: '700',
          color: theme.colors.textHex,
          align: 'center',
          fixedWidth: panelW - 32,
          wordWrap: { width: panelW - 32, useAdvancedWrap: true },
        }).setOrigin(0.5, 0).setDepth(10);
        textY += sectionTextSize + (H < 720 ? 10 : 12);
      };
      drawSection('OBJECTIF', objectiveText);
      drawSection('DANGER', dangerText);
    } else {
      // Rule text
      this.add.text(centerX, textY, level.ruleText, {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${Math.max(13, Math.min(16, Math.floor(W * 0.040)))}px`,
        fontStyle: '700',
        color: '#f39c12',
        align: 'center',
      }).setOrigin(0.5, 0).setDepth(10);
      textY += bodySize + (H < 720 ? 5 : 8);

      // Objective / boss HP
      const infoStr = isBoss
        ? `PV : ${level.bossHp ?? 3}`
        : `OBJECTIF : ${level.quota ?? 10}`;
      this.add.text(centerX, textY, infoStr, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        fontStyle: '700',
        color: theme.colors.secondaryHex,
      }).setOrigin(0.5, 0).setDepth(10);
      textY += H < 720 ? 18 : 22;

      // Hint
      const hintMaxLines = textY + bodySize * 3 + 10 <= contentBottomY ? 3 : 2;
      const hintTxt = this.add.text(centerX, textY, level.introHint, {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${bodySize}px`,
        fontStyle: '700',
        color: theme.colors.textHex,
        align: 'center',
        fixedWidth: panelW - 40,
        lineSpacing: 3,
        wordWrap: { width: panelW - 40, useAdvancedWrap: true },
      }).setOrigin(0.5, 0).setDepth(10);
      hintTxt.setMaxLines(hintMaxLines);
      if (hintTxt.getBounds().bottom > contentBottomY) {
        hintTxt.setFontSize(Math.max(11, bodySize - 1));
        hintTxt.setMaxLines(2);
      }
    }

    // Universe badge — Castle only (OpenMoji icons already loaded for Castle)
    if (isCastle) {
      const badgeKey = getCastleOpenMojiBadge(level.type).key;
      if (this.textures.exists(badgeKey)) {
        const badgeSize = Math.min(34, W * 0.09);
        this.add.image(
          panelX + panelW - badgeSize / 2 - 6,
          infoPanelTopY + badgeSize / 2 + 6,
          badgeKey,
        ).setDisplaySize(badgeSize, badgeSize).setAlpha(0.72).setDepth(11);
      }
    }

    // ── Buttons ───────────────────────────────────────────────────────────────
    const btnW  = Math.min(panelW * 0.42, 145);
    const primaryBtnW = isCastle ? Math.min(panelW * 0.52, 182) : btnW;
    const secondaryBtnW = isCastle ? Math.max(84, Math.min(panelW * 0.28, 108)) : btnW;
    const totalButtonW = primaryBtnW + secondaryBtnW + btnGap;
    const primaryBtnX = isCastle ? centerX - totalButtonW / 2 + primaryBtnW / 2 : centerX - btnW / 2 - btnGap / 2;
    const secondaryBtnX = isCastle ? centerX + totalButtonW / 2 - secondaryBtnW / 2 : centerX + btnW / 2 + btnGap / 2;
    let started = false;

    const startLevel = (): void => {
      if (started) return;
      started = true;
      flashScreen(this, theme.colors.primary, 0.35, 200);
      this.time.delayedCall(150, () => {
        this.cameras.main.fadeOut(150, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.GAME, { levelId });
        });
      });
    };

    addMobileButton(this, {
      x: primaryBtnX,
      y: btnRowY,
      width: primaryBtnW,
      height: btnH,
      label: 'JOUER',
      primary: true,
      fillColor: theme.buttons.primaryFill,
      pressedFillColor: theme.buttons.primaryPressed,
      strokeColor: theme.buttons.primaryStroke,
      textColor: theme.buttons.primaryText,
      onClick: startLevel,
    });

    addMobileButton(this, {
      x: secondaryBtnX,
      y: btnRowY,
      width: secondaryBtnW,
      height: btnH,
      label: 'CARTE',
      fillColor: theme.buttons.secondaryFill,
      pressedFillColor: theme.buttons.secondaryPressed,
      strokeColor: theme.buttons.secondaryStroke,
      textColor: theme.buttons.secondaryText,
      onClick: () => this.scene.start(SCENES.WORLD_MAP),
    });

    // ── Ambient FX ────────────────────────────────────────────────────────────
    this.spawnMenuFx(theme.fx, W, H, theme.colors.primary, theme.colors.secondary);

    // ── Fade in ───────────────────────────────────────────────────────────────
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Tap anywhere outside buttons also starts the level
    this.input.on('pointerdown', (_p: unknown, go: Phaser.GameObjects.GameObject[]) => {
      if (started) return;
      if (go && go.length > 0) return;
      startLevel();
    });
  }

  // ── Ambient FX (lightweight tweens, no heavy particles) ────────────────────

  private spawnMenuFx(
    fx: string,
    W: number,
    H: number,
    primary: number,
    secondary: number,
  ): void {
    switch (fx) {
      case 'magic':
      case 'rings':
      case 'neon':
        this.spawnFloating(W, H, fx === 'neon' ? secondary : primary, 6, 'up');
        break;
      case 'rain':
        this.spawnRain(W, H, secondary);
        break;
      case 'snow':
        this.spawnSnow(W, H);
        break;
      case 'embers':
        this.spawnEmbers(W, H, primary, secondary);
        break;
      case 'paper':
        this.spawnPaper(W, H);
        break;
      case 'impact':
      default:
        break;
    }
  }

  private spawnFloating(W: number, H: number, color: number, count: number, _dir: string): void {
    for (let i = 0; i < count; i++) {
      const x  = Phaser.Math.Between(Math.floor(W * 0.08), Math.floor(W * 0.92));
      const y0 = Phaser.Math.Between(Math.floor(H * 0.08), Math.floor(H * 0.55));
      const r  = Phaser.Math.Between(2, 4);
      const gfx = this.add.graphics().setDepth(5).setAlpha(0);
      gfx.fillStyle(color, 1);
      gfx.fillCircle(0, 0, r);
      gfx.x = x;
      gfx.y = y0;

      this.time.delayedCall(i * 290 + Phaser.Math.Between(0, 500), () => {
        this.tweens.add({
          targets: gfx,
          y: y0 - Phaser.Math.Between(60, 120),
          alpha: { from: 0, to: 0.55 },
          duration: Phaser.Math.Between(2200, 3400),
          ease: 'Sine.easeIn',
          repeat: -1,
          onRepeat: () => {
            gfx.x = Phaser.Math.Between(Math.floor(W * 0.08), Math.floor(W * 0.92));
            gfx.y = y0;
            gfx.setAlpha(0);
          },
        });
      });
    }
  }

  private spawnRain(W: number, H: number, color: number): void {
    for (let i = 0; i < 8; i++) {
      const x0  = Phaser.Math.Between(0, W);
      const y0  = Phaser.Math.Between(Math.floor(-H * 0.1), Math.floor(H * 0.3));
      const gfx = this.add.graphics().setDepth(5).setAlpha(0.35);
      gfx.lineStyle(1, color, 0.6);
      gfx.lineBetween(0, 0, -3, 13);
      gfx.x = x0;
      gfx.y = y0;

      this.time.delayedCall(i * 190 + Phaser.Math.Between(0, 800), () => {
        this.tweens.add({
          targets: gfx,
          y: H + 20,
          duration: Phaser.Math.Between(1200, 2000),
          ease: 'Linear',
          repeat: -1,
          onRepeat: () => {
            gfx.x = Phaser.Math.Between(0, W);
            gfx.y = y0;
          },
        });
      });
    }
  }

  private spawnSnow(W: number, H: number): void {
    for (let i = 0; i < 8; i++) {
      const gfx = this.add.graphics().setDepth(5);
      gfx.fillStyle(0xffffff, 0.7);
      gfx.fillCircle(0, 0, Phaser.Math.Between(1, 3));
      gfx.x = Phaser.Math.Between(0, W);
      gfx.y = Phaser.Math.Between(-10, Math.floor(H * 0.2));
      const driftX = Phaser.Math.Between(-30, 30);

      this.time.delayedCall(i * 260 + Phaser.Math.Between(0, 600), () => {
        this.tweens.add({
          targets: gfx,
          y: H + 10,
          x: gfx.x + driftX,
          duration: Phaser.Math.Between(3000, 5000),
          ease: 'Linear',
          repeat: -1,
          onRepeat: () => {
            gfx.x = Phaser.Math.Between(0, W);
            gfx.y = -10;
          },
        });
      });
    }
  }

  private spawnEmbers(W: number, H: number, primary: number, secondary: number): void {
    for (let i = 0; i < 6; i++) {
      const x0  = Phaser.Math.Between(Math.floor(W * 0.1), Math.floor(W * 0.9));
      const y0  = Phaser.Math.Between(Math.floor(H * 0.5), Math.floor(H * 0.85));
      const gfx = this.add.graphics().setDepth(5).setAlpha(0.7);
      gfx.fillStyle(i % 2 === 0 ? primary : secondary, 1);
      gfx.fillCircle(0, 0, Phaser.Math.Between(1, 3));
      gfx.x = x0;
      gfx.y = y0;

      this.time.delayedCall(i * 310 + Phaser.Math.Between(0, 600), () => {
        this.tweens.add({
          targets: gfx,
          y: y0 - Phaser.Math.Between(80, 180),
          x: x0 + Phaser.Math.Between(-20, 20),
          alpha: { from: 0.7, to: 0 },
          duration: Phaser.Math.Between(1800, 2800),
          ease: 'Sine.easeOut',
          repeat: -1,
          onRepeat: () => {
            gfx.x = Phaser.Math.Between(Math.floor(W * 0.1), Math.floor(W * 0.9));
            gfx.y = y0;
            gfx.setAlpha(0.7);
          },
        });
      });
    }
  }

  private spawnPaper(W: number, H: number): void {
    for (let i = 0; i < 4; i++) {
      const gfx = this.add.graphics().setDepth(5).setAlpha(0.5);
      gfx.fillStyle(0xffffff, 0.75);
      gfx.fillRect(-5, -7, 10, 14);
      gfx.x = Phaser.Math.Between(0, W);
      gfx.y = Phaser.Math.Between(-20, Math.floor(H * 0.2));

      this.time.delayedCall(i * 420, () => {
        this.tweens.add({
          targets: gfx,
          y: H + 20,
          angle: Phaser.Math.Between(-180, 180),
          duration: Phaser.Math.Between(3500, 5500),
          ease: 'Linear',
          repeat: -1,
          onRepeat: () => {
            gfx.x = Phaser.Math.Between(0, W);
            gfx.y = -20;
          },
        });
      });
    }
  }
}
