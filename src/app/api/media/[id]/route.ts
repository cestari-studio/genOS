import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/validations/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: filePath } = await params;
    const orgId = request.headers.get('x-org-id');

    if (!orgId) {
      return apiError('Contexto de organização não encontrado', 403);
    }

    // Validate the file path starts with the user's org
    if (!filePath.startsWith(orgId)) {
      return apiError('Acesso negado ao arquivo', 403);
    }

    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from('media')
      .createSignedUrl(filePath, 3600); // 1hr expiry

    if (error) throw error;

    return apiSuccess({ url: data.signedUrl });
  } catch (error) {
    console.error('Get media error:', error);
    return apiError('Erro ao buscar arquivo');
  }
}
