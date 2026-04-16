import { NextResponse } from 'next/server';
import { getPolicyBySlug } from '@/db/queries';
import { personalizeScore, PersonalizationAnswers } from '@/data/scoring';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, answers } = body as { slug: string; answers: PersonalizationAnswers };

    if (!slug || !answers) {
      return NextResponse.json({ error: 'Missing slug or answers' }, { status: 400 });
    }

    const policy = await getPolicyBySlug(slug);
    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    const result = personalizeScore(policy, answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Personalization error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
