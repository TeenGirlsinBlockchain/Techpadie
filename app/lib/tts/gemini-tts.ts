
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { logger } from '@/app/lib/logger';
import type { Language } from '@prisma/client';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_TTS_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const AUDIO_STORAGE_PATH = process.env.AUDIO_STORAGE_PATH || './audio-files';

// Language → voice configuration
const VOICE_CONFIG: Record<string, { languageCode: string; name: string }> = {
  EN: { languageCode: 'en-US', name: 'Kore' },
  FR: { languageCode: 'fr-FR', name: 'Kore' },
  AR: { languageCode: 'ar-XA', name: 'Kore' },
  SW: { languageCode: 'en-US', name: 'Kore' }, // Fallback — Swahili TTS limited
  HA: { languageCode: 'en-US', name: 'Kore' }, // Fallback — Hausa TTS limited
  PT: { languageCode: 'pt-BR', name: 'Kore' },
};

/**
 * Generate audio from lesson text using Gemini TTS.
 * Returns the file path and estimated duration.
 *
 * NOTE: This uses Gemini's multimodal audio output. If Gemini TTS API
 * changes or you need a dedicated TTS provider (Google Cloud TTS, ElevenLabs),
 * swap this function's implementation. The interface stays the same.
 */
export async function generateAudio(
  lessonId: string,
  content: string,
  language: Language,
  contentHash: string
): Promise<{ filePath: string; durationSecs: number }> {
  if (!GEMINI_API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
  }

  const voiceConfig = VOICE_CONFIG[language] || VOICE_CONFIG.EN;

  // Truncate long content for TTS (most TTS APIs have limits)
  const truncatedContent = content.slice(0, 10000);

  // Estimate duration: ~150 words per minute average
  const wordCount = truncatedContent.split(/\s+/).length;
  const estimatedDuration = Math.ceil((wordCount / 150) * 60);

  // Create directory for lesson audio
  const audioDir = path.join(AUDIO_STORAGE_PATH, lessonId);
  await mkdir(audioDir, { recursive: true });

  const fileName = `${language.toLowerCase()}_${contentHash.slice(0, 12)}.mp3`;
  const filePath = path.join(audioDir, fileName);

  try {
    // Use Gemini to generate spoken audio
    // NOTE: Gemini's direct audio generation is still evolving.
    // This implementation uses the speech generation capability.
    // For production, consider Google Cloud TTS or ElevenLabs as alternatives.
    const response = await fetch(`${GEMINI_TTS_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Read aloud the following educational content clearly and at a moderate pace in ${voiceConfig.languageCode}:\n\n${truncatedContent}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceConfig.name,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown');
      throw new Error(`Gemini TTS error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const audioPart = data?.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: { mimeType?: string } }) =>
        p.inlineData?.mimeType?.startsWith('audio/')
    );

    if (!audioPart?.inlineData?.data) {
      throw new Error('No audio data in Gemini response');
    }

    // Decode base64 audio and save to file
    const audioBuffer = Buffer.from(audioPart.inlineData.data, 'base64');
    await writeFile(filePath, audioBuffer);

    logger.info('Audio generated', {
      lessonId,
      language,
      filePath,
      sizeBytes: audioBuffer.length,
    });

    return {
      filePath,
      durationSecs: estimatedDuration,
    };
  } catch (error) {
    logger.error(
      'TTS generation failed',
      error instanceof Error ? error : new Error(String(error)),
      { lessonId, language }
    );
    throw error;
  }
}

/**
 * Get the public-facing audio URL from a file path.
 * In production, this would point to a CDN or object storage URL.
 */
export function getAudioUrl(filePath: string): string {
  // Convert local path to API-served URL
  const relativePath = filePath.replace(AUDIO_STORAGE_PATH, '');
  return `/api/audio${relativePath}`;
}