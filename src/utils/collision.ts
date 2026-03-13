import type { Position } from '../types/game';
import { GRID_SIZE } from '../constants/game';

export function hitsWall(pos: Position): boolean {
  return pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE;
}

export function hitsSelf(head: Position, body: Position[]): boolean {
  return body.some(seg => seg.x === head.x && seg.y === head.y);
}

export function hitsObstacle(head: Position, obstacles: Position[]): boolean {
  return obstacles.some(obs => obs.x === head.x && obs.y === head.y);
}

export function eatsFood(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y;
}

export function randomFood(snake: Position[], obstacles: Position[] = []): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (
    snake.some(seg => seg.x === pos.x && seg.y === pos.y) ||
    obstacles.some(obs => obs.x === pos.x && obs.y === pos.y)
  );
  return pos;
}

export function randomObstacle(
  snake: Position[],
  food: Position,
  obstacles: Position[],
): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (
    snake.some(seg => seg.x === pos.x && seg.y === pos.y) ||
    (pos.x === food.x && pos.y === food.y) ||
    obstacles.some(obs => obs.x === pos.x && obs.y === pos.y)
  );
  return pos;
}
