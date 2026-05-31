import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = process.env.PATCH1096_BASE_URL ?? 'http://localhost:5173/snake/';
const OUT = 'reports/patch-1096/screenshots';
mkdirSync(OUT, { recursive: true });

const targets = [
  { id: 'kombat_normal', file: 'kombat_normal_after.png', wait: 3200 },
  { id: 'kombat_boss', file: 'kombat_boss_after.png', forceTicks: 16, settle: 180 },
  { id: 'shinobi_boss', file: 'shinobi_boss_after.png', forceTicks: 28, settle: 120 },
];

const browser = await chromium.launch({ headless: true });

for (const target of targets) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(BASE);
  await page.waitForFunction(() => {
    const game = window.__SNAKE_GAME__;
    return game && game.scene;
  }, { timeout: 8000 });

  await page.evaluate((levelId) => {
    const game = window.__SNAKE_GAME__;
    const activeScenes = game.scene.scenes.filter(scene => scene.scene.isActive());
    for (const scene of activeScenes) game.scene.stop(scene.scene.key);
    game.scene.start('GameScene', { levelId });
  }, target.id);

  await page.waitForFunction(() => {
    const game = window.__SNAKE_GAME__;
    return game && game.scene.isActive('GameScene');
  }, { timeout: 8000 });
  if (target.forceTicks) {
    await page.waitForTimeout(500);
    await page.evaluate((ticks) => {
      const scene = window.__SNAKE_GAME__.scene.getScene('GameScene');
      for (let tick = 1; tick <= ticks; tick++) {
        scene.syncMechanicCtx();
        scene.applyMechanicUpdate(scene.mechanic.tick(tick));
      }
      scene.syncMechanicCtx();
      scene.renderGameState();
    }, target.forceTicks);
    await page.waitForTimeout(target.settle ?? 0);
  } else {
    await page.waitForTimeout(target.wait ?? 2000);
  }
  await page.screenshot({ path: `${OUT}/${target.file}` });
  await context.close();
  console.log(`captured ${target.file}`);
}

await browser.close();
