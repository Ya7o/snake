// PATCH 1082 — Runtime icon footprint harmonization screenshots
// Mobile 390x844. Captures icon scales after the fix.
const { chromium } = require('playwright');

const BASE = 'http://localhost:5174/snake';
const VIEWPORT = { width: 390, height: 844 };
const SS_DIR = 'reports/patch-1082/screenshots';

// Poll until GameScene is active and snake is initialized
async function waitForGameScene(page, timeout = 12000) {
  await page.waitForFunction(() => {
    try {
      const g = Object.values(window).find(v => v && v.scene && v.scene.getScene);
      const gs = g && g.scene.getScene('GameScene');
      return gs && gs.scene.isActive() && gs.snake && gs.snake.length > 0;
    } catch { return false; }
  }, { timeout });
}

async function launchGameScene(page, levelId) {
  await page.evaluate((id) => {
    try {
      const g = Object.values(window).find(v => v && v.scene && v.scene.getScene);
      if (!g) return;
      // Stop any currently running scene (except BootScene)
      g.scene.scenes
        .filter(s => s.scene.isActive() && s.scene.key !== 'BootScene')
        .forEach(s => s.scene.stop());
      g.scene.start('GameScene', { levelId: id });
    } catch (e) { console.error('launchGameScene err:', e); }
  }, levelId);
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') console.log('[PAGE ERR]', m.text()); });

  // ── 1. Load game, advance to WorldMap ────────────────────────────────────
  await page.goto(`${BASE}/?unlockAll=1`, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(3500);

  // Click title to advance (TitleScene → WorldMap)
  await page.mouse.click(195, 422);
  await page.waitForTimeout(1000);
  await page.mouse.click(195, 422);
  await page.waitForTimeout(2500);

  const hasGame = await page.evaluate(() => {
    return !!(Object.values(window).find(v => v && v.scene && v.scene.getScene));
  });
  if (!hasGame) {
    console.error('Phaser game not found — aborting.');
    await browser.close();
    process.exit(1);
  }

  // ── Helper: launch, wait for snake to init, screenshot within ~1s ────────
  async function captureLevel(levelId, filename) {
    await launchGameScene(page, levelId);
    try {
      await waitForGameScene(page, 10000);
    } catch {
      console.warn(`  waitForGameScene timed out for ${levelId}, taking screenshot anyway`);
    }
    // 1100ms: enough for rendering but before snake hits a wall (~175ms × 15 steps = 2625ms)
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${SS_DIR}/${filename}` });
    console.log(`  captured: ${filename}`);
    await page.waitForTimeout(400);
  }

  // ── 2. Sonic — ring pickup reference ────────────────────────────────────
  console.log('Sonic normal (ring reference)...');
  await captureLevel('sonic_normal', 'sonic_ring_reference.png');

  // ── 3. Castle — pickup reference ────────────────────────────────────────
  console.log('Castle normal (pickup reference)...');
  await captureLevel('castle_normal', 'castle_pickup_reference.png');

  // ── 4. Paperboy — icons after ───────────────────────────────────────────
  console.log('Paperboy normal (icons after)...');
  await captureLevel('paperboy_normal', 'paperboy_icons_after.png');

  // ── 5. OutRun — icons after (traffic car obstacle) ──────────────────────
  console.log('OutRun normal (icons after)...');
  await captureLevel('outrun_normal', 'outrun_icons_after.png');

  // ── 6. Shinobi — icons after ────────────────────────────────────────────
  console.log('Shinobi normal (icons after)...');
  await captureLevel('shinobi_normal', 'shinobi_icons_after.png');

  // ── 7. Castle boss — non-regression ─────────────────────────────────────
  console.log('Castle boss (non-regression)...');
  await captureLevel('castle_boss', 'castle_non_regression.png');

  await browser.close();
  console.log('Done.');
})();
