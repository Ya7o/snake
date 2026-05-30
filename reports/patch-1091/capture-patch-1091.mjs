import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const BASE = 'http://localhost:5173/snake/';
const OUT = 'reports/patch-1091';
const SCREENSHOTS = `${OUT}/screenshots`;
const LOGS = `${OUT}/logs`;

mkdirSync(SCREENSHOTS, { recursive: true });
mkdirSync(LOGS, { recursive: true });

const browser = await chromium.launch({ headless: true });
const rows = [
  [
    'level_id',
    'universe',
    'level_type',
    'grid_width',
    'grid_height',
    'board_width',
    'board_height',
    'cell_size',
    'reference_applied',
    'exception_reason',
  ].join(','),
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

async function captureBoard(levelId, file) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await openScene(page, 'GameScene', { levelId });
  const metrics = await page.evaluate(() => {
    const game = window.__SNAKE_GAME__;
    const scene = game?.scene?.getScene('GameScene');
    const active = scene?.layout;
    const visual = scene?.visualBoardLayout ?? active;
    const level = scene?.levelConfig;
    if (!active || !visual || !level) return null;
    return {
      levelId: level.id,
      universe: level.universeId,
      levelType: level.type,
      gridWidth: active.cols,
      gridHeight: active.rows,
      boardWidth: (visual.cellWidth ?? visual.cellSize) * visual.cols,
      boardHeight: (visual.cellHeight ?? visual.cellSize) * visual.rows,
      cellSize: active.cellSize,
    };
  });
  if (metrics) {
    rows.push([
      metrics.levelId,
      metrics.universe,
      metrics.levelType,
      metrics.gridWidth,
      metrics.gridHeight,
      metrics.boardWidth,
      metrics.boardHeight,
      metrics.cellSize,
      'yes',
      '',
    ].join(','));
  }
  await page.screenshot({ path: `${SCREENSHOTS}/${file}` });
  await context.close();
}

await captureBoard('castle_normal', 'castle_board_after.png');
await captureBoard('sonic_normal', 'sonic_board_after.png');
await captureBoard('paperboy_normal', 'paperboy_board_after.png');
await captureBoard('outrun_normal', 'outrun_board_after.png');
await captureBoard('sonic_boss', 'boss_board_after.png');

writeFileSync(`${LOGS}/board-size-comparison.csv`, `${rows.join('\n')}\n`);
await browser.close();

console.log(`Wrote ${SCREENSHOTS} and ${LOGS}/board-size-comparison.csv`);
