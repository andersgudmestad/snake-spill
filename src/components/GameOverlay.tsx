import { useState } from 'react';
import type { GameStatus, GameStats, Difficulty } from '../types/game';

interface Props {
  status: GameStatus;
  score: number;
  highScore: number;
  stats: GameStats;
  difficulty: Difficulty;
  qualifiesForTopTen: (score: number, difficulty: Difficulty) => boolean;
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
  onSubmitScore: (name: string) => Promise<boolean>;
  onShowLeaderboard: () => void;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}

export function GameOverlay({
  status, score, highScore, stats, difficulty,
  qualifiesForTopTen, onStart, onResume, onRestart,
  onSubmitScore, onShowLeaderboard,
}: Props) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (status === 'playing') return null;

  const canSubmit = status === 'dead' && !submitted && qualifiesForTopTen(score, difficulty);

  async function handleSubmit() {
    if (!name.trim()) return;
    setSubmitting(true);
    const ok = await onSubmitScore(name.trim());
    if (ok) setSubmitted(true);
    setSubmitting(false);
  }

  // Reset submission state when starting a new game
  function handleRestart() {
    setName('');
    setSubmitted(false);
    onRestart();
  }

  function handleStart() {
    setName('');
    setSubmitted(false);
    onStart();
  }

  return (
    <div className="overlay">
      {status === 'idle' && (
        <>
          <div className="overlay-title">🐍 Snake</div>
          <p className="overlay-sub">Bruk piltaster eller WASD</p>
          <button className="btn-primary" onClick={handleStart}>Start spill</button>
          <button className="btn-secondary" onClick={onShowLeaderboard}>🏆 Toppliste</button>
        </>
      )}

      {status === 'paused' && (
        <>
          <div className="overlay-title">Pause</div>
          <button className="btn-primary" onClick={onResume}>Fortsett</button>
          <button className="btn-secondary" onClick={handleRestart}>Start på nytt</button>
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

          {canSubmit && (
            <div className="leaderboard-submit">
              <p className="leaderboard-submit-label">🏆 Du kvalifiserer til topplisten!</p>
              <input
                className="leaderboard-name-input"
                type="text"
                placeholder="Ditt navn"
                maxLength={20}
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={submitting || !name.trim()}
              >
                {submitting ? 'Lagrer...' : 'Lagre til toppliste'}
              </button>
            </div>
          )}

          {submitted && (
            <div className="leaderboard-submitted">
              <p className="leaderboard-submit-label">✅ Score lagret!</p>
              <button className="btn-secondary" onClick={onShowLeaderboard}>Se topplisten</button>
            </div>
          )}

          <button className="btn-primary" onClick={handleRestart}>Prøv igjen</button>
        </>
      )}
    </div>
  );
}
