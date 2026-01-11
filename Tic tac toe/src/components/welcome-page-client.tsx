'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StageGrid } from '@/components/stage-grid';
import { useGameStore } from '@/hooks/use-game-store';
import { Gamepad2, Users, Sparkles } from 'lucide-react';
import { StageGrid as StageGridSkeleton } from './stage-grid';

export function WelcomePageClient() {
  const { stage, isLoaded } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-4xl text-center shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader>
          <div className="flex justify-center items-center gap-4">
            <Sparkles className="w-10 h-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-headline">
              Emoji Tic-Tac-Toe Arena
            </h1>
          </div>
          <p className="text-muted-foreground mt-4 text-lg">
            Welcome, challenger! Conquer all 100 stages to become the ultimate champion.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 font-headline">Your Journey</h2>
            {isLoaded ? <StageGrid currentStage={stage} /> : <StageGridSkeleton.Skeleton />}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Link href="/play">
                <Gamepad2 />
                <span>{stage > 1 ? `Continue to Stage ${stage}` : 'Play vs AI'}</span>
              </Link>
            </Button>
            <Button size="lg" variant="secondary" disabled className="shadow-lg">
              <Users />
              <span>Play Online (Coming Soon)</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
