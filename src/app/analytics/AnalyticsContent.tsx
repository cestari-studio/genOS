'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Grid,
  Column,
  Tile,
  Breadcrumb,
  BreadcrumbItem,
  Loading,
} from '@carbon/react';
import {
  UserMultiple,
  Folder,
  Document,
  TaskComplete,
} from '@carbon/icons-react';
import { DonutChart } from '@carbon/charts-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';

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
  const { t } = useTranslation();

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
    return (
      <div className="page-header">
        <Loading description={t('analytics.loading')} withOverlay={false} />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem>
          <Link href="/dashboard">{t('sidebar.dashboard')}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('analytics.title')}</BreadcrumbItem>
      </Breadcrumb>

      <div className="page-header">
        <h1>{t('analytics.title')}</h1>
        <p>{t('analytics.subtitle')}</p>
      </div>

      <Grid>
        <Column lg={4} md={4} sm={4}>
          <Tile className="stat-card">
            <div className="stat-card__header" style={{ color: 'var(--cds-link-primary, #0f62fe)' }}>
              <UserMultiple size={24} />
              <span>{t('analytics.totalClients')}</span>
            </div>
            <div className="stat-value">{stats?.totalClients}</div>
            <div className="stat-change positive">
              {t('analytics.active', { count: stats?.activeClients || 0 })}
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="stat-card">
            <div className="stat-card__header" style={{ color: 'var(--cds-support-info, #8a3ffc)' }}>
              <Folder size={24} />
              <span>{t('analytics.totalProjects')}</span>
            </div>
            <div className="stat-value">{stats?.totalProjects}</div>
            <div className="stat-change positive">
              {t('analytics.completed', { count: stats?.completedProjects || 0 })}
            </div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="stat-card">
            <div className="stat-card__header" style={{ color: 'var(--cds-support-success, #007d79)' }}>
              <TaskComplete size={24} />
              <span>{t('analytics.briefings')}</span>
            </div>
            <div className="stat-value">{stats?.totalBriefings}</div>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile className="stat-card">
            <div className="stat-card__header" style={{ color: 'var(--cds-support-error, #fa4d56)' }}>
              <Document size={24} />
              <span>{t('analytics.documents')}</span>
            </div>
            <div className="stat-value">{stats?.totalDocuments}</div>
          </Tile>
        </Column>
      </Grid>

      <Grid style={{ marginTop: '2rem' }}>
        <Column lg={8} md={4} sm={4}>
          <Tile>
            <DonutChart
              data={stats?.clientsByStatus.map((s) => ({
                group: s.status,
                value: s.count,
              })) || []}
              options={{
                title: t('analytics.clientsByStatus'),
                resizable: true,
                height: '300px',
                donut: {
                  center: {
                    label: t('sidebar.clients'),
                  },
                },
              }}
            />
          </Tile>
        </Column>

        <Column lg={8} md={4} sm={4}>
          <Tile>
            <DonutChart
              data={stats?.projectsByStatus.map((s) => ({
                group: s.status,
                value: s.count,
              })) || []}
              options={{
                title: t('analytics.projectsByStatus'),
                resizable: true,
                height: '300px',
                donut: {
                  center: {
                    label: t('sidebar.projects'),
                  },
                },
              }}
            />
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
