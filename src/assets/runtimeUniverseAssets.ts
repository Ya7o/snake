// src/assets/runtimeUniverseAssets.ts
// Patch 943 — catalogue final limité aux 24 assets runtime validés.
// Ne pas charger les anciens dossiers _downloaded, _extracted, design_board_icons ou runtime_candidates.

export type RuntimeAssetRole = "pickup" | "obstacle" | "boss";

export type UniverseRuntimeAssetSet = {
  pickup: string;
  obstacle: string;
  boss: string;
};

export const RUNTIME_UNIVERSE_ASSETS: Record<string, UniverseRuntimeAssetSet> = {
  // castle uses db_ assets (pickup_01/02, obstacle_01/02, boss) — no runtime override needed
  sonic: {
    pickup: "/assets/runtime/universes/sonic/pickup_ring.png",
    obstacle: "/assets/runtime/universes/sonic/obstacle_bumper.png",
    boss: "/assets/runtime/universes/sonic/boss_loop_serpent.png",
  },
  streets: {
    pickup: "/assets/runtime/universes/streets/pickup_street_bonus.png",
    obstacle: "/assets/runtime/universes/streets/obstacle_crowd.png",
    boss: "/assets/runtime/universes/streets/boss_crime_lord.png",
  },
  fighter: {
    pickup: "/assets/runtime/universes/fighter/pickup_energy.png",
    obstacle: "/assets/runtime/universes/fighter/obstacle_charge_marker.png",
    boss: "/assets/runtime/universes/fighter/boss_final_challenger.png",
  },
  outrun: {
    pickup: "/assets/runtime/universes/outrun/pickup_checkpoint.png",
    obstacle: "/assets/runtime/universes/outrun/obstacle_car.png",
    boss: "/assets/runtime/universes/outrun/boss_turbo_rival.png",
  },
  shinobi: {
    pickup: "/assets/runtime/universes/shinobi/pickup_shuriken.png",
    obstacle: "/assets/runtime/universes/shinobi/obstacle_decoy.png",
    boss: "/assets/runtime/universes/shinobi/boss_shadow_ninja.png",
  },
  kombat: {
    pickup: "/assets/runtime/universes/kombat/pickup_finish_token.png",
    obstacle: "/assets/runtime/universes/kombat/obstacle_fatal_zone.png",
    boss: "/assets/runtime/universes/kombat/boss_dragon_gate.png",
  },
  paperboy: {
    pickup: "/assets/runtime/universes/paperboy/pickup_newspaper.png",
    obstacle: "/assets/runtime/universes/paperboy/obstacle_dog.png",
    boss: "/assets/runtime/universes/paperboy/boss_neighborhood_chaos.png",
  },
};

export function getRuntimeAsset(universeId: string, role: RuntimeAssetRole): string | undefined {
  return RUNTIME_UNIVERSE_ASSETS[universeId]?.[role];
}
