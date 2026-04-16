import { generateWithRetry } from '@/lib/ai';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Prepare system instructions based on whether we are viewing a policy
    const systemInstruction = `You are the PolicyLens AI Assistant. 
You help users understand Indian health insurance policies.
Keep your answers brief, plain-English, and free of insurance jargon.
Be unbiased and do NOT sell insurance.
Rules:
- IMPORTANT: You have full access to Google Search. If the user asks about a policy you don't know, ALWAYS search the internet for exact policy brochures and wording to answer them accurately. Do NOT say you don't know if you haven't searched.
- If the user asks about a specific policy, look at the Context provided.
- If the Context contains 'userPersonalizedScore' or 'personalizedLoopholesRisk', use this data to provide highly tailored recommendations based on their generated risk profile. Treat this as their personalized fit.
- If you don't know the answer even after searching, say so. Do not hallucinate coverage.

Context: ${context ? JSON.stringify(context) : 'No specific policy selected.'}
`;

    // Convert frontend history format to Gemini format
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Append the new message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await generateWithRetry('gemini-1.5-pro', {
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
        tools: [{ googleSearch: {} }],
      }
    });

    return NextResponse.json({ response: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process chat message' }, { status: 500 });
  }
}
