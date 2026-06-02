import { UniverseConfig } from './types';
import { UNIVERSE_DISPLAY_NAMES } from './constants';

export const UNIVERSES: Record<string, UniverseConfig> = {
  castle: {
    id: 'castle',
    name: UNIVERSE_DISPLAY_NAMES.castle,
    shortName: 'CASTLE',
    assetFolder: 'castle',
    mechanicNormal: 'castleIllusion',
    mechanicBoss: 'witchMirror',
    palette: { bg: '#0d0820', primary: '#9b59b6', secondary: '#8e44ad', accent: '#f1c40f' }
  },
  sonic: {
    id: 'sonic',
    name: UNIVERSE_DISPLAY_NAMES.sonic,
    shortName: 'SONIC',
    assetFolder: 'sonic',
    mechanicNormal: 'ringChains',
    mechanicBoss: 'loopSerpent',
    snakeSkinId: 'snake_u01_sonic',
    palette: { bg: '#001033', primary: '#2980b9', secondary: '#3498db', accent: '#f9ca24' }
  },
  streets: {
    id: 'streets',
    name: UNIVERSE_DISPLAY_NAMES.streets,
    shortName: 'STREETS',
    assetFolder: 'streets',
    mechanicNormal: 'crowdBlockers',
    mechanicBoss: 'crimeLord',
    palette: { bg: '#1a0a00', primary: '#e67e22', secondary: '#d35400', accent: '#ecf0f1' }
  },
  fighter: {
    id: 'fighter',
    name: UNIVERSE_DISPLAY_NAMES.fighter,
    shortName: 'FIGHTER',
    assetFolder: 'fighter',
    mechanicNormal: 'chargeMove',
    mechanicBoss: 'finalChallenger',
    palette: { bg: '#0a0010', primary: '#e74c3c', secondary: '#c0392b', accent: '#f39c12' }
  },
  outrun: {
    id: 'outrun',
    name: UNIVERSE_DISPLAY_NAMES.outrun,
    shortName: 'OUTRUN',
    assetFolder: 'outrun',
    mechanicNormal: 'laneDrift',
    mechanicBoss: 'turboRival',
    palette: { bg: '#0a001a', primary: '#ff6b9d', secondary: '#c44569', accent: '#ffd32a' }
  },
  shinobi: {
    id: 'shinobi',
    name: UNIVERSE_DISPLAY_NAMES.shinobi,
    shortName: 'SHINOBI',
    assetFolder: 'shinobi',
    mechanicNormal: 'focusMode',
    mechanicBoss: 'shadowNinja',
    palette: { bg: '#001a2a', primary: '#00b4d8', secondary: '#0077b6', accent: '#ffffff' }
  },
  kombat: {
    id: 'kombat',
    name: UNIVERSE_DISPLAY_NAMES.kombat,
    shortName: 'KOMBAT',
    assetFolder: 'kombat',
    mechanicNormal: 'fatalZones',
    mechanicBoss: 'dragonGate',
    palette: { bg: '#1a0000', primary: '#e74c3c', secondary: '#922b21', accent: '#f39c12' }
  },
  paperboy: {
    id: 'paperboy',
    name: UNIVERSE_DISPLAY_NAMES.paperboy,
    shortName: 'PAPER',
    assetFolder: 'paperboy',
    mechanicNormal: 'deliveryTargets',
    mechanicBoss: 'neighborhoodChaos',
    palette: { bg: '#0a1a00', primary: '#27ae60', secondary: '#1e8449', accent: '#f1c40f' }
  }
};

export const UNIVERSE_ORDER: string[] = [
  'castle', 'sonic', 'streets', 'fighter', 'outrun', 'shinobi', 'kombat', 'paperboy'
];
