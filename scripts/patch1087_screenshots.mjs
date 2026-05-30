/**
 * PATCH 1087 — Boss screenshots
 * Sonic boss clarity, OutRun boss hint, Kombat boss zone, Paperboy boss wave
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5173/snake/';
const OUT  = 'reports/patch-1087/screenshots';
mkdirSync(OUT, { recursive: true });

const LEVELS = [
  { id: 'sonic_boss',    file: 'sonic_boss_clarity.png',     wait: 2500 },
  { id: 'outrun_boss',   file: 'outrun_boss_hint.png',       wait: 2500 },
  { id: 'kombat_boss',   file: 'kombat_boss_zone.png',       wait: 4000 },
  { id: 'paperboy_boss', file: 'paperboy_boss_wave.png',     wait: 2000 },
];

const browser = await chromium.launch({ headless: true });

for (const { id, file, wait } of LEVELS) {
  const ctx  = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  await page.goto(BASE);
  await page.waitForFunction(() => {
    const g = window.__SNAKE_GAME__;
    return g && g.scene && g.scene.isActive('TitleScene');
  }, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);

  await page.evaluate((levelId) => {
    const g = window.__SNAKE_GAME__;
    if (!g) return;
    const active = g.scene.scenes.filter(s => s.scene.isActive());
    for (const s of active) g.scene.stop(s.scene.key);
    g.scene.start('GameScene', { levelId });
  }, id);

  await page.waitForFunction(() => {
    const g = window.__SNAKE_GAME__;
    return g && g.scene.isActive('GameScene');
  }, { timeout: 8000 }).catch(() => {});

  await page.waitForTimeout(wait);
  await page.screenshot({ path: `${OUT}/${file}` });
  await ctx.close();
  console.log(`✓ ${file}`);
}

await browser.close();
console.log('Done.');
