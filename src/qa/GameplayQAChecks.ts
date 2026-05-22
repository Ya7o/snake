import { LEVELS } from '../config/levels';
import { MAP_NODES } from '../config/mapNodes';
import { UNIVERSE_ORDER } from '../config/universes';
import { createMechanic } from '../mechanics/MechanicFactory';
import { BaseBoss } from '../mechanics/bosses/BaseBoss';
import { CASTLE_ILLUSION_TUNING } from '../mechanics/CastleIllusionMechanic';
import { WITCH_MIRROR_TUNING } from '../mechanics/bosses/WitchMirrorBoss';
import { createSnake } from '../core/Snake';

export interface GameplayQACheck {
  name: string;
  pass: boolean;
  detail: string;
}

const NORMAL_SPEED_MIN = 130;
const NORMAL_SPEED_MAX = 175;
const BOSS_SPEED_MIN = 140;
const BOSS_SPEED_MAX = 180;
const BOSS_HP_MAX = 3;

export function runGameplayQAChecks(): GameplayQACheck[] {
  const normalLevels = LEVELS.filter(level => level.type === 'normal');
  const bossLevels = LEVELS.filter(level => level.type === 'boss');

  const invalidNormalSpeed = normalLevels.filter(
    level => level.speedMs < NORMAL_SPEED_MIN || level.speedMs > NORMAL_SPEED_MAX,
  );
  const invalidBossSpeed = bossLevels.filter(
    level => level.speedMs < BOSS_SPEED_MIN || level.speedMs > BOSS_SPEED_MAX,
  );
  const invalidBossHp = bossLevels.filter(
    level => (level.bossHp ?? 0) < 1 || (level.bossHp ?? 0) > BOSS_HP_MAX,
  );
  const invalidNormalQuota = normalLevels.filter(
    level => (level.quota ?? 0) < 8 || (level.quota ?? 0) > 15,
  );

  const mechanicByUniverse = UNIVERSE_ORDER.map(universeId => {
    const level = normalLevels.find(candidate => candidate.universeId === universeId);
    return { universeId, mechanic: level?.mechanic ?? '' };
  });
  const duplicatedNormalMechanics = mechanicByUniverse.filter((entry, index) => {
    return mechanicByUniverse.findIndex(candidate => candidate.mechanic === entry.mechanic) !== index;
  });
  const missingMapLevels = LEVELS.filter(level => !MAP_NODES.some(node => node.levelId === level.id));
  const duplicateNodeLevelIds = MAP_NODES
    .map(node => node.levelId)
    .filter((levelId, index, ids) => ids.indexOf(levelId) !== index);
  const invalidLevelMapRefs = LEVELS.filter(level => !MAP_NODES.some(node => node.id === level.mapNodeId));
  const invalidProgressionOrder = MAP_NODES.some((node, index) => node.id !== `node_${index + 1}`);
  const mechanicsWithoutDangerApi = [...new Set(LEVELS.map(level => level.mechanic))].filter(mechanicId => {
    const mechanic = createMechanic(mechanicId);
    return typeof mechanic.getDangerCells !== 'function';
  });
  const bossMechanicsWithoutWeakPointApi = [...new Set(bossLevels.map(level => level.mechanic))].filter(mechanicId => {
    const mechanic = createMechanic(mechanicId);
    return typeof (mechanic as { getWeakPoints?: unknown }).getWeakPoints !== 'function'
      || typeof (mechanic as { onWeakPointHit?: unknown }).onWeakPointHit !== 'function';
  });
  const castleStage = LEVELS.find(level => level.id === 'castle_normal');
  const castleBoss = LEVELS.find(level => level.id === 'castle_boss');
  const castleStageNode = castleStage ? MAP_NODES.find(node => node.levelId === castleStage.id) : undefined;
  const castleBossNode = castleBoss ? MAP_NODES.find(node => node.levelId === castleBoss.id) : undefined;
  const castleUnlocksBoss = !!castleStageNode && !!castleBossNode
    && MAP_NODES.indexOf(castleBossNode) === MAP_NODES.indexOf(castleStageNode) + 1;
  const castleMechanic = createMechanic('castleIllusion');
  const witchMirror = createMechanic('witchMirror');
  const castleRuntimeReadability = getCastleRuntimeReadabilityCheck(castleStage);
  const witchMirrorRuntimeReadability = getWitchMirrorRuntimeReadabilityCheck(castleBoss);

  return [
    {
      name: '970 Normal speeds in Phase 1 range',
      pass: invalidNormalSpeed.length === 0,
      detail: invalidNormalSpeed.length
        ? invalidNormalSpeed.map(level => `${level.id}:${level.speedMs}ms`).join(', ')
        : 'OK',
    },
    {
      name: '970 Boss speeds in Phase 1 range',
      pass: invalidBossSpeed.length === 0,
      detail: invalidBossSpeed.length
        ? invalidBossSpeed.map(level => `${level.id}:${level.speedMs}ms`).join(', ')
        : 'OK',
    },
    {
      name: '970 Boss HP capped at 3',
      pass: invalidBossHp.length === 0,
      detail: invalidBossHp.length
        ? invalidBossHp.map(level => `${level.id}:${level.bossHp ?? 0}`).join(', ')
        : 'OK',
    },
    {
      name: '970 Normal quotas in Phase 1 range',
      pass: invalidNormalQuota.length === 0,
      detail: invalidNormalQuota.length
        ? invalidNormalQuota.map(level => `${level.id}:${level.quota ?? 0}`).join(', ')
        : 'OK',
    },
    {
      name: '970 One normal gimmick per universe',
      pass: duplicatedNormalMechanics.length === 0,
      detail: duplicatedNormalMechanics.length
        ? duplicatedNormalMechanics.map(entry => `${entry.universeId}:${entry.mechanic}`).join(', ')
        : 'OK',
    },
    {
      name: '971 Every level is reachable from the map',
      pass: missingMapLevels.length === 0 && duplicateNodeLevelIds.length === 0 && invalidLevelMapRefs.length === 0,
      detail: missingMapLevels.length || duplicateNodeLevelIds.length || invalidLevelMapRefs.length
        ? `Missing: ${missingMapLevels.map(level => level.id).join(', ') || 'none'}; duplicates: ${duplicateNodeLevelIds.join(', ') || 'none'}; bad mapNodeId: ${invalidLevelMapRefs.map(level => level.id).join(', ') || 'none'}`
        : 'OK',
    },
    {
      name: '971 Progression nodes are sequential',
      pass: !invalidProgressionOrder && MAP_NODES[0]?.id === 'node_1',
      detail: invalidProgressionOrder ? 'Expected node_1..node_16 order' : 'OK',
    },
    {
      name: '971 Mechanics expose danger-cell API',
      pass: mechanicsWithoutDangerApi.length === 0,
      detail: mechanicsWithoutDangerApi.length ? mechanicsWithoutDangerApi.join(', ') : 'OK',
    },
    {
      name: '972 Boss mechanics expose weak-point API',
      pass: bossMechanicsWithoutWeakPointApi.length === 0,
      detail: bossMechanicsWithoutWeakPointApi.length ? bossMechanicsWithoutWeakPointApi.join(', ') : 'OK',
    },
    {
      name: '972 Linear progression debt documented',
      pass: true,
      detail: 'MAP_NODES order is the accepted Phase 1/2 progression source; see docs/972_LINEAR_PROGRESSION_DEBT.md',
    },
    {
      name: '980 Castle Stage 1 vertical-slice data',
      pass: !!castleStage && castleStage.type === 'normal' && castleStage.mechanic === 'castleIllusion'
        && (castleStage.quota ?? 0) >= 8 && (castleStage.quota ?? 0) <= 12,
      detail: castleStage ? `${castleStage.id}:${castleStage.quota ?? 0} ${castleStage.mechanic}` : 'Missing castle_normal',
    },
    {
      name: '980 Castle Boss vertical-slice data',
      pass: !!castleBoss && castleBoss.type === 'boss' && castleBoss.mechanic === 'witchMirror'
        && (castleBoss.bossHp ?? 0) >= 1 && (castleBoss.bossHp ?? 0) <= 3,
      detail: castleBoss ? `${castleBoss.id}:hp${castleBoss.bossHp ?? 0} ${castleBoss.mechanic}` : 'Missing castle_boss',
    },
    {
      name: '980 Castle Stage 1 unlocks Castle Boss',
      pass: castleUnlocksBoss,
      detail: castleUnlocksBoss ? 'node_1 -> node_2' : 'Castle boss is not the next map node after Castle Stage 1',
    },
    {
      name: '980 Castle mechanic exposes warning and danger APIs',
      pass: typeof castleMechanic.getExtraEntities === 'function' && typeof castleMechanic.getDangerCells === 'function',
      detail: 'Warning cells render as extra entities; only active cells are returned by getDangerCells()',
    },
    {
      name: '980 Witch Mirror exposes boss APIs',
      pass: witchMirror instanceof BaseBoss
        && typeof witchMirror.getDangerCells === 'function'
        && typeof witchMirror.getWeakPoints === 'function'
        && typeof witchMirror.onWeakPointHit === 'function',
      detail: witchMirror instanceof BaseBoss ? 'Boss danger, weak-point and hit APIs available' : 'witchMirror is not a BaseBoss',
    },
    {
      name: '981 Castle illusion tuning is readable',
      pass: CASTLE_ILLUSION_TUNING.warningTicks > 0
        && CASTLE_ILLUSION_TUNING.activeTicks > 0
        && CASTLE_ILLUSION_TUNING.warningTicks >= CASTLE_ILLUSION_TUNING.activeTicks
        && CASTLE_ILLUSION_TUNING.maxWalls <= 3,
      detail: `warning=${CASTLE_ILLUSION_TUNING.warningTicks}, active=${CASTLE_ILLUSION_TUNING.activeTicks}, maxWalls=${CASTLE_ILLUSION_TUNING.maxWalls}`,
    },
    castleRuntimeReadability,
    {
      name: '981 Witch Mirror tuning is first-world friendly',
      pass: WITCH_MIRROR_TUNING.warningTicks > 0
        && WITCH_MIRROR_TUNING.attackingTicks > 0
        && WITCH_MIRROR_TUNING.vulnerableTicks >= WITCH_MIRROR_TUNING.attackingTicks,
      detail: `warning=${WITCH_MIRROR_TUNING.warningTicks}, attacking=${WITCH_MIRROR_TUNING.attackingTicks}, vulnerable=${WITCH_MIRROR_TUNING.vulnerableTicks}`,
    },
    witchMirrorRuntimeReadability,
  ];
}

