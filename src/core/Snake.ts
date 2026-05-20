import { Cell, cellEq, cellKey } from './Grid';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const DIR_OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'
};

export const DIR_DELTA: Record<Direction, Cell> = {
  UP:    { col: 0,  row: -1 },
  DOWN:  { col: 0,  row:  1 },
  LEFT:  { col: -1, row:  0 },
  RIGHT: { col: 1,  row:  0 },
};

export interface SnakeState {
  body: Cell[];       // head is [0]
  direction: Direction;
  nextDirection: Direction;
  growing: number;    // pending growth cells
}

export function createSnake(startCol: number, startRow: number): SnakeState {
  return {
    body: [
      { col: startCol,     row: startRow },
      { col: startCol - 1, row: startRow },
      { col: startCol - 2, row: startRow },
    ],
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    growing: 0
  };
}

export function snakeOccupied(snake: SnakeState): Set<string> {
  const s = new Set<string>();
  for (const c of snake.body) s.add(cellKey(c));
  return s;
}

export function queueDirection(snake: SnakeState, dir: Direction): void {
  if (dir !== DIR_OPPOSITE[snake.direction]) {
    snake.nextDirection = dir;
  }
}

export interface SnakeMoveResult {
  moved: boolean;
  hitWall: boolean;
  hitSelf: boolean;
  ate: boolean;
  head: Cell;
}

export function stepSnake(
  snake: SnakeState,
  cols: number,
  rows: number,
  pickups: Set<string>,
  walls: Set<string>
): SnakeMoveResult {
  snake.direction = snake.nextDirection;
  const delta = DIR_DELTA[snake.direction];
  const head = snake.body[0];
  const newHead: Cell = { col: head.col + delta.col, row: head.row + delta.row };

  // wall collision
  if (newHead.col < 0 || newHead.col >= cols || newHead.row < 0 || newHead.row >= rows) {
    return { moved: false, hitWall: true, hitSelf: false, ate: false, head: newHead };
  }

  // solid wall collision
  if (walls.has(cellKey(newHead))) {
    return { moved: false, hitWall: true, hitSelf: false, ate: false, head: newHead };
  }

  // self collision (exclude tail if not growing)
  const bodyCheck = snake.growing > 0 ? snake.body : snake.body.slice(0, -1);
  if (bodyCheck.some(c => cellEq(c, newHead))) {
    return { moved: false, hitWall: false, hitSelf: true, ate: false, head: newHead };
  }

  const ate = pickups.has(cellKey(newHead));

  snake.body.unshift(newHead);

  if (snake.growing > 0) {
    snake.growing--;
  } else {
    snake.body.pop();
  }

  return { moved: true, hitWall: false, hitSelf: false, ate, head: newHead };
}
