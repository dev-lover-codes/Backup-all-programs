'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { AI_EMOJI } from '@/types';

interface GameBoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  playerTurn: boolean;
  isThinking: boolean;
  winner: string | null | undefined;
  winningLine: number[] | null;
  gameMode?: 'pve' | 'pvp' | null;
}

const getLineCoords = (line: number[], cellSize: number) => {
  if (!line || line.length < 3) return null;

  const getCenter = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    };
  };

  const start = getCenter(line[0]);
  const end = getCenter(line[2]);

  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
};


export function GameBoard({ board, onCellClick, playerTurn, isThinking, winner, winningLine, gameMode }: GameBoardProps) {
  const cellSize = 112; // md:w-28, md:h-28 in Tailwind is 7rem = 112px
  const lineCoords = winningLine ? getLineCoords(winningLine, cellSize) : null;
  const winnerColor = 'hsl(var(--neon-yellow))';
  
  const isDisabled = (cell: string | null) => {
    if (winner || !!cell) return true;
    if (gameMode === 'pve') return isThinking || !playerTurn;
    return false;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative grid grid-cols-3"
        style={{
          boxShadow: '0 0 10px hsl(var(--neon-blue)), 0 0 20px hsl(var(--neon-blue))',
          border: '2px solid hsl(var(--neon-blue))',
          borderRadius: '1rem',
        }}
      >
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => onCellClick(index)}
            disabled={isDisabled(cell)}
            className={cn(
              'relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
              'transition-all duration-200 transform-gpu',
              'text-5xl md:text-6xl',
              'disabled:cursor-not-allowed',
              'border-2 border-neon-blue/50',
              'hover:bg-neon-blue/10',
              {
                'border-t-0': index > 2,
                'border-b-0': index < 6,
                'border-l-0': index % 3 !== 0,
                'border-r-0': index % 3 !== 2,
                'rounded-tl-lg': index === 0,
                'rounded-tr-lg': index === 2,
                'rounded-bl-lg': index === 6,
                'rounded-br-lg': index === 8,
              }
            )}
            style={{
              borderColor: 'hsl(var(--neon-blue) / 0.5)',
              boxShadow: 'inset 0 0 5px hsl(var(--neon-blue) / 0.5)',
            }}
            aria-label={`Cell ${index + 1}`}
          >
            {cell && (
              <span
                className={cn(
                  'relative z-10 animate-in zoom-in-95 duration-300'
                )}
                style={{
                  color: cell === AI_EMOJI ? 'hsl(var(--neon-red))' : 'hsl(var(--neon-blue))',
                  textShadow: `
                    0 0 5px ${cell === AI_EMOJI ? 'hsl(var(--neon-red))' : 'hsl(var(--neon-blue))'},
                    0 0 10px ${cell === AI_EMOJI ? 'hsl(var(--neon-red))' : 'hsl(var(--neon-blue))'},
                    0 0 20px ${cell === AI_EMOJI ? 'hsl(var(--neon-red))' : 'hsl(var(--neon-blue))'}
                  `
                }}
              >
                {cell}
              </span>
            )}
          </button>
        ))}
         {lineCoords && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
               style={{
                filter: `drop-shadow(0 0 5px ${winnerColor}) drop-shadow(0 0 10px ${winnerColor})`
               }}
          >
            <line 
                {...lineCoords} 
                stroke={winnerColor} 
                strokeWidth="6" 
                strokeLinecap="round" 
                className="animate-in fade-in-0"
            />
          </svg>
        )}
      </div>
      <div className="flex items-center justify-center h-8">
        {/* The "Making a move..." indicator has been removed to make the AI's turn appear instant. */}
      </div>
    </div>
  );
}
