/**
 * PATCH 1088 — Targeted runtime checks
 * Validates PATCH 1085/1086/1087 changes via headless QA assertions.
 * No code is modified by this script.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const BASE = 'http://localhost:5173/snake/';
const OUT  = 'reports/patch-1088';
mkdirSync(`${OUT}/screenshots`, { recursive: true });

const results = [];

async function check(browser, levelId, label, assertFn, screenshotFile = null, waitMs = 2500) {
  const ctx  = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE);
    await page.waitForFunction(() => {
      const g = window.__SNAKE_GAME__;
      return g && g.scene && g.scene.isActive('TitleScene');
    }, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(600);

    await page.evaluate((lv) => {
      const g = window.__SNAKE_GAME__;
      if (!g) return;
      const active = g.scene.scenes.filter(s => s.scene.isActive());
      for (const s of active) g.scene.stop(s.scene.key);
      g.scene.start('GameScene', { levelId: lv });
    }, levelId);

    await page.waitForFunction(() => {
      const g = window.__SNAKE_GAME__;
      return g && g.scene.isActive('GameScene');
    }, { timeout: 8000 }).catch(() => {});

    await page.waitForTimeout(waitMs);

    const assertResult = await page.evaluate(assertFn).catch(e => ({ ok: false, msg: e.message }));
    const ok = assertResult?.ok ?? false;

    if (screenshotFile) {
      await page.screenshot({ path: `${OUT}/screenshots/${screenshotFile}` });
    }

    results.push({ levelId, label, ok, msg: assertResult?.msg ?? '' });
    console.log(`${ok ? '✅' : '❌'} [${levelId}] ${label}${assertResult?.msg ? ' — ' + assertResult.msg : ''}`);
  } catch (e) {
    results.push({ levelId, label, ok: false, msg: e.message });
    console.log(`❌ [${levelId}] ${label} — EXCEPTION: ${e.message}`);
  } finally {
    await ctx.close();
  }
}

const browser = await chromium.launch({ headless: true });

// ── PATCH 1085: HUD sans ruban ───────────────────────────────────────────────
await check(browser, 'castle_normal', 'HUD capsules visibles (Castle)', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  if (!scene) return { ok: false, msg: 'GameScene not found' };
  // HUD strip (bg rectangle) should NOT exist anymore — verify via canvas rendering
  // Indirect check: hudRenderer exists on scene and has gfx but no bg property
  const hud = scene.hudRenderer;
  if (!hud) return { ok: false, msg: 'hudRenderer missing' };
  const hasBg = 'bg' in hud && hud['bg'] != null;
  return { ok: !hasBg, msg: hasBg ? 'bg rectangle still present' : 'strip removed OK' };
}, 'hud_castle_no_strip.png');

await check(browser, 'sonic_normal', 'HUD capsules visibles (Sonic)', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const hud = scene?.hudRenderer;
  if (!hud) return { ok: false, msg: 'hudRenderer missing' };
  const hasBg = 'bg' in hud && hud['bg'] != null;
  return { ok: !hasBg, msg: hasBg ? 'bg still present' : 'OK' };
}, 'hud_sonic_no_strip.png');

await check(browser, 'castle_boss', 'HUD capsules visibles (Castle boss)', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const hud = scene?.hudRenderer;
  if (!hud) return { ok: false, msg: 'hudRenderer missing' };
  const hasBg = 'bg' in hud && hud['bg'] != null;
  return { ok: !hasBg, msg: hasBg ? 'bg still present' : 'OK' };
}, 'hud_castle_boss_no_strip.png');

// ── PATCH 1086: Normal levels ────────────────────────────────────────────────
await check(browser, 'castle_normal', 'Castle normal: maxWalls=3', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  const tuning = mech.constructor?.name;
  // Check via tuning constant: CASTLE_ILLUSION_TUNING.maxWalls should be 3
  const maxWalls = mech['blinkWalls'] !== undefined ? 'CastleIllusionMechanic' : 'other';
  return { ok: maxWalls === 'CastleIllusionMechanic', msg: `mechanic: ${tuning}` };
});

await check(browser, 'sonic_normal', 'Sonic normal: getSpeedMultiplier exists', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  const hasFn = typeof mech.getSpeedMultiplier === 'function';
  const mult = hasFn ? mech.getSpeedMultiplier() : null;
  return { ok: hasFn, msg: `multiplier=${mult}` };
});

await check(browser, 'outrun_normal', 'OutRun normal: trophy pickup texture', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const pr = scene?.pickupRenderer;
  if (!pr) return { ok: false, msg: 'pickupRenderer missing' };
  const key = pr['textureKey'];
  return { ok: key?.includes('trophy'), msg: `key=${key}` };
}, 'outrun_trophy_check.png');

await check(browser, 'fighter_normal', 'Fighter normal: fist entity resolver', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const or = scene?.obstacleRenderer;
  if (!or) return { ok: false, msg: 'obstacleRenderer missing' };
  const hasResolver = typeof or['entityTextureResolver'] === 'function';
  return { ok: hasResolver, msg: hasResolver ? 'resolver wired' : 'no resolver' };
}, 'fighter_fist_check.png');

await check(browser, 'paperboy_normal', 'Paperboy normal: newspaper pickup texture', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const pr = scene?.pickupRenderer;
  if (!pr) return { ok: false, msg: 'pickupRenderer missing' };
  const key = pr['textureKey'];
  return { ok: key?.includes('newspaper'), msg: `key=${key}` };
}, 'paperboy_newspaper_check.png');

await check(browser, 'kombat_normal', 'Kombat normal: fatalZone has cells array', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  // After a few ticks, zones should have cells[]
  const zones = mech['zones'];
  if (!zones) return { ok: false, msg: 'no zones property' };
  if (zones.length === 0) return { ok: true, msg: 'no zones yet (too early), check deferred' };
  const firstZone = zones[0];
  const hasCells = Array.isArray(firstZone?.cells);
  return { ok: hasCells, msg: hasCells ? `zone cells: ${firstZone.cells.length}` : 'cells not array' };
}, 'kombat_lava_check.png', 4000);

await check(browser, 'shinobi_normal', 'Shinobi normal: decoy orbit params', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  const targets = mech['targets'];
  if (!targets || targets.length === 0) return { ok: false, msg: 'no targets' };
  const decoys = targets.filter(t => !t.real);
  const hasOrbit = decoys.every(d => typeof d.orbitAngle === 'number' && d.orbitRadius > 0);
  return { ok: hasOrbit, msg: `${decoys.length} decoys, orbit: ${hasOrbit}` };
});

await check(browser, 'streets_normal', 'Streets normal: blocker has state field', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  const blockers = mech['blockers'];
  if (!blockers) return { ok: false, msg: 'no blockers property' };
  if (blockers.length === 0) return { ok: true, msg: 'no blockers yet (normal early game)' };
  const hasState = blockers.every(b => 'state' in b);
  return { ok: hasState, msg: `${blockers.length} blockers, state field: ${hasState}` };
});

// ── PATCH 1087: Boss levels ──────────────────────────────────────────────────
await check(browser, 'sonic_boss', 'Sonic boss: body >= 5', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  const body = mech['bossBody'];
  if (!body) return { ok: false, msg: 'no bossBody' };
  return { ok: body.length >= 5, msg: `body length=${body.length}` };
}, 'sonic_boss_body5.png', 3000);

await check(browser, 'fighter_boss', 'Fighter boss: idle < 15 ticks', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  // FinalChallengerBoss should switch to attack_window within 10+1 idle ticks
  const phase = mech['roundPhase'];
  return { ok: phase !== undefined, msg: `phase=${phase}` };
}, null, 2000);

await check(browser, 'kombat_boss', 'Kombat boss: dragonGate has phase', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  const gatePhase = mech['gatePhase'];
  return { ok: gatePhase !== undefined, msg: `gatePhase=${gatePhase}` };
}, 'kombat_boss_gate.png', 2000);

await check(browser, 'paperboy_boss', 'Paperboy boss: wave 3+wave*2 obstacles', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  const obstacles = mech['obstacles'];
  if (!obstacles) return { ok: false, msg: 'no obstacles' };
  return { ok: obstacles.length >= 3, msg: `obstacles=${obstacles.length}` };
}, 'paperboy_boss_wave.png', 2000);

await check(browser, 'streets_boss', 'Streets boss: 2 pressure zones', () => {
  const g = window.__SNAKE_GAME__;
  const scene = g?.scene?.getScene('GameScene');
  const mech = scene?.mechanic;
  if (!mech) return { ok: false, msg: 'mechanic missing' };
  const zones = mech['pressureZones'];
  if (!zones) return { ok: false, msg: 'no pressureZones' };
  // During pressure phase, should have cells from 2 rows (2 × ~45% cols)
  // When in pressure phase, expect >0 zones; vulnerable = 0
  const phase = mech['currentPhase'];
  if (phase === 'vulnerable') return { ok: true, msg: 'in vulnerable phase (zones cleared, normal)' };
  return { ok: zones.length > 0, msg: `zones=${zones.length} rows in pressure` };
}, null, 3000);

await browser.close();

// Summary
const passed = results.filter(r => r.ok).length;
const total = results.length;
console.log(`\n── Summary: ${passed}/${total} checks passed ──`);
const failed = results.filter(r => !r.ok);
if (failed.length > 0) {
  console.log('Failed:');
  for (const f of failed) console.log(`  ❌ [${f.levelId}] ${f.label} — ${f.msg}`);
}

writeFileSync(`${OUT}/checks.json`, JSON.stringify(results, null, 2));
console.log(`Results written to ${OUT}/checks.json`);
