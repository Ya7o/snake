import { LEVELS } from '../config/levels';
import { MAP_NODES } from '../config/mapNodes';
import { UNIVERSES, UNIVERSE_ORDER } from '../config/universes';
import { createMechanic } from '../mechanics/MechanicFactory';

export interface QAResult {
  pass: boolean;
  checks: { name: string; pass: boolean; detail: string }[];
}

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
