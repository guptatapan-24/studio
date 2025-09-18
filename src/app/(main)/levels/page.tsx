
"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { levels } from '@/lib/levels';
import { Play, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

export default function LevelsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4 text-muted-foreground">Loading levels...</p>
      </div>
    );
  }

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
            {levels.map((level) => (
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
  );
}
