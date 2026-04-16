import { NextResponse } from 'next/server';
import { analyzePolicy } from '@/lib/ingestion';
import { db } from '@/db';
import { policiesTable } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 3) {
      return NextResponse.json({ error: 'Please provide a valid policy name.' }, { status: 400 });
    }

    // 1. Call Gemini to generate the structured analysis
    const newPolicy = await analyzePolicy(query);

    // 2. Save it to our Supabase database using Drizzle
    await db.insert(policiesTable).values({
      id: newPolicy.id,
      slug: newPolicy.slug,
      name: newPolicy.name,
      insurer: newPolicy.insurer,
      insurerLogo: newPolicy.insurerLogo,
      planType: String(newPolicy.planType),
      category: newPolicy.category,
      overallScore: newPolicy.overallScore,
      tagline: newPolicy.tagline,
      highlights: newPolicy.highlights,
      dimensions: newPolicy.dimensions,
      features: newPolicy.features,
      loopholes: newPolicy.loopholes,
      profileFit: newPolicy.profileFit,
      alternatives: newPolicy.alternatives,
      pairings: newPolicy.pairings,
    }).onConflictDoUpdate({
      target: policiesTable.slug,
      set: {
        name: newPolicy.name,
        overallScore: newPolicy.overallScore,
        dimensions: newPolicy.dimensions,
        features: newPolicy.features,
        loopholes: newPolicy.loopholes,
        profileFit: newPolicy.profileFit,
      }
    });

    return NextResponse.json(newPolicy);

  } catch (error: any) {
    console.error('Ingestion API Error FULL:', error);
    
    // Check if it's a Gemini error
    if (error.status && error.status === 400) {
      return NextResponse.json({ error: 'LLM configuration error: ' + error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: error.message || 'Failed to ingest policy', trace: String(error) }, { status: 500 });
  }
}
