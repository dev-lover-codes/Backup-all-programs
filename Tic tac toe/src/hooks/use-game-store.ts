'use client';

import { useState, useEffect, useCallback } from 'react';
import { EMOJI_OPTIONS, GameProgress } from '@/types';

const PROGRESS_KEY = 'tic-tac-toe-progress';
const EMOJI_KEY = 'tic-tac-toe-emoji';

const initialProgress: GameProgress = {
  easy: 0,
  medium: 0,
  hard: 0,
};

export function useGameStore() {
  const [progress, setProgressState] = useState<GameProgress>(initialProgress);
  const [playerEmoji, setPlayerEmojiState] = useState(EMOJI_OPTIONS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      const savedEmoji = localStorage.getItem(EMOJI_KEY);

      if (savedProgress) {
        setProgressState(JSON.parse(savedProgress));
      }
      if (savedEmoji && EMOJI_OPTIONS.includes(savedEmoji)) {
        setPlayerEmojiState(savedEmoji);
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
      // If parsing fails, reset to initial state
      setProgressState(initialProgress);
      setPlayerEmojiState(EMOJI_OPTIONS[0]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setProgress = useCallback((newProgress: Partial<GameProgress>) => {
    setProgressState(prev => {
      const updatedProgress = { ...prev, ...newProgress };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedProgress));
      return updatedProgress;
    });
  }, []);
  
  const advanceStage = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    setProgressState(prev => {
      const newStage = prev[difficulty] + 1;
      const updatedProgress = { ...prev, [difficulty]: newStage };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedProgress));
      return updatedProgress;
    })
  }, []);


  const setPlayerEmoji = useCallback((newEmoji: string) => {
    setPlayerEmojiState(newEmoji);
    localStorage.setItem(EMOJI_KEY, newEmoji);
  }, []);

  return { progress, playerEmoji, setProgress, advanceStage, setPlayerEmoji, isLoaded };
}
