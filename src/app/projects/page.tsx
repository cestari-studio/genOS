import { createClient } from '@/lib/supabase/server';
import ProjectsContent from './ProjectsContent';

async function getProjectsData() {
  const supabase = await createClient();
  
  const [
    { data: projects },
    { data: clients },
    { data: serviceTiers },
  ] = await Promise.all([
    supabase.from('projects').select('*, client:clients(id, name), service_tier:service_tiers(id, name)').order('created_at', { ascending: false }),
    supabase.from('clients').select('id, name').eq('status', 'active'),
    supabase.from('service_tiers').select('id, name, price').eq('is_active', true),
  ]);
  
  return {
    projects: projects || [],
    clients: clients || [],
    serviceTiers: serviceTiers || [],
  };
}

export default async function ProjectsPage() {
  const data = await getProjectsData();
  return <ProjectsContent {...data} />;
}
