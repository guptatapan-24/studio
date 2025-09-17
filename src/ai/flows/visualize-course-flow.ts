'use server';

/**
 * @fileOverview A flow to convert a text description of a golf course into a structured 3D level format.
 *
 * - visualizeCourse - A function that handles the course visualization process.
 * - VisualizeCourseInput - The input type for the visualizeCourse function.
 * - VisualizeCourseOutput - The return type for the visualizeCourse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualizeCourseInputSchema = z.object({
  courseDescription: z.string().describe('A natural language description of a golf course hole.'),
});
export type VisualizeCourseInput = z.infer<typeof VisualizeCourseInputSchema>;

const ObstacleSchema = z.object({
    type: z.enum(['box', 'ramp']).describe("The type of the obstacle."),
    position: z.array(z.number()).length(3).describe("The [x, y, z] coordinates of the obstacle's center."),
    size: z.array(z.number()).length(3).describe("The [width, height, depth] of the obstacle."),
    rotation: z.optional(z.array(z.number()).length(3)).describe("The [x, y, z] Euler rotation of the obstacle in radians."),
});

const VisualizeCourseOutputSchema = z.object({
  par: z.number().int().describe('The par for the hole.'),
  startPosition: z.array(z.number()).length(3).describe('The [x, y, z] starting coordinates for the golf ball. Y should typically be 0.2 to be on the ground.'),
  holePosition: z.array(z.number()).length(3).describe('The [x, y, z] coordinates for the center of the hole. Y should be 0.01 to be on the ground plane.'),
  holeRadius: z.number().describe('The radius of the hole.'),
  obstacles: z.array(ObstacleSchema).describe('An array of obstacles on the course.'),
});
export type VisualizeCourseOutput = z.infer<typeof VisualizeCourseOutputSchema>;


export async function visualizeCourse(input: VisualizeCourseInput): Promise<VisualizeCourseOutput> {
  return visualizeCourseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualizeCoursePrompt',
  input: {schema: VisualizeCourseInputSchema},
  output: {schema: VisualizeCourseOutputSchema},
  prompt: `You are a 3D level designer for a minigolf game. Your task is to convert a natural language description of a golf hole into a structured JSON object that can be rendered by a game engine.

The game's coordinate system is centered at (0,0,0). The golf ball starts at a position and the player aims towards the negative Z axis. Positive Z is "behind" the player, negative Z is "in front". Positive X is to the right, negative X is to the left. The ground plane is at Y=0.

Analyze the following course description and generate a valid level object. Be precise with positions and sizes.

Course Description:
"{{{courseDescription}}}"

- Infer the 'par' from the description.
- Determine the 'startPosition' array. The Y-coordinate should be 0.2.
- Determine the 'holePosition' array. The Y-coordinate should be 0.01.
- Set a reasonable 'holeRadius', typically between 0.2 and 0.3.
- Create an array of 'obstacles'. Each obstacle must have a 'type', 'position', 'size', and an optional 'rotation'. A 'ramp' is just a 'box' with a rotation on the X or Z axis. Infer the dimensions and placement from the text.
- Be creative but stay true to the description. If specific dimensions aren't given, estimate them based on context (e.g., a "small pond" might be 4x1x6 units).
- The entire playable area should generally be within -25 to 25 on the X and Z axes.
- A "wall" is a 'box' obstacle. A "ramp" is a 'box' obstacle with rotation.
- Only output the JSON object.`,
});

const visualizeCourseFlow = ai.defineFlow(
  {
    name: 'visualizeCourseFlow',
    inputSchema: VisualizeCourseInputSchema,
    outputSchema: VisualizeCourseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
