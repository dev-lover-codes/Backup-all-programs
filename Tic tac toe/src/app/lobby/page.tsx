
'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Swords } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LobbyPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isFindingMatch, setIsFindingMatch] = useState(false);

  // Redirect to login if user is not authenticated and loading is complete
  if (!isUserLoading && !user) {
    router.replace('/login');
    return null;
  }
  
  const handleFindMatch = async () => {
    setIsFindingMatch(true);
    // In the future, this will trigger the matchmaking logic.
    // For now, it just shows a loading state.
  };

  // Show a loading skeleton while checking auth state
  if (isUserLoading || !user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Online Lobby</CardTitle>
          <CardDescription>Welcome, {user.email}! Ready for a challenge?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="w-full"
            onClick={handleFindMatch}
            disabled={isFindingMatch}
          >
            {isFindingMatch ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Swords className="mr-2 h-5 w-5" />
            )}
            {isFindingMatch ? 'Searching for opponent...' : 'Find Match'}
          </Button>
          <p className="text-sm text-muted-foreground">
            You will be matched with another player automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
