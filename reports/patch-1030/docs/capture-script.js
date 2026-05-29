const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  // title
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'reports/patch-1030/screenshots/title_default.png' });
  // worldmap default - click to go to worldmap if needed
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'reports/patch-1030/screenshots/worldmap_default_progression.png' });
  // unlock all
  await page.goto('http://localhost:5173/?unlockAll=1', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'reports/patch-1030/screenshots/worldmap_unlock_all.png' });
  // reset
  await page.goto('http://localhost:5173/?resetProgress=1', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'reports/patch-1030/screenshots/worldmap_after_reset.png' });
  await browser.close();
})();
