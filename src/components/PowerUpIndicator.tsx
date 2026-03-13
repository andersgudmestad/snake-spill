import { useEffect, useState } from 'react';
import type { ActiveEffect } from '../types/game';
import { POWER_UP_COLORS, POWER_UP_LABELS, POWER_UP_SYMBOLS } from '../constants/game';

interface Props {
  activeEffect: ActiveEffect | null;
}

export function PowerUpIndicator({ activeEffect }: Props) {
  const [, rerender] = useState(0);

  useEffect(() => {
    if (!activeEffect) return;
    const interval = setInterval(() => rerender(n => n + 1), 100);
    return () => clearInterval(interval);
  }, [activeEffect]);

  if (!activeEffect) return <div className="power-up-indicator-placeholder" />;

  const secondsLeft = Math.max(0, Math.ceil((activeEffect.endsAt - Date.now()) / 1000));
  const color = POWER_UP_COLORS[activeEffect.type];

  return (
    <div className="power-up-indicator" style={{ borderColor: color, color }}>
      <span className="power-up-symbol">{POWER_UP_SYMBOLS[activeEffect.type]}</span>
      <span className="power-up-name">{POWER_UP_LABELS[activeEffect.type]}</span>
      <span className="power-up-timer">{secondsLeft}s</span>
    </div>
  );
}
