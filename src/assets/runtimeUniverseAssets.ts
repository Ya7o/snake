// src/assets/runtimeUniverseAssets.ts
// Patch 943 — catalogue final limité aux 24 assets runtime validés.
// Ne pas charger les anciens dossiers _downloaded, _extracted, design_board_icons ou runtime_candidates.

export type RuntimeAssetRole = "pickup" | "obstacle" | "boss";

export type UniverseRuntimeAssetSet = {
  pickup: string;
  obstacle: string;
  boss: string;
};

const publicAsset = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

export const RUNTIME_UNIVERSE_ASSETS: Record<string, UniverseRuntimeAssetSet> = {
  // castle uses db_ assets (pickup_01/02, obstacle_01/02, boss) — no runtime override needed
  sonic: {
    pickup: publicAsset("assets/runtime/universes/sonic/pickup_ring.png"),
    obstacle: publicAsset("assets/runtime/universes/sonic/obstacle_bumper.png"),
    boss: publicAsset("assets/runtime/universes/sonic/boss_loop_serpent.png"),
  },
  streets: {
    pickup: publicAsset("assets/runtime/universes/streets/pickup_street_bonus.png"),
    obstacle: publicAsset("assets/runtime/universes/streets/obstacle_crowd.png"),
    boss: publicAsset("assets/runtime/universes/streets/boss_idle.png"),
  },
  fighter: {
    pickup: publicAsset("assets/runtime/universes/fighter/pickup_energy.png"),
    obstacle: publicAsset("assets/runtime/universes/fighter/obstacle_charge_marker.png"),
    boss: publicAsset("assets/runtime/universes/fighter/boss_idle.png"),
  },
  outrun: {
    pickup: publicAsset("assets/runtime/universes/outrun/pickup_checkpoint.png"),
    obstacle: publicAsset("assets/runtime/universes/outrun/obstacle_car.png"),
    boss: publicAsset("assets/runtime/universes/outrun/boss_idle.png"),
  },
  shinobi: {
    pickup: publicAsset("assets/runtime/universes/shinobi/pickup_shuriken.png"),
    obstacle: publicAsset("assets/runtime/universes/shinobi/obstacle_decoy.png"),
    boss: publicAsset("assets/runtime/universes/shinobi/boss_shadow_ninja.png"),
  },
  kombat: {
    pickup: publicAsset("assets/runtime/universes/kombat/pickup_finish_token.png"),
    obstacle: publicAsset("assets/runtime/universes/kombat/obstacle_fatal_zone.png"),
    boss: publicAsset("assets/runtime/universes/kombat/boss_idle.png"),
  },
  paperboy: {
    pickup: publicAsset("assets/runtime/universes/paperboy/pickup_newspaper.png"),
    obstacle: publicAsset("assets/runtime/universes/paperboy/obstacle_dog.png"),
    boss: publicAsset("assets/runtime/universes/paperboy/boss_neighborhood_chaos.png"),
  },
};

export function getRuntimeAsset(universeId: string, role: RuntimeAssetRole): string | undefined {
  return RUNTIME_UNIVERSE_ASSETS[universeId]?.[role];
}
