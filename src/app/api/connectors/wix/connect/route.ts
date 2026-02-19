import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { testWixConnection } from '@/lib/connectors/wix';
import { apiSuccess, apiError } from '@/lib/validations/response';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    if (!orgId) return apiError('Contexto de organização não encontrado', 403);

    const { api_key } = await request.json();
    if (!api_key) return apiError('API key é obrigatória', 400);

    const connected = await testWixConnection(api_key);
    if (!connected) return apiError('Não foi possível conectar ao Wix. Verifique a API key.', 400);

    const supabase = await createClient();

    // Store the API key in organization settings
    const { data: org } = await supabase
      .from('organizations')
      .select('settings')
      .eq('id', orgId)
      .single();

    const settings = { ...(org?.settings ?? {}), wix_api_key: api_key };

    await supabase
      .from('organizations')
      .update({ settings })
      .eq('id', orgId);

    return apiSuccess({ connected: true, connector: 'wix' });
  } catch (error) {
    console.error('Wix connect error:', error);
    return apiError('Erro ao conectar ao Wix');
  }
}
