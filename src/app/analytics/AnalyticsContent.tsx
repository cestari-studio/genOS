'use client';

import { useState, useEffect } from 'react';
import { Grid, Column, Tile } from '@carbon/react';
import {
  UserMultiple,
  Folder,
  Document,
  TaskComplete,
  Growth,
  Activity,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  totalClients: number;
  activeClients: number;
  totalProjects: number;
  completedProjects: number;
  totalBriefings: number;
  totalDocuments: number;
  clientsByStatus: { status: string; count: number }[];
  projectsByStatus: { status: string; count: number }[];
}

export default function AnalyticsContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [
        { count: totalClients },
        { count: activeClients },
        { count: totalProjects },
        { count: completedProjects },
        { count: totalBriefings },
        { count: totalDocuments },
        { data: clients },
        { data: projects },
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('briefings').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('status'),
        supabase.from('projects').select('status'),
      ]);

      // Agrupar por status
      const clientsByStatus = Object.entries(
        (clients || []).reduce((acc: Record<string, number>, c: any) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, {})
      ).map(([status, count]) => ({ status, count: count as number }));

      const projectsByStatus = Object.entries(
        (projects || []).reduce((acc: Record<string, number>, p: any) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {})
      ).map(([status, count]) => ({ status, count: count as number }));

      setStats({
        totalClients: totalClients || 0,
        activeClients: activeClients || 0,
        totalProjects: totalProjects || 0,
        completedProjects: completedProjects || 0,
        totalBriefings: totalBriefings || 0,
        totalDocuments: totalDocuments || 0,
        clientsByStatus,
        projectsByStatus,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div className="page-header"><h1>Carregando...</h1></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Métricas e estatísticas do sistema</p>
      </div>

      <Grid>
        <Column lg={4} md={4} sm={4}>
          <Tile className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#0f62fe' }}>
              <UserMultiple size={24} />
              <span>Total de Clientes</span>
            </div>
            <div className="stat-value">{stats?.totalClients}</div>
            <div style={{ fontSize: '0.875rem', color: '#24a148' }}>
              {stats?.activeClients} ativos
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#8a3ffc' }}>
              <Folder size={24} />
              <span>Total de Projetos</span>
            </div>
            <div className="stat-value">{stats?.totalProjects}</div>
            <div style={{ fontSize: '0.875rem', color: '#24a148' }}>
              {stats?.completedProjects} concluídos
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#007d79' }}>
              <TaskComplete size={24} />
              <span>Briefings</span>
            </div>
            <div className="stat-value">{stats?.totalBriefings}</div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#fa4d56' }}>
              <Document size={24} />
              <span>Documentos</span>
            </div>
            <div className="stat-value">{stats?.totalDocuments}</div>
          </Tile>
        </Column>
      </Grid>

      <Grid style={{ marginTop: '2rem' }}>
        <Column lg={8} md={4} sm={4}>
          <div className="content-card">
            <div className="card-header">
              <h2>Clientes por Status</h2>
            </div>
            <div className="card-body">
              {stats?.clientsByStatus.map((item) => (
                <div key={item.status} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e0e0e0' }}>
                  <span style={{ textTransform: 'capitalize' }}>{item.status}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>
        </Column>

        <Column lg={8} md={4} sm={4}>
          <div className="content-card">
            <div className="card-header">
              <h2>Projetos por Status</h2>
            </div>
            <div className="card-body">
              {stats?.projectsByStatus.length === 0 ? (
                <p style={{ color: '#8d8d8d', textAlign: 'center' }}>Nenhum projeto cadastrado</p>
              ) : (
                stats?.projectsByStatus.map((item) => (
                  <div key={item.status} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e0e0e0' }}>
                    <span style={{ textTransform: 'capitalize' }}>{item.status.replace('_', ' ')}</span>
                    <strong>{item.count}</strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </Column>
      </Grid>
    </div>
  );
}
