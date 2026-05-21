export interface UniverseDesignAssets {
  boardSource: string;
  assetBase: string;
  confidence: string;
  fallback: boolean;
  fallbacks: string[];
  assets: Record<string, string | null>;
  assetTypes: Record<string, string>;
  palette: {
    bg: string;
    primary: string;
    accent: string;
    secondary: string;
    highlight: string;
  };
}

interface DesignBoardManifest {
  version: number;
  generatedAt: string;
  universes: Record<string, UniverseDesignAssets>;
}

class DesignBoardManagerSingleton {
  private manifest: DesignBoardManifest | null = null;
  private loadPromise: Promise<void> | null = null;

  async load(): Promise<void> {
    if (this.manifest) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = fetch('assets/design-board-manifest.json')
      .then(r => {
        if (!r.ok) throw new Error(`manifest HTTP ${r.status}`);
        return r.json() as Promise<DesignBoardManifest>;
      })
      .then(data => { this.manifest = data; })
      .catch(err => {
        console.warn('[DesignBoardManager] manifest non chargé:', err);
        this.manifest = { version: 0, generatedAt: '', universes: {} };
      });

    return this.loadPromise;
  }

  isLoaded(): boolean { return this.manifest !== null; }

  getUniverseAssets(universeId: string): UniverseDesignAssets | undefined {
    return this.manifest?.universes[universeId];
  }

  hasRealAsset(universeId: string, key: string): boolean {
    const u = this.manifest?.universes[universeId];
    if (!u) return false;
    return !!u.assets[key] && !u.fallbacks.includes(key);
  }

  getAssetPath(universeId: string, key: string): string | null {
    const u = this.manifest?.universes[universeId];
    if (!u) { console.warn(`[DesignBoardManager] univers inconnu: ${universeId}`); return null; }
    const path = u.assets[key] ?? null;
    if (!path) console.warn(`[DesignBoardManager] asset manquant: ${universeId}.${key} → fallback`);
    return path;
  }

  /** Clé Phaser pour préchargement : "<universeId>_<key>" */
  assetKey(universeId: string, key: string): string {
    return `db_${universeId}_${key}`;
  }

  /** Retourne toutes les paires [key, path] chargeables pour un univers */
  getLoadableAssets(universeId: string): Array<{ key: string; path: string }> {
    const u = this.manifest?.universes[universeId];
    if (!u) return [];
    return Object.entries(u.assets)
      .filter(([, path]) => path !== null)
      .map(([key, path]) => ({ key: this.assetKey(universeId, key), path: path! }));
  }

  getAllUniverseIds(): string[] {
    return Object.keys(this.manifest?.universes ?? {});
  }

  /**
   * 928 — Returns the path for a developer-extracted asset only if it passed
   * the quality gate (status === 'clean' in the extraction report).
   * `extractionReport` is the parsed JSON from
   * `public/assets/generated/_audit/design-board-extraction-report.json`.
   * Returns null for any non-clean or missing entry.
   */
  getDeveloperExtractedPath(
    universeId: string,
    key: string,
    extractionReport: Record<string, { zones?: Record<string, { status?: string }> }>,
  ): string | null {
    const status = extractionReport?.[universeId]?.zones?.[key]?.status;
    if (status !== 'clean') return null;
    return `assets/generated/${universeId}/clean/${key}.png`;
  }

  /** 908 — runtime diagnostic string for QA/debug */
  getDiagnostics(universeId: string): string {
    if (!this.manifest) return `[DesignBoardManager] manifest non chargé`;
    const u = this.manifest.universes[universeId];
    if (!u) return `[DesignBoardManager] univers inconnu: ${universeId}`;
    const assetCount = Object.values(u.assets).filter(Boolean).length;
    const fallbackCount = u.fallbacks.length;
    return [
      `board: ${u.boardSource}`,
      `confidence: ${u.confidence}`,
      `fallback: ${u.fallback}`,
      `assets: ${assetCount} total, ${fallbackCount} fallback`,
      `fallback keys: ${u.fallbacks.join(', ') || 'aucun'}`,
    ].join(' | ');
  }
}

export const DesignBoardManager = new DesignBoardManagerSingleton();
