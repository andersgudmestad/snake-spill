import { useState } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useTouchDevice } from './hooks/useTouchDevice';
import { useLeaderboard } from './hooks/useLeaderboard';
import { GameCanvas } from './components/GameCanvas';
import { GameOverlay } from './components/GameOverlay';
import { ScoreBoard } from './components/ScoreBoard';
import { DifficultySelector } from './components/DifficultySelector';
import { MobileControls } from './components/MobileControls';
import { PowerUpIndicator } from './components/PowerUpIndicator';
import { Leaderboard } from './components/Leaderboard';

export default function App() {
  const game = useSnakeGame();
  const isTouch = useTouchDevice();
  const { topTen, loading, qualifiesForTopTen, submitScore } = useLeaderboard();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  async function handleSubmitScore(name: string) {
    return submitScore(name, game.score, game.difficulty);
  }

  return (
    <div className="app">
      <h1 className="app-title">Snake</h1>

      <ScoreBoard
        score={game.score}
        highScore={game.highScore}
        difficulty={game.difficulty}
      />

      <PowerUpIndicator activeEffect={game.activeEffect} />

      <div className="game-wrapper">
        <GameCanvas state={game} />
        <GameOverlay
          status={game.status}
          score={game.score}
          highScore={game.highScore}
          stats={game.stats}
          difficulty={game.difficulty}
          qualifiesForTopTen={qualifiesForTopTen}
          onStart={game.start}
          onResume={game.resume}
          onRestart={game.restart}
          onSubmitScore={handleSubmitScore}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
      </div>

      <DifficultySelector
        value={game.difficulty}
        onChange={game.setDifficulty}
        disabled={game.status === 'playing'}
      />

      {isTouch && (
        <MobileControls
          onDirection={game.changeDirection}
          onPause={game.pause}
          onResume={game.resume}
          status={game.status}
        />
      )}

      {!isTouch && <p className="hint">Space / Esc = pause &nbsp;|&nbsp; Piltaster / WASD = retning</p>}

      {showLeaderboard && (
        <Leaderboard
          topTen={topTen}
          loading={loading}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}
