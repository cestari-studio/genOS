import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = import('@supabase/supabase-js').SupabaseClient<any, any, any>;

export class TenantViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantViolationError';
  }
}

export async function validateTenant(
  supabase: AnySupabaseClient,
  entityId: string,
  tableName: string
): Promise<{ valid: true; orgId: string }> {
  const { data: orgIdResult, error: orgError } = await supabase.rpc('get_user_org_id');

  if (orgError || !orgIdResult) {
    throw new TenantViolationError('Não foi possível identificar a organização do usuário');
  }

  const userOrgId = orgIdResult as string;

  const { data: entity, error: entityError } = await supabase
    .from(tableName)
    .select('organization_id')
    .eq('id', entityId)
    .single();

  if (entityError || !entity) {
    throw new TenantViolationError('O registro solicitado não foi encontrado');
  }

  if (entity.organization_id !== userOrgId) {
    console.error(
      `TENTATIVA DE VIOLAÇÃO: user org ${userOrgId} tentou acessar registro ${entityId} da org ${entity.organization_id} na tabela ${tableName}`
    );

    const adminClient = createAdminClient();
    await adminClient.from('audit_log').insert({
      organization_id: userOrgId,
      action: 'tenant_violation_attempt',
      details: {
        target_entity_id: entityId,
        target_org_id: entity.organization_id,
        table_name: tableName,
      },
    });

    throw new TenantViolationError('O registro solicitado não pertence ao seu perfil');
  }

  return { valid: true, orgId: userOrgId };
}
