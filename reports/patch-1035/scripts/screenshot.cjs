// Playwright screenshot script — runs from WSL canonical repo ~/apps/snake
const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = '/home/kali/apps/snake/reports/patch-1035/screenshots';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Click through the title screen to reach WorldMap
  await page.click('canvas');
  await page.waitForTimeout(2500);

  // Screenshot 1: WorldMap default — first node pre-selected, hint should be visible
  await page.screenshot({ path: path.join(OUT_DIR, 'worldmap_default_hint.png') });
  console.log('Shot 1 done');

  // Screenshot 2: same state (DEV_UNLOCK_ALL=true, all nodes accessible)
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT_DIR, 'worldmap_unlock_all_hint.png') });
  console.log('Shot 2 done');

  await browser.close();
  console.log('Screenshots saved to', OUT_DIR);
})();
