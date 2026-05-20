/**
 * audit-design-assets.mjs
 * Vérifie que chaque univers a un board mappé, une entrée manifest et ses assets critiques.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const UNIVERSES = ['castle', 'sonic', 'streets', 'fighter', 'outrun', 'shinobi', 'kombat', 'paperboy'];
const CRITICAL_ASSETS = ['pickup_01.png', 'pickup_02.png', 'obstacle_01.png', 'obstacle_02.png', 'boss.png'];

let errors = 0;
let warnings = 0;

function ok(msg)   { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.warn(`  ⚠ ${msg}`); warnings++; }
function fail(msg) { console.error(`  ✗ ${msg}`); errors++; }

// ─── 1. BOARD_MAPPING.json ────────────────────────────────────────────────────

const mappingPath = join(ROOT, 'design_boards', 'BOARD_MAPPING.json');
console.log('\n── Vérification BOARD_MAPPING.json');
if (!existsSync(mappingPath)) {
  fail('design_boards/BOARD_MAPPING.json manquant — lancer npm run assets:build');
  process.exit(1);
}

const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));
for (const uid of UNIVERSES) {
  const entry = mapping.universes?.[uid];
  if (!entry) { fail(`${uid} absent du mapping`); continue; }
  if (entry.status === 'unmapped') { warn(`${uid} : status=unmapped`); continue; }
  if (!entry.sourceFile) { warn(`${uid} : sourceFile vide`); }
  else if (!existsSync(join(ROOT, entry.sourceFile))) {
    warn(`${uid} : sourceFile introuvable → ${entry.sourceFile}`);
  } else {
    ok(`${uid} : board mappé → ${entry.sourceFile}`);
  }
}

// ─── 2. Manifest ──────────────────────────────────────────────────────────────

const manifestPath = join(ROOT, 'public', 'assets', 'design-board-manifest.json');
console.log('\n── Vérification design-board-manifest.json');
if (!existsSync(manifestPath)) {
  fail('public/assets/design-board-manifest.json manquant — lancer npm run assets:build');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
for (const uid of UNIVERSES) {
  const entry = manifest.universes?.[uid];
  if (!entry) { fail(`${uid} absent du manifest`); continue; }
  ok(`${uid} : entrée manifest présente (confidence: ${entry.confidence})`);
}

// ─── 3. Assets critiques ──────────────────────────────────────────────────────

console.log('\n── Vérification assets critiques par univers');
for (const uid of UNIVERSES) {
  const dir = join(ROOT, 'public', 'assets', 'universes', uid);
  for (const asset of CRITICAL_ASSETS) {
    const p = join(dir, asset);
    if (!existsSync(p)) {
      fail(`${uid}/${asset} manquant`);
    } else {
      ok(`${uid}/${asset}`);
    }
  }
  // frame_tile.png et hud_panel.png sont utiles mais pas bloquants
  if (!existsSync(join(dir, 'frame_tile.png'))) warn(`${uid}/frame_tile.png manquant`);
  if (!existsSync(join(dir, 'hud_panel.png')))  warn(`${uid}/hud_panel.png manquant`);
  if (!existsSync(join(dir, 'theme_palette.json'))) warn(`${uid}/theme_palette.json manquant`);
}

// ─── 4. Assets référencés dans le manifest ────────────────────────────────────

console.log('\n── Vérification cohérence manifest ↔ fichiers');
for (const [uid, entry] of Object.entries(manifest.universes ?? {})) {
  for (const [key, val] of Object.entries(entry.assets ?? {})) {
    if (!val) { warn(`${uid}.${key} : null dans manifest (fallback)`); continue; }
    const full = join(ROOT, 'public', val);
    if (!existsSync(full)) fail(`${uid}.${key} : ${val} référencé mais absent`);
    else ok(`${uid}.${key} → OK`);
  }
}

// ─── Résumé ───────────────────────────────────────────────────────────────────

console.log('\n──────────────────────────────────');
if (errors > 0 || warnings > 0) {
  console.log(`Résultat : ${errors} erreur(s), ${warnings} avertissement(s)`);
} else {
  console.log('Résultat : tout OK — pipeline design boards validé');
}

if (errors > 0) process.exit(1);
