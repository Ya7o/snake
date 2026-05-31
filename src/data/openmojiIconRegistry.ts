// Runtime icon registry for legacy OpenMoji-derived SVGs.
// The source folder is gone; icons live beside each universe's gameplay assets.

const CASTLE_ICON_ROOT = 'assets/runtime/universes/castle';

export const CASTLE_V1_OPENMOJI = {
  world: `${CASTLE_ICON_ROOT}/icon_world_castle.svg`,
  stage: `${CASTLE_ICON_ROOT}/icon_hud_stage.svg`,
  pickupPrimary: `${CASTLE_ICON_ROOT}/icon_pickup_magic_star.svg`,
  bonusGem: `${CASTLE_ICON_ROOT}/icon_pickup_gem.svg`,
  rareOrb: `${CASTLE_ICON_ROOT}/icon_pickup_orb.svg`,
  bonusStar: `${CASTLE_ICON_ROOT}/icon_pickup_bonus_star.svg`,
  perfectStar: `${CASTLE_ICON_ROOT}/icon_pickup_perfect_star.svg`,
  keyUnlock: `${CASTLE_ICON_ROOT}/icon_pickup_key.svg`,
  shieldPowerup: `${CASTLE_ICON_ROOT}/icon_pickup_shield.svg`,
  obstacleFixed: `${CASTLE_ICON_ROOT}/icon_obstacle_brick.svg`,
  obstacleAlt: `${CASTLE_ICON_ROOT}/icon_obstacle_stone.svg`,
  obstacleDoor: `${CASTLE_ICON_ROOT}/icon_obstacle_door.svg`,
  dangerPrimary: `${CASTLE_ICON_ROOT}/icon_danger_fire.svg`,
  dangerImpact: `${CASTLE_ICON_ROOT}/icon_danger_impact.svg`,
  dangerWarning: `${CASTLE_ICON_ROOT}/icon_danger_warning.svg`,
  bossEvent: `${CASTLE_ICON_ROOT}/icon_boss_crystal_ball.svg`,
  bossDanger: `${CASTLE_ICON_ROOT}/icon_boss_skull.svg`,
  bossReward: `${CASTLE_ICON_ROOT}/icon_boss_crown.svg`,
  pause: `${CASTLE_ICON_ROOT}/icon_hud_pause.svg`,
  play: `${CASTLE_ICON_ROOT}/icon_hud_play.svg`,
  home: `${CASTLE_ICON_ROOT}/icon_hud_home.svg`,
  clear: `${CASTLE_ICON_ROOT}/icon_hud_clear.svg`,
} as const;
