'use server';
/**
 * @fileOverview This file defines a Genkit flow to fetch mock trend data based on a user's input.
 *
 * - fetchMockTrendData - A function that initiates the trend data retrieval.
 * - FetchMockTrendDataInput - The input type for the fetchMockTrendData function.
 * - FetchMockTrendDataOutput - The return type for the fetchMockTrendData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchMockTrendDataInputSchema = z.object({
  keyword: z.string().describe('The keyword or hashtag to fetch trend data for.'),
});
export type FetchMockTrendDataInput = z.infer<typeof FetchMockTrendDataInputSchema>;

const FetchMockTrendDataOutputSchema = z.object({
  trendData: z.string().describe('Mock trend data related to the input keyword.'),
});
export type FetchMockTrendDataOutput = z.infer<typeof FetchMockTrendDataOutputSchema>;

export async function fetchMockTrendData(input: FetchMockTrendDataInput): Promise<FetchMockTrendDataOutput> {
  return fetchMockTrendDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fetchMockTrendDataPrompt',
  input: {schema: FetchMockTrendDataInputSchema},
  output: {schema: FetchMockTrendDataOutputSchema},
  prompt: `You are an AI that provides mock trend data for keywords or hashtags.

  Based on the user's input, generate realistic but mock data related to search popularity, post volume, and engagement rates.

  Input Keyword: {{{keyword}}}

  Return the mock trend data as a string.  Make it look realistic.  Include these values:
  - 24h Mentions
  - 7d Mentions
  - Engagement Rate (%)
  - Trend Status (Rising, Stable, or Falling)

  Example:
  Keyword: #AI
  24h Mentions: 12,000
  7d Mentions: 80,000
  Engagement Rate: 15%
  Trend Status: Rising
  `,
});

const fetchMockTrendDataFlow = ai.defineFlow(
  {
    name: 'fetchMockTrendDataFlow',
    inputSchema: FetchMockTrendDataInputSchema,
    outputSchema: FetchMockTrendDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {trendData: output!.trendData};
  }
);
