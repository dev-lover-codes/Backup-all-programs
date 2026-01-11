import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bot, ArrowLeft, LogIn } from 'lucide-react';

export default function ModeSelectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
       <Button asChild variant="ghost" className="absolute top-4 left-4">
        <Link href="/">
          <ArrowLeft /> Back to Home
        </Link>
      </Button>
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Choose Your Mode</CardTitle>
          <CardDescription>How would you like to play today?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/offline">
              <Bot className="mr-2" /> Play Offline vs. AI
            </Link>
          </Button>
          <Button asChild size="lg">
             <Link href="/login">
              <LogIn className="mr-2" /> Play Online
            </Link>
          </Button>
           <Button asChild size="lg" variant="secondary">
             <Link href="/play?mode=pvp">
              <Users className="mr-2" /> 2-Player Offline
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
