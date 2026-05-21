import { LevelConfig } from './types';

// speedMs aligned with V3 (122–150ms) for matching responsiveness feel
export const LEVELS: LevelConfig[] = [
  // Castle
  { id: 'castle_normal', universeId: 'castle', type: 'normal', name: 'Jardin Enchanté',     mechanic: 'castleIllusion',    quota: 10, speedMs: 165, ruleText: 'MURS CLIGNOTANTS = DANGER', introHint: 'Les murs apparaissent par pulsations : avance quand la voie est claire.', mapNodeId: 'node_1' },
  { id: 'castle_boss',   universeId: 'castle', type: 'boss',   name: 'Miroir Sorcière',      mechanic: 'witchMirror',       bossHp: 3, speedMs: 175, ruleText: 'TOUCHE LE VRAI MIROIR',     introHint: 'Les reflets mentent : vise le miroir qui reste stable.', mapNodeId: 'node_2' },
  // Sonic
  { id: 'sonic_normal',  universeId: 'sonic',  type: 'normal', name: 'Zone des Anneaux',     mechanic: 'ringChains',        quota: 15, speedMs: 135, ruleText: 'ENCHAÎNE LES ANNEAUX',      introHint: "Ramasse les anneaux dans l'ordre : garde le rythme pour conserver la chaîne.", mapNodeId: 'node_3' },
  { id: 'sonic_boss',    universeId: 'sonic',  type: 'boss',   name: 'Serpent en Boucle',    mechanic: 'loopSerpent',       bossHp: 3, speedMs: 145, ruleText: 'ATTRAPE LA BOUCLE',         introHint: 'Anticipe les virages du serpent et coupe sa trajectoire au bon moment.', mapNodeId: 'node_4' },
  // Streets
  { id: 'streets_normal',universeId: 'streets',type: 'normal', name: 'Bagarre en Ruelle',    mechanic: 'crowdBlockers',     quota: 10, speedMs: 155, ruleText: 'LA FOULE BOUGE',            introHint: 'Les passants bloquent la route : lis leurs déplacements avant de foncer.', mapNodeId: 'node_5' },
  { id: 'streets_boss',  universeId: 'streets',type: 'boss',   name: 'Seigneur du Crime',    mechanic: 'crimeLord',         bossHp: 3, speedMs: 165, ruleText: 'ÉVITE LA PRESSION',         introHint: "Reste mobile, évite l'étau, puis frappe quand une ouverture apparaît.", mapNodeId: 'node_6' },
  // Fighter
  { id: 'fighter_normal',universeId: 'fighter',type: 'normal', name: 'Dojo des Guerriers',   mechanic: 'chargeMove',        quota: 8,  speedMs: 165, ruleText: 'CHARGE PUIS FRAPPE',        introHint: "Prépare ta charge, puis récupère la cible quand l'élan est prêt.", mapNodeId: 'node_7' },
  { id: 'fighter_boss',  universeId: 'fighter',type: 'boss',   name: 'Challenger Final',     mechanic: 'finalChallenger',   bossHp: 3, speedMs: 175, ruleText: 'GAGNE 3 MANCHES',           introHint: "Chaque manche demande une touche propre : ne force pas l'échange.", mapNodeId: 'node_8' },
  // OutRun
  { id: 'outrun_normal', universeId: 'outrun', type: 'normal', name: 'Autoroute du Soleil',  mechanic: 'laneDrift',         quota: 10, speedMs: 130, ruleText: 'PASSE LES BALISES',         introHint: "Change de voie avec douceur et garde l'axe pour atteindre les balises.", mapNodeId: 'node_9' },
  { id: 'outrun_boss',   universeId: 'outrun', type: 'boss',   name: 'Rival Turbo',          mechanic: 'turboRival',        bossHp: 3, speedMs: 140, ruleText: 'DOUBLE LE RIVAL',           introHint: 'Choisis la bonne ligne et dépasse quand le rival laisse un passage.', mapNodeId: 'node_10' },
  // Shinobi
  { id: 'shinobi_normal',universeId: 'shinobi',type: 'normal', name: 'Dojo des Neiges',      mechanic: 'focusMode',         quota: 8,  speedMs: 160, ruleText: 'VISE LA VRAIE CIBLE',       introHint: "Repère la vraie cible parmi les leurres avant de t'engager.", mapNodeId: 'node_11' },
  { id: 'shinobi_boss',  universeId: 'shinobi',type: 'boss',   name: "Ninja de l'Ombre",     mechanic: 'shadowNinja',       bossHp: 3, speedMs: 160, ruleText: 'FRAPPE LA VRAIE OMBRE',     introHint: "Les clones se dispersent : suis l'ombre qui trahit son mouvement.", mapNodeId: 'node_12' },
  // Kombat
  { id: 'kombat_normal', universeId: 'kombat', type: 'normal', name: 'Arène des Enfers',     mechanic: 'fatalZones',        quota: 10, speedMs: 160, ruleText: 'ZONES FATALES',             introHint: 'Les zones mortelles préviennent avant de frapper : sors du danger.', mapNodeId: 'node_13' },
  { id: 'kombat_boss',   universeId: 'kombat', type: 'boss',   name: 'Porte du Dragon',      mechanic: 'dragonGate',        bossHp: 3, speedMs: 170, ruleText: 'FENÊTRE DE FRAPPE',         introHint: "Attends l'ouverture, puis touche la porte avant qu'elle se referme.", mapNodeId: 'node_14' },
  // Paperboy
  { id: 'paperboy_normal',universeId:'paperboy',type: 'normal', name: 'Tournée du Matin',    mechanic: 'deliveryTargets',   quota: 8,  speedMs: 155, ruleText: 'LIVRE LES JOURNAUX',        introHint: 'Livre les bonnes maisons et garde une trajectoire propre dans le chaos.', mapNodeId: 'node_15' },
  { id: 'paperboy_boss', universeId: 'paperboy',type: 'boss',  name: 'Chaos du Quartier',    mechanic: 'neighborhoodChaos', bossHp: 3, speedMs: 155, ruleText: 'SURVIS À LA TOURNÉE',        introHint: "Les pièges s'enchaînent : privilégie la survie avant la livraison.", mapNodeId: 'node_16' },
];

export function getLevelById(id: string): LevelConfig | undefined {
  return LEVELS.find(l => l.id === id);
}
