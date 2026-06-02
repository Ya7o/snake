export type UniverseId = 'castle' | 'sonic' | 'streets' | 'fighter' | 'outrun' | 'shinobi' | 'kombat' | 'paperboy';
export type LevelType = 'normal' | 'boss';

export interface SnakeSkinData {
  id: string;
  headSprite: string;
  bodySprite: string;
  tailSprite: string;
}

export interface UniverseConfig {
  id: UniverseId;
  name: string;
  shortName: string;
  assetFolder: string;
  mechanicNormal: string;
  mechanicBoss: string;
  snakeSkinId?: string;
  palette: {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface LevelConfig {
  id: string;
  universeId: UniverseId;
  type: LevelType;
  name: string;
  mechanic: string;
  quota?: number;
  bossHp?: number;
  speedMs: number;
  ruleText: string;
  introHint: string;
  mapNodeId: string;
}

export interface MapNodeConfig {
  id: string;
  levelId: string;
  x: number;
  y: number;
  label: string;
  /** Draw a yellow circle on the map (for nodes the source art doesn't include one) */
  drawCircle?: boolean;
}
