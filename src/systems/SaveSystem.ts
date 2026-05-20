const SAVE_KEY = 'snakeDriveV4_save';

export interface SaveData {
  clearedLevels: string[];   // level IDs that have been cleared
  unlockedNodes: string[];   // map node IDs unlocked
}

function defaultSave(): SaveData {
  return {
    clearedLevels: [],
    unlockedNodes: [
      'node_1','node_2','node_3','node_4',
      'node_5','node_6','node_7','node_8',
      'node_9','node_10','node_11','node_12',
      'node_13','node_14','node_15','node_16',
    ],
  };
}

export const SaveSystem = {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultSave();
      const data = JSON.parse(raw) as SaveData;
      // Always ensure all nodes are unlocked
      const def = defaultSave();
      for (const n of def.unlockedNodes) {
        if (!data.unlockedNodes.includes(n)) data.unlockedNodes.push(n);
      }
      return data;
    } catch {
      return defaultSave();
    }
  },

  save(data: SaveData): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
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