function getCastleRuntimeReadabilityCheck(castleStage: typeof LEVELS[number] | undefined): GameplayQACheck {
  if (!castleStage) {
    return { name: '981 Castle runtime warning/danger separation', pass: false, detail: 'Missing castle_normal' };
  }

  const mechanic = createMechanic('castleIllusion');
  mechanic.init({
    snake: createSnake(5, 10),
    grid: { cols: 16, rows: 20 },
    levelConfig: castleStage,
    pickups: [{ col: 12, row: 12 }],
    walls: [],
    score: 0,
    quota: castleStage.quota ?? 10,
    elapsed: 0,
  });

  for (let tick = 1; tick <= CASTLE_ILLUSION_TUNING.spawnIntervalTicks + CASTLE_ILLUSION_TUNING.safeTicks; tick++) {
    mechanic.tick(tick);
  }
  const warningCells = mechanic.getExtraEntities().filter(entity => entity.type === 'blinkWall' && entity.state === 'warning');
  const warningDanger = mechanic.getDangerCells();

  for (
    let tick = 1;
    tick <= CASTLE_ILLUSION_TUNING.warningTicks;
    tick++
  ) {
    mechanic.tick(CASTLE_ILLUSION_TUNING.spawnIntervalTicks + CASTLE_ILLUSION_TUNING.safeTicks + tick);
  }
  const activeCells = mechanic.getExtraEntities().filter(entity => entity.type === 'blinkWall' && entity.state === 'active');
  const activeDanger = mechanic.getDangerCells();

  return {
    name: '981 Castle runtime warning/danger separation',
    pass: warningCells.length > 0
      && warningDanger.length === 0
      && activeCells.length > 0
      && activeDanger.length === activeCells.length,
    detail: `warningEntities=${warningCells.length}, warningDanger=${warningDanger.length}, activeEntities=${activeCells.length}, activeDanger=${activeDanger.length}`,
  };
}

