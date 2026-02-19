import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { apiSuccess, apiError, apiValidationError } from '@/lib/validations/response';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: orgId } = await supabase.rpc('get_user_org_id');

    if (!orgId) {
      return apiError('Organização não encontrada', 403);
    }

    const adminSupabase = createAdminClient();
    const { data: members, error } = await adminSupabase
      .from('organization_members')
      .select('user_id, role, created_at')
      .eq('organization_id', orgId);

    if (error) throw error;

    // Fetch user details via admin auth API
    const users = await Promise.all(
      (members ?? []).map(async (member) => {
        const { data: { user } } = await adminSupabase.auth.admin.getUserById(member.user_id);
        return {
          id: member.user_id,
          email: user?.email ?? '',
          name: user?.user_metadata?.full_name ?? user?.email ?? '',
          role: member.role,
          created_at: member.created_at,
          last_sign_in_at: user?.last_sign_in_at ?? null,
        };
      })
    );

    return apiSuccess(users);
  } catch (error) {
    console.error('List users error:', error);
    return apiError('Erro ao listar usuários');
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { email, role } = body;

    if (!email || typeof email !== 'string') {
      return apiValidationError({ email: ['Email is required'] });
    }

    if (!role || !['admin', 'editor', 'viewer'].includes(role)) {
      return apiValidationError({ role: ['Role must be admin, editor, or viewer'] });
    }

    const { data: orgId } = await supabase.rpc('get_user_org_id');
    if (!orgId) {
      return apiError('Organização não encontrada', 403);
    }

    const adminSupabase = createAdminClient();

    // Invite user via Supabase Auth
    const { data: inviteData, error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
      data: { invited_to_org: orgId, role },
    });

    if (inviteError) {
      if (inviteError.message.includes('already registered')) {
        return apiError('Usuário já registrado. Adicione-o diretamente.', 409);
      }
      throw inviteError;
    }

    // Add to organization_members
    if (inviteData.user) {
      await adminSupabase.from('organization_members').insert({
        organization_id: orgId,
        user_id: inviteData.user.id,
        role,
      });
    }

    return apiSuccess({ email, role, invited: true }, 201);
  } catch (error) {
    console.error('Invite user error:', error);
    return apiError('Erro ao convidar usuário');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { user_id, role } = body;

    if (!user_id || typeof user_id !== 'string') {
      return apiValidationError({ user_id: ['User ID is required'] });
    }

    if (!role || !['admin', 'editor', 'viewer'].includes(role)) {
      return apiValidationError({ role: ['Role must be admin, editor, or viewer'] });
    }

    const { data: orgId } = await supabase.rpc('get_user_org_id');
    if (!orgId) {
      return apiError('Organização não encontrada', 403);
    }

    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('organization_members')
      .update({ role })
      .eq('organization_id', orgId)
      .eq('user_id', user_id);

    if (error) throw error;

    return apiSuccess({ user_id, role });
  } catch (error) {
    console.error('Update user role error:', error);
    return apiError('Erro ao atualizar papel do usuário');
  }
}
