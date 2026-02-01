import { createClient } from '@/lib/supabase/server';
import ClientsContent from './ClientsContent';

async function getClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return data || [];
}

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsContent clients={clients} />;
}
