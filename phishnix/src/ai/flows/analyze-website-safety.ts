'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing website safety.
 *
 * - analyzeWebsiteSafety - An asynchronous function that takes a URL as input and returns a safety verdict with reasoning.
 * - AnalyzeWebsiteSafetyInput - The input type for the analyzeWebsiteSafety function (a URL string).
 * - AnalyzeWebsiteSafetyOutput - The output type for the analyzeWebsiteSafety function, including a safety verdict and reasoning.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWebsiteSafetyInputSchema = z.object({
  url: z.string().describe('The URL to analyze for safety.'),
});
export type AnalyzeWebsiteSafetyInput = z.infer<typeof AnalyzeWebsiteSafetyInputSchema>;

const AnalyzeWebsiteSafetyOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the website is safe or not.'),
  reasoning: z.string().describe('The reasoning behind the safety verdict.'),
  trustScore: z.number().min(0).max(1).describe('A score of 0 if unsafe/suspicious, or 1 if safe.'),
  url: z.string().optional().describe('The URL that was analyzed.'),
  domainAgeIndication: z.string().optional().describe('An indication of the domain\'s registration age and the risk associated with it.'),
});
export type AnalyzeWebsiteSafetyOutput = z.infer<typeof AnalyzeWebsiteSafetyOutputSchema>;

export async function analyzeWebsiteSafety(input: AnalyzeWebsiteSafetyInput): Promise<AnalyzeWebsiteSafetyOutput> {
  return analyzeWebsiteSafetyFlow(input);
}

const analyzeWebsiteSafetyPrompt = ai.definePrompt({
  name: 'analyzeWebsiteSafetyPrompt',
  input: {schema: AnalyzeWebsiteSafetyInputSchema},
  output: {schema: AnalyzeWebsiteSafetyOutputSchema},
  prompt: `You are an expert in website security and fraud detection. Your task is to analyze the safety of a given URL and provide a verdict with clear reasoning and a trust score of 0 if it is unsafe/suspicious, and 1 if it is safe.

Analyze the following URL:
{{{url}}}

Consider factors such as:
- **Domain Age & Reputation**: Based on your training data, estimate the age and reputation of the domain. State that newly registered domains (e.g., created within the last year, especially the last 6 months) are a significant red flag for phishing and scams. Provide your assessment in the 'domainAgeIndication' field. For example: "This domain is for a well-known brand and has been active for many years, which is a positive signal." or "This domain appears to be very recently registered. This is a major risk factor as fraudulent sites are often new."
- **Presence of an SSL certificate (HTTPS)**: Note that while essential, this does not guarantee safety.
- **Website content and design (look for suspicious elements)**: Does it look professionally made or thrown together?
- **User reviews and reputation**: What is the general sentiment about this site online?
- **Known phishing or malware reports**: Does your data contain reports of this being a malicious site?

Based on your analysis, determine if the website is safe or potentially fraudulent. Provide a concise explanation for your verdict in the 'reasoning' field.

Output should be structured as a JSON object that conforms to AnalyzeWebsiteSafetyOutputSchema. Make sure to set isSafe to true if safe, and false if unsafe. The reasoning field should contain the bulk of your analysis. Also include the original url, the trustScore (0 or 1), and your domainAgeIndication in the output. Do not include any preamble or postamble in your response.`,
});

const analyzeWebsiteSafetyFlow = ai.defineFlow(
  {
    name: 'analyzeWebsiteSafetyFlow',
    inputSchema: AnalyzeWebsiteSafetyInputSchema,
    outputSchema: AnalyzeWebsiteSafetyOutputSchema,
  },
  async input => {
    const {output} = await analyzeWebsiteSafetyPrompt(input);
    return output!;
  }
);
