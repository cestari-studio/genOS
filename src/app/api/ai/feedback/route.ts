import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const orgId = request.headers.get('x-org-id');
  const userId = request.headers.get('x-user-id');

  if (!orgId || !userId) {
    return NextResponse.json({ error: 'Missing context' }, { status: 400 });
  }

  const body = await request.json();
  const { generation_id, rating, comment } = body;

  if (!generation_id || !rating || !['positive', 'negative'].includes(rating)) {
    return NextResponse.json({ error: 'Invalid feedback data' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data, error } = await supabase
    .schema('cestari')
    .from('ai_feedback')
    .insert({
      org_id: orgId,
      user_id: userId,
      generation_id,
      rating,
      comment: comment || null,
    })
    .select()
    .single();

  if (error) {
    console.error('AI feedback error:', error);
    return NextResponse.json({ error: 'Failed to store feedback' }, { status: 500 });
  }

  return NextResponse.json({ data });
}
