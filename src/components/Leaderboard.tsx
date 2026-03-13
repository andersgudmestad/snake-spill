import { useState } from 'react';
import type { Difficulty, LeaderboardEntry } from '../types/game';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Lett',
  medium: 'Middels',
  hard: 'Vanskelig',
};

interface Props {
  topTen: Record<Difficulty, LeaderboardEntry[]>;
  loading: boolean;
  onClose: () => void;
}

export function Leaderboard({ topTen, loading, onClose }: Props) {
  const [tab, setTab] = useState<Difficulty>('hard');

  const entries = topTen[tab];

  return (
    <div className="leaderboard-backdrop" onClick={onClose}>
      <div className="leaderboard-modal" onClick={e => e.stopPropagation()}>
        <div className="leaderboard-header">
          <span className="leaderboard-title">🏆 Toppliste</span>
          <button className="leaderboard-close" onClick={onClose}>✕</button>
        </div>

        <div className="leaderboard-tabs">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              className={`leaderboard-tab${tab === d ? ' active' : ''}`}
              onClick={() => setTab(d)}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="leaderboard-loading">Laster...</p>
        ) : entries.length === 0 ? (
          <p className="leaderboard-empty">Ingen rekorder ennå — bli den første!</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Navn</th>
                <th>Poeng</th>
                <th>Dato</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id}>
                  <td className="leaderboard-rank">{i + 1}</td>
                  <td className="leaderboard-name">{e.player_name}</td>
                  <td className="leaderboard-score">{e.score}</td>
                  <td className="leaderboard-date">
                    {new Date(e.created_at).toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
