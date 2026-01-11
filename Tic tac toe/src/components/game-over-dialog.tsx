'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { GameResult } from '@/types';
import { STAGES_PER_DIFFICULTY } from '@/types';
import { Frown, Meh, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface GameOverDialogProps {
  result: GameResult;
  onNext: () => void;
  onRetry: () => void;
  stage: number;
  difficulty: 'easy' | 'medium' | 'hard';
  gameMode: 'pve' | 'pvp' | null;
}

const resultDetails = {
  win: {
    icon: <Trophy className="w-16 h-16 text-yellow-400" />,
    title: 'Victory!',
    descriptionPVE: "You cleared the stage! Ready for the next challenge?",
    descriptionPVP: "Player 1 wins the match!",
  },
  lose: {
    icon: <Trophy className="w-16 h-16 text-yellow-400" />,
    title: 'Player 2 Wins!',
    descriptionPVE: "The AI got the best of you this time. Don't give up!",
    descriptionPVP: "Congratulations to Player 2!",
  },
  draw: {
    icon: <Meh className="w-16 h-16 text-gray-500" />,
    title: "It's a Draw!",
    description: "A hard-fought battle ends in a stalemate. Time for a rematch!",
  },
};

export function GameOverDialog({ result, onNext, onRetry, stage, difficulty, gameMode }: GameOverDialogProps) {
  if (!result) return null;

  const details = resultDetails[result];
  const isLastStageOfDifficulty = stage >= STAGES_PER_DIFFICULTY;
  
  let description = '';
  if (result === 'draw') {
    description = details.description;
  } else if (gameMode === 'pvp') {
    description = result === 'win' ? resultDetails.win.descriptionPVP : resultDetails.lose.descriptionPVP;
  } else { // pve
    description = result === 'win' ? resultDetails.win.descriptionPVE : resultDetails.lose.descriptionPVE;
  }
  
  let title = details.title;
  if(gameMode === 'pve' && result === 'lose') {
      title = "Defeat!";
  } else if (gameMode === 'pvp' && result === 'lose'){
      title = resultDetails.lose.title;
  }
  
  let icon = details.icon;
  if(gameMode === 'pve' && result === 'lose') {
      icon = <Frown className="w-16 h-16 text-red-500" />;
  }


  return (
    <AlertDialog open={!!result}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">{icon}</div>
          <AlertDialogTitle className="text-center text-3xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link href={gameMode === 'pve' ? '/offline' : '/mode-select'}>Back to Menu</Link>
          </Button>
          
          {gameMode === 'pve' && result === 'win' ? (
             isLastStageOfDifficulty ? (
              <Button asChild className="bg-green-500 hover:bg-green-600">
                <Link href="/offline">Finish {difficulty} Level <Trophy className="ml-2 w-4 h-4" /></Link>
              </Button>
            ) : (
              <AlertDialogAction onClick={onNext} className="bg-green-500 hover:bg-green-600">
                Next Stage <ArrowRight className="ml-2 w-4 h-4" />
              </AlertDialogAction>
            )
          ) : (
            <AlertDialogAction onClick={onRetry}>
              {gameMode === 'pvp' ? 'Play Again' : 'Try Again'} <RotateCcw className="ml-2 w-4 h-4" />
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
