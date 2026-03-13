import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Difficulty, LeaderboardEntry } from '../types/game';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
);

type TopTenMap = Record<Difficulty, LeaderboardEntry[]>;

export function useLeaderboard() {
  const [topTen, setTopTen] = useState<TopTenMap>({ easy: [], medium: [], hard: [] });
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('high_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(30);

    if (data) {
      const map: TopTenMap = { easy: [], medium: [], hard: [] };
      for (const entry of data as LeaderboardEntry[]) {
        const list = map[entry.difficulty];
        if (list.length < 10) list.push(entry);
      }
      setTopTen(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const qualifiesForTopTen = useCallback(
    (score: number, difficulty: Difficulty): boolean => {
      const list = topTen[difficulty];
      if (list.length < 10) return score > 0;
      return score > list[list.length - 1].score;
    },
    [topTen]
  );

  const submitScore = useCallback(
    async (playerName: string, score: number, difficulty: Difficulty): Promise<boolean> => {
      const { error } = await supabase
        .from('high_scores')
        .insert({ player_name: playerName.trim(), score, difficulty });
      if (error) return false;
      await fetchAll();
      return true;
    },
    [fetchAll]
  );

  return { topTen, loading, qualifiesForTopTen, submitScore, refresh: fetchAll };
}
