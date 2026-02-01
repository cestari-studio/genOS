'use client';

import { Grid, Column, Tile, ClickableTile } from '@carbon/react';
import { 
  UserMultiple, 
  Folder, 
  TaskComplete,
  ArrowRight,
  Time,
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

export default function DashboardContent({ data }: { data: DashboardData }) {
  const { stats, recentClients, recentProjects } = data;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral do genOS Content Factory</p>
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
              <Link href="/clients" className="view-all">
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-body">
              {recentClients.length === 0 ? (
                <p className="empty-state">Nenhum cliente cadastrado</p>
              ) : (
                <ul className="recent-list">
                  {recentClients.map((client) => (
                    <li key={client.id} className="recent-item">
                      <div className="item-info">
                        <span className="item-name">{client.name}</span>
                        <span className="item-meta">{client.email}</span>
                      </div>
                      <span className={`status-badge ${client.status}`}>
                        {client.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Column>

        <Column lg={8} md={4} sm={4}>
          <div className="content-card">
            <div className="card-header">
              <h2>Projetos Recentes</h2>
              <Link href="/projects" className="view-all">
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-body">
              {recentProjects.length === 0 ? (
                <p className="empty-state">Nenhum projeto cadastrado</p>
              ) : (
                <ul className="recent-list">
                  {recentProjects.map((project) => (
                    <li key={project.id} className="recent-item">
                      <div className="item-info">
                        <span className="item-name">{project.name}</span>
                        <span className="item-meta">{project.client?.name}</span>
                      </div>
                      <span className={`status-badge ${project.status}`}>
                        {project.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Column>
      </Grid>

      <style jsx>{`
        .view-all {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #0f62fe;
          text-decoration: none;
          font-size: 0.875rem;
        }
        .recent-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .recent-item:last-child {
          border-bottom: none;
        }
        .item-info {
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-weight: 500;
        }
        .item-meta {
          font-size: 0.75rem;
          color: #525252;
        }
        .empty-state {
          color: #8d8d8d;
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, href }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="stat-card" style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#525252' }}>
          {icon}
          <span className="stat-label" style={{ margin: 0 }}>{label}</span>
        </div>
        <div className="stat-value">{value}</div>
      </div>
    </Link>
  );
}
