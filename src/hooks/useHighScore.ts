import { useState, useEffect } from 'react';

const KEY = 'snake-highscore';

export function useHighScore(score: number): number {
  const [highScore, setHighScore] = useState<number>(() => {
    const stored = localStorage.getItem(KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(KEY, String(score));
    }
  }, [score, highScore]);

  return highScore;
}
