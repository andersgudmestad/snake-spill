import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  Direction, Difficulty, GameState, GameActions,
  Position, PowerUp, PowerUpType, ActiveEffect, GameStats,
} from '../types/game';
import {
  INITIAL_SNAKE, SPEEDS, MIN_SPEEDS,
  POWER_UP_BOARD_DURATION, POWER_UP_EFFECT_DURATION, POWER_UP_SPAWN_CHANCE,
  MAX_OBSTACLES,
} from '../constants/game';
import { hitsWall, hitsSelf, hitsObstacle, eatsFood, randomFood, randomObstacle } from '../utils/collision';
import { useHighScore } from './useHighScore';
import { useSoundEffects } from './useSoundEffects';
import { useGameLoop } from './useGameLoop';
import { useSwipeControls } from './useSwipeControls';

const OPPOSITES: Record<Direction, Direction> = {
  UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
};

const POWER_UP_TYPES: PowerUpType[] = ['speed', 'shield', 'trim'];

function moveHead(snake: Position[], dir: Direction): Position {
  const head = snake[0];
  switch (dir) {
    case 'UP':    return { x: head.x, y: head.y - 1 };
    case 'DOWN':  return { x: head.x, y: head.y + 1 };
    case 'LEFT':  return { x: head.x - 1, y: head.y };
    case 'RIGHT': return { x: head.x + 1, y: head.y };
  }
}

const INITIAL_STATS: GameStats = { foodEaten: 0, maxLength: 3, startTime: 0 };

