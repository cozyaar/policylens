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

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

/**
 * Executes a Gemini model call with automatic model fallback and exponential backoff.
 * If a model returns 404 (e.g. legacy model ID on v1beta), it falls back to current active models.
 * If 503 (service unavailable) occurs, it retries with exponential backoff.
 */
export async function generateWithRetry(
  preferredModel: string,
  request: GenerateContentOptions,
  maxRetries = 3
): Promise<GenerateContentResponse> {
  const client = getAiClient();

  // Model fallback chain
  const modelsToTry = [
    preferredModel,
    ...CANDIDATE_MODELS.filter(m => m !== preferredModel),
  ];

  let lastError: unknown;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Gemini is busy (503). Retrying ${model} in ${delay / 1000}s... (Attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        return await client.models.generateContent({
          model,
          ...request,
        });
      } catch (error: unknown) {
        lastError = error;
        const err = error as { status?: number; message?: string };
        const is503 = err?.status === 503 || err?.message?.includes('503') || err?.message?.includes('high demand');
        const is404 = err?.status === 404 || err?.message?.includes('not found') || err?.message?.includes('NOT_FOUND');

        // If the model is not found on this API version, try the next candidate model
        if (is404) {
          console.warn(`Model '${model}' not available on API (404). Falling back to next model...`);
          break;
        }

        // If Google Search tool causes permission or configuration issues, attempt fallback without search tool
        if (request.config && 'tools' in request.config && (err?.status === 400 || err?.message?.includes('tool') || err?.message?.includes('search'))) {
          console.warn(`Tool error on model '${model}'. Retrying generation without tools...`);
          try {
            const strippedConfig = { ...request.config };
            delete (strippedConfig as { tools?: unknown }).tools;
            return await client.models.generateContent({
              model,
              ...request,
              config: strippedConfig,
            });
          } catch {
            // continue loop if stripped call also fails
          }
        }

        if (!is503 || attempt === maxRetries) {
          break;
        }
      }
    }
  }

  throw lastError;
}

export { getAiClient as ai };
