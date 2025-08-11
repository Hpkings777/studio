'use server';

/**
 * @fileOverview An AI agent that dynamically arranges birthday page elements based on the chosen template and device.
 *
 * - arrangeElements - A function that handles the arrangement process.
 * - ArrangeElementsInput - The input type for the arrangeElements function.
 * - ArrangeElementsOutput - The return type for the arrangeElements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArrangeElementsInputSchema = z.object({
  template: z.string().describe('The selected birthday template.'),
  device: z.string().describe('The device type (e.g., desktop, mobile, tablet).'),
  name: z.string().describe('The name of the birthday celebrant.'),
  message: z.string().describe('The birthday message.'),
  photoDataUri: z
    .string()
    .describe(
      'A photo of the birthday celebrant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  birthdayDate: z.string().describe('The birthday date in ISO format (YYYY-MM-DD).'),
});
export type ArrangeElementsInput = z.infer<typeof ArrangeElementsInputSchema>;

const ArrangeElementsOutputSchema = z.object({
  layout: z.string().describe('The JSON layout configuration for the birthday page elements.'),
});
export type ArrangeElementsOutput = z.infer<typeof ArrangeElementsOutputSchema>;

export async function arrangeElements(input: ArrangeElementsInput): Promise<ArrangeElementsOutput> {
  return arrangeElementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'arrangeElementsPrompt',
  input: {schema: ArrangeElementsInputSchema},
  output: {schema: ArrangeElementsOutputSchema},
  prompt: `You are an expert web designer specializing in creating aesthetically pleasing layouts for birthday pages.

You will receive the following information:
- Birthday Template: {{{template}}}
- Device Type: {{{device}}}
- Name: {{{name}}}
- Message: {{{message}}}
- Photo: {{media url=photoDataUri}}
- Birthday Date: {{{birthdayDate}}}

Based on this information, create a JSON layout configuration that arranges the birthday page elements in a visually appealing way for the given device and template.

Consider the following factors when creating the layout:
- Balance: Distribute the elements evenly across the page to create a sense of harmony.
- Hierarchy: Emphasize the most important elements (e.g., the name and photo) by making them larger or more prominent.
- Readability: Ensure that the text is easy to read and that the elements are not too cluttered.
- Responsiveness: Ensure that the layout adapts well to different screen sizes.

Example JSON Layout Configuration:
{
  "header": {
    "element": "name",
    "position": "top-center",
    "size": "large"
  },
  "photo": {
    "element": "photo",
    "position": "center",
    "size": "medium"
  },
  "message": {
    "element": "message",
    "position": "bottom-center",
    "size": "small"
  },
  "countdown": {
    "element": "countdown",
    "position": "bottom-right",
    "size": "small"
  }
}

Return ONLY a valid JSON object.  Do not include any other text. The JSON must conform to the example above.
`,
});

const arrangeElementsFlow = ai.defineFlow(
  {
    name: 'arrangeElementsFlow',
    inputSchema: ArrangeElementsInputSchema,
    outputSchema: ArrangeElementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

