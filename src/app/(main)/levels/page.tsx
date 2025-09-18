
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { levels } from '@/lib/levels';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getBestScores, type BestScore } from '@/lib/supabase/scores';

export default async function LevelsPage() {
  const bestScoresData = await getBestScores();
  const bestScores = new Map(bestScoresData.map(s => [s.level_id, s.strokes]));

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight">Select a Level</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Challenge yourself with our collection of courses.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => {
              const bestScore = bestScores.get(level.id);
              return (
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
                      <div className="text-right flex flex-col gap-2">
                        <Badge variant={'outline'}>Par {level.par}</Badge>
                        {bestScore !== undefined && (
                           <Badge variant={bestScore <= level.par ? 'default' : 'secondary'}>
                            Best: {bestScore}
                          </Badge>
                        )}
                      </div>
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
              )
            })}
        </div>
        
      </div>
    </div>
  );
}
