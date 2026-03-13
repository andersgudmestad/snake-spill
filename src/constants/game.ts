import type { Difficulty, Position, PowerUpType } from '../types/game';

export const GRID_SIZE = 20;
export const CELL_SIZE = 24;
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 480px

export const SPEEDS: Record<Difficulty, number> = {
  easy: 200,
  medium: 130,
  hard: 80,
};

export const MIN_SPEEDS: Record<Difficulty, number> = {
  easy: 100,
  medium: 65,
  hard: 40,
};

export const COLORS = {
  background: '#1a1a2e',
  grid: '#16213e',
  snakeHead: '#e94560',
  snakeBody: '#0f3460',
  food: '#f5a623',
  text: '#e0e0e0',
  overlay: 'rgba(26, 26, 46, 0.85)',
  obstacle: '#2d2d4e',
  obstacleDetail: '#3d3d5e',
};

export const POWER_UP_COLORS: Record<PowerUpType, string> = {
  speed: '#ff6b35',
  shield: '#4ecdc4',
  trim: '#a8e6cf',
};

export const POWER_UP_SYMBOLS: Record<PowerUpType, string> = {
  speed: '⚡',
  shield: '★',
  trim: '✂',
};

export const POWER_UP_LABELS: Record<PowerUpType, string> = {
  speed: 'Fartsfelle',
  shield: 'Skjold',
  trim: 'Trimmer',
};

export const POWER_UP_BOARD_DURATION = 8000;  // 8s synlig på brettet
export const POWER_UP_EFFECT_DURATION = 5000; // 5s effektvarighet
export const POWER_UP_SPAWN_CHANCE = 0.3;     // 30% sjanse per mat spist
export const MAX_OBSTACLES = 6;

export const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
