'use server';

import { getEasyAiMove } from '@/ai/flows/easy-ai-opponent';
import { getNormalAiMove } from '@/ai/flows/normal-ai-opponent';
import { getImpossibleAiMove } from '@/ai/flows/impossible-ai-opponent';
import type { Difficulty } from '@/types';

export async function getAiMove(
  board: (string | null)[],
  difficulty: Difficulty,
  playerEmoji: string,
  aiEmoji: string
): Promise<{ move: number }> {
  try {
    switch (difficulty) {
      case 'easy':
        const boardStrings = board.map(cell => cell || '');
        // The easy AI flow expects 'X' or 'O', so we'll just pass the aiEmoji as the player
        return await getEasyAiMove({ board: boardStrings, player: aiEmoji });
      case 'normal':
        return await getNormalAiMove({ board, playerEmoji, aiEmoji });
      case 'impossible':
        return await getImpossibleAiMove({ board, playerEmoji, aiEmoji });
      case 'hard': // Hard just uses normal AI, unless specified otherwise in play page
        return await getNormalAiMove({ board, playerEmoji, aiEmoji });
      default:
        throw new Error(`Invalid difficulty level: ${difficulty}`);
    }
  } catch (error) {
    console.error('Error getting AI move:', error);
    // Fallback to a random move if AI fails
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter(index => index !== -1);
    if (emptyCells.length > 0) {
      const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      return { move: randomMove };
    }
    return { move: -1 };
  }
}
