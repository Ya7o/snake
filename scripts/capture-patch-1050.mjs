import { chromium } from "playwright";
const OUT = "/home/kali/apps/snake/reports/patch-1050/screenshots";
const BASE = "http://localhost:5173/?unlockAll=1";
const VP = { width: 390, height: 844 };
async function go(page, levelId) {
  await page.goto(BASE);
  await page.waitForTimeout(4000);
  await page.evaluate((id) => {
    const g = window.__SNAKE_GAME__;
    g.scene.getScenes(true).forEach(s => g.scene.stop(s.sys.key));
    g.scene.start("GameScene", { levelId: id });
  }, levelId);
  await page.waitForTimeout(3000);
}
async function main() {
  const br = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  for (const [id, name] of [["paperboy_normal","paperboy_normal_after"],["paperboy_boss","paperboy_boss_after"],["castle_normal","castle_normal_non_regression"]]) {
    const p = await br.newPage();
    await p.setViewportSize(VP);
    await go(p, id);
    await p.screenshot({ path: OUT + "/" + name + ".png" });
    console.log("captured: " + name + ".png");
    await p.close();
  }
  await br.close();
}
main().catch(e => { console.error(e); process.exit(1); });
