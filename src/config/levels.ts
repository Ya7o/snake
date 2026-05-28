import { LevelConfig } from './types';

// speedMs aligned with V3 (122–150ms) for matching responsiveness feel
export const LEVELS: LevelConfig[] = [
  // Castle
  { id: 'castle_normal', universeId: 'castle', type: 'normal', name: "Jardin d’Illusion",    mechanic: 'castleIllusion',    quota: 10, speedMs: 175, ruleText: 'NIVEAU 1',                 introHint: "Collecte 10 éclats. Les murs brillent avant d’apparaître.", mapNodeId: 'node_1' },
  { id: 'castle_boss',   universeId: 'castle', type: 'boss',   name: 'La Sorcière au Miroir', mechanic: 'witchMirror',      bossHp: 3, speedMs: 180, ruleText: 'BOSS',                     introHint: "Évite les reflets maudits. Frappe l’éclat lumineux quand il apparaît.", mapNodeId: 'node_2' },
  // Sonic
  { id: 'sonic_normal',  universeId: 'sonic',  type: 'normal', name: 'Zone des Anneaux',     mechanic: 'ringChains',        quota: 15, speedMs: 135, ruleText: 'EN CHAÎNE',                introHint: 'Ramasse les anneaux en ordre. Ne casse pas la chaîne.', mapNodeId: 'node_3' },
  { id: 'sonic_boss',    universeId: 'sonic',  type: 'boss',   name: 'Serpent en Boucle',    mechanic: 'loopSerpent',       bossHp: 3, speedMs: 145, ruleText: 'COUPE LA BOUCLE',           introHint: 'Anticipe ses virages et coupe sa trajectoire.', mapNodeId: 'node_4' },
  // Streets
  { id: 'streets_normal',universeId: 'streets',type: 'normal', name: 'Bagarre en Ruelle',    mechanic: 'crowdBlockers',     quota: 10, speedMs: 155, ruleText: 'FOULE MOBILE',              introHint: 'Attends un couloir libre, puis fonce.', mapNodeId: 'node_5' },
  { id: 'streets_boss',  universeId: 'streets',type: 'boss',   name: 'Seigneur du Crime',    mechanic: 'crimeLord',         bossHp: 3, speedMs: 165, ruleText: 'ÉTAU',                      introHint: "Reste mobile, évite l’étau, puis frappe l’ouverture.", mapNodeId: 'node_6' },
  // Fighter
  { id: 'fighter_normal',universeId: 'fighter',type: 'normal', name: 'Dojo des Guerriers',   mechanic: 'chargeMove',        quota: 8,  speedMs: 165, ruleText: 'CHARGE',                    introHint: 'Garde le cap. Frappe quand CHARGE clignote.', mapNodeId: 'node_7' },
  { id: 'fighter_boss',  universeId: 'fighter',type: 'boss',   name: 'Ultime Challenger',    mechanic: 'finalChallenger',   bossHp: 3, speedMs: 175, ruleText: '3 MANCHES',                 introHint: 'Touche proprement. Évite le contre.', mapNodeId: 'node_8' },
  // OutRun
  { id: 'outrun_normal', universeId: 'outrun', type: 'normal', name: 'Autoroute du Soleil',  mechanic: 'laneDrift',         quota: 10, speedMs: 130, ruleText: 'BALISES',                   introHint: 'Change de voie et passe chaque balise.', mapNodeId: 'node_9' },
  { id: 'outrun_boss',   universeId: 'outrun', type: 'boss',   name: 'Rival Turbo',          mechanic: 'turboRival',        bossHp: 3, speedMs: 140, ruleText: 'DÉPASSEMENT',               introHint: 'Choisis la bonne ligne et dépasse au bon moment.', mapNodeId: 'node_10' },
  // Shinobi
  { id: 'shinobi_normal',universeId: 'shinobi',type: 'normal', name: 'Temple des Neiges',    mechanic: 'focusMode',         quota: 8,  speedMs: 160, ruleText: 'VRAIE CIBLE',               introHint: 'Repère la vraie cible. Ignore les leurres.', mapNodeId: 'node_11' },
  { id: 'shinobi_boss',  universeId: 'shinobi',type: 'boss',   name: "Ninja de l’Ombre",     mechanic: 'shadowNinja',       bossHp: 3, speedMs: 160, ruleText: 'VRAIE OMBRE',               introHint: "Suis l’ombre qui bouge. Ignore les fausses.", mapNodeId: 'node_12' },
  // Kombat
  { id: 'kombat_normal', universeId: 'kombat', type: 'normal', name: 'Arène des Enfers',     mechanic: 'fatalZones',        quota: 10, speedMs: 160, ruleText: 'ZONES FATALES',             introHint: "Les zones s’allument avant de frapper. Sors vite.", mapNodeId: 'node_13' },
  { id: 'kombat_boss',   universeId: 'kombat', type: 'boss',   name: 'Porte du Dragon',      mechanic: 'dragonGate',        bossHp: 3, speedMs: 170, ruleText: "FENÊTRE D’ATTAQUE",  introHint: "Attends l’ouverture. Frappe vite.", mapNodeId: 'node_14' },
  // Paperboy
  { id: 'paperboy_normal',universeId:'paperboy',type: 'normal', name: 'Tournée du Matin',    mechanic: 'deliveryTargets',   quota: 8,  speedMs: 155, ruleText: 'LIVRAISON',                 introHint: 'Livre les bonnes maisons sans te crasher.', mapNodeId: 'node_15' },
  { id: 'paperboy_boss', universeId: 'paperboy',type: 'boss',  name: 'Chaos du Quartier',    mechanic: 'neighborhoodChaos', bossHp: 3, speedMs: 155, ruleText: 'SURVIE',                    introHint: "Les pièges s’enchaînent. Survis avant de livrer.", mapNodeId: 'node_16' },
];

export function getLevelById(id: string): LevelConfig | undefined {
  return LEVELS.find(l => l.id === id);
}

/** Resolve a levelId from scene init data, falling back to 'castle_normal'. */
export function resolveLevelId(data: { levelId?: string } | undefined): string {
  return data?.levelId ?? 'castle_normal';
}
