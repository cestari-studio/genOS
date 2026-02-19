import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncFigmaAssets } from '@/lib/connectors/figma';
import { apiSuccess, apiError } from '@/lib/validations/response';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    if (!orgId) return apiError('Contexto de organização não encontrado', 403);

    const { file_key } = await request.json();
    if (!file_key) return apiError('file_key é obrigatório', 400);

    const supabase = await createClient();

    // Get Figma access token from organization settings
    const { data: org } = await supabase
      .from('organizations')
      .select('settings')
      .eq('id', orgId)
      .single();

    const accessToken = org?.settings?.figma_access_token;
    if (!accessToken) return apiError('Figma não está conectado. Configure o access token primeiro.', 400);

    const result = await syncFigmaAssets(supabase, accessToken, file_key, orgId);

    return apiSuccess(result);
  } catch (error) {
    console.error('Figma sync error:', error);
    return apiError('Erro ao sincronizar com Figma');
  }
}
