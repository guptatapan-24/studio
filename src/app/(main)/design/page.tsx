"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { designCourse, type CourseDesignOutput } from '@/ai/flows/course-design-tool';

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
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  launchPoint: z.string().min(1, 'Launch point is required.'),
  obstacles: z.string().min(1, 'Obstacles description is required.'),
  terrain: z.string().min(1, 'Terrain type is required.'),
  par: z.coerce.number().int().min(1, 'Par must be at least 1.'),
});

export default function DesignPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CourseDesignOutput | null>(null);
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const output = await designCourse(values);
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">AI Course Design Tool</h1>
        <p className="text-muted-foreground mb-8">
          Use generative AI to efficiently design and tune your golf course holes.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Design with AI
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>

        {isLoading && (
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

        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Generated Course Design</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none text-card-foreground">
                <p>{result.courseDesign}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
