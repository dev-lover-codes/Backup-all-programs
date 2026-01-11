'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameBoard } from '@/components/game-board';
import { GameOverDialog } from '@/components/game-over-dialog';
import { useGameStore } from '@/hooks/use-game-store';
import { checkWinner } from '@/lib/game-logic';
import { getAiMove } from '@/lib/actions';
import type { Difficulty, GameResult, GameStatus } from '@/types';
import { AI_EMOJI, EMOJI_OPTIONS, STAGES_PER_DIFFICULTY } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function PlayPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { progress, advanceStage, playerEmoji, setPlayerEmoji, isLoaded } = useGameStore();

  const gameMode = searchParams.get('mode') as 'pve' | 'pvp' | null; // Player vs Env (AI) or Player vs Player
  const difficultyParam = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null;
  
  const [status, setStatus] = useState<GameStatus>('setup');
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // In PvP, true is P1, false is P2
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<GameResult>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  
  // Player Emojis for PvP mode
  const [player2Emoji, setPlayer2Emoji] = useState(EMOJI_OPTIONS[1]);

  const difficulty = difficultyParam || 'easy';
  const currentStage = progress[difficulty] || 0;
  const isFirstEverGame = progress.easy === 0 && progress.medium === 0 && progress.hard === 0;

  // Determine opponent and current player emoji based on mode
  const opponentEmoji = gameMode === 'pve' ? AI_EMOJI : player2Emoji;
  const currentPlayerEmoji = isPlayerTurn ? playerEmoji : opponentEmoji;

  let aiDifficulty: Difficulty = difficulty;
  if (gameMode === 'pve') {
    if (difficulty === 'medium') {
      aiDifficulty = 'normal';
    }
    if (difficulty === 'hard' && currentStage === STAGES_PER_DIFFICULTY - 1) {
      aiDifficulty = 'impossible';
    }
  }

  const winnerInfo = checkWinner(board);
  const winner = winnerInfo?.winner;
  const isDraw = board.every(cell => cell !== null) && !winner;

  const handleStartGame = () => {
    if (playerEmoji && (gameMode === 'pve' || player2Emoji)) {
       if (gameMode === 'pvp' && playerEmoji === player2Emoji) {
        toast({
          title: "Choose Different Emojis",
          description: "Player 1 and Player 2 must have different emojis.",
          variant: "destructive",
        });
        return;
      }
      setStatus('playing');
    }
  };
  
  const resetGame = useCallback((startPlaying = false) => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setResult(null);
    setWinningLine(null);
    if(startPlaying) {
      setStatus('playing');
    }
  }, []);

  const handleNextStage = () => {
    if (gameMode === 'pve' && result === 'win') {
      advanceStage(difficulty);
    }
    
    if (gameMode === 'pve') {
        const nextStage = currentStage + 1;
        if (nextStage >= STAGES_PER_DIFFICULTY) {
          router.push('/offline');
        } else {
          resetGame(true);
        }
    } else { // PvP mode
        resetGame(true);
    }
  };

  const handleRetry = () => {
    resetGame(true);
  };
  
  const handleCellClick = async (index: number) => {
    if (board[index] || winner || isDraw || (gameMode === 'pve' && !isPlayerTurn) ) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayerEmoji;
    setBoard(newBoard);
    setIsPlayerTurn(prev => !prev);
  };
  
  useEffect(() => {
    if (!gameMode) {
      router.replace('/mode-select');
      return;
    }

    if (gameMode === 'pve' && !difficultyParam) {
      router.replace('/offline');
      return;
    }
  
    const winnerInfo = checkWinner(board);
    if (winnerInfo) {
      setWinningLine(winnerInfo.winningLine);
      if (winnerInfo.winner === playerEmoji) setResult('win');
      else if (winnerInfo.winner === opponentEmoji) setResult('lose');
      setStatus('finished');
      return;
    }

    if (isDraw) {
      setResult('draw');
      setStatus('finished');
      return;
    }
    
    if (gameMode === 'pve' && !isPlayerTurn && !isThinking) {
      setIsThinking(true);
      const makeAiMove = async () => {
        try {
          const response = await getAiMove(board, aiDifficulty, playerEmoji, AI_EMOJI);
          const aiMove = response.move;

          if (aiMove !== -1 && !board[aiMove]) {
            const newBoard = [...board];
            newBoard[aiMove] = AI_EMOJI;
            setBoard(newBoard);
            setIsPlayerTurn(true);
            setIsThinking(false);
          } else {
            setIsPlayerTurn(true);
            setIsThinking(false);
          }
        } catch (error) {
          console.error("AI move failed:", error);
          toast({
            title: "AI Error",
            description: "The AI failed to make a move. It's your turn again.",
            variant: "destructive",
          });
          setIsPlayerTurn(true);
          setIsThinking(false);
        }
      };
      makeAiMove();
    }
  }, [board, isPlayerTurn, winner, isDraw, aiDifficulty, playerEmoji, opponentEmoji, toast, isThinking, router, difficultyParam, gameMode]);
  
  if (!isLoaded || !gameMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8">
        <Skeleton className="h-48 w-full max-w-md" />
        <Skeleton className="h-24 w-full max-w-md" />
        <Skeleton className="h-96 w-96" />
      </div>
    );
  }

  const EmojiSelector = ({isPopover = false, onSelect, selectedEmoji}: {isPopover?: boolean, onSelect: (emoji: string) => void, selectedEmoji: string}) => (
    <div className={cn("grid gap-2", isPopover ? "grid-cols-4 p-4" : "grid-cols-4")}>
      {EMOJI_OPTIONS.map(emoji => (
        <Button
          key={emoji}
          variant={selectedEmoji === emoji ? 'default' : 'outline'}
          onClick={() => onSelect(emoji)}
          className={cn(
            'text-3xl p-2 h-16 w-16 transition-all transform',
            selectedEmoji === emoji ? 'scale-110 ring-2 ring-primary' : 'scale-100'
          )}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
  
  const pageTitle = gameMode === 'pve' ? `${difficulty} - Stage ${currentStage + 1}` : "Player vs. Player";
  const backLink = gameMode === 'pve' ? '/offline' : '/mode-select';
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Button asChild variant="ghost" className="absolute top-4 left-4">
        <Link href={backLink}>
          <ArrowLeft /> Back
        </Link>
      </Button>

      {status === 'setup' && (
        <Card className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-500 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center font-headline capitalize">{pageTitle}</CardTitle>
            <CardDescription className="text-center">
              {gameMode === 'pve' && isFirstEverGame ? 'Choose your emoji to begin!' : `Get ready for the match!`}
               {gameMode === 'pvp' && 'Choose your emojis to begin!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
             <div className="flex justify-around items-center">
              <div className="space-y-2 text-center">
                <Label className="text-lg font-semibold">Player 1</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="text-4xl h-24 w-24">{playerEmoji}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <EmojiSelector isPopover onSelect={setPlayerEmoji} selectedEmoji={playerEmoji} />
                  </PopoverContent>
                </Popover>
              </div>
              
              {gameMode === 'pvp' && (
                <div className="space-y-2 text-center">
                  <Label className="text-lg font-semibold">Player 2</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="text-4xl h-24 w-24">{player2Emoji}</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <EmojiSelector isPopover onSelect={setPlayer2Emoji} selectedEmoji={player2Emoji} />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {gameMode === 'pve' && (
                 <div className="space-y-2 text-center">
                  <Label className="text-lg font-semibold">AI</Label>
                  <div className="text-4xl h-24 w-24 flex items-center justify-center rounded-md bg-muted">{AI_EMOJI}</div>
                </div>
              )}
            </div>
            <Button size="lg" className="w-full font-bold text-lg" onClick={handleStartGame}>Start Game</Button>
          </CardContent>
        </Card>
      )}

      {status === 'playing' && (
        <div className="animate-in fade-in-0 zoom-in-95 duration-500">
          <h2 className="text-3xl font-bold text-center mb-2 font-headline capitalize" style={{ color: 'hsl(var(--neon-blue))', textShadow: '0 0 5px hsl(var(--neon-blue))' }}>{pageTitle}</h2>
          
          {gameMode === 'pve' ? (
            <p className="text-center text-muted-foreground mb-6 text-xl">
              <span style={{ color: 'hsl(var(--neon-blue))', textShadow: '0 0 5px hsl(var(--neon-blue))' }}>{playerEmoji} (You)</span> vs. <span style={{ color: 'hsl(var(--neon-red))', textShadow: '0 0 5px hsl(var(--neon-red))' }}>{AI_EMOJI} (AI)</span>
            </p>
          ) : (
             <p className="text-center text-muted-foreground mb-6 text-xl">
                <span className={cn(isPlayerTurn && "text-primary font-bold")}>{playerEmoji} (P1)</span> vs. <span className={cn(!isPlayerTurn && "text-primary font-bold")}>{player2Emoji} (P2)</span>
            </p>
          )}

          <GameBoard 
            board={board} 
            onCellClick={handleCellClick}
            playerTurn={isPlayerTurn}
            isThinking={isThinking}
            winner={winner}
            winningLine={winningLine}
            gameMode={gameMode}
          />
        </div>
      )}

      <GameOverDialog 
        result={result} 
        onNext={handleNextStage} 
        onRetry={handleRetry} 
        stage={currentStage + 1}
        difficulty={difficulty}
        gameMode={gameMode}
      />
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <PlayPageContent />
    </Suspense>
  );
}
