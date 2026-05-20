import { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
  // Castle
  { id: 'castle_normal', universeId: 'castle', type: 'normal', name: 'Enchanted Garden', mechanic: 'castleIllusion', quota: 10, speedMs: 220, ruleText: 'BLINK WALLS = DANGER', mapNodeId: 'node_1' },
  { id: 'castle_boss',   universeId: 'castle', type: 'boss',   name: 'Witch Mirror',     mechanic: 'witchMirror',   bossHp: 3,  speedMs: 240, ruleText: 'HIT TRUE MIRROR',  mapNodeId: 'node_2' },
  // Sonic
  { id: 'sonic_normal',  universeId: 'sonic',  type: 'normal', name: 'Ring Rush Zone',   mechanic: 'ringChains',    quota: 15, speedMs: 180, ruleText: 'CHAIN RINGS',       mapNodeId: 'node_3' },
  { id: 'sonic_boss',    universeId: 'sonic',  type: 'boss',   name: 'Loop Serpent',     mechanic: 'loopSerpent',   bossHp: 3,  speedMs: 200, ruleText: 'CATCH THE LOOP',   mapNodeId: 'node_4' },
  // Streets
  { id: 'streets_normal',universeId: 'streets',type: 'normal', name: 'Back Alley Brawl',mechanic: 'crowdBlockers', quota: 10, speedMs: 210, ruleText: 'CROWDS MOVE',       mapNodeId: 'node_5' },
  { id: 'streets_boss',  universeId: 'streets',type: 'boss',   name: 'Crime Lord',       mechanic: 'crimeLord',     bossHp: 3,  speedMs: 230, ruleText: 'AVOID PRESSURE',  mapNodeId: 'node_6' },
  // Fighter
  { id: 'fighter_normal',universeId: 'fighter',type: 'normal', name: 'World Warrior Dojo',mechanic: 'chargeMove',  quota: 8,  speedMs: 230, ruleText: 'CHARGE THEN STRIKE',mapNodeId: 'node_7' },
  { id: 'fighter_boss',  universeId: 'fighter',type: 'boss',   name: 'Final Challenger', mechanic: 'finalChallenger',bossHp: 3, speedMs: 250, ruleText: 'WIN 3 ROUNDS',    mapNodeId: 'node_8' },
  // OutRun
  { id: 'outrun_normal', universeId: 'outrun', type: 'normal', name: 'Sunset Highway',   mechanic: 'laneDrift',     quota: 10, speedMs: 170, ruleText: 'HIT CHECKPOINTS',  mapNodeId: 'node_9' },
  { id: 'outrun_boss',   universeId: 'outrun', type: 'boss',   name: 'Turbo Rival',      mechanic: 'turboRival',    bossHp: 3,  speedMs: 190, ruleText: 'OVERTAKE',        mapNodeId: 'node_10' },
  // Shinobi
  { id: 'shinobi_normal',universeId: 'shinobi',type: 'normal', name: 'Snow Dojo',        mechanic: 'focusMode',     quota: 8,  speedMs: 220, ruleText: 'FOCUS TARGET',     mapNodeId: 'node_11' },
  { id: 'shinobi_boss',  universeId: 'shinobi',type: 'boss',   name: 'Shadow Ninja',     mechanic: 'shadowNinja',   bossHp: 3,  speedMs: 220, ruleText: 'HIT REAL SHADOW', mapNodeId: 'node_12' },
  // Kombat
  { id: 'kombat_normal', universeId: 'kombat', type: 'normal', name: 'Nether Arena',     mechanic: 'fatalZones',    quota: 10, speedMs: 220, ruleText: 'FATAL ZONES',      mapNodeId: 'node_13' },
  { id: 'kombat_boss',   universeId: 'kombat', type: 'boss',   name: 'Dragon Gate',      mechanic: 'dragonGate',    bossHp: 3,  speedMs: 240, ruleText: 'FINISH WINDOW',   mapNodeId: 'node_14' },
  // Paperboy
  { id: 'paperboy_normal',universeId: 'paperboy',type: 'normal',name: 'Morning Route',   mechanic: 'deliveryTargets',quota: 8, speedMs: 210, ruleText: 'DELIVER PAPERS',   mapNodeId: 'node_15' },
  { id: 'paperboy_boss', universeId: 'paperboy',type: 'boss',  name: 'Neighborhood Chaos',mechanic: 'neighborhoodChaos',bossHp: 3,speedMs: 210, ruleText: 'SURVIVE ROUTE', mapNodeId: 'node_16' },
];

export function getLevelById(id: string): LevelConfig | undefined {
  return LEVELS.find(l => l.id === id);
}
