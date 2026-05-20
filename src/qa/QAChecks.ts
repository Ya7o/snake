import { LEVELS } from '../config/levels';
import { MAP_NODES } from '../config/mapNodes';
import { UNIVERSES, UNIVERSE_ORDER } from '../config/universes';
import { createMechanic } from '../mechanics/MechanicFactory';

export interface QAResult {
  pass: boolean;
  checks: { name: string; pass: boolean; detail: string }[];
}

const EXPECTED_MECHANICS: Record<string, string> = {
  castle:   'castleNormal',
  sonic:    'sonicNormal',
  streets:  'streetsNormal',
  fighter:  'fighterNormal',
  outrun:   'outrunNormal',
  shinobi:  'shinobiNormal',
  kombat:   'kombatNormal',
  paperboy: 'paperboyNormal',
};

export function runQAChecks(): QAResult {
  const checks: { name: string; pass: boolean; detail: string }[] = [];

  // 1. 16 levels defined
  checks.push({
    name: '16 levels defined',
    pass: LEVELS.length === 16,
    detail: `Found ${LEVELS.length} levels`
  });

  // 2. 16 map nodes defined
  checks.push({
    name: '16 map nodes defined',
    pass: MAP_NODES.length === 16,
    detail: `Found ${MAP_NODES.length} nodes`
  });

  // 3. 8 universes defined
  checks.push({
    name: '8 universes defined',
    pass: UNIVERSE_ORDER.length === 8,
    detail: `Found ${UNIVERSE_ORDER.length} universes`
  });

  // 4. Each level references a valid universe
  const invalidUniverseRefs = LEVELS.filter(l => !UNIVERSES[l.universeId]);
  checks.push({
    name: 'All levels reference valid universe',
    pass: invalidUniverseRefs.length === 0,
    detail: invalidUniverseRefs.length ? `Bad refs: ${invalidUniverseRefs.map(l => l.id).join(', ')}` : 'OK'
  });

  // 5. Each node references a valid level
  const invalidNodeRefs = MAP_NODES.filter(n => !LEVELS.find(l => l.id === n.levelId));
  checks.push({
    name: 'All nodes reference valid level',
    pass: invalidNodeRefs.length === 0,
    detail: invalidNodeRefs.length ? `Bad nodes: ${invalidNodeRefs.map(n => n.id).join(', ')}` : 'OK'
  });

  // 6. 8 normal + 8 boss levels
  const normalLevels = LEVELS.filter(l => l.type === 'normal');
  const bossLevels = LEVELS.filter(l => l.type === 'boss');
  checks.push({
    name: '8 normal + 8 boss levels',
    pass: normalLevels.length === 8 && bossLevels.length === 8,
    detail: `Normal: ${normalLevels.length}, Boss: ${bossLevels.length}`
  });

  // 7. All mechanics instantiatable
  const mechanicIds = [...new Set(LEVELS.map(l => l.mechanic))];
  const failedMechanics: string[] = [];
  for (const id of mechanicIds) {
    try {
      createMechanic(id);
    } catch (e) {
      failedMechanics.push(id);
    }
  }
  checks.push({
    name: 'All mechanics instantiatable',
    pass: failedMechanics.length === 0,
    detail: failedMechanics.length ? `Failed: ${failedMechanics.join(', ')}` : 'OK'
  });

  // 8. No duplicate level IDs
  const levelIds = LEVELS.map(l => l.id);
  const dupIds = levelIds.filter((id, i) => levelIds.indexOf(id) !== i);
  checks.push({
    name: 'No duplicate level IDs',
    pass: dupIds.length === 0,
    detail: dupIds.length ? `Dups: ${dupIds.join(', ')}` : 'OK'
  });

  // 908 — 9. Each universe has a distinct mechanic declared (not all generic)
  const universeMechanics = UNIVERSE_ORDER.map(uid => {
    const lvl = LEVELS.find(l => l.universeId === uid && l.type === 'normal');
    return { uid, mechanic: lvl?.mechanic ?? '(none)' };
  });
  const genericFallbacks = universeMechanics.filter(um => um.mechanic === 'generic' || um.mechanic === '');
  checks.push({
    name: '908 All universes have non-generic mechanic',
    pass: genericFallbacks.length === 0,
    detail: genericFallbacks.length
      ? `Generic fallback: ${genericFallbacks.map(g => g.uid).join(', ')}`
      : 'OK'
  });

  // 908 — 10. Boss levels reference valid bossHp
  const bossNoHp = LEVELS.filter(l => l.type === 'boss' && (l.bossHp === undefined || l.bossHp <= 0));
  checks.push({
    name: '908 Boss levels have valid bossHp',
    pass: bossNoHp.length === 0,
    detail: bossNoHp.length ? `Missing bossHp: ${bossNoHp.map(l => l.id).join(', ')}` : 'OK'
  });

  // 908 — 11. Normal levels have quota defined
  const normalNoQuota = normalLevels.filter(l => !l.quota || l.quota <= 0);
  checks.push({
    name: '908 Normal levels have quota',
    pass: normalNoQuota.length === 0,
    detail: normalNoQuota.length ? `Missing quota: ${normalNoQuota.map(l => l.id).join(', ')}` : 'OK'
  });

  // 908 — 12. Each universe has exactly 1 normal + 1 boss level
  const universeBalance = UNIVERSE_ORDER.map(uid => {
    const normal = LEVELS.filter(l => l.universeId === uid && l.type === 'normal').length;
    const boss   = LEVELS.filter(l => l.universeId === uid && l.type === 'boss').length;
    return { uid, normal, boss, ok: normal === 1 && boss === 1 };
  });
  const unbalanced = universeBalance.filter(u => !u.ok);
  checks.push({
    name: '908 Universe balance (1 normal + 1 boss each)',
    pass: unbalanced.length === 0,
    detail: unbalanced.length
      ? unbalanced.map(u => `${u.uid}:${u.normal}N/${u.boss}B`).join(', ')
      : 'OK'
  });

  const allPass = checks.every(c => c.pass);
  if (typeof console !== 'undefined') {
    console.group('[QA] Snake Drive V4 Self-Check');
    for (const c of checks) {
      console.log(`${c.pass ? '✓' : '✗'} ${c.name}: ${c.detail}`);
    }
    console.log(allPass ? '✅ All checks passed' : '❌ Some checks failed');
    console.groupEnd();
  }

  return { pass: allPass, checks };
}
