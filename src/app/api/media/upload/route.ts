import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/validations/response';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'application/pdf',
];

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    if (!orgId) {
      return apiError('Contexto de organização não encontrado', 403);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return apiError('Nenhum arquivo enviado', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiError('Arquivo excede o limite de 50MB', 400);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return apiError(`Tipo de arquivo não permitido: ${file.type}`, 400);
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${orgId}/${folder}/${timestamp}-${safeName}`;

    const supabase = await createClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    return apiSuccess({
      path: data.path,
      fullPath: data.path,
      size: file.size,
      type: file.type,
    }, 201);
  } catch (error) {
    console.error('Upload error:', error);
    return apiError('Erro ao fazer upload do arquivo');
  }
}
