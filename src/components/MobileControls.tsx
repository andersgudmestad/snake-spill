import type { Direction } from '../types/game';

interface Props {
  onDirection: (d: Direction) => void;
}

export function MobileControls({ onDirection }: Props) {
  const btn = (dir: Direction, label: string) => (
    <button
      className="dpad-btn"
      onTouchStart={e => { e.preventDefault(); onDirection(dir); }}
      onClick={() => onDirection(dir)}
      aria-label={dir}
    >
      {label}
    </button>
  );

  return (
    <div className="dpad">
      <div className="dpad-row">{btn('UP', '▲')}</div>
      <div className="dpad-row">
        {btn('LEFT', '◀')}
        <div className="dpad-center" />
        {btn('RIGHT', '▶')}
      </div>
      <div className="dpad-row">{btn('DOWN', '▼')}</div>
    </div>
  );
}
