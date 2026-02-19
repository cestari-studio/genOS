import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { step, data } = body as { step: number; data: Record<string, unknown> };

    if (user) {
      // Save onboarding progress for authenticated users
      await supabase
        .from('onboarding_progress')
        .upsert(
          {
            user_id: user.id,
            step,
            step_data: data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,step' }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding POST error:', error);
    // Return success even on DB errors so the UI flow is not blocked
    return NextResponse.json({ success: true });
  }
}

export async function PUT() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Mark onboarding as complete in user metadata
      await supabase.auth.updateUser({
        data: { onboarding_completed: true, onboarding_completed_at: new Date().toISOString() },
      });

      // Also persist to profiles table if it exists
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
    }

    return NextResponse.json({ success: true, completed: true });
  } catch (error) {
    console.error('Onboarding PUT error:', error);
    return NextResponse.json({ success: true, completed: true });
  }
}
