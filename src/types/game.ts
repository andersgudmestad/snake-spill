export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'idle' | 'playing' | 'paused' | 'dead';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type PowerUpType = 'speed' | 'shield' | 'trim';

export interface Position {
  x: number;
  y: number;
}

export interface PowerUp {
  position: Position;
  type: PowerUpType;
  spawnedAt: number; // Date.now()
}

export interface ActiveEffect {
  type: PowerUpType;
  endsAt: number; // Date.now()
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0–1
  decay: number;
  color: string;
  size: number;
}

export interface GameStats {
  foodEaten: number;
  maxLength: number;
  startTime: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  powerUp: PowerUp | null;
  activeEffect: ActiveEffect | null;
  obstacles: Position[];
  direction: Direction;
  status: GameStatus;
  score: number;
  highScore: number;
  difficulty: Difficulty;
  stats: GameStats;
}

export interface GameActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  setDifficulty: (d: Difficulty) => void;
  changeDirection: (d: Direction) => void;
}

export interface DrawConfig {
  ctx: CanvasRenderingContext2D;
  state: GameState;
  cellSize: number;
  gridSize: number;
  particles: Particle[];
}
