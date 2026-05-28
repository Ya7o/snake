import { MapNodeConfig } from './types';

// Node positions calibrated to yellow circles detected in
// public/assets/ui/worldmap/world_map_minimap_16_9.png (1672x941).
// Values are normalized 0..1 relative to the full source image.
export const MAP_NODES: MapNodeConfig[] = [
  // Castle of Illusion
  { id: 'node_1',  levelId: 'castle_normal',   x: 0.1888, y: 0.3743, label: '1' },
  { id: 'node_2',  levelId: 'castle_boss',      x: 0.2166, y: 0.3746, label: '2★' },
  // Sonic 2
  { id: 'node_3',  levelId: 'sonic_normal',     x: 0.4741, y: 0.3637, label: '3' },
  { id: 'node_4',  levelId: 'sonic_boss',       x: 0.5014, y: 0.3635, label: '4★' },
  // Streets of Rage
  { id: 'node_5',  levelId: 'streets_normal',   x: 0.6701, y: 0.3764, label: '5' },
  { id: 'node_6',  levelId: 'streets_boss',     x: 0.6980, y: 0.3762, label: '6★' },
  // Street Fighter
  { id: 'node_7',  levelId: 'fighter_normal',   x: 0.8522, y: 0.4313, label: '7' },
  { id: 'node_8',  levelId: 'fighter_boss',     x: 0.8805, y: 0.4322, label: '8★' },
  // OutRun
  { id: 'node_9',  levelId: 'outrun_normal',    x: 0.4892, y: 0.6016, label: '9' },
  { id: 'node_10', levelId: 'outrun_boss',      x: 0.5165, y: 0.6018, label: '10★' },
  // Shinobi
  { id: 'node_11', levelId: 'shinobi_normal',   x: 0.2035, y: 0.5802, label: '11' },
  { id: 'node_12', levelId: 'shinobi_boss',     x: 0.2256, y: 0.5834, label: '12★' },
  // Mortal Kombat
  { id: 'node_13', levelId: 'kombat_normal',    x: 0.2308, y: 0.8426, label: '13' },
  { id: 'node_14', levelId: 'kombat_boss',      x: 0.2591, y: 0.8430, label: '14★' },
  // Paperboy
  { id: 'node_15', levelId: 'paperboy_normal',  x: 0.7120, y: 0.8422, label: '15' },
  { id: 'node_16', levelId: 'paperboy_boss',    x: 0.7401, y: 0.8424, label: '16★' },
];
