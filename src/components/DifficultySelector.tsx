import type { Difficulty } from '../types/game';

interface Props {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  disabled?: boolean;
}

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Lett' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Vanskelig' },
];

export function DifficultySelector({ value, onChange, disabled }: Props) {
  return (
    <div className="difficulty-selector">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          className={`diff-btn ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
          disabled={disabled}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
