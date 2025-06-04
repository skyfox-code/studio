// Implemented the fuzzy logic thermostat flow using temperature, humidity and target temperature to determine heating or cooling output.
'use server';
/**
 * @fileOverview Fuzzy logic thermostat AI agent.
 *
 * - regulateTemperature - A function that handles the temperature regulation using fuzzy logic.
 * - RegulateTemperatureInput - The input type for the regulateTemperature function.
 * - RegulateTemperatureOutput - The return type for the regulateTemperature function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegulateTemperatureInputSchema = z.object({
  currentTemperature: z.number().describe('The current temperature in Celsius.'),
  currentHumidity: z.number().describe('The current humidity as a percentage.'),
  targetTemperature: z.number().describe('The desired target temperature in Celsius.'),
});
export type RegulateTemperatureInput = z.infer<typeof RegulateTemperatureInputSchema>;

const RegulateTemperatureOutputSchema = z.object({
  heatingOutput: z
    .number()
    .describe(
      'The heating output as a percentage (0-100).  A higher value indicates more heating is needed.'
    ),
  coolingOutput:
    z.number().describe('The cooling output as a percentage (0-100). A higher value indicates more cooling is needed.'),
  reasoning: z.string().describe('The reasoning behind the heating and cooling outputs.'),
});
export type RegulateTemperatureOutput = z.infer<typeof RegulateTemperatureOutputSchema>;

export async function regulateTemperature(
  input: RegulateTemperatureInput
): Promise<RegulateTemperatureOutput> {
  return regulateTemperatureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regulateTemperaturePrompt',
  input: {schema: RegulateTemperatureInputSchema},
  output: {schema: RegulateTemperatureOutputSchema},
  prompt: `You are an expert in fuzzy logic and thermostat control.

You will receive the current temperature, humidity, and target temperature.
Based on this information, you will determine the appropriate heating and cooling output percentages to efficiently reach the desired temperature.
Consider that high humidity can make the current temperature feel warmer, and low humidity can make it feel cooler.

Current Temperature: {{{currentTemperature}}} Celsius
Current Humidity: {{{currentHumidity}}}%
Target Temperature: {{{targetTemperature}}} Celsius

Reasoning:
Let's think step by step.

Heating Output:
Based on your reasoning, what percentage of heating output is required to reach the target temperature? (0-100)

Cooling Output:
Based on your reasoning, what percentage of cooling output is required to reach the target temperature? (0-100)

Output in JSON format:
{ "heatingOutput": number, "coolingOutput": number, "reasoning": string }
`,
});

const regulateTemperatureFlow = ai.defineFlow(
  {
    name: 'regulateTemperatureFlow',
    inputSchema: RegulateTemperatureInputSchema,
    outputSchema: RegulateTemperatureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
