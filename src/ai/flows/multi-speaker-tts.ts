'use server';

/**
 * @fileOverview A Text-to-Speech (TTS) AI agent for generating audio from text.
 *
 * - multiSpeakerTts - A function that handles the TTS conversion process.
 * - MultiSpeakerTtsInput - The input type for the function.
 * - MultiSpeakerTtsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const MultiSpeakerTtsInputSchema = z.object({
  message: z.string().describe('The text to be converted to speech. Use "Speaker1:" and "Speaker2:" to assign different voices.'),
});

export type MultiSpeakerTtsInput = z.infer<typeof MultiSpeakerTtsInputSchema>;

const MultiSpeakerTtsOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});

export type MultiSpeakerTtsOutput = z.infer<typeof MultiSpeakerTtsOutputSchema>;

export async function multiSpeakerTts(input: MultiSpeakerTtsInput): Promise<MultiSpeakerTtsOutput> {
  return multiSpeakerTtsFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const multiSpeakerTtsFlow = ai.defineFlow(
  {
    name: 'multiSpeakerTtsFlow',
    inputSchema: MultiSpeakerTtsInputSchema,
    outputSchema: MultiSpeakerTtsOutputSchema,
  },
  async ({ message }) => {
    
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
           multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Speaker1', // Cheerful, friendly voice
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Algenib' } },
              },
              {
                speaker: 'Speaker2', // Calm, warm voice
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Achernar' } },
              },
            ]
           }
        },
      },
      prompt: message,
    });

    if (!media) {
      throw new Error('No audio media was returned from the TTS service.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    
    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
