-- Create media storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  false,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policy: users can only access files in their org's folder
CREATE POLICY "org_media_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = cestari.get_user_org_id()::text
  );

CREATE POLICY "org_media_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = cestari.get_user_org_id()::text
  );

CREATE POLICY "org_media_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media'
    AND (storage.foldername(name))[1] = cestari.get_user_org_id()::text
  );
