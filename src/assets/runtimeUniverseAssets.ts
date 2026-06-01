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
    pickup: publicAsset("assets/runtime/universes/sonic/01_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/sonic/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/sonic/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/sonic/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/sonic/02_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/sonic/06_boss_attack.png"),
  },
  streets: {
    pickup: publicAsset("assets/runtime/universes/streets/02_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/streets/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/streets/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/streets/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/streets/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/streets/06_boss_attack.png"),
  },
  fighter: {
    pickup: publicAsset("assets/runtime/universes/fighter/03_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/fighter/04_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/fighter/05_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/fighter/02_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/fighter/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/fighter/06_boss_attack.png"),
  },
  outrun: {
    pickup: publicAsset("assets/runtime/universes/outrun/01_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/outrun/02_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/outrun/03_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/outrun/04_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/outrun/05_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/outrun/06_boss_attack.png"),
  },
  shinobi: {
    pickup: publicAsset("assets/runtime/universes/shinobi/02_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/shinobi/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/shinobi/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/shinobi/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/shinobi/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/shinobi/06_boss_attack.png"),
  },
  kombat: {
    pickup: publicAsset("assets/runtime/universes/kombat/02_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/kombat/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/kombat/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/kombat/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/kombat/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/kombat/06_boss_attack.png"),
  },
  paperboy: {
    pickup: publicAsset("assets/runtime/universes/paperboy/02_pickup_object.png"),
    pickupSecondary: publicAsset("assets/runtime/universes/paperboy/03_pickup_object_2.png"),
    obstacle: publicAsset("assets/runtime/universes/paperboy/04_obstacle.png"),
    obstacleDanger: publicAsset("assets/runtime/universes/paperboy/05_obstacle_danger.png"),
    boss: publicAsset("assets/runtime/universes/paperboy/01_boss_idle.png"),
    bossAttack: publicAsset("assets/runtime/universes/paperboy/06_boss_attack.png"),
  },
};

export function getRuntimeAsset(universeId: string, role: RuntimeAssetRole): string | undefined {
  return RUNTIME_UNIVERSE_ASSETS[universeId]?.[role];
}
