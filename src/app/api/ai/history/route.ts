import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const orgId = request.headers.get('x-org-id');
  const userId = request.headers.get('x-user-id');

  if (!orgId || !userId) {
    return NextResponse.json({ error: 'Missing context' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');

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

  const { data, error, count } = await supabase
    .schema('cestari')
    .from('audit_log')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .eq('action', 'ai_generate')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('AI history error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    limit,
    offset,
  });
}
