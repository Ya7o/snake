/**
 * PATCH 1031 — Progression State Assertions (static analysis)
 *
 * Reads SaveSystem.ts, WorldMapScene.ts, mapNodes.ts and levels.ts
 * and validates progression logic via pattern matching + structural checks.
 * No browser required.
 *
 * Run: node reports/patch-1031/scripts/assert-progression.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');
const LOG_PATH = join(__dirname, '..', 'logs', 'progression-state-results.json');

function src(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

const results = { timestamp: new Date().toISOString(), assertions: [], summary: {} };

function assert(name, condition, detail = '') {
  const passed = !!condition;
  results.assertions.push({ name, passed, detail });
  console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`);
  return passed;
}

console.log('\n=== PATCH 1031 — Progression State Assertions (static) ===\n');

// ── Load source files ─────────────────────────────────────────────────────
const saveSystem    = src('src/systems/SaveSystem.ts');
const worldMap      = src('src/scenes/WorldMapScene.ts');
const mapNodes      = src('src/config/mapNodes.ts');
const levels        = src('src/config/levels.ts');
const constants     = src('src/config/constants.ts');

// ── Test 1: Castle accessible by default ─────────────────────────────────
console.log('Test 1: Castle accessible by default');

const firstNodeMatch = mapNodes.match(/MAP_NODES\s*:\s*MapNodeConfig\[\]\s*=\s*\[[\s\S]*?id:\s*'(node_\d+)'[\s\S]*?levelId:\s*'(castle_\w+)'/);
const firstNodeId    = firstNodeMatch?.[1];
const firstLevelId   = firstNodeMatch?.[2];

assert('MAP_NODES[0] is castle_normal',
  firstNodeId === 'node_1' && firstLevelId === 'castle_normal',
  `id=${firstNodeId}, levelId=${firstLevelId}`);

const hasFirstNodeIdFn = saveSystem.includes('MAP_NODES[0]?.id');
assert('firstNodeId() returns MAP_NODES[0].id',
  hasFirstNodeIdFn,
  'SaveSystem.ts line: MAP_NODES[0]?.id ?? \'node_1\'');

const defaultSavePattern = /unlockedNodes:\s*\[firstNodeId\(\)\]/;
assert('defaultSave() unlocks firstNodeId only',
  defaultSavePattern.test(saveSystem),
  'defaultSave returns { clearedLevels: [], unlockedNodes: [firstNodeId()] }');

const clearedDefaultPattern = /clearedLevels:\s*\[\]/;
assert('defaultSave() has empty clearedLevels',
  clearedDefaultPattern.test(saveSystem),
  'No levels cleared on fresh start');

// ── Test 2: All other worlds locked by default ────────────────────────────
console.log('\nTest 2: Other worlds locked by default');

const nodeCount = (mapNodes.match(/id:\s*'node_\d+'/g) || []).length;
assert('16 nodes defined in MAP_NODES',
  nodeCount === 16,
  `found: ${nodeCount}`);

assert('defaultSave unlocks only 1 node (node_1)',
  /unlockedNodes:\s*\[firstNodeId\(\)\]/.test(saveSystem),
  'nodes 2–16 are locked by default');

// ── Test 3: resetProgress clears localStorage ─────────────────────────────
console.log('\nTest 3: resetProgress=1 clears localStorage');

const saveKeyMatch = saveSystem.match(/const SAVE_KEY\s*=\s*'([^']+)'/);
const saveKey = saveKeyMatch?.[1];
assert('SAVE_KEY is defined',
  saveKey !== undefined,
  `SAVE_KEY = '${saveKey}'`);

const resetPattern = /resetProgress.*===.*'1'[\s\S]*?localStorage\.removeItem\(SAVE_KEY\)/;
assert('resetProgress=1 removes SAVE_KEY from localStorage',
  resetPattern.test(saveSystem),
  'Module-level code: if resetProgress=1 → localStorage.removeItem(SAVE_KEY)');

const moduleLevel = saveSystem.indexOf('if (_p.get(\'resetProgress\') === \'1\')');
assert('resetProgress runs at module level (before Phaser)',
  moduleLevel > 0 && moduleLevel < saveSystem.indexOf('export const SaveSystem'),
  `position: ${moduleLevel} (before export block)`);

// ── Test 4: unlockAll=1 is session-only, no localStorage pollution ────────
console.log('\nTest 4: unlockAll=1 — session only, no localStorage write');

const sessionUnlockPattern = /SESSION_UNLOCK_ALL\s*=\s*_p\.get\('unlockAll'\)\s*===\s*'1'/;
assert('SESSION_UNLOCK_ALL set from ?unlockAll=1',
  sessionUnlockPattern.test(saveSystem),
  'Const assigned at module level from URLSearchParams');

const debugAliasPattern = /_p\.get\('debugUnlockAll'\)\s*===\s*'1'/;
assert('?debugUnlockAll=1 is also accepted',
  debugAliasPattern.test(saveSystem),
  'Alias for ?unlockAll=1');

const saveGuard = /save\(data: SaveData\): void \{[\s\S]*?if \(SESSION_UNLOCK_ALL\) return/;
assert('save() returns early when SESSION_UNLOCK_ALL',
  saveGuard.test(saveSystem),
  'Prevents any localStorage write during unlock session');

const markClearedGuard = /markCleared\([\s\S]*?if \(SESSION_UNLOCK_ALL\) return/;
assert('markCleared() returns early when SESSION_UNLOCK_ALL',
  markClearedGuard.test(saveSystem),
  'Progression events do not persist during unlock session');

const loadSessionReturn = /load\(\): SaveData \{[\s\S]*?if \(SESSION_UNLOCK_ALL\) \{[\s\S]*?return \{/;
assert('load() returns full unlock data from memory when SESSION_UNLOCK_ALL',
  loadSessionReturn.test(saveSystem),
  'Returns all levels + all nodes — purely in-memory, no localStorage read/write');

// ── Test 5: No public unlock all button in WorldMapScene ─────────────────
console.log('\nTest 5: No public unlock all button');

const updateFooterBtn = worldMap.match(/private updateFooterButton[\s\S]*?\{([\s\S]*?)\}/);
const footerBtnBody = updateFooterBtn?.[1] ?? '';
const isNoop = footerBtnBody.includes('no button') && footerBtnBody.trim().split('\n').every(l => l.trim() === '' || l.trim().startsWith('//'));
assert('updateFooterButton() is a no-op with no unlock reference',
  isNoop,
  'WorldMapScene.ts: "// no button — launch via double-tap on node"');

const noUnlockTextInUI = !worldMap.includes('unlockAll') && !worldMap.includes('unlock all') && !worldMap.includes('Unlock All');
assert('WorldMapScene contains no reference to unlockAll',
  noUnlockTextInUI,
  'URL param is internal only');

// ── Test 6: DEV_UNLOCK_ALL is false ────────────────────────────────────────
console.log('\nTest 6: DEV_UNLOCK_ALL = false (prod-safe)');

const devUnlock = constants.match(/DEV_UNLOCK_ALL\s*=\s*(true|false)/);
assert('DEV_UNLOCK_ALL is false',
  devUnlock?.[1] === 'false',
  `value: ${devUnlock?.[1]}`);

// ── Test 7: SaveSystem not imported in WorldMapScene with unlock bypass ────
console.log('\nTest 7: WorldMapScene uses SaveSystem.load() for node state');

assert('WorldMapScene calls SaveSystem.load()',
  worldMap.includes('SaveSystem.load()'),
  'Reads real save data including lock state for each node');

assert('WorldMapScene renders locked marker for locked nodes',
  worldMap.includes('drawLockedNodeMarker'),
  'isUnlocked check gates which marker is drawn');

// ── Summary ───────────────────────────────────────────────────────────────
const passed = results.assertions.filter(a => a.passed).length;
const total  = results.assertions.length;
results.summary = { passed, failed: total - passed, total, allPassed: passed === total };

console.log(`\n=== RÉSULTAT: ${passed}/${total} assertions OK ===\n`);

mkdirSync(dirname(LOG_PATH), { recursive: true });
writeFileSync(LOG_PATH, JSON.stringify(results, null, 2));
console.log(`Log: ${LOG_PATH}`);

process.exit(results.summary.allPassed ? 0 : 1);
