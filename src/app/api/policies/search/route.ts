import { NextResponse } from 'next/server';
import { searchPolicies } from '@/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  
  try {
    const results = await searchPolicies(q);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching policies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
