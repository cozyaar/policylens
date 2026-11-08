import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your environment variables.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

type GenerateContentParams = Parameters<GoogleGenAI['models']['generateContent']>[0];
export type GenerateContentOptions = Omit<GenerateContentParams, 'model'>;

/**
 * Executes a Gemini model call with exponential backoff for 503 (service unavailable) errors.
 * This ensures high-depth models (like 1.5-pro) are resilient to temporary spikes in demand.
 */
export async function generateWithRetry(
  modelName: string,
  request: GenerateContentOptions,
  maxRetries = 3
): Promise<GenerateContentResponse> {
  const client = getAiClient();

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Gemini is busy (503). Retrying in ${delay / 1000}s... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      return await client.models.generateContent({
        model: modelName,
        ...request,
      });
    } catch (error: unknown) {
      lastError = error;

      // If it's a 503 (Service Unavailable / High Demand), we retry.
      // Other errors (like 400 Bad Request, 401 Unauthorized) should fail immediately.
      const err = error as { status?: number; message?: string };
      const is503 = err?.status === 503 || err?.message?.includes('503') || err?.message?.includes('high demand');

      if (!is503 || attempt === maxRetries) {
        throw error;
      }
    }
  }

  throw lastError;
}

export { getAiClient as ai };
