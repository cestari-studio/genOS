import { createClient } from '@/lib/supabase/server';
import DocumentsContent from './DocumentsContent';

async function getDocumentsData() {
  const supabase = await createClient();
  
  const [{ data: documents }, { data: clients }] = await Promise.all([
    supabase.from('documents').select('*, client:clients(id, name)').order('created_at', { ascending: false }),
    supabase.from('clients').select('id, name'),
  ]);
  
  return { documents: documents || [], clients: clients || [] };
}

export default async function DocumentsPage() {
  const data = await getDocumentsData();
  return <DocumentsContent {...data} />;
}
