import { Cell } from '../core/Grid';
import { SnakeState } from '../core/Snake';
import { LevelConfig } from '../config/types';

export interface MechanicContext {
  snake: SnakeState;
  grid: { cols: number; rows: number };
  levelConfig: LevelConfig;
  pickups: Cell[];
  walls: Cell[];
  score: number;
  quota: number;
  elapsed: number;
}

export interface MechanicUpdate {
  addPickup?: Cell;
  removePickup?: Cell;
  addWall?: Cell;
  removeWall?: Cell;
  hitDanger?: boolean;
  score?: number;
  extraData?: Record<string, unknown>;
}

export interface DangerCell extends Cell {
  source?: string;
  lethal?: boolean;
}

export abstract class BaseMechanic {
  protected ctx!: MechanicContext;

  init(ctx: MechanicContext): void {
    this.ctx = ctx;
    this.onInit();
  }

  syncContext(patch: Partial<MechanicContext>): void {
    this.ctx = { ...this.ctx, ...patch };
  }

  protected abstract onInit(): void;

  abstract tick(tickCount: number): MechanicUpdate;

  onPickupCollected(_cell: Cell): MechanicUpdate {
    return {};
  }

  // Extra entities to render (returned each frame as data, renderer handles visuals)
  getExtraEntities(): ExtraEntity[] {
    return [];
  }

  getDangerCells(): DangerCell[] {
    return [];
  }

  // HUD text beyond score/quota
  getHudExtra(): string {
    return '';
  }

  // Optional speed multiplier: < 1 = faster, > 1 = slower. Default = no override.
  getSpeedMultiplier(): number {
    return 1;
  }
}

export type EntityState =
  | 'ghost' | 'warning' | 'active' | 'static' | 'inactive'
  | 'idle' | 'moving' | 'attacking' | 'vulnerable' | 'hit' | 'defeated'
  | 'danger' | 'ready' | 'decoy' | 'real' | 'orb' | 'body'
  | 'highlighted' | 'shadow'
  | 'pressure' | 'closed' | 'opening' | 'open'
  | 'attack_window' | 'counter'
  | 'charging';

export interface ExtraEntity {
  type: string;
  cell: Cell;
  state: EntityState;
  data?: Record<string, unknown>;
}
