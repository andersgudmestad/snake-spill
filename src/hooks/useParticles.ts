import { useRef, useCallback } from 'react';
import type { Particle } from '../types/game';
import { COLORS } from '../constants/game';

export function useParticles() {
  const particlesRef = useRef<Particle[]>([]);

  const spawnEatParticles = useCallback((x: number, y: number, cellSize: number) => {
    const cx = (x + 0.5) * cellSize;
    const cy = (y + 0.5) * cellSize;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.04 + Math.random() * 0.02,
        color: COLORS.food,
        size: 2 + Math.random() * 2,
      });
    }
  }, []);

  const spawnCrashParticles = useCallback((x: number, y: number, cellSize: number) => {
    const cx = (x + 0.5) * cellSize;
    const cy = (y + 0.5) * cellSize;
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.015 + Math.random() * 0.02,
        color: COLORS.snakeHead,
        size: 2 + Math.random() * 4,
      });
    }
  }, []);

  const updateParticles = useCallback(() => {
    particlesRef.current = particlesRef.current
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.08, // gravity
        life: p.life - p.decay,
      }))
      .filter(p => p.life > 0);
  }, []);

  return { particlesRef, spawnEatParticles, spawnCrashParticles, updateParticles };
}
