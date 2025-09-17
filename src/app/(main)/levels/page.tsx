"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { levels } from '@/lib/levels';
import { CheckCircle, Lock, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LevelsPage() {
  const router = useRouter();
  const [maxLevelUnlocked, setMaxLevelUnlocked] = useState(1);

  useEffect(() => {
    const unlocked = parseInt(localStorage.getItem('maxLevelUnlocked') || '1');
    setMaxLevelUnlocked(unlocked);
  }, []);

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight">Select a Level</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Complete levels to unlock new ones. Good luck!
            </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => {
            const isUnlocked = level.id <= maxLevelUnlocked;
            const isCompleted = level.id < maxLevelUnlocked;

            return (
              <Card 
                key={level.id} 
                className={`transition-all ${isUnlocked ? 'hover:border-primary' : 'bg-muted/50'}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardDescription>Hole {level.id}</CardDescription>
                      <CardTitle>{level.name}</CardTitle>
                    </div>
                    {isCompleted ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                        <CheckCircle className="mr-1.5 h-4 w-4" />
                        Done
                      </Badge>
                    ) : (
                      <Badge variant={isUnlocked ? 'outline' : 'secondary'}>Par {level.par}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    asChild
                    disabled={!isUnlocked} 
                    className="w-full"
                  >
                    <Link href={`/play?level=${level.id}`}>
                      {isUnlocked ? <Play className="mr-2" /> : <Lock className="mr-2" />}
                      {isUnlocked ? (isCompleted ? 'Play Again' : 'Play') : 'Locked'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
