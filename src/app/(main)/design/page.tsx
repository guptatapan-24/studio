
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { designCourse, type CourseDesignOutput } from '@/ai/flows/course-design-tool';
import { visualizeCourse, type VisualizeCourseOutput } from '@/ai/flows/visualize-course-flow';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Wand2, Play } from 'lucide-react';
import type { Level } from '@/lib/levels';

const GolfCanvas = dynamic(() => import('@/components/game/GolfCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-200"><Loader2 className="h-8 w-8 animate-spin" /></div>,
});


const formSchema = z.object({
  launchPoint: z.string().min(1, 'Launch point is required.'),
  obstacles: z.string().min(1, 'Obstacles description is required.'),
  terrain: z.string().min(1, 'Terrain type is required.'),
  par: z.coerce.number().int().min(1, 'Par must be at least 1.'),
});

// Helper function for retrying promises
async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 2000, finalErr: string): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastError = e;
      if (i < retries - 1) {
        // Optional: Check for specific retryable errors, e.g., e.message.includes('503')
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(finalErr);
}


export default function DesignPage() {
  const router = useRouter();
  const [isDesigning, setIsDesigning] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [designResult, setDesignResult] = useState<CourseDesignOutput | null>(null);
  const [visualizationResult, setVisualizationResult] = useState<Level | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      launchPoint: "Center of the starting tee, 10 meters from the back edge.",
      obstacles: "A small pond on the right, two sand bunkers protecting the green.",
      terrain: "Mostly flat with a slight uphill slope towards the green.",
      par: 4,
    },
  });

  async function onDesignSubmit(values: z.infer<typeof formSchema>) {
    setIsDesigning(true);
    setDesignResult(null);
    setVisualizationResult(null);
    setError(null);
    try {
       const output = await retry(
        () => designCourse(values),
        3,
        2000,
        "The AI service is currently busy. Please try again in a moment."
      );
      setDesignResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsDesigning(false);
    }
  }

  async function onVisualize() {
    if (!designResult) return;
    setIsVisualizing(true);
    setError(null);
    try {
        const output = await retry(
            () => visualizeCourse({ courseDescription: designResult.courseDesign }),
            3,
            2000,
            "The AI service is currently busy. Please try again in a moment."
        );
        const level: Level = {
            id: 99, // Custom level ID
            name: "AI Generated Course",
            par: output.par,
            startPosition: output.startPosition as [number, number, number],
            holePosition: output.holePosition as [number, number, number],
            holeRadius: output.holeRadius,
            obstacles: output.obstacles.map(o => ({
                ...o,
                position: o.position as [number, number, number],
                size: o.size as [number, number, number],
                rotation: o.rotation as [number, number, number] | undefined,
            })),
        };
        setVisualizationResult(level);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsVisualizing(false);
    }
  }
  
   const handlePlayFullScreen = () => {
    if (visualizationResult) {
      localStorage.setItem('customLevel', JSON.stringify(visualizationResult));
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">AI Course Design Tool</h1>
        <p className="text-muted-foreground mb-8">
          Use generative AI to efficiently design and tune your golf course holes.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onDesignSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Course Parameters</CardTitle>
                <CardDescription>
                  Provide the details for the hole you want to design.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="terrain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terrain</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hilly with a large lake" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="obstacles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Obstacles</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the obstacles..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="launchPoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Launch Point</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 0,0,15" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="par"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Par</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isDesigning || isVisualizing}>
                  {isDesigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Design with AI
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
        
        {isDesigning && (
          <div className="mt-8 text-center">
            <div className="flex justify-center items-center p-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground mt-2 ml-4">AI is designing the course...</p>
            </div>
          </div>
        )}

        {error && (
            <Card className="mt-8 border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                </CardContent>
            </Card>
        )}

        {designResult && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Generated Course Design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none text-card-foreground">
                <p>{designResult.courseDesign}</p>
              </div>
               <Button onClick={onVisualize} disabled={isVisualizing || isDesigning}>
                {isVisualizing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                Visualize
              </Button>
            </CardContent>
          </Card>
        )}
        
        {isVisualizing && (
            <div className="mt-8 text-center">
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground mt-2 ml-4">AI is visualizing the course...</p>
                </div>
            </div>
        )}

        {visualizationResult && (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>3D Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-[400px] rounded-md overflow-hidden border">
                         <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                            <GolfCanvas
                                key={Date.now()}
                                level={visualizationResult}
                                onStroke={() => {}}
                                onHoleComplete={() => {}}
                                setPower={() => {}}
                                isGamePaused={true}
                            />
                        </Suspense>
                    </div>
                </CardContent>
                 <CardFooter className="flex-col items-start gap-4">
                    <Button asChild onClick={handlePlayFullScreen}>
                        <Link href="/play?level=custom">
                        <Play className="mr-2 h-4 w-4" />
                        Play in Full Screen
                        </Link>
                    </Button>
                 </CardFooter>
            </Card>
        )}
      </div>
    </div>
  );
}
