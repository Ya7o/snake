import { MapNodeConfig } from './types';

// 16 nodes laid out in a snake-path pattern across the world map
// Coordinates are normalized 0..1 relative to map area
export const MAP_NODES: MapNodeConfig[] = [
  { id: 'node_1',  levelId: 'castle_normal',   x: 0.12, y: 0.10, label: '1' },
  { id: 'node_2',  levelId: 'castle_boss',     x: 0.28, y: 0.10, label: '2★' },
  { id: 'node_3',  levelId: 'sonic_normal',    x: 0.50, y: 0.10, label: '3' },
  { id: 'node_4',  levelId: 'sonic_boss',      x: 0.72, y: 0.10, label: '4★' },
  { id: 'node_5',  levelId: 'streets_normal',  x: 0.88, y: 0.22, label: '5' },
  { id: 'node_6',  levelId: 'streets_boss',    x: 0.88, y: 0.36, label: '6★' },
  { id: 'node_7',  levelId: 'fighter_normal',  x: 0.72, y: 0.48, label: '7' },
  { id: 'node_8',  levelId: 'fighter_boss',    x: 0.50, y: 0.48, label: '8★' },
  { id: 'node_9',  levelId: 'outrun_normal',   x: 0.28, y: 0.48, label: '9' },
  { id: 'node_10', levelId: 'outrun_boss',     x: 0.12, y: 0.60, label: '10★' },
  { id: 'node_11', levelId: 'shinobi_normal',  x: 0.28, y: 0.72, label: '11' },
  { id: 'node_12', levelId: 'shinobi_boss',    x: 0.50, y: 0.72, label: '12★' },
  { id: 'node_13', levelId: 'kombat_normal',   x: 0.72, y: 0.72, label: '13' },
  { id: 'node_14', levelId: 'kombat_boss',     x: 0.88, y: 0.84, label: '14★' },
  { id: 'node_15', levelId: 'paperboy_normal', x: 0.50, y: 0.90, label: '15' },
  { id: 'node_16', levelId: 'paperboy_boss',   x: 0.28, y: 0.90, label: '16★' },
];
