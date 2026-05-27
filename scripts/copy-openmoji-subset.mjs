#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const sourceArg = argValue('--source', 'snake/tmp/emoticon');
const destArg = argValue('--dest', 'public/assets/openmoji');
const manifestPath = argValue('--manifest', 'scripts/openmoji_selected_icons_manifest.json');

const sourceCandidates = [
  sourceArg,
  'snake/tmp/emoticon',
  'tmp/emoticon',
  '/tmp/openmoji',
  'snake/tmp/openmoji'
];

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function findOpenMojiRoot() {
  for (const candidate of sourceCandidates) {
    if (exists(candidate)) return candidate;
  }
  throw new Error(`OpenMoji source not found. Tried: ${sourceCandidates.join(', ')}`);
}

function findSvgDir(root) {
  const candidates = [
    path.join(root, 'color', 'svg'),
    path.join(root, 'black', 'svg')
  ];
  for (const candidate of candidates) {
    if (exists(candidate)) return candidate;
  }
  throw new Error(`Could not find color/svg or black/svg under ${root}`);
}

function normalizeCandidates(icon) {
  return [...(icon.filenames || []), ...(icon.fallbacks || [])];
}

function copyFirstAvailable(svgDir, destFile, candidates) {
  for (const filename of candidates) {
    const src = path.join(svgDir, filename);
    if (exists(src)) {
      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      fs.copyFileSync(src, destFile);
      return { copied: true, filename };
    }
  }
  return { copied: false, filename: null };
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const openMojiRoot = findOpenMojiRoot();
const svgDir = findSvgDir(openMojiRoot);

const groups = ['world', 'hud', 'pickups', 'obstacles', 'danger', 'boss', 'result'];
const report = [];

for (const group of groups) {
  const entries = manifest[group] || {};
  for (const [key, icon] of Object.entries(entries)) {
    const destFile = path.join(destArg, group, `${key}.svg`);
    const candidates = normalizeCandidates(icon);
    const result = copyFirstAvailable(svgDir, destFile, candidates);
    report.push({
      group,
      key,
      emoji: icon.emoji || '',
      destination: destFile,
      sourceFile: result.filename,
      status: result.copied ? 'copied' : 'missing',
      tried: candidates
    });
  }
}

const reportPath = path.join(destArg, 'OPENMOJI_COPY_REPORT.json');
fs.mkdirSync(destArg, { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify({
  openMojiRoot,
  svgDir,
  destinationRoot: destArg,
  groups,
  report
}, null, 2));

const missing = report.filter(r => r.status === 'missing');

console.log(`OpenMoji root: ${openMojiRoot}`);
console.log(`SVG directory: ${svgDir}`);
console.log(`Destination: ${destArg}`);
console.log(`Copied: ${report.length - missing.length}`);
console.log(`Missing: ${missing.length}`);
console.log(`Report: ${reportPath}`);

if (missing.length) {
  console.warn('Missing icons:');
  for (const item of missing) {
    console.warn(`- ${item.group}/${item.key}: tried ${item.tried.join(', ')}`);
  }
  process.exitCode = 0;
}
