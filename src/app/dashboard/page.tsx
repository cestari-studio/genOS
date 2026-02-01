import { createClient } from '@/lib/supabase/server';
import DashboardContent from './DashboardContent';

async function getDashboardData() {
  const supabase = await createClient();
  
  const [
    { count: clientsCount },
    { count: projectsCount },
    { count: briefingsCount },
    { data: recentClients },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('briefings').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('projects').select('*, client:clients(name)').order('created_at', { ascending: false }).limit(5),
  ]);

  return {
    stats: {
      clients: clientsCount || 0,
      projects: projectsCount || 0,
      briefings: briefingsCount || 0,
    },
    recentClients: recentClients || [],
    recentProjects: recentProjects || [],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  return <DashboardContent data={data} />;
}
