'use server';

/**
 * @fileOverview AI opponent for the 'Easy' level in Tic Tac Toe.
 *
 * - getEasyAiMove - A function that returns the least advantageous move for the AI.
 * - EasyAiMoveInput - The input type for the getEasyAiMove function.
 * - EasyAiMoveOutput - The return type for the getEasyAiMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EasyAiMoveInputSchema = z.object({
  board: z.array(z.string()).length(9).describe('The current state of the Tic Tac Toe board. Each element is either \'X\', \'O\', or an empty string for an empty cell.'),
  player: z.string().describe('The player whose turn it is (either \'X\' or \'O\').'),
});
export type EasyAiMoveInput = z.infer<typeof EasyAiMoveInputSchema>;

const EasyAiMoveOutputSchema = z.object({
  move: z.number().int().min(0).max(8).describe('The index (0-8) of the least advantageous move for the AI.'),
});
export type EasyAiMoveOutput = z.infer<typeof EasyAiMoveOutputSchema>;

export async function getEasyAiMove(input: EasyAiMoveInput): Promise<EasyAiMoveOutput> {
  return easyAiMoveFlow(input);
}

const getLeastAdvantageousMove = ai.defineTool(
  {
    name: 'getLeastAdvantageousMove',
    description: 'Suggests the least advantageous move for the AI player in a Tic Tac Toe game, allowing the user to win.',
    inputSchema: EasyAiMoveInputSchema,
    outputSchema: z.number().int().min(0).max(8).describe('The index (0-8) of the least advantageous move.'),
  },
  async (input) => {
    const {board, player} = input;

    // Find all empty cells on the board
    const emptyCells = board
      .map((cell, index) => (cell === '' ? index : null))
      .filter(index => index !== null) as number[];

    // If there are no empty cells, return -1 (no move possible)
    if (emptyCells.length === 0) {
      return -1;
    }

    // Return a random empty cell (least advantageous)
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }
);

const easyAiMovePrompt = ai.definePrompt({
  name: 'easyAiMovePrompt',
  tools: [getLeastAdvantageousMove],
  input: {schema: EasyAiMoveInputSchema},
  output: {schema: EasyAiMoveOutputSchema},
  prompt: `You are an AI that always makes the worst possible move in Tic Tac Toe, letting the human player win.

  The current board state is:
  {{board}}

  It is player {{player}}'s turn.

  Use the getLeastAdvantageousMove tool to find the best move to make (worst for the AI, best for the human).
  Return the index of the move in the move field.
  `,
});

const easyAiMoveFlow = ai.defineFlow(
  {
    name: 'easyAiMoveFlow',
    inputSchema: EasyAiMoveInputSchema,
    outputSchema: EasyAiMoveOutputSchema,
  },
  async input => {
    const {output} = await easyAiMovePrompt(input);
    return {
      move: output!.move,
    };
  }
);
