"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { levels } from '@/lib/levels';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function LevelsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // This is a placeholder for if you wanted to track completed levels.
    // For now, we just unlock everything.
  }, []);

  const easyLevels = levels.filter(l => l.difficulty === 'Easy');
  const mediumLevels = levels.filter(l => l.difficulty === 'Medium');
  const hardLevels = levels.filter(l => l.difficulty === 'Hard');

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight">Select a Level</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Challenge yourself with levels of varying difficulty.
            </p>
        </div>

        <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-4">Easy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {easyLevels.map((level) => (
                  <Card 
                    key={level.id} 
                    className={`transition-all hover:border-primary`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardDescription>Hole {level.id}</CardDescription>
                          <CardTitle>{level.name}</CardTitle>
                        </div>
                        <Badge variant={'outline'}>Par {level.par}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        asChild
                        className="w-full"
                      >
                        <Link href={`/play?level=${level.id}`}>
                          <Play className="mr-2" />
                          Play
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-4">Medium</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediumLevels.map((level) => (
                   <Card 
                    key={level.id} 
                    className={`transition-all hover:border-primary`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardDescription>Hole {level.id}</CardDescription>
                          <CardTitle>{level.name}</CardTitle>
                        </div>
                        <Badge variant={'outline'}>Par {level.par}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        asChild
                        className="w-full"
                      >
                        <Link href={`/play?level=${level.id}`}>
                          <Play className="mr-2" />
                          Play
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-4">Hard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hardLevels.map((level) => (
                   <Card 
                    key={level.id} 
                    className={`transition-all hover:border-primary`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardDescription>Hole {level.id}</CardDescription>
                          <CardTitle>{level.name}</CardTitle>
                        </div>
                        <Badge variant={'outline'}>Par {level.par}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        asChild
                        className="w-full"
                      >
                        <Link href={`/play?level=${level.id}`}>
                          <Play className="mr-2" />
                          Play
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}
