export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export type GameStatus = 'setup' | 'playing' | 'finished';

export type GameResult = 'win' | 'lose' | 'draw' | null;

export const AI_EMOJI = '🤖';

export const EMOJI_OPTIONS = ['😊', '😎', '😂', '🥳', '👻', '🦄', '🍕', '🚀', '🤯', '🤩', '👑', '👽', '👾', '🧡', '🔥', '💧'];

export const STAGES_PER_DIFFICULTY = 15;

export interface GameProgress {
  easy: number;
  medium: number;
  hard: number;
}
