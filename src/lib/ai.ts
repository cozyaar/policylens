import { GoogleGenAI, GenerateContentRequest, GenerateContentResult } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Executes a Gemini model call with exponential backoff for 503 (service unavailable) errors.
 * This ensures high-depth models (like 1.5-pro) are resilient to temporary spikes in demand.
 */
export async function generateWithRetry(
  modelName: string,
  request: Omit<GenerateContentRequest, 'model'>,
  maxRetries = 3
): Promise<GenerateContentResult> {
  const model = ai.models.get(modelName);
  
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Small delay for retries (exponential backoff)
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Gemini is busy (503). Retrying in ${delay / 1000}s... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      return await model.generateContent(request);
    } catch (error: any) {
      lastError = error;
      
      // If it's a 503 (Service Unavailable / High Demand), we retry.
      // Other errors (like 400 Bad Request) should fail immediately.
      const is503 = error?.status === 503 || error?.message?.includes('503') || error?.message?.includes('high demand');
      
      if (!is503 || attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  throw lastError;
}

export { ai };
