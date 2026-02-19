import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncWixContacts } from '@/lib/connectors/wix';
import { apiSuccess, apiError } from '@/lib/validations/response';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    if (!orgId) return apiError('Contexto de organização não encontrado', 403);

    const supabase = await createClient();

    // Get Wix API key from organization settings
    const { data: org } = await supabase
      .from('organizations')
      .select('settings')
      .eq('id', orgId)
      .single();

    const apiKey = org?.settings?.wix_api_key;
    if (!apiKey) return apiError('Wix não está conectado. Configure a API key primeiro.', 400);

    const result = await syncWixContacts(supabase, apiKey, orgId);

    return apiSuccess(result);
  } catch (error) {
    console.error('Wix sync error:', error);
    return apiError('Erro ao sincronizar com Wix');
  }
}
