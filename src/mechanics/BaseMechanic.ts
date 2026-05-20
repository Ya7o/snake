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

export abstract class BaseMechanic {
  protected ctx!: MechanicContext;

  init(ctx: MechanicContext): void {
    this.ctx = ctx;
    this.onInit();
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

  // HUD text beyond score/quota
  getHudExtra(): string {
    return '';
  }
}

export interface ExtraEntity {
  type: string;
  cell: Cell;
  state: string;
  data?: Record<string, unknown>;
}
