import { useEffect } from 'react';
import type { Direction } from '../types/game';

const THRESHOLD = 30;

export function useSwipeControls(onDirection: (d: Direction) => void) {
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        onDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onDirection]);
}
