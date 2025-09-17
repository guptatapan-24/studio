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
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[levelIndex]);
  const [strokes, setStrokes] = useState(0);
  const [power, setPower] = useState(0);
  const [isHoleComplete, setIsHoleComplete] = useState(false);

  const handleStroke = () => {
    if (isHoleComplete) return;
    setStrokes((prev) => prev + 1);
  };

  const handleHoleComplete = () => {
    if (!isHoleComplete) { // prevent multiple triggers
      setIsHoleComplete(true);
    }
  };

  const handleNextLevel = () => {
    const nextLevelIndex = levelIndex + 1;
    if (nextLevelIndex < levels.length) {
      setLevelIndex(nextLevelIndex);
      setCurrentLevel(levels[nextLevelIndex]);
    } else {
      // Loop back to the first level
      setLevelIndex(0);
      setCurrentLevel(levels[0]);
    }
    setStrokes(0);
    setIsHoleComplete(false);
  };
  
  const handleReset = () => {
    // This will cause the GolfCanvas to re-mount due to the key change
    setCurrentLevel({ ...currentLevel });
    setStrokes(0);
    setIsHoleComplete(false);
  };

  return (
    <div className="relative w-full h-[calc(100dvh-4rem)] overflow-hidden bg-background">
      <GameUI level={currentLevel.id} par={currentLevel.par} strokes={strokes} power={power} />
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
            <GolfCanvas
                key={levelIndex} // Re-mount component on level change to reset its internal state
                level={currentLevel}
                onStroke={handleStroke}
                onHoleComplete={handleHoleComplete}
                setPower={setPower}
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

    
