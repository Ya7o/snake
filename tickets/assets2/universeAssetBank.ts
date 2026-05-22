export type UniverseAssetBankRole = 'pickup' | 'obstacle' | 'prop' | 'iconic_major' | 'boss';

export type UniverseAssetBankEntry = {
  universe: string;
  index: number;
  role: UniverseAssetBankRole;
  slug: string;
  file: string;
};

export const UNIVERSE_ASSET_BANK = 
[
  {
    "universe": "universe_01_castle",
    "index": 1,
    "role": "pickup",
    "slug": "pickup_01_magic_orb",
    "file": "public/assets/universe_asset_bank/universe_01_castle/01_pickup_01_magic_orb.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 2,
    "role": "pickup",
    "slug": "pickup_02_golden_key",
    "file": "public/assets/universe_asset_bank/universe_01_castle/02_pickup_02_golden_key.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 3,
    "role": "pickup",
    "slug": "pickup_03_gem_medallion",
    "file": "public/assets/universe_asset_bank/universe_01_castle/03_pickup_03_gem_medallion.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 4,
    "role": "obstacle",
    "slug": "obstacle_01_magic_wall",
    "file": "public/assets/universe_asset_bank/universe_01_castle/04_obstacle_01_magic_wall.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 5,
    "role": "obstacle",
    "slug": "obstacle_02_portcullis_gate",
    "file": "public/assets/universe_asset_bank/universe_01_castle/05_obstacle_02_portcullis_gate.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 6,
    "role": "obstacle",
    "slug": "obstacle_03_castle_gate",
    "file": "public/assets/universe_asset_bank/universe_01_castle/06_obstacle_03_castle_gate.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 7,
    "role": "prop",
    "slug": "prop_01_banner",
    "file": "public/assets/universe_asset_bank/universe_01_castle/07_prop_01_banner.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 8,
    "role": "prop",
    "slug": "prop_02_purple_torch",
    "file": "public/assets/universe_asset_bank/universe_01_castle/08_prop_02_purple_torch.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 9,
    "role": "iconic_major",
    "slug": "iconic_major_01_brazier",
    "file": "public/assets/universe_asset_bank/universe_01_castle/09_iconic_major_01_brazier.png"
  },
  {
    "universe": "universe_01_castle",
    "index": 10,
    "role": "boss",
    "slug": "boss_01_magic_portal",
    "file": "public/assets/universe_asset_bank/universe_01_castle/10_boss_01_magic_portal.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 1,
    "role": "pickup",
    "slug": "pickup_01_ring",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/01_pickup_01_ring.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 2,
    "role": "pickup",
    "slug": "pickup_02_ring_chain",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/02_pickup_02_ring_chain.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 3,
    "role": "pickup",
    "slug": "pickup_03_energy_orb",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/03_pickup_03_energy_orb.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 4,
    "role": "obstacle",
    "slug": "obstacle_01_spring",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/04_obstacle_01_spring.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 5,
    "role": "obstacle",
    "slug": "obstacle_02_spikes",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/05_obstacle_02_spikes.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 6,
    "role": "obstacle",
    "slug": "obstacle_03_loop_arch",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/06_obstacle_03_loop_arch.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 7,
    "role": "prop",
    "slug": "prop_01_palm_tree",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/07_prop_01_palm_tree.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 8,
    "role": "prop",
    "slug": "prop_02_star_badge",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/08_prop_02_star_badge.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 9,
    "role": "iconic_major",
    "slug": "iconic_major_01_golden_loop",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/09_iconic_major_01_golden_loop.png"
  },
  {
    "universe": "universe_02_sonic",
    "index": 10,
    "role": "boss",
    "slug": "boss_01_mechanical_snake",
    "file": "public/assets/universe_asset_bank/universe_02_sonic/10_boss_01_mechanical_snake.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 1,
    "role": "pickup",
    "slug": "pickup_01_energy_drink",
    "file": "public/assets/universe_asset_bank/universe_03_streets/01_pickup_01_energy_drink.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 2,
    "role": "pickup",
    "slug": "pickup_02_1up_coin",
    "file": "public/assets/universe_asset_bank/universe_03_streets/02_pickup_02_1up_coin.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 3,
    "role": "pickup",
    "slug": "pickup_03_lightning_medallion",
    "file": "public/assets/universe_asset_bank/universe_03_streets/03_pickup_03_lightning_medallion.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 4,
    "role": "obstacle",
    "slug": "obstacle_01_barrel",
    "file": "public/assets/universe_asset_bank/universe_03_streets/04_obstacle_01_barrel.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 5,
    "role": "obstacle",
    "slug": "obstacle_02_traffic_cone",
    "file": "public/assets/universe_asset_bank/universe_03_streets/05_obstacle_02_traffic_cone.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 6,
    "role": "obstacle",
    "slug": "obstacle_03_road_barricade",
    "file": "public/assets/universe_asset_bank/universe_03_streets/06_obstacle_03_road_barricade.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 7,
    "role": "prop",
    "slug": "prop_01_boombox",
    "file": "public/assets/universe_asset_bank/universe_03_streets/07_prop_01_boombox.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 8,
    "role": "prop",
    "slug": "prop_02_open_sign",
    "file": "public/assets/universe_asset_bank/universe_03_streets/08_prop_02_open_sign.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 9,
    "role": "iconic_major",
    "slug": "iconic_major_01_hotel_sign",
    "file": "public/assets/universe_asset_bank/universe_03_streets/09_iconic_major_01_hotel_sign.png"
  },
  {
    "universe": "universe_03_streets",
    "index": 10,
    "role": "boss",
    "slug": "boss_01_fighter",
    "file": "public/assets/universe_asset_bank/universe_03_streets/10_boss_01_fighter.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 1,
    "role": "pickup",
    "slug": "pickup_01_energy_orb",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/01_pickup_01_energy_orb.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 2,
    "role": "pickup",
    "slug": "pickup_02_explosion",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/02_pickup_02_explosion.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 3,
    "role": "pickup",
    "slug": "pickup_03_ice_flame",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/03_pickup_03_ice_flame.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 4,
    "role": "obstacle",
    "slug": "obstacle_01_spiked_pillar",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/04_obstacle_01_spiked_pillar.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 5,
    "role": "obstacle",
    "slug": "obstacle_02_punching_bag",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/05_obstacle_02_punching_bag.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 6,
    "role": "obstacle",
    "slug": "obstacle_03_tatami_mat",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/06_obstacle_03_tatami_mat.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 7,
    "role": "prop",
    "slug": "prop_01_gong",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/07_prop_01_gong.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 8,
    "role": "prop",
    "slug": "prop_02_red_belt",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/08_prop_02_red_belt.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 9,
    "role": "iconic_major",
    "slug": "iconic_major_01_vs_logo",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/09_iconic_major_01_vs_logo.png"
  },
  {
    "universe": "universe_04_fighter",
    "index": 10,
    "role": "boss",
    "slug": "boss_01_challenger",
    "file": "public/assets/universe_asset_bank/universe_04_fighter/10_boss_01_challenger.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 1,
    "role": "pickup",
    "slug": "pickup_01_checkpoint",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/01_pickup_01_checkpoint.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 2,
    "role": "pickup",
    "slug": "pickup_02_turbo_badge",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/02_pickup_02_turbo_badge.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 3,
    "role": "pickup",
    "slug": "pickup_03_cassette",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/03_pickup_03_cassette.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 4,
    "role": "obstacle",
    "slug": "obstacle_01_traffic_cone",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/04_obstacle_01_traffic_cone.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 5,
    "role": "obstacle",
    "slug": "obstacle_02_winding_sign",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/05_obstacle_02_winding_sign.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 6,
    "role": "obstacle",
    "slug": "obstacle_03_roadblock",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/06_obstacle_03_roadblock.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 7,
    "role": "prop",
    "slug": "prop_01_palm_tree",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/07_prop_01_palm_tree.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 8,
    "role": "prop",
    "slug": "prop_02_speedometer",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/08_prop_02_speedometer.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 9,
    "role": "iconic_major",
    "slug": "iconic_major_01_convertible",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/09_iconic_major_01_convertible.png"
  },
  {
    "universe": "universe_05_outrun",
    "index": 10,
    "role": "boss",
    "slug": "boss_01_muscle_car",
    "file": "public/assets/universe_asset_bank/universe_05_outrun/10_boss_01_muscle_car.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 1,
    "role": "pickup",
    "slug": "pickup_01_shuriken",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/01_pickup_01_shuriken.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 2,
    "role": "pickup",
    "slug": "pickup_02_dagger",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/02_pickup_02_dagger.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 3,
    "role": "pickup",
    "slug": "pickup_03_energy_orb",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/03_pickup_03_energy_orb.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 4,
    "role": "obstacle",
    "slug": "obstacle_01_stone_lantern",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/04_obstacle_01_stone_lantern.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 5,
    "role": "obstacle",
    "slug": "obstacle_02_snow_rock",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/05_obstacle_02_snow_rock.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 6,
    "role": "obstacle",
    "slug": "obstacle_03_training_pole",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/06_obstacle_03_training_pole.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 7,
    "role": "prop",
    "slug": "prop_01_scroll",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/07_prop_01_scroll.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 8,
    "role": "prop",
    "slug": "prop_02_torii_gate",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/08_prop_02_torii_gate.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 9,
    "role": "iconic_major",
    "slug": "iconic_major_01_shrine_entrance",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/09_iconic_major_01_shrine_entrance.png"
  },
  {
    "universe": "universe_06_shinobi",
    "index": 10,
    "role": "boss",
    "slug": "boss_01_ninja",
    "file": "public/assets/universe_asset_bank/universe_06_shinobi/10_boss_01_ninja.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 1,
    "role": "pickup",
    "slug": "pickup_01_ghost_flame",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/01_pickup_01_ghost_flame.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 2,
    "role": "pickup",
    "slug": "pickup_02_dragon_medallion",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/02_pickup_02_dragon_medallion.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 3,
    "role": "pickup",
    "slug": "pickup_03_fire_medallion",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/03_pickup_03_fire_medallion.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 4,
    "role": "obstacle",
    "slug": "obstacle_01_volcanic_barrier",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/04_obstacle_01_volcanic_barrier.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 5,
    "role": "obstacle",
    "slug": "obstacle_02_arena_pillar",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/05_obstacle_02_arena_pillar.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 6,
    "role": "obstacle",
    "slug": "obstacle_03_sorcerer_gateway",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/06_obstacle_03_sorcerer_gateway.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 7,
    "role": "prop",
    "slug": "prop_01_flaming_brazier",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/07_prop_01_flaming_brazier.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 8,
    "role": "prop",
    "slug": "prop_02_decorative_gong",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/08_prop_02_decorative_gong.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 9,
    "role": "iconic_major",
    "slug": "iconic_major_01_dragon_emblem",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/09_iconic_major_01_dragon_emblem.png"
  },
  {
    "universe": "universe_07_kombat",
    "index": 10,
    "role": "boss",
    "slug": "boss_01_masked_warrior",
    "file": "public/assets/universe_asset_bank/universe_07_kombat/10_boss_01_masked_warrior.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 1,
    "role": "pickup",
    "slug": "pickup_01_newspaper",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/01_pickup_01_newspaper.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 2,
    "role": "pickup",
    "slug": "pickup_02_golden_scroll",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/02_pickup_02_golden_scroll.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 3,
    "role": "pickup",
    "slug": "pickup_03_messenger_bag",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/03_pickup_03_messenger_bag.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 4,
    "role": "obstacle",
    "slug": "obstacle_01_mailbox_blue",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/04_obstacle_01_mailbox_blue.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 5,
    "role": "obstacle",
    "slug": "obstacle_02_bulldog",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/05_obstacle_02_bulldog.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 6,
    "role": "obstacle",
    "slug": "obstacle_03_hedge_block",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/06_obstacle_03_hedge_block.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 7,
    "role": "prop",
    "slug": "prop_01_mailbox_red",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/07_prop_01_mailbox_red.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 8,
    "role": "prop",
    "slug": "prop_02_delivery_bicycle",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/08_prop_02_delivery_bicycle.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 9,
    "role": "iconic_major",
    "slug": "iconic_major_01_cosmic_skate_obstacle",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/09_iconic_major_01_cosmic_skate_obstacle.png"
  },
  {
    "universe": "universe_08_paperboy",
    "index": 10,
    "role": "boss",
    "slug": "boss_01_bulldog_chaos",
    "file": "public/assets/universe_asset_bank/universe_08_paperboy/10_boss_01_bulldog_chaos.png"
  }
]
 as const;

export function getUniverseAssetBank(universe: string, role?: UniverseAssetBankRole) {
  return UNIVERSE_ASSET_BANK.filter((asset) => asset.universe === universe && (!role || asset.role === role));
}
