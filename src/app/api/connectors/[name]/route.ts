import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/validations/response';

const VALID_CONNECTORS = ['wix', 'figma'];
const CONNECTOR_KEY_MAP: Record<string, string> = {
  wix: 'wix_api_key',
  figma: 'figma_access_token',
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const orgId = request.headers.get('x-org-id');
    if (!orgId) return apiError('Contexto de organização não encontrado', 403);

    if (!VALID_CONNECTORS.includes(name)) {
      return apiError(`Conector '${name}' não é válido`, 400);
    }

    const supabase = await createClient();
    const { data: org } = await supabase
      .from('organizations')
      .select('settings')
      .eq('id', orgId)
      .single();

    if (!org) return apiError('Organização não encontrada', 404);

    const settings = { ...(org.settings ?? {}) };
    delete settings[CONNECTOR_KEY_MAP[name]];

    await supabase
      .from('organizations')
      .update({ settings })
      .eq('id', orgId);

    return apiSuccess({ disconnected: true, connector: name });
  } catch (error) {
    console.error('Disconnect connector error:', error);
    return apiError('Erro ao desconectar');
  }
}
