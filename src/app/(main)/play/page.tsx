"use client";

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { levels, type Level } from '@/lib/levels';
import { GameUI } from '@/components/game/GameUI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper, Loader2 } from 'lucide-react';

const GolfCanvas = dynamic(() => import('@/components/game/GolfCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-200"><Loader2 className="h-8 w-8 animate-spin" /></div>,
});

export default function PlayPage() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [strokes, setStrokes] = useState(0);
  const [power, setPower] = useState(0);
  const [isHoleComplete, setIsHoleComplete] = useState(false);
  const [gameKey, setGameKey] = useState(Date.now()); // Used to force a re-render of the canvas

  const currentLevel = levels[levelIndex];

  const handleStroke = () => {
    if (isHoleComplete) return;
    setStrokes((prev) => prev + 1);
  };

  const handleHoleComplete = () => {
    if (!isHoleComplete) {
      setIsHoleComplete(true);
    }
  };

  const handleNextLevel = () => {
    const nextLevelIndex = (levelIndex + 1) % levels.length;
    setLevelIndex(nextLevelIndex);
    setStrokes(0);
    setIsHoleComplete(false);
    setGameKey(Date.now()); // Change the key to force re-mount
  };

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] overflow-hidden bg-background">
      <GameUI level={currentLevel.id} par={currentLevel.par} strokes={strokes} power={power} />
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <GolfCanvas
                key={gameKey} // Re-mount component on level change
                level={currentLevel}
                onStroke={handleStroke}
                onHoleComplete={handleHoleComplete}
                setPower={setPower}
                isGamePaused={isHoleComplete}
            />
        </Suspense>
      {isHoleComplete && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center p-4">
          <Card className="max-w-sm text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary mb-4">
                <PartyPopper className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Hole Complete!</CardTitle>
              <CardDescription>
                You finished Hole {currentLevel.id} in {strokes} strokes (Par {currentLevel.par}).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleNextLevel}>
                {levelIndex < levels.length - 1 ? 'Next Level' : 'Play Again'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}