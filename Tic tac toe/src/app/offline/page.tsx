'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGameStore } from '@/hooks/use-game-store';
import { ArrowLeft, Lock, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STAGES_PER_DIFFICULTY } from '@/types';

export default function OfflinePage() {
  const { progress, isLoaded } = useGameStore();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl p-4 space-y-4">
          <div className="h-24 w-full bg-muted rounded-lg animate-pulse" />
          <div className="h-48 w-full bg-muted rounded-lg animate-pulse" />
          <div className="h-48 w-full bg-muted rounded-lg animate-pulse" />
          <div className="h-48 w-full bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  const isMediumUnlocked = progress.easy >= STAGES_PER_DIFFICULTY;
  const isHardUnlocked = progress.medium >= STAGES_PER_DIFFICULTY;
  const isGameCompleted = progress.hard >= STAGES_PER_DIFFICULTY;

  const DifficultyCard = ({
    title,
    description,
    difficulty,
    currentStage,
    isUnlocked,
    isCompleted,
  }: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    currentStage: number;
    isUnlocked: boolean;
    isCompleted: boolean;
  }) => (
    <Card className={cn('w-full shadow-lg transition-all transform hover:scale-[1.02]', !isUnlocked && 'bg-muted/50')}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold font-headline">{title}</span>
          {isUnlocked ? (
            isCompleted ? (
              <Trophy className="w-8 h-8 text-yellow-400" />
            ) : (
              <span className="text-sm font-semibold text-primary">
                Stage {currentStage + 1} / {STAGES_PER_DIFFICULTY}
              </span>
            )
          ) : (
            <Lock className="w-6 h-6 text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isUnlocked ? (
          <Button asChild size="lg" className="w-full">
            <Link href={`/play?mode=pve&difficulty=${difficulty}`}>
              {isCompleted ? 'Replay' : currentStage > 0 ? 'Continue' : 'Start'}
            </Link>
          </Button>
        ) : (
          <Button size="lg" className="w-full" disabled>
            Locked
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Button asChild variant="ghost" className="absolute top-4 left-4">
        <Link href="/mode-select">
          <ArrowLeft /> Back
        </Link>
      </Button>
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-headline">Play vs. AI</h1>
          <p className="text-muted-foreground mt-2">Complete all stages for each difficulty to progress.</p>
        </div>

        {isGameCompleted && (
           <Card className="w-full text-center p-6 bg-gradient-to-r from-primary to-accent text-primary-foreground">
             <Trophy className="w-12 h-12 mx-auto mb-4" />
             <CardTitle className="text-2xl font-bold">Congratulations!</CardTitle>
             <CardDescription className="text-primary-foreground/80 mt-2">
               You have mastered the Emoji Tic-Tac-Toe Arena!
             </CardDescription>
           </Card>
        )}

        <div className="space-y-4">
          <DifficultyCard
            title="Easy"
            description="A gentle start. The AI is quite forgiving."
            difficulty="easy"
            currentStage={progress.easy}
            isUnlocked={true}
            isCompleted={progress.easy >= STAGES_PER_DIFFICULTY}
          />
          <DifficultyCard
            title="Medium"
            description="A balanced challenge. The AI will put up a good fight."
            difficulty="medium"
            currentStage={progress.medium}
            isUnlocked={isMediumUnlocked}
            isCompleted={progress.medium >= STAGES_PER_DIFFICULTY}
          />
          <DifficultyCard
            title="Hard"
            description="A true test of your skills. The AI is relentless."
            difficulty="hard"
            currentStage={progress.hard}
            isUnlocked={isHardUnlocked}
            isCompleted={progress.hard >= STAGES_PER_DIFFICULTY}
          />
        </div>
      </div>
    </div>
  );
}
