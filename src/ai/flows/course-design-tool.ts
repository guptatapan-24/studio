'use server';

/**
 * @fileOverview A course design tool powered by generative AI.
 *
 * - designCourse - A function that designs the golf course based on input parameters.
 * - CourseDesignInput - The input type for the designCourse function.
 * - CourseDesignOutput - The return type for the designCourse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseDesignInputSchema = z.object({
  launchPoint: z
    .string()
    .describe('The coordinates of the launch point for the golf ball.'),
  obstacles: z.string().describe('The description of obstacles on the course.'),
  terrain: z.string().describe('The type of terrain for the golf course.'),
  par: z.number().describe('The par for the golf course hole.'),
});
export type CourseDesignInput = z.infer<typeof CourseDesignInputSchema>;

const CourseDesignOutputSchema = z.object({
  courseDesign: z
    .string()
    .describe('The design of the golf course, including launch point, obstacles, terrain, and par.'),
});
export type CourseDesignOutput = z.infer<typeof CourseDesignOutputSchema>;

export async function designCourse(input: CourseDesignInput): Promise<CourseDesignOutput> {
  return designCourseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseDesignPrompt',
  input: {schema: CourseDesignInputSchema},
  output: {schema: CourseDesignOutputSchema},
  prompt: `You are an expert golf course designer. Based on the following parameters, design a golf course hole.

Launch Point: {{{launchPoint}}}
Obstacles: {{{obstacles}}}
Terrain: {{{terrain}}}
Par: {{{par}}}

Course Design:`,
});

const designCourseFlow = ai.defineFlow(
  {
    name: 'designCourseFlow',
    inputSchema: CourseDesignInputSchema,
    outputSchema: CourseDesignOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
