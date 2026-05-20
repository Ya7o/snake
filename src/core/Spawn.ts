import { Cell, Grid, cellKey } from './Grid';
import { SnakeState, snakeOccupied } from './Snake';

export function spawnPickup(
  grid: Grid,
  snake: SnakeState,
  extra: Cell[] = []
): Cell | null {
  const occupied = snakeOccupied(snake);
  for (const c of extra) occupied.add(cellKey(c));
  return grid.randomFreeCell(occupied);
}

export function occupiedSet(snake: SnakeState, extra: Cell[] = []): Set<string> {
  const s = snakeOccupied(snake);
  for (const c of extra) s.add(cellKey(c));
  return s;
}
