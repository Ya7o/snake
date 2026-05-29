import { MAP_NODES } from '../config/mapNodes';
import { LEVELS } from '../config/levels';

const SAVE_KEY = 'snakeDriveV4_save';

// Session-only URL flags — never persisted to localStorage.
// ?unlockAll=1 or ?debugUnlockAll=1 : unlocks everything for the current session.
// ?resetProgress=1 : clears saved progress on page load (then plays normally).
const _p = new URLSearchParams(window.location.search);
const SESSION_UNLOCK_ALL = _p.get('unlockAll') === '1' || _p.get('debugUnlockAll') === '1';
if (_p.get('resetProgress') === '1') {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* noop */ }
}

export interface SaveData {
  clearedLevels: string[];   // level IDs that have been cleared
  unlockedNodes: string[];   // map node IDs unlocked
}

function firstNodeId(): string {
  return MAP_NODES[0]?.id ?? 'node_1';
}

function defaultSave(): SaveData {
  return {
    clearedLevels: [],
    unlockedNodes: [firstNodeId()],
  };
}

function sanitizeSave(value: unknown): SaveData {
  if (!value || typeof value !== 'object') return defaultSave();

  const raw = value as Partial<SaveData>;
  const validLevelIds = new Set(LEVELS.map(level => level.id));
  const validNodeIds = new Set(MAP_NODES.map(node => node.id));

  const clearedLevels = Array.isArray(raw.clearedLevels)
    ? raw.clearedLevels.filter((id): id is string => typeof id === 'string' && validLevelIds.has(id))
    : [];

  const unlockedNodes = Array.isArray(raw.unlockedNodes)
    ? raw.unlockedNodes.filter((id): id is string => typeof id === 'string' && validNodeIds.has(id))
    : [];

  if (unlockedNodes.length === 0) unlockedNodes.push(firstNodeId());

  return {
    clearedLevels: [...new Set(clearedLevels)],
    unlockedNodes: [...new Set(unlockedNodes)],
  };
}

export const SaveSystem = {
  load(): SaveData {
    if (SESSION_UNLOCK_ALL) {
      return {
        clearedLevels: LEVELS.map(l => l.id),
        unlockedNodes: MAP_NODES.map(n => n.id),
      };
    }
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultSave();
      return sanitizeSave(JSON.parse(raw));
    } catch {
      return defaultSave();
    }
  },

  save(data: SaveData): void {
    if (SESSION_UNLOCK_ALL) return; // don't overwrite real progress with session state
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(sanitizeSave(data)));
    } catch {
      console.warn('[Save] localStorage unavailable');
    }
  },

  markCleared(levelId: string, nextNodeId?: string): void {
    if (SESSION_UNLOCK_ALL) return; // already all-unlocked, nothing to persist
    const data = this.load();
    if (!data.clearedLevels.includes(levelId)) {
      data.clearedLevels.push(levelId);
    }
    if (nextNodeId && !data.unlockedNodes.includes(nextNodeId)) {
      data.unlockedNodes.push(nextNodeId);
    }
    this.save(data);
  },

  isCleared(levelId: string): boolean {
    return this.load().clearedLevels.includes(levelId);
  },

  isUnlocked(nodeId: string): boolean {
    const data = this.load();
    return data.unlockedNodes.includes(nodeId);
  },

  reset(): void {
    this.save(defaultSave());
  }
};
