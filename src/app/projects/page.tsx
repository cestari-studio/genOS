import { createClient } from '@/lib/supabase/server';
import ProjectsContent from './ProjectsContent';

async function getProjectsData() {
  const supabase = await createClient();

  const [
    { data: projects },
    { data: clients },
  ] = await Promise.all([
    supabase.from('projects').select('*, client:clients(id, name)').order('created_at', { ascending: false }),
    supabase.from('clients').select('id, name').eq('status', 'active'),
  ]);

  return {
    projects: projects || [],
    clients: clients || [],
  };
}

export default async function ProjectsPage() {
  const data = await getProjectsData();
  return <ProjectsContent {...data} />;
}
