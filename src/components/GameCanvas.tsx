import { useRef, useEffect, useCallback } from 'react';
import type { GameState } from '../types/game';
import { CANVAS_SIZE, GRID_SIZE, CELL_SIZE } from '../constants/game';
import { drawGame } from '../utils/canvasRenderer';
import { useParticles } from '../hooks/useParticles';

interface Props {
  state: GameState;
}

export function GameCanvas({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  const prevFoodRef = useRef(state.food);
  const prevStatusRef = useRef(state.status);

  const { particlesRef, spawnEatParticles, spawnCrashParticles, updateParticles } = useParticles();

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = stateRef.current;

    // Detect food eaten (food position changed while playing)
    const currentFood = currentState.food;
    const prevFood = prevFoodRef.current;
    if (
      currentState.status === 'playing' &&
      (currentFood.x !== prevFood.x || currentFood.y !== prevFood.y)
    ) {
      spawnEatParticles(prevFood.x, prevFood.y, CELL_SIZE);
      prevFoodRef.current = currentFood;
    }

    // Detect crash
    if (currentState.status === 'dead' && prevStatusRef.current === 'playing') {
      if (currentState.snake.length > 0) {
        spawnCrashParticles(currentState.snake[0].x, currentState.snake[0].y, CELL_SIZE);
      }
    }
    prevStatusRef.current = currentState.status;

    updateParticles();

    drawGame(
      { ctx, state: currentState, cellSize: CELL_SIZE, gridSize: GRID_SIZE, particles: particlesRef.current },
      timestamp
    );

    rafRef.current = requestAnimationFrame(draw);
  }, [spawnEatParticles, spawnCrashParticles, updateParticles, particlesRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', borderRadius: 8 }}
    />
  );
}
