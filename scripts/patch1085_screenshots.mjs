/**
 * PATCH 1085 — Screenshots: HUD sans ruban, plateau harmonisé
 * Cibles : Castle HUD, Sonic HUD, OutRun HUD, Castle boss HUD
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5173/snake/';
const OUT  = 'reports/patch-1085/screenshots';
mkdirSync(OUT, { recursive: true });

const LEVELS = [
  { id: 'castle_normal',  file: 'castle_hud_after.png'  },
  { id: 'sonic_normal',   file: 'sonic_hud_after.png'   },
  { id: 'outrun_normal',  file: 'outrun_hud_after.png'  },
  { id: 'castle_boss',    file: 'castle_boss_hud_after.png' },
];

const browser = await chromium.launch({ headless: true });

for (const { id, file } of LEVELS) {
  const ctx  = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  await page.goto(BASE);

  // Wait for Phaser game to be ready
  await page.waitForFunction(() => {
    const g = window.__SNAKE_GAME__;
    return g && g.scene && g.scene.isActive('TitleScene');
  }, { timeout: 8000 }).catch(() => {});

  await page.waitForTimeout(500);

  // Jump directly to GameScene
  await page.evaluate((levelId) => {
    const g = window.__SNAKE_GAME__;
    if (!g) return;
    // Stop all active scenes then start GameScene
    const active = g.scene.scenes.filter(s => s.scene.isActive());
    for (const s of active) g.scene.stop(s.scene.key);
    g.scene.start('GameScene', { levelId });
  }, id);

  // Wait for GameScene to be running
  await page.waitForFunction(() => {
    const g = window.__SNAKE_GAME__;
    return g && g.scene.isActive('GameScene');
  }, { timeout: 8000 }).catch(() => {});

  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${file}` });
  await ctx.close();
  console.log(`✓ ${file}`);
}

await browser.close();
console.log('Done.');