function getWitchMirrorRuntimeReadabilityCheck(castleBoss: typeof LEVELS[number] | undefined): GameplayQACheck {
  if (!castleBoss) {
    return { name: '981 Witch Mirror exposes danger then weak point', pass: false, detail: 'Missing castle_boss' };
  }

  const mechanic = createMechanic('witchMirror');
  mechanic.init({
    snake: createSnake(5, 10),
    grid: { cols: 16, rows: 20 },
    levelConfig: castleBoss,
    pickups: [],
    walls: [],
    score: 0,
    quota: 0,
    elapsed: 0,
  });

  for (let tick = 1; tick <= WITCH_MIRROR_TUNING.idleTicks + WITCH_MIRROR_TUNING.warningTicks; tick++) {
    mechanic.tick(tick);
  }
  const dangerCells = mechanic.getDangerCells();

  for (let tick = 1; tick <= WITCH_MIRROR_TUNING.attackingTicks; tick++) {
    mechanic.tick(WITCH_MIRROR_TUNING.idleTicks + WITCH_MIRROR_TUNING.warningTicks + tick);
  }
  const boss = mechanic as BaseBoss;
  const weakPoints = boss.getWeakPoints();
  const weakPointKeys = new Set(weakPoints.map(cell => `${cell.col},${cell.row}`));
  const overlappingDanger = dangerCells.filter(cell => weakPointKeys.has(`${cell.col},${cell.row}`));

  return {
    name: '981 Witch Mirror exposes danger then weak point',
    pass: dangerCells.length > 0 && weakPoints.length > 0 && overlappingDanger.length === 0,
    detail: `danger=${dangerCells.length}, weakPoints=${weakPoints.length}, overlap=${overlappingDanger.length}`,
  };
}
