// src/systems/CodexAssetResolver.ts
// Codex 8x10 — charge un pickup, un obstacle et un boss par univers depuis la banque codex.
// Utilisé en complément des runtime assets (patch 944), jamais en remplacement si ceux-ci existent.

import Phaser from 'phaser';
import { UNIVERSE_ASSET_BANK, UniverseAssetBankRole } from '../assets/universeAssetBank';

const UNIVERSE_ID_MAP: Record<string, string> = {
  castle:   'universe_01_castle',
  sonic:    'universe_02_sonic',
  streets:  'universe_03_streets',
  fighter:  'universe_04_fighter',
  outrun:   'universe_05_outrun',
  shinobi:  'universe_06_shinobi',
  kombat:   'universe_07_kombat',
  paperboy: 'universe_08_paperboy',
};

// Rôle codex → index préféré dans la banque (premier asset de chaque rôle)
const PREFERRED_INDEX: Record<UniverseAssetBankRole, number> = {
  pickup:       1,
  obstacle:     4,
  boss:        10,
  prop:         7,
  iconic_major: 9,
};

export function codexKey(universeId: string, role: UniverseAssetBankRole): string {
  return `codex_${universeId}_${role}`;
}

function getCodexPath(universeId: string, role: UniverseAssetBankRole): string | null {
  const codexUniverse = UNIVERSE_ID_MAP[universeId];
  if (!codexUniverse) return null;
  const targetIndex = PREFERRED_INDEX[role];
  const entry = UNIVERSE_ASSET_BANK.find(
    a => a.universe === codexUniverse && a.role === role && a.index === targetIndex,
  );
  return entry ? entry.file : null;
}

/** À appeler dans preload() — charge pickup, obstacle et boss codex de l'univers courant. */
export function preloadCodexAssets(scene: Phaser.Scene, universeId: string): void {
  const roles: UniverseAssetBankRole[] = ['pickup', 'obstacle', 'boss'];
  for (const role of roles) {
    const key = codexKey(universeId, role);
    if (scene.textures.exists(key)) continue;
    const path = getCodexPath(universeId, role);
    if (path) scene.load.image(key, path);
  }
}

/** Retourne la clé Phaser codex si chargée, sinon null. */
export function getCodexTextureKey(
  scene: Phaser.Scene,
  universeId: string,
  role: UniverseAssetBankRole,
): string | null {
  const key = codexKey(universeId, role);
  return scene.textures.exists(key) ? key : null;
}

/** Retourne le chemin vers un asset codex par rôle+index (pour usage avancé). */
export function getCodexAssetPath(
  universeId: string,
  role: UniverseAssetBankRole,
  index: number,
): string | null {
  const codexUniverse = UNIVERSE_ID_MAP[universeId];
  if (!codexUniverse) return null;
  const entry = UNIVERSE_ASSET_BANK.find(
    a => a.universe === codexUniverse && a.role === role && a.index === index,
  );
  return entry ? entry.file : null;
}
