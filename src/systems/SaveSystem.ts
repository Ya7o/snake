import { MAP_NODES } from '../config/mapNodes';
import { LEVELS } from '../config/levels';
import { DEV_UNLOCK_ALL } from '../config/constants';

const SAVE_KEY = 'snakeDriveV4_save';

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
    if (DEV_UNLOCK_ALL) {
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
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(sanitizeSave(data)));
    } catch {
      console.warn('[Save] localStorage unavailable');
    }
  },

  markCleared(levelId: string, nextNodeId?: string): void {
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
