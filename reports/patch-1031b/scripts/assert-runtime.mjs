import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'http://localhost:5173';
const OUT_DIR = 'reports/patch-1031b/logs';
const SS_DIR = 'reports/patch-1031b/screenshots';
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(SS_DIR, { recursive: true });

const results = {};

async function testPage(browser, label, url, clearStorage = false) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
  if (clearStorage) {
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle', timeout: 20000 });
  }
  await page.waitForTimeout(4000);

  const storage = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      data[k] = localStorage.getItem(k);
    }
    return data;
  });

  const bodyText = await page.evaluate(() => document.body.innerText || '');
  const hasPublicUnlock = /unlock all|débloquer tout/i.test(bodyText);

  await page.screenshot({ path: `${SS_DIR}/${label}.png`, fullPage: false });

  results[label] = {
    url,
    localStorage: storage,
    hasPublicUnlockButton: hasPublicUnlock,
    consoleLogs: consoleLogs.slice(0, 20),
  };

  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-web-security', '--enable-webgl', '--use-gl=swiftshader']
  });

  await testPage(browser, 'normal_empty_storage', BASE, true);
  await testPage(browser, 'unlock_all', `${BASE}/?unlockAll=1`);
  await testPage(browser, 'after_reset', `${BASE}/?resetProgress=1`);
  await testPage(browser, 'normal_after_reset', BASE);

  await browser.close();

  writeFileSync(`${OUT_DIR}/runtime-results.json`, JSON.stringify(results, null, 2));
  console.log('Done. Results:', JSON.stringify(results, null, 2));
})();
