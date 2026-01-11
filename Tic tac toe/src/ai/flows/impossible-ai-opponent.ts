'use server';

/**
 * @fileOverview This file defines the Genkit flow for the 'Impossible' AI opponent in a Tic-Tac-Toe game.
 *
 * - getImpossibleAiMove - A function that returns the optimal move.
 * - ImpossibleAiOpponentInput - The input type for the function.
 * - ImpossibleAiOpponentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImpossibleAiOpponentInputSchema = z.object({
  board: z
    .array(z.string().nullable())
    .length(9)
    .describe('The current state of the Tic-Tac-Toe board.'),
  playerEmoji: z.string().describe('The emoji representing the player.'),
  aiEmoji: z.string().describe('The emoji representing the AI.'),
});
export type ImpossibleAiOpponentInput = z.infer<typeof ImpossibleAiOpponentInputSchema>;

const ImpossibleAiOpponentOutputSchema = z.object({
  move: z
    .number()
    .min(-1)
    .max(8)
    .describe('The index of the AI move on the Tic-Tac-Toe board.'),
});
export type ImpossibleAiOpponentOutput = z.infer<typeof ImpossibleAiOpponentOutputSchema>;

export async function getImpossibleAiMove(input: ImpossibleAiOpponentInput): Promise<ImpossibleAiOpponentOutput> {
  return impossibleAiOpponentFlow(input);
}

function checkWin(board: (string | null)[], emoji: string): boolean {
  const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === emoji && board[b] === emoji && board[c] === emoji) {
          return true;
      }
  }
  return false;
}

const getBestMove = ai.defineTool({
  name: 'getBestMoveForImpossibleAI',
  description: 'Determines the best possible move for the AI on the Tic-Tac-Toe board.',
  inputSchema: z.object({
    board: z
      .array(z.string().nullable())
      .length(9)
      .describe('The current state of the Tic-Tac-Toe board.'),
    aiEmoji: z.string().describe('The emoji representing the AI.'),
    playerEmoji: z.string().describe('The emoji representing the player.'),
  }),
  outputSchema: z.number().min(-1).max(8).describe('The index of the best move on the Tic-Tac-Toe board. -1 if no move available.'),
},
async (input) => {
    const {board, aiEmoji, playerEmoji} = input;
    
    // 1. Check for AI win
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const tempBoard = [...board];
        tempBoard[i] = aiEmoji;
        if (checkWin(tempBoard, aiEmoji)) {
          return i;
        }
      }
    }

    // 2. Check to block player win
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const tempBoard = [...board];
        tempBoard[i] = playerEmoji;
        if (checkWin(tempBoard, playerEmoji)) {
          return i;
        }
      }
    }

    // 3. Take center if available
    if (!board[4]) {
      return 4;
    }

    // 4. Take opposite corner
    const oppositeCorners: {[key: number]: number} = {0: 8, 8: 0, 2: 6, 6: 2};
    for (const corner in oppositeCorners) {
        if(board[corner] === playerEmoji && !board[oppositeCorners[corner]]) {
            return oppositeCorners[corner];
        }
    }
    
    // 5. Take empty corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !board[i]);
    if(availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 6. Take any available side
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(i => !board[i]);
    if(availableSides.length > 0) {
        return availableSides[Math.floor(Math.random() * availableSides.length)];
    }
    
    // No move available
    return -1;
  }
);

const impossibleAiOpponentFlow = ai.defineFlow(
  {
    name: 'impossibleAiOpponentFlow',
    inputSchema: ImpossibleAiOpponentInputSchema,
    outputSchema: ImpossibleAiOpponentOutputSchema,
  },
  async input => {
    const bestMove = await getBestMove({
      board: input.board,
      aiEmoji: input.aiEmoji,
      playerEmoji: input.playerEmoji,
    });

    if (bestMove === -1) {
      const firstEmpty = input.board.findIndex(cell => !cell);
      return {move: firstEmpty !== -1 ? firstEmpty : -1};
    }

    return {move: bestMove};
  }
);
