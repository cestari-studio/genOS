import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_STATUSES = ['draft', 'review', 'approved', 'published'];

const STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['review'],
  review: ['draft', 'approved'],
  approved: ['review', 'published'],
  published: ['approved'],
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get content item error:', error);
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('GET /api/content/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Fetch current item to validate status transitions
    const { data: current, error: fetchError } = await supabase
      .from('content_items')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch content item for update error:', fetchError);
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    // Validate status transition if status is being changed
    if (body.status && body.status !== current.status) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: { status: [`Invalid status: ${body.status}`] },
          },
          { status: 422 }
        );
      }

      const allowed = STATUS_TRANSITIONS[current.status] ?? [];
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          {
            error: 'Invalid status transition',
            details: {
              status: [
                `Cannot transition from '${current.status}' to '${body.status}'. Allowed: ${allowed.join(', ') || 'none'}`,
              ],
            },
          },
          { status: 422 }
        );
      }
    }

    const updatePayload: Record<string, unknown> = {};
    if (body.title !== undefined) updatePayload.title = body.title;
    if (body.type !== undefined) updatePayload.type = body.type;
    if (body.platform !== undefined) updatePayload.platform = body.platform;
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.body !== undefined) updatePayload.body = body.body;
    if (body.metadata !== undefined) updatePayload.metadata = body.metadata;

    const { data, error } = await supabase
      .from('content_items')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update content item error:', error);
      return NextResponse.json({ error: 'Failed to update content item' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/content/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase.from('content_items').delete().eq('id', id);

    if (error) {
      console.error('Delete content item error:', error);
      return NextResponse.json({ error: 'Failed to delete content item' }, { status: 500 });
    }

    return NextResponse.json({ data: { deleted: true, id } }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/content/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
