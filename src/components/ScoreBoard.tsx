import { useRef, useEffect, useState } from 'react';
import type { Difficulty } from '../types/game';

interface Props {
  score: number;
  highScore: number;
  difficulty: Difficulty;
}

const LABEL: Record<Difficulty, string> = {
  easy: 'Lett',
  medium: 'Medium',
  hard: 'Vanskelig',
};

export function ScoreBoard({ score, highScore, difficulty }: Props) {
  const [recordFlash, setRecordFlash] = useState(false);
  const prevHighScore = useRef(highScore);

  useEffect(() => {
    if (highScore > prevHighScore.current) {
      prevHighScore.current = highScore;
      setRecordFlash(true);
      const t = setTimeout(() => setRecordFlash(false), 700);
      return () => clearTimeout(t);
    }
  }, [highScore]);

  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="score-label">Poeng</span>
        <span className="score-value">{score}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Rekord</span>
        <span className={`score-value ${recordFlash ? 'record-flash' : ''}`}>{highScore}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Nivå</span>
        <span className="score-value difficulty">{LABEL[difficulty]}</span>
      </div>
    </div>
  );
}
