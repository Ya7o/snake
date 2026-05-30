import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const BASE = 'http://localhost:5173/snake/';
const OUT = 'reports/patch-1089';
const SCREENSHOTS = `${OUT}/screenshots`;
const LOGS = `${OUT}/logs`;

mkdirSync(SCREENSHOTS, { recursive: true });
mkdirSync(LOGS, { recursive: true });

const browser = await chromium.launch({ headless: true });
const rows = [
  ['levelId', 'universeId', 'cols', 'rows', 'cellSize', 'boardWidth', 'boardHeight', 'x', 'y'].join(','),
];

async function openScene(page, sceneKey, data) {
  await page.goto(BASE);
  await page.waitForFunction(() => {
    const game = window.__SNAKE_GAME__;
    return game && game.scene && game.scene.isActive('TitleScene');
  }, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.evaluate(({ sceneKey, data }) => {
    const game = window.__SNAKE_GAME__;
    if (!game) return;
    const activeScenes = game.scene.scenes.filter(scene => scene.scene.isActive());
    for (const scene of activeScenes) game.scene.stop(scene.scene.key);
    game.scene.start(sceneKey, data);
  }, { sceneKey, data });
  await page.waitForFunction((key) => {
    const game = window.__SNAKE_GAME__;
    return game && game.scene.isActive(key);
  }, sceneKey, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(900);
}

async function captureGameOver() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await openScene(page, 'GameOverScene', {
    levelId: 'castle_normal',
    score: 123456,
    bestScore: 987654,
  });
  await page.screenshot({ path: `${SCREENSHOTS}/gameover_mobile_after.png` });
  await context.close();
}

async function captureBoard(levelId, file) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await openScene(page, 'GameScene', { levelId });
  const metrics = await page.evaluate(() => {
    const game = window.__SNAKE_GAME__;
    const scene = game?.scene?.getScene('GameScene');
    const layout = scene?.layout;
    const level = scene?.levelConfig;
    if (!layout || !level) return null;
    return {
      levelId: level.id,
      universeId: level.universeId,
      cols: layout.cols,
      rows: layout.rows,
      cellSize: layout.cellSize,
      boardWidth: layout.cellSize * layout.cols,
      boardHeight: layout.cellSize * layout.rows,
      x: layout.x,
      y: layout.y,
    };
  });
  if (metrics) {
    rows.push([
      metrics.levelId,
      metrics.universeId,
      metrics.cols,
      metrics.rows,
      metrics.cellSize,
      metrics.boardWidth,
      metrics.boardHeight,
      metrics.x,
      metrics.y,
    ].join(','));
  }
  await page.screenshot({ path: `${SCREENSHOTS}/${file}` });
  await context.close();
}

await captureGameOver();
await captureBoard('castle_normal', 'castle_board_mobile_after.png');
await captureBoard('sonic_normal', 'sonic_board_mobile_after.png');
await captureBoard('paperboy_normal', 'third_universe_board_after.png');

writeFileSync(`${LOGS}/board-size-comparison.csv`, `${rows.join('\n')}\n`);
await browser.close();

console.log(`Wrote ${SCREENSHOTS} and ${LOGS}/board-size-comparison.csv`);
