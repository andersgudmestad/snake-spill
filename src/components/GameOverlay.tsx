import type { GameStatus, GameStats } from '../types/game';

interface Props {
  status: GameStatus;
  score: number;
  highScore: number;
  stats: GameStats;
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

export function GameOverlay({ status, score, highScore, stats, onStart, onResume, onRestart }: Props) {
  if (status === 'playing') return null;

  return (
    <div className="overlay">
      {status === 'idle' && (
        <>
          <div className="overlay-title">🐍 Snake</div>
          <p className="overlay-sub">Bruk piltaster eller WASD</p>
          <button className="btn-primary" onClick={onStart}>Start spill</button>
        </>
      )}

      {status === 'paused' && (
        <>
          <div className="overlay-title">Pause</div>
          <button className="btn-primary" onClick={onResume}>Fortsett</button>
          <button className="btn-secondary" onClick={onRestart}>Start på nytt</button>
        </>
      )}

      {status === 'dead' && (
        <>
          <div className="overlay-title">Game Over</div>
          <p className="overlay-score">Poeng: <strong>{score}</strong></p>
          {score >= highScore && score > 0 && (
            <p className="overlay-new-record">✨ Ny rekord!</p>
          )}
          <div className="overlay-stats">
            <div className="overlay-stat">
              <span className="overlay-stat-label">Mat spist</span>
              <span className="overlay-stat-value">{stats.foodEaten}</span>
            </div>
            <div className="overlay-stat">
              <span className="overlay-stat-label">Maks lengde</span>
              <span className="overlay-stat-value">{stats.maxLength}</span>
            </div>
            {stats.startTime > 0 && (
              <div className="overlay-stat">
                <span className="overlay-stat-label">Tid overlevd</span>
                <span className="overlay-stat-value">{formatTime(Date.now() - stats.startTime)}</span>
              </div>
            )}
          </div>
          <button className="btn-primary" onClick={onRestart}>Prøv igjen</button>
        </>
      )}
    </div>
  );
}
