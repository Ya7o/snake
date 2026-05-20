import { BaseMechanic } from './BaseMechanic';
import { CastleIllusionMechanic } from './CastleIllusionMechanic';
import { SonicRingsMechanic } from './SonicRingsMechanic';
import { StreetsCrowdMechanic } from './StreetsCrowdMechanic';
import { FighterChargeMechanic } from './FighterChargeMechanic';
import { OutRunLaneMechanic } from './OutRunLaneMechanic';
import { ShinobiFocusMechanic } from './ShinobiFocusMechanic';
import { KombatFatalMechanic } from './KombatFatalMechanic';
import { PaperboyDeliveryMechanic } from './PaperboyDeliveryMechanic';
import { WitchMirrorBoss } from './bosses/WitchMirrorBoss';
import { LoopSerpentBoss } from './bosses/LoopSerpentBoss';
import { CrimeLordBoss } from './bosses/CrimeLordBoss';
import { FinalChallengerBoss } from './bosses/FinalChallengerBoss';
import { TurboRivalBoss } from './bosses/TurboRivalBoss';
import { ShadowNinjaBoss } from './bosses/ShadowNinjaBoss';
import { DragonGateBoss } from './bosses/DragonGateBoss';
import { NeighborhoodChaosBoss } from './bosses/NeighborhoodChaosBoss';

const MAP: Record<string, () => BaseMechanic> = {
  castleIllusion:     () => new CastleIllusionMechanic(),
  ringChains:         () => new SonicRingsMechanic(),
  crowdBlockers:      () => new StreetsCrowdMechanic(),
  chargeMove:         () => new FighterChargeMechanic(),
  laneDrift:          () => new OutRunLaneMechanic(),
  focusMode:          () => new ShinobiFocusMechanic(),
  fatalZones:         () => new KombatFatalMechanic(),
  deliveryTargets:    () => new PaperboyDeliveryMechanic(),
  witchMirror:        () => new WitchMirrorBoss(),
  loopSerpent:        () => new LoopSerpentBoss(),
  crimeLord:          () => new CrimeLordBoss(),
  finalChallenger:    () => new FinalChallengerBoss(),
  turboRival:         () => new TurboRivalBoss(),
  shadowNinja:        () => new ShadowNinjaBoss(),
  dragonGate:         () => new DragonGateBoss(),
  neighborhoodChaos:  () => new NeighborhoodChaosBoss(),
};

export function createMechanic(id: string): BaseMechanic {
  const factory = MAP[id];
  if (!factory) {
    console.warn(`[MechanicFactory] Unknown mechanic: ${id}, using fallback`);
    return new CastleIllusionMechanic();
  }
  return factory();
}
