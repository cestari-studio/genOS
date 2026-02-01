import { createClient } from '@/lib/supabase/server';
import BriefingsContent from './BriefingsContent';

async function getBriefingsData() {
  const supabase = await createClient();
  
  const [{ data: briefings }, { data: clients }] = await Promise.all([
    supabase.from('briefings').select('*, client:clients(id, name)').order('created_at', { ascending: false }),
    supabase.from('clients').select('id, name').eq('status', 'active'),
  ]);
  
  return { briefings: briefings || [], clients: clients || [] };
}

export default async function BriefingsPage() {
  const data = await getBriefingsData();
  return <BriefingsContent {...data} />;
}
