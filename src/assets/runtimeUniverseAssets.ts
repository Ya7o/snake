// src/assets/runtimeUniverseAssets.ts
// Runtime gameplay asset registry.
// All non-Castle gameplay assets should be resolved from public/assets/runtime/universes.

export type RuntimeAssetRole =
  | "pickup"
  | "pickupSecondary"
  | "obstacle"
  | "obstacleDanger"
  | "boss"
  | "bossAttack";

export type UniverseRuntimeAssetSet = {
  pickup: string;
  pickupSecondary: string;
  obstacle: string;
  obstacleDanger: string;
  boss: string;
  bossAttack: string;
};

const publicAsset = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

export const RUNTIME_UNIVERSE_ASSETS: Record<string, UniverseRuntimeAssetSet> = {
  sonic: {
    pickup: publicAsset("assets/runtime/universes/sonic/new/01_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/sonic/new/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/sonic/new/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/sonic/new/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/sonic/new/02_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/sonic/new/06_boss_attack.png"),
  },
  streets: {
    pickup: publicAsset("assets/runtime/universes/streets/new/02_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/streets/new/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/streets/new/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/streets/new/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/streets/new/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/streets/new/06_boss_attack.png"),
  },
  fighter: {
    pickup: publicAsset("assets/runtime/universes/fighter/new/03_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/fighter/new/04_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/fighter/new/05_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/fighter/new/02_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/fighter/new/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/fighter/new/06_boss_attack.png"),
  },
  outrun: {
    pickup: publicAsset("assets/runtime/universes/outrun/new/01_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/outrun/new/02_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/outrun/new/03_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/outrun/new/04_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/outrun/new/05_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/outrun/new/06_boss_attack.png"),
  },
  shinobi: {
    pickup: publicAsset("assets/runtime/universes/shinobi/new/02_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/shinobi/new/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/shinobi/new/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/shinobi/new/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/shinobi/new/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/shinobi/new/06_boss_attack.png"),
  },
  kombat: {
    pickup: publicAsset("assets/runtime/universes/kombat/new/02_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/kombat/new/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/kombat/new/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/kombat/new/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/kombat/new/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/kombat/new/06_boss_attack.png"),
  },
  paperboy: {
    pickup: publicAsset("assets/runtime/universes/paperboy/new/02_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/paperboy/new/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/paperboy/new/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/paperboy/new/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/paperboy/new/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/paperboy/new/06_boss_attack.png"),
  },
};

export function getRuntimeAsset(universeId: string, role: RuntimeAssetRole): string | undefined {
  return RUNTIME_UNIVERSE_ASSETS[universeId]?.[role];
}
