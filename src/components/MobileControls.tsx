import type { Direction, GameStatus } from '../types/game';

interface Props {
  onDirection: (d: Direction) => void;
  onPause: () => void;
  onResume: () => void;
  status: GameStatus;
}

export function MobileControls({ onDirection, onPause, onResume, status }: Props) {
  const btn = (dir: Direction, label: string) => (
    <button
      className="dpad-btn"
      onTouchStart={e => { e.preventDefault(); navigator.vibrate?.(15); onDirection(dir); }}
      onClick={() => onDirection(dir)}
      aria-label={dir}
    >
      {label}
    </button>
  );

  const handlePauseToggle = () => {
    if (status === 'playing') { navigator.vibrate?.(30); onPause(); }
    else if (status === 'paused') { onResume(); }
  };

  return (
    <div className="mobile-controls">
      {(status === 'playing' || status === 'paused') && (
        <button
          className="pause-btn"
          onTouchStart={e => { e.preventDefault(); handlePauseToggle(); }}
          onClick={handlePauseToggle}
          aria-label={status === 'paused' ? 'Fortsett' : 'Pause'}
        >
          {status === 'paused' ? '▶' : '⏸'}
        </button>
      )}
      <div className="dpad">
        <div className="dpad-row">{btn('UP', '▲')}</div>
        <div className="dpad-row">
          {btn('LEFT', '◀')}
          <div className="dpad-center" />
          {btn('RIGHT', '▶')}
        </div>
        <div className="dpad-row">{btn('DOWN', '▼')}</div>
      </div>
    </div>
  );
}
