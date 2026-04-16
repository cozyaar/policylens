import { NextResponse } from 'next/server';
import { getPolicyBySlug } from '@/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugs = searchParams.get('slugs');

  if (!slugs) {
    return NextResponse.json({ error: 'Missing slugs parameter' }, { status: 400 });
  }

  try {
    const slugList = slugs.split(',').map(s => s.trim());
    const policies = await Promise.all(
      slugList.map(slug => getPolicyBySlug(slug))
    );
    const found = policies.filter(Boolean);
    return NextResponse.json(found);
  } catch (error) {
    console.error('Alternatives fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
