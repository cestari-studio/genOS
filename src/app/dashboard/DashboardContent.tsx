'use client';

import {
  Grid,
  Column,
  ClickableTile,
  Tag,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from '@carbon/react';
import {
  UserMultiple,
  Folder,
  TaskComplete,
  ArrowRight,
} from '@carbon/icons-react';
import Link from 'next/link';

interface DashboardData {
  stats: {
    clients: number;
    projects: number;
    briefings: number;
  };
  recentClients: any[];
  recentProjects: any[];
}

const statusColors: Record<string, 'green' | 'gray' | 'blue' | 'red'> = {
  active: 'green',
  inactive: 'gray',
  lead: 'blue',
  churned: 'red',
  planning: 'gray',
  briefing: 'blue',
  in_progress: 'cyan' as any,
  review: 'purple' as any,
  completed: 'green',
  on_hold: 'teal' as any,
  cancelled: 'red',
};

export default function DashboardContent({ data }: { data: DashboardData }) {
  const { stats, recentClients, recentProjects } = data;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Visao geral do genOS Content Factory</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={<UserMultiple size={24} />}
          label="Clientes Ativos"
          value={stats.clients}
          href="/clients"
        />
        <StatCard
          icon={<Folder size={24} />}
          label="Projetos"
          value={stats.projects}
          href="/projects"
        />
        <StatCard
          icon={<TaskComplete size={24} />}
          label="Briefings"
          value={stats.briefings}
          href="/briefings"
        />
      </div>

      <Grid>
        <Column lg={8} md={4} sm={4}>
          <div className="content-card">
            <div className="card-header">
              <h2>Clientes Recentes</h2>
              <Link
                href="/clients"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--cds-link-primary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-body">
              {recentClients.length === 0 ? (
                <p
                  style={{
                    color: 'var(--cds-text-helper)',
                    textAlign: 'center',
                    padding: '2rem',
                  }}
                >
                  Nenhum cliente cadastrado
                </p>
              ) : (
                <StructuredListWrapper isCondensed>
                  <StructuredListBody>
                    {recentClients.map((client) => (
                      <StructuredListRow key={client.id}>
                        <StructuredListCell>
                          <span style={{ fontWeight: 600 }}>
                            {client.name}
                          </span>
                          <br />
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--cds-text-secondary)',
                            }}
                          >
                            {client.email}
                          </span>
                        </StructuredListCell>
                        <StructuredListCell>
                          <Tag
                            type={statusColors[client.status] || 'gray'}
                            size="sm"
                          >
                            {client.status}
                          </Tag>
                        </StructuredListCell>
                      </StructuredListRow>
                    ))}
                  </StructuredListBody>
                </StructuredListWrapper>
              )}
            </div>
          </div>
        </Column>

        <Column lg={8} md={4} sm={4}>
          <div className="content-card">
            <div className="card-header">
              <h2>Projetos Recentes</h2>
              <Link
                href="/projects"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--cds-link-primary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-body">
              {recentProjects.length === 0 ? (
                <p
                  style={{
                    color: 'var(--cds-text-helper)',
                    textAlign: 'center',
                    padding: '2rem',
                  }}
                >
                  Nenhum projeto cadastrado
                </p>
              ) : (
                <StructuredListWrapper isCondensed>
                  <StructuredListBody>
                    {recentProjects.map((project) => (
                      <StructuredListRow key={project.id}>
                        <StructuredListCell>
                          <span style={{ fontWeight: 600 }}>
                            {project.name}
                          </span>
                          <br />
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--cds-text-secondary)',
                            }}
                          >
                            {project.client?.name}
                          </span>
                        </StructuredListCell>
                        <StructuredListCell>
                          <Tag
                            type={statusColors[project.status] || 'gray'}
                            size="sm"
                          >
                            {project.status}
                          </Tag>
                        </StructuredListCell>
                      </StructuredListRow>
                    ))}
                  </StructuredListBody>
                </StructuredListWrapper>
              )}
            </div>
          </div>
        </Column>
      </Grid>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <ClickableTile href={href} className="stat-card">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
          color: 'var(--cds-text-secondary)',
        }}
      >
        {icon}
        <span className="stat-label" style={{ margin: 0 }}>
          {label}
        </span>
      </div>
      <div className="stat-value">{value}</div>
    </ClickableTile>
  );
}
