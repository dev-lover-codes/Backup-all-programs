'use server';

/**
 * @fileOverview Implements the AI opponent for the 'Normal' (and 'Hard') level in a Tic-Tac-Toe game.
 *
 * - `getNormalAiMove` - A function that returns the AI's move. It uses a combination of strategic and random choices.
 * - `NormalAiOpponentInput` - The input type for the `getNormalAiMove` function.
 * - `NormalAiOpponentOutput` - The return type for the `getNormalAiMove` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NormalAiOpponentInputSchema = z.object({
  board: z
    .array(z.string().nullable())
    .length(9)
    .describe('The current state of the Tic-Tac-Toe board.'),
  playerEmoji: z.string().describe('The emoji representing the player.'),
  aiEmoji: z.string().describe('The emoji representing the AI.'),
});
export type NormalAiOpponentInput = z.infer<typeof NormalAiOpponentInputSchema>;

const NormalAiOpponentOutputSchema = z.object({
  move: z
    .number()
    .min(-1)
    .max(8)
    .describe('The index of the AI move on the Tic-Tac-Toe board.'),
});
export type NormalAiOpponentOutput = z.infer<typeof NormalAiOpponentOutputSchema>;

export async function getNormalAiMove(input: NormalAiOpponentInput): Promise<NormalAiOpponentOutput> {
  return normalAiOpponentFlow(input);
}

const getStrategicMove = ai.defineTool({
  name: 'getStrategicMove',
  description: 'Determines a strategic move for the AI on the Tic-Tac-Toe board (win if possible, else block).',
  inputSchema: z.object({
    board: z
      .array(z.string().nullable())
      .length(9)
      .describe('The current state of the Tic-Tac-Toe board.'),
    aiEmoji: z.string().describe('The emoji representing the AI.'),
    playerEmoji: z.string().describe('The emoji representing the player.'),
  }),
  outputSchema: z.number().min(-1).max(8).describe('The index of a strategic move, or -1 if none is obvious.'),
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

    // 3. No immediate strategic move
    return -1;
  }
);

function checkWin(board: (string | null)[], emoji: string): boolean {
  const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === emoji && board[b] === emoji && board[c] === emoji) {
          return true;
      }
  }
  return false;
}

const normalAiOpponentFlow = ai.defineFlow(
  {
    name: 'normalAiOpponentFlow',
    inputSchema: NormalAiOpponentInputSchema,
    outputSchema: NormalAiOpponentOutputSchema,
  },
  async input => {
    // Randomly decide whether to play optimally or sub-optimally
    if (Math.random() < 0.75) { // 75% chance to play smart
      const strategicMove = await getStrategicMove({
        board: input.board,
        aiEmoji: input.aiEmoji,
        playerEmoji: input.playerEmoji,
      });

      if (strategicMove !== -1) {
        return {move: strategicMove};
      }
    }
    
    // If no strategic move or in the 25% "random" chance, play a random available move
    const emptyCells = input.board
      .map((cell, index) => (cell === null ? index : null))
      .filter(index => index !== null) as number[];

    if (emptyCells.length === 0) {
      return {move: -1}; // No move available
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return {move: emptyCells[randomIndex]};
  }
);
