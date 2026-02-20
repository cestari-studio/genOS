'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  Button,
  ClickableTile,
} from '@carbon/react';
import {
  Dashboard,
  ArrowRight,
  Collaborate,
  Analytics,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const quickStats = {
  activeClients: 47,
  pendingApprovals: 12,
  contentThisMonth: 234,
  revenueMonth: '$28,400',
};

const recentActivity = [
  { id: '1', type: 'content_approved', client: 'Acme Corp', time: '2h ago' },
  { id: '2', type: 'client_onboarded', client: 'Beta Inc', time: '4h ago' },
  { id: '3', type: 'invoice_paid', client: 'Gamma LLC', time: '6h ago' },
  { id: '4', type: 'content_submitted', client: 'Delta Co', time: '8h ago' },
  { id: '5', type: 'project_started', client: 'Epsilon Ltd', time: '1d ago' },
  { id: '6', type: 'content_approved', client: 'Zeta Corp', time: '1d ago' },
];

const activityTypeColors: Record<string, 'green' | 'blue' | 'purple' | 'cyan' | 'teal'> = {
  content_approved: 'green',
  client_onboarded: 'blue',
  invoice_paid: 'purple',
  content_submitted: 'cyan',
  project_started: 'teal',
};

const activityTypeLabels: Record<string, string> = {
  content_approved: 'Content Approved',
  client_onboarded: 'Client Onboarded',
  invoice_paid: 'Invoice Paid',
  content_submitted: 'Content Submitted',
  project_started: 'Project Started',
};

const quickActions = [
  { id: 'new-client', label: 'New Client', href: '/agency/portfolio', icon: Collaborate },
  { id: 'create-content', label: 'Create Content', href: '/content', icon: Dashboard },
  { id: 'view-reports', label: 'View Reports', href: '/agency/profit', icon: Analytics },
  { id: 'ai-assistant', label: 'AI Assistant', href: '/briefings', icon: ArrowRight },
];

export default function AgencyHomePage() {
  const { t } = useTranslation();
  const [visibleActivities, setVisibleActivities] = useState(4);

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header">
        <h1>Agency Dashboard</h1>
        <p>Overview of your agency operations and performance</p>
      </div>

      {/* KPI Tiles Row */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Dashboard size={20} style={{ color: 'var(--cds-link-primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              Active Clients
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{quickStats.activeClients}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Collaborate size={20} style={{ color: 'var(--cds-support-warning)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              Pending Approvals
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{quickStats.pendingApprovals}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Analytics size={20} style={{ color: 'var(--cds-support-success)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              Content This Month
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{quickStats.contentThisMonth}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <ArrowRight size={20} style={{ color: 'var(--cds-support-info)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              Revenue This Month
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{quickStats.revenueMonth}</p>
          </Tile>
        </Column>
      </Grid>

      {/* Quick Action Cards */}
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Quick Actions</h2>
      <Grid style={{ marginBottom: '2rem' }}>
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Column key={action.id} lg={4} md={2} sm={4}>
              <ClickableTile
                href={action.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                <IconComponent size={20} />
                <span style={{ fontWeight: 500 }}>{action.label}</span>
                <ArrowRight size={20} style={{ marginLeft: 'auto' }} />
              </ClickableTile>
            </Column>
          );
        })}
      </Grid>

      {/* Recent Activity Feed */}
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Activity</h2>
      <Tile style={{ padding: '1rem' }}>
        {recentActivity.slice(0, visibleActivities).map((activity) => (
          <div
            key={activity.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 0',
              borderBottom: '1px solid var(--cds-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Tag type={activityTypeColors[activity.type] || 'gray'} size="sm">
                {activityTypeLabels[activity.type] || activity.type}
              </Tag>
              <span style={{ fontWeight: 500 }}>{activity.client}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
              {activity.time}
            </span>
          </div>
        ))}
        {visibleActivities < recentActivity.length && (
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <Button
              kind="ghost"
              size="sm"
              onClick={() => setVisibleActivities(recentActivity.length)}
            >
              Show More
            </Button>
          </div>
        )}
      </Tile>
    </div>
  );
}
