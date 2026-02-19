import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('content_versions')
      .select('*')
      .eq('content_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get content versions error:', error);
      return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error('GET /api/content/[id]/versions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the current content item to snapshot
    const { data: contentItem, error: fetchError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch content item for versioning error:', fetchError);
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const label = body.label ?? null;
    const message = body.message ?? null;

    const versionPayload = {
      content_id: id,
      title: contentItem.title,
      type: contentItem.type,
      platform: contentItem.platform,
      status: contentItem.status,
      body: contentItem.body ?? null,
      metadata: contentItem.metadata ?? null,
      label,
      message,
      snapshot: contentItem,
    };

    const { data, error } = await supabase
      .from('content_versions')
      .insert(versionPayload)
      .select()
      .single();

    if (error) {
      console.error('Create content version error:', error);
      return NextResponse.json({ error: 'Failed to create version snapshot' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/content/[id]/versions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
