import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const mockContentItems = [
  {
    id: '1',
    title: 'Summer Campaign - Instagram Post',
    type: 'post',
    platform: ['Instagram', 'Facebook'],
    status: 'published',
    updated_at: '2026-02-18T00:00:00Z',
  },
  {
    id: '2',
    title: 'Brand Story - Q1 2026',
    type: 'story',
    platform: ['Instagram'],
    status: 'approved',
    updated_at: '2026-02-17T00:00:00Z',
  },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching content items, returning mock data:', error);
      return NextResponse.json({ data: mockContentItems }, { status: 200 });
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error('GET /api/content error:', error);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { title, type } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Validation failed', details: { title: ['Title is required'] } },
        { status: 422 }
      );
    }

    if (!type || typeof type !== 'string' || type.trim() === '') {
      return NextResponse.json(
        { error: 'Validation failed', details: { type: ['Type is required'] } },
        { status: 422 }
      );
    }

    const validTypes = ['post', 'page', 'story', 'reel'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: { type: [`Type must be one of: ${validTypes.join(', ')}`] },
        },
        { status: 422 }
      );
    }

    const payload = {
      title: title.trim(),
      type,
      platform: body.platform ?? [],
      status: body.status ?? 'draft',
      body: body.body ?? null,
      metadata: body.metadata ?? null,
    };

    const { data, error } = await supabase
      .from('content_items')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Insert content item error:', error);
      return NextResponse.json({ error: 'Failed to create content item' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
