import { NextResponse } from 'next/server';
import { analyzePolicy } from '@/lib/ingestion';
import { savePolicy } from '@/db/queries';

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in your environment variables to enable AI analysis.'
      }, { status: 503 });
    }

    const { query } = await request.json();

    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return NextResponse.json({ error: 'Please provide a valid policy name.' }, { status: 400 });
    }

    // 1. Call Gemini to generate the structured analysis
    const newPolicy = await analyzePolicy(query.trim());

    // 2. Save it to our store and database (if available)
    await savePolicy(newPolicy);

    return NextResponse.json(newPolicy);

  } catch (error: unknown) {
    console.error('Ingestion API Error:', error);

    const err = error as { status?: number; message?: string; stack?: string };
    if (err?.status === 400) {
      return NextResponse.json({ error: 'LLM configuration error: ' + (err.message || 'Bad Request') }, { status: 400 });
    }

    const message = err?.message || (error instanceof Error ? error.message : 'Failed to ingest policy');
    const trace = err?.stack || String(error);

    return NextResponse.json({
      error: message,
      trace
    }, { status: 500 });
  }
}
