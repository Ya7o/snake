// src/assets/runtimeIconCatalog.ts
// Catalogue d’icônes SVG locales. Les fichiers physiques sont dans public/assets/ui/icons.
// Pas de marque déposée, pas d’assets web externes, pas de dépendance.

export type RuntimeIconId =
  | "pickup_star"
  | "pickup_ring"
  | "pickup_orb"
  | "pickup_shuriken"
  | "pickup_newspaper"
  | "pickup_checkpoint"
  | "pickup_finish"
  | "obstacle_block"
  | "obstacle_fire"
  | "obstacle_crowd"
  | "obstacle_cone"
  | "obstacle_dog"
  | "obstacle_car"
  | "obstacle_mailbox"
  | "boss_mirror"
  | "boss_loop_serpent"
  | "boss_crime_lord"
  | "boss_challenger"
  | "boss_rival"
  | "boss_shadow_ninja"
  | "boss_dragon_gate"
  | "boss_bulldog"
  | "ui_play"
  | "ui_map"
  | "ui_retry"
  | "ui_lock"
  | "state_clear"
  | "state_boss";

export const RUNTIME_ICON_PATHS: Record<RuntimeIconId, string> = {
  pickup_star: "/assets/ui/icons/pickup_star.svg",
  pickup_ring: "/assets/ui/icons/pickup_ring.svg",
  pickup_orb: "/assets/ui/icons/pickup_orb.svg",
  pickup_shuriken: "/assets/ui/icons/pickup_shuriken.svg",
  pickup_newspaper: "/assets/ui/icons/pickup_newspaper.svg",
  pickup_checkpoint: "/assets/ui/icons/pickup_checkpoint.svg",
  pickup_finish: "/assets/ui/icons/pickup_finish.svg",
  obstacle_block: "/assets/ui/icons/obstacle_block.svg",
  obstacle_fire: "/assets/ui/icons/obstacle_fire.svg",
  obstacle_crowd: "/assets/ui/icons/obstacle_crowd.svg",
  obstacle_cone: "/assets/ui/icons/obstacle_cone.svg",
  obstacle_dog: "/assets/ui/icons/obstacle_dog.svg",
  obstacle_car: "/assets/ui/icons/obstacle_car.svg",
  obstacle_mailbox: "/assets/ui/icons/obstacle_mailbox.svg",
  boss_mirror: "/assets/ui/icons/boss_mirror.svg",
  boss_loop_serpent: "/assets/ui/icons/boss_loop_serpent.svg",
  boss_crime_lord: "/assets/ui/icons/boss_crime_lord.svg",
  boss_challenger: "/assets/ui/icons/boss_challenger.svg",
  boss_rival: "/assets/ui/icons/boss_rival.svg",
  boss_shadow_ninja: "/assets/ui/icons/boss_shadow_ninja.svg",
  boss_dragon_gate: "/assets/ui/icons/boss_dragon_gate.svg",
  boss_bulldog: "/assets/ui/icons/boss_bulldog.svg",
  ui_play: "/assets/ui/icons/ui_play.svg",
  ui_map: "/assets/ui/icons/ui_map.svg",
  ui_retry: "/assets/ui/icons/ui_retry.svg",
  ui_lock: "/assets/ui/icons/ui_lock.svg",
  state_clear: "/assets/ui/icons/state_clear.svg",
  state_boss: "/assets/ui/icons/state_boss.svg",
};

export function preloadRuntimeIcons(scene: Phaser.Scene) {
  for (const [id, path] of Object.entries(RUNTIME_ICON_PATHS)) {
    scene.load.svg(id, path, { width: 64, height: 64 });
  }
}