export function useSnakeGame(): GameState & GameActions {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(() => randomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'dead'>('idle');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficultyState] = useState<Difficulty>('medium');
  const [powerUp, setPowerUp] = useState<PowerUp | null>(null);
  const [activeEffect, setActiveEffect] = useState<ActiveEffect | null>(null);
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);

  // Refs for use inside the RAF tick (avoids stale closures)
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const statusRef = useRef(status);
  const scoreRef = useRef(0);
  const powerUpRef = useRef<PowerUp | null>(null);
  const activeEffectRef = useRef<ActiveEffect | null>(null);
  const obstaclesRef = useRef<Position[]>([]);
  const statsRef = useRef<GameStats>(INITIAL_STATS);

  snakeRef.current = snake;
  foodRef.current = food;
  statusRef.current = status;

  const highScore = useHighScore(score);
  const { playEat, playCrash, playPowerUp } = useSoundEffects();

  const changeDirection = useCallback((d: Direction) => {
    if (d !== OPPOSITES[dirRef.current]) {
      nextDirRef.current = d;
    }
  }, []);

  const tick = useCallback(() => {
    const currentSnake = snakeRef.current;
    const currentFood = foodRef.current;
    const currentObstacles = obstaclesRef.current;
    const now = Date.now();

    // Expire power-up on board
    const boardPowerUp = powerUpRef.current;
    if (boardPowerUp && now - boardPowerUp.spawnedAt > POWER_UP_BOARD_DURATION) {
      powerUpRef.current = null;
      setPowerUp(null);
    }

    // Expire active effect
    const currentEffect = activeEffectRef.current;
    if (currentEffect && now > currentEffect.endsAt) {
      activeEffectRef.current = null;
      setActiveEffect(null);
    }

    // Apply queued direction
    const newDir = nextDirRef.current;
    dirRef.current = newDir;
    setDirection(newDir);

    const head = moveHead(currentSnake, newDir);

    if (hitsWall(head) || hitsObstacle(head, currentObstacles)) {
      playCrash();
      setStatus('dead');
      return;
    }

    // Self collision (skip if shield active)
    const hasShield = activeEffectRef.current?.type === 'shield';
    if (!hasShield && hitsSelf(head, currentSnake)) {
      playCrash();
      setStatus('dead');
      return;
    }

    const ate = eatsFood(head, currentFood);
    let newSnake = ate
      ? [head, ...currentSnake]
      : [head, ...currentSnake.slice(0, -1)];

    if (ate) {
      playEat();
      const newScore = scoreRef.current + 1;
      setScore(newScore);
      scoreRef.current = newScore;

      const newStats: GameStats = {
        ...statsRef.current,
        foodEaten: statsRef.current.foodEaten + 1,
        maxLength: Math.max(statsRef.current.maxLength, newSnake.length),
      };
      statsRef.current = newStats;
      setStats(newStats);

      // Add one obstacle every 5 points (max MAX_OBSTACLES)
      if (newScore % 5 === 0 && obstaclesRef.current.length < MAX_OBSTACLES) {
        const newObs = randomObstacle(newSnake, currentFood, obstaclesRef.current);
        const newObstacles = [...obstaclesRef.current, newObs];
        obstaclesRef.current = newObstacles;
        setObstacles(newObstacles);
      }

      const newFood = randomFood(newSnake, obstaclesRef.current);
      foodRef.current = newFood;
      setFood(newFood);

      // Spawn power-up with POWER_UP_SPAWN_CHANCE probability
      if (!powerUpRef.current && Math.random() < POWER_UP_SPAWN_CHANCE) {
        const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
        const puPos = randomFood([...newSnake, newFood], obstaclesRef.current);
        const newPowerUp: PowerUp = { position: puPos, type, spawnedAt: now };
        powerUpRef.current = newPowerUp;
        setPowerUp(newPowerUp);
      }
    }

    // Check power-up collection
    const activePowerUp = powerUpRef.current;
    if (activePowerUp && head.x === activePowerUp.position.x && head.y === activePowerUp.position.y) {
      const type = activePowerUp.type;
      powerUpRef.current = null;
      setPowerUp(null);
      playPowerUp();

      if (type === 'trim') {
        const halfLength = Math.max(3, Math.ceil(newSnake.length / 2));
        newSnake = newSnake.slice(0, halfLength);
      } else {
        const effect: ActiveEffect = { type, endsAt: now + POWER_UP_EFFECT_DURATION };
        activeEffectRef.current = effect;
        setActiveEffect(effect);
      }
    }

    snakeRef.current = newSnake;
    setSnake(newSnake);
  }, [playEat, playCrash, playPowerUp]);

  // Progressive speed: -2ms per 5 score, capped at min speed
  // Speed effect makes it 30% faster
  const baseSpeed = SPEEDS[difficulty];
  const minSpeed = MIN_SPEEDS[difficulty];
  const progressiveSpeed = Math.max(baseSpeed - Math.floor(score / 5) * 2, minSpeed);
  const effectiveSpeed = activeEffect?.type === 'speed'
    ? Math.max(Math.round(progressiveSpeed * 0.7), minSpeed)
    : progressiveSpeed;

  useGameLoop(tick, effectiveSpeed, status === 'playing');
  useSwipeControls(changeDirection);

  // Keyboard input
  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
      w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        changeDirection(dir);
        return;
      }
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        if (statusRef.current === 'playing') setStatus('paused');
        else if (statusRef.current === 'paused') setStatus('playing');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeDirection]);

  const start = useCallback(() => {
    const initialSnake = INITIAL_SNAKE.map(p => ({ ...p }));
    const initialFood = randomFood(initialSnake);
    const initialStats: GameStats = { foodEaten: 0, maxLength: 3, startTime: Date.now() };

    snakeRef.current = initialSnake;
    foodRef.current = initialFood;
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    powerUpRef.current = null;
    activeEffectRef.current = null;
    obstaclesRef.current = [];
    statsRef.current = initialStats;
    scoreRef.current = 0;

    setSnake(initialSnake);
    setFood(initialFood);
    setDirection('RIGHT');
    setScore(0);
    setPowerUp(null);
    setActiveEffect(null);
    setObstacles([]);
    setStats(initialStats);
    setStatus('playing');
  }, []);

  const pause = useCallback(() => setStatus('paused'), []);
  const resume = useCallback(() => setStatus('playing'), []);
  const restart = useCallback(() => start(), [start]);

  const setDifficulty = useCallback((d: Difficulty) => {
    setDifficultyState(d);
  }, []);

  return {
    snake, food, direction, status, score, highScore, difficulty,
    powerUp, activeEffect, obstacles, stats,
    start, pause, resume, restart,
    setDifficulty,
    changeDirection,
  };
}
