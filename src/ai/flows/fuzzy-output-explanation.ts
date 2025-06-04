'use server';

/**
 * @fileOverview This file defines a Genkit flow to explain the fuzzy logic system's output.
 *
 * - FuzzyOutputExplanationInput: The input type for the fuzzyOutputExplanation function.
 * - FuzzyOutputExplanationOutput: The return type for the fuzzyOutputExplanation function.
 * - fuzzyOutputExplanation: A function that takes the temperature, humidity, and desired temperature as input and returns an explanation of the fuzzy logic output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FuzzyOutputExplanationInputSchema = z.object({
  currentTemperature: z
    .number()
    .describe('The current temperature in degrees Celsius.'),
  currentHumidity: z.number().describe('The current humidity percentage.'),
  desiredTemperature: z
    .number()
    .describe('The desired temperature in degrees Celsius.'),
  heatingOutput: z.number().describe('The heating output determined by the fuzzy logic system.'),
  coolingOutput: z.number().describe('The cooling output determined by the fuzzy logic system.'),
});
export type FuzzyOutputExplanationInput = z.infer<
  typeof FuzzyOutputExplanationInputSchema
>;

const FuzzyOutputExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A brief explanation of why the fuzzy logic system chose a specific heating or cooling output.'
    ),
});
export type FuzzyOutputExplanationOutput = z.infer<
  typeof FuzzyOutputExplanationOutputSchema
>;

export async function fuzzyOutputExplanation(
  input: FuzzyOutputExplanationInput
): Promise<FuzzyOutputExplanationOutput> {
  return fuzzyOutputExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fuzzyOutputExplanationPrompt',
  input: {schema: FuzzyOutputExplanationInputSchema},
  output: {schema: FuzzyOutputExplanationOutputSchema},
  prompt: `You are an expert in fuzzy logic control systems. Given the current temperature of {{{currentTemperature}}}°C, humidity of {{{currentHumidity}}}%, a desired temperature of {{{desiredTemperature}}}°C, a heating output of {{{heatingOutput}}}, and a cooling output of {{{coolingOutput}}}, explain in a concise manner (maximum 50 words) why the fuzzy logic system chose this particular heating or cooling output. Focus on the rationale behind the decision based on the provided values, assuming the fuzzy logic system aims to minimize the difference between current and desired temperature while considering humidity levels.`,
});

const fuzzyOutputExplanationFlow = ai.defineFlow(
  {
    name: 'fuzzyOutputExplanationFlow',
    inputSchema: FuzzyOutputExplanationInputSchema,
    outputSchema: FuzzyOutputExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
