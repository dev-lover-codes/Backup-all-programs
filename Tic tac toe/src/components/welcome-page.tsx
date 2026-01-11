import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Play } from 'lucide-react';

export function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl text-center shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader>
          <div className="flex justify-center items-center gap-4">
            <Sparkles className="w-10 h-10 text-primary" />
            <CardTitle className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-headline">
              Emoji Tic-Tac-Toe Arena
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground mt-4 text-lg">
            Welcome, challenger! Prove your skills against the AI and climb the ranks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Button asChild size="lg" className="shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Link href="/mode-select">
              <Play />
              <span>Start Game</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
