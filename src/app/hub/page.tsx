'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Tag,
  Button,
} from '@carbon/react';
import {
  Dashboard,
  Document,
  Analytics,
  Calendar,
  ArrowRight,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const clientStats = {
  contentPublished: 45,
  pendingApproval: 3,
  scheduledPosts: 8,
  geoScore: 78.5,
};

const recentContent = [
  {
    title: 'Instagram Story - Summer',
    status: 'published',
    date: '2026-02-18',
  },
  {
    title: 'Blog Post - Product Launch',
    status: 'pending',
    date: '2026-02-17',
  },
  {
    title: 'LinkedIn Article - Industry Trends',
    status: 'published',
    date: '2026-02-16',
  },
  {
    title: 'Twitter Thread - Tips & Tricks',
    status: 'scheduled',
    date: '2026-02-20',
  },
  {
    title: 'Newsletter - February Edition',
    status: 'draft',
    date: '2026-02-15',
  },
];

const statusTagType: Record<string, 'green' | 'blue' | 'cyan' | 'gray'> = {
  published: 'green',
  pending: 'blue',
  scheduled: 'cyan',
  draft: 'gray',
};

export default function HubHomePage() {
  const { t } = useTranslation();
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  const kpiTiles = [
    {
      key: 'contentPublished',
      label: 'Content Published',
      value: clientStats.contentPublished,
      icon: <Document size={20} />,
    },
    {
      key: 'pendingApproval',
      label: 'Pending Approval',
      value: clientStats.pendingApproval,
      icon: <Dashboard size={20} />,
    },
    {
      key: 'scheduledPosts',
      label: 'Scheduled Posts',
      value: clientStats.scheduledPosts,
      icon: <Calendar size={20} />,
    },
    {
      key: 'geoScore',
      label: 'GEO Score',
      value: `${clientStats.geoScore}%`,
      icon: <Analytics size={20} />,
    },
  ];

  const quickActions = [
    { label: 'View Content', icon: <Document size={20} />, href: '#content' },
    { label: 'Calendar', icon: <Calendar size={20} />, href: '#calendar' },
    { label: 'Reports', icon: <Analytics size={20} />, href: '#reports' },
    {
      label: 'DNA Settings',
      icon: <Dashboard size={20} />,
      href: '/hub/dna-editor',
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Client Home Dashboard</h1>
        <p style={{ color: '#525252', marginTop: '0.5rem' }}>
          Welcome back, Acme Corp. Here is your content overview for genOS
          v4.5.0.
        </p>
      </div>

      {/* Welcome Banner */}
      <Tile
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #0f62fe 0%, #6929c4 100%)',
          color: '#ffffff',
          padding: '2rem',
        }}
      >
        <Grid>
          <Column lg={12} md={6} sm={4}>
            <h2 style={{ marginBottom: '0.5rem' }}>Welcome, Acme Corp</h2>
            <p>
              Your brand is performing well this month. Content engagement is up
              12% compared to last period.
            </p>
          </Column>
          <Column
            lg={4}
            md={2}
            sm={4}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button kind="secondary" renderIcon={ArrowRight}>
              View Full Report
            </Button>
          </Column>
        </Grid>
      </Tile>

      {/* KPI Stat Tiles */}
      <Grid style={{ marginBottom: '2rem' }}>
        {kpiTiles.map((kpi) => (
          <Column key={kpi.key} lg={4} md={4} sm={4}>
            <Tile
              style={{
                cursor: 'pointer',
                border:
                  selectedStat === kpi.key
                    ? '2px solid #0f62fe'
                    : '2px solid transparent',
                marginBottom: '1rem',
              }}
              onClick={() =>
                setSelectedStat(selectedStat === kpi.key ? null : kpi.key)
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                {kpi.icon}
                <span style={{ fontSize: '0.875rem', color: '#525252' }}>
                  {kpi.label}
                </span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 600 }}>{kpi.value}</p>
            </Tile>
          </Column>
        ))}
      </Grid>

      {/* Quick Action Cards */}
      <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
      <Grid style={{ marginBottom: '2rem' }}>
        {quickActions.map((action) => (
          <Column key={action.label} lg={4} md={4} sm={4}>
            <ClickableTile
              href={action.href}
              style={{ marginBottom: '1rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </div>
                <ArrowRight size={20} />
              </div>
            </ClickableTile>
          </Column>
        ))}
      </Grid>

      {/* Recent Content Feed */}
      <h3 style={{ marginBottom: '1rem' }}>Recent Content</h3>
      <Grid>
        <Column lg={16} md={8} sm={4}>
          {recentContent.map((item, index) => (
            <Tile key={index} style={{ marginBottom: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <Document size={20} />
                  <div>
                    <p style={{ fontWeight: 500 }}>{item.title}</p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#525252',
                        marginTop: '0.25rem',
                      }}
                    >
                      {item.date}
                    </p>
                  </div>
                </div>
                <Tag type={statusTagType[item.status] ?? 'gray'}>
                  {item.status}
                </Tag>
              </div>
            </Tile>
          ))}
        </Column>
      </Grid>
    </div>
  );
}
