/**
 * PATCH 1092 — Visual Quality Audit capture script
 * Uses Playwright to screenshot all main screens at mobile portrait (390x844)
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173/snake/?unlockAll=1';
const OUT_DIR = path.join(__dirname, 'screenshots');
const CROP_DIR = path.join(OUT_DIR, 'crops');

const VIEWPORT = { width: 390, height: 844 };
const DEVICE_SCALE = 2;

async function wait(page, ms) {
  await page.waitForTimeout(ms);
}

async function screenshot(page, name) {
  const p = path.join(OUT_DIR, name);
  await page.screenshot({ path: p, type: 'png' });
  console.log(`  saved: ${name}`);
}

async function crop(page, name, clip) {
  const p = path.join(CROP_DIR, name);
  await page.screenshot({ path: p, clip, type: 'png' });
  console.log(`  crop: ${name}`);
}

async function navigateToGameplay(page, levelId) {
  // Use Phaser's scene manager via JS eval to jump directly to GameScene
  await page.evaluate((id) => {
    const game = window.__SNAKE_GAME__;
    if (!game) return;
    // Stop current active scenes
    const sm = game.scene;
    const active = sm.getScenes(true);
    for (const s of active) sm.stop(s.scene.key);
    sm.start('GameScene', { levelId: id });
  }, levelId);
  await wait(page, 1800);
}

async function navigateToTitle(page) {
  await page.evaluate(() => {
    const game = window.__SNAKE_GAME__;
    if (!game) return;
    const sm = game.scene;
    const active = sm.getScenes(true);
    for (const s of active) sm.stop(s.scene.key);
    sm.start('TitleScene');
  });
  await wait(page, 1200);
}

async function navigateToWorldMap(page) {
  await page.evaluate(() => {
    const game = window.__SNAKE_GAME__;
    if (!game) return;
    const sm = game.scene;
    const active = sm.getScenes(true);
    for (const s of active) sm.stop(s.scene.key);
    sm.start('WorldMapScene');
  });
  await wait(page, 1500);
}

async function navigateToLevelIntro(page, levelId) {
  await page.evaluate((id) => {
    const game = window.__SNAKE_GAME__;
    if (!game) return;
    const sm = game.scene;
    const active = sm.getScenes(true);
    for (const s of active) sm.stop(s.scene.key);
    sm.start('LevelIntroScene', { levelId: id });
  }, levelId);
  await wait(page, 1200);
}

async function navigateToClear(page, levelId) {
  await page.evaluate((id) => {
    const game = window.__SNAKE_GAME__;
    if (!game) return;
    const sm = game.scene;
    const active = sm.getScenes(true);
    for (const s of active) sm.stop(s.scene.key);
    sm.start('ClearScene', { levelId: id, score: 1500, time: 45 });
  }, levelId);
  await wait(page, 1200);
}

async function navigateToGameOver(page, levelId) {
  await page.evaluate((id) => {
    const game = window.__SNAKE_GAME__;
    if (!game) return;
    const sm = game.scene;
    const active = sm.getScenes(true);
    for (const s of active) sm.stop(s.scene.key);
    sm.start('GameOverScene', { levelId: id, score: 800 });
  }, levelId);
  await wait(page, 1200);
}

const NORMAL_LEVELS = [
  'castle_normal', 'sonic_normal', 'streets_normal', 'fighter_normal',
  'outrun_normal', 'shinobi_normal', 'kombat_normal', 'paperboy_normal',
];
const BOSS_LEVELS = [
  'castle_boss', 'sonic_boss', 'streets_boss', 'fighter_boss',
  'outrun_boss', 'shinobi_boss', 'kombat_boss', 'paperboy_boss',
];
const UNIVERSE_NAMES = [
  'castle', 'sonic', 'streets', 'fighter',
  'outrun', 'shinobi', 'kombat', 'paperboy',
];

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
  });
  const page = await context.newPage();

  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('Navigating to base URL...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await wait(page, 2000);

  // 1. Title screen
  console.log('\n--- Title Screen ---');
  await navigateToTitle(page);
  await screenshot(page, 'title_screen.png');

  // 2. WorldMap
  console.log('\n--- WorldMap ---');
  await navigateToWorldMap(page);
  await screenshot(page, 'worldmap.png');

  // 3. LevelIntro (castle as example)
  console.log('\n--- LevelIntro (castle) ---');
  await navigateToLevelIntro(page, 'castle_normal');
  await screenshot(page, 'level_intro_castle.png');

  // 4. Gameplay — normal levels
  console.log('\n--- Gameplay Normal Levels ---');
  for (let i = 0; i < NORMAL_LEVELS.length; i++) {
    const levelId = NORMAL_LEVELS[i];
    const uid = UNIVERSE_NAMES[i];
    console.log(`  ${uid} normal...`);
    await navigateToGameplay(page, levelId);
    await screenshot(page, `${uid}_gameplay.png`);

    // Crop HUD area
    await crop(page, `${uid}_hud_crop.png`, { x: 0, y: 0, width: 390, height: 60 });
    // Crop grid area
    await crop(page, `${uid}_grid_crop.png`, { x: 0, y: 60, width: 390, height: 500 });
  }

  // 5. Gameplay — boss levels
  console.log('\n--- Gameplay Boss Levels ---');
  const bossesToCapture = ['castle', 'sonic', 'fighter', 'outrun', 'kombat', 'paperboy'];
  for (const uid of bossesToCapture) {
    console.log(`  ${uid} boss...`);
    await navigateToGameplay(page, `${uid}_boss`);
    await screenshot(page, `${uid}_boss.png`);
  }

  // 6. Clear screen
  console.log('\n--- Clear Screen ---');
  await navigateToClear(page, 'castle_normal');
  await screenshot(page, 'clear_screen.png');

  // 7. GameOver screen
  console.log('\n--- GameOver Screen ---');
  await navigateToGameOver(page, 'castle_normal');
  await screenshot(page, 'gameover_screen.png');

  // Save console errors
  if (errors.length > 0) {
    fs.writeFileSync(path.join(__dirname, 'logs', 'console_errors.txt'), errors.join('\n'));
    console.log(`\n${errors.length} console errors logged.`);
  }

  console.log('\nAll screenshots done.');
  await browser.close();
})();
