/**
 * PATCH 1086 — Targeted screenshots
 * OutRun pickup (trophy), Fighter obstacle (fist), Paperboy journal/mailbox, Kombat zones
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5173/snake/';
const OUT  = 'reports/patch-1086/screenshots';
mkdirSync(OUT, { recursive: true });

const LEVELS = [
  { id: 'outrun_normal',   file: 'outrun_pickup_trophy.png'      },
  { id: 'fighter_normal',  file: 'fighter_fist_obstacle.png'     },
  { id: 'paperboy_normal', file: 'paperboy_newspaper_mailbox.png' },
  { id: 'kombat_normal',   file: 'kombat_lava_zones.png'         },
];

const browser = await chromium.launch({ headless: true });

for (const { id, file } of LEVELS) {
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

  // Wait a bit extra for Kombat lava zones to appear
  await page.waitForTimeout(id === 'kombat_normal' ? 3500 : 2000);
  await page.screenshot({ path: `${OUT}/${file}` });
  await ctx.close();
  console.log(`✓ ${file}`);
}

await browser.close();
console.log('Done.');
