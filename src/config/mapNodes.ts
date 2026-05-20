import { MapNodeConfig } from './types';

// Node positions calibrated to the visible yellow level circles and boss stars
// on public/assets/map/world_map.png (1448x1086). Values are normalized 0..1
// relative to the full source image, not the current viewport crop.
export const MAP_NODES: MapNodeConfig[] = [
  // Castle of Illusion
  { id: 'node_1',  levelId: 'castle_normal',     x: 0.2528, y: 0.3131, label: '1' },
  { id: 'node_2',  levelId: 'castle_boss',       x: 0.2949, y: 0.3122, label: '2★' },
  // Sonic 2
  { id: 'node_3',  levelId: 'sonic_normal',      x: 0.5014, y: 0.2716, label: '3' },
  { id: 'node_4',  levelId: 'sonic_boss',        x: 0.5477, y: 0.2716, label: '4★' },
  // Streets of Rage
  { id: 'node_5',  levelId: 'streets_normal',    x: 0.7661, y: 0.3343, label: '5' },
  { id: 'node_6',  levelId: 'streets_boss',      x: 0.8128, y: 0.3343, label: '6★' },
  // Street Fighter
  { id: 'node_7',  levelId: 'fighter_normal',    x: 0.7790, y: 0.5792, label: '7' },
  { id: 'node_8',  levelId: 'fighter_boss',      x: 0.8198, y: 0.5792, label: '8★' },
  // OutRun
  { id: 'node_9',  levelId: 'outrun_normal',     x: 0.4855, y: 0.5663, label: '9' },
  { id: 'node_10', levelId: 'outrun_boss',       x: 0.5289, y: 0.5663, label: '10★' },
  // Shinobi
  { id: 'node_11', levelId: 'shinobi_normal',    x: 0.2213, y: 0.5387, label: '11' },
  { id: 'node_12', levelId: 'shinobi_boss',      x: 0.2604, y: 0.5387, label: '12★' },
  // Mortal Kombat
  { id: 'node_13', levelId: 'kombat_normal',     x: 0.1428, y: 0.8149, label: '13' },
  { id: 'node_14', levelId: 'kombat_boss',       x: 0.1851, y: 0.8168, label: '14★' },
  // Paperboy has a boss star on the map; the normal selector sits on the
  // Paperboy nameplate because the source art has no separate yellow circle.
  { id: 'node_15', levelId: 'paperboy_normal',   x: 0.4965, y: 0.8094, label: '15' },
  { id: 'node_16', levelId: 'paperboy_boss',     x: 0.5539, y: 0.8094, label: '16★' },
];
