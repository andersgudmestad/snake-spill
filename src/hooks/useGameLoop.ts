import { useEffect, useRef } from 'react';

export function useGameLoop(tick: () => void, intervalMs: number, active: boolean) {
  const lastTickTime = useRef<number>(0);
  const rafId = useRef<number>(0);
  const tickRef = useRef(tick);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    if (!active) return;

    lastTickTime.current = 0;

    const loop = (timestamp: number) => {
      if (timestamp - lastTickTime.current >= intervalMs) {
        lastTickTime.current = timestamp;
        tickRef.current();
      }
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [intervalMs, active]);
}
