'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Tag,
} from '@carbon/react';
import {
  Currency,
  ChartLine,
  Receipt,
  Analytics,
  DocumentTasks,
  Money,
  ArrowRight,
  Renew,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import { DonutChart, LineChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

const costBreakdownData = [
  { group: 'AI API', value: 24000 },
  { group: 'Infrastructure', value: 12000 },
  { group: 'Bandwidth', value: 3000 },
  { group: 'Storage', value: 2000 },
];
const costBreakdownOptions = {
  title: 'Cost Breakdown by Category',
  resizable: true,
  height: '320px',
  theme: 'g10' as const,
  donut: { center: { label: 'Total $41K' } },
};

const monthlyRevenueData = [
  { group: 'Revenue', date: 'Sep 2025', value: 98000 },
  { group: 'Revenue', date: 'Oct 2025', value: 105000 },
  { group: 'Revenue', date: 'Nov 2025', value: 112000 },
  { group: 'Revenue', date: 'Dec 2025', value: 120000 },
  { group: 'Revenue', date: 'Jan 2026', value: 131000 },
  { group: 'Revenue', date: 'Feb 2026', value: 142000 },
];
const monthlyRevenueOptions = {
  title: 'Monthly Revenue Trend',
  resizable: true,
  height: '320px',
  theme: 'g10' as const,
  axes: {
    bottom: { mapsTo: 'date', scaleType: 'labels' as any },
    left: { mapsTo: 'value' },
  },
  curve: 'curveMonotoneX' as const,
};

const kpiData = [
  { label: 'Total Revenue', value: '$142K', icon: Currency, color: 'green' },
  { label: 'Operating Costs', value: '$54K', icon: Money, color: 'red' },
  { label: 'Net Margin', value: '62%', icon: Analytics, color: 'blue' },
  { label: 'Token Economy', value: '$18K', icon: Renew, color: 'purple' },
];

const quickLinks = [
  { title: 'Token Economy', href: '/finops/tokens', icon: Renew, description: 'Manage token minting, burning, and transfers' },
  { title: 'Cost Breakdown', href: '/finops/costs', icon: Money, description: 'Analyze AI, infra, and operational costs' },
  { title: 'ROI Tracker', href: '/finops/roi', icon: Analytics, description: 'Track return on investment by client and channel' },
  { title: 'Invoices', href: '/finops/invoices', icon: Receipt, description: 'Create, send, and manage client invoices' },
  { title: 'Forecast', href: '/finops/forecast', icon: ChartLine, description: 'Project future revenue and growth scenarios' },
  { title: 'Audit Trail', href: '/finops/audit', icon: DocumentTasks, description: 'Review all financial events and flagged items' },
];

const recentTransactions = [
  { id: 'TXN-4021', date: '2026-02-19', description: 'Invoice #INV-1042 payment received', amount: '+$8,500.00', type: 'payment' },
  { id: 'TXN-4020', date: '2026-02-18', description: 'OpenAI API usage — February billing', amount: '-$3,214.50', type: 'cost' },
  { id: 'TXN-4019', date: '2026-02-18', description: 'Token mint — Acme Corp allocation', amount: '+500,000 tokens', type: 'token' },
  { id: 'TXN-4018', date: '2026-02-17', description: 'AWS Infrastructure — monthly compute', amount: '-$4,120.00', type: 'cost' },
  { id: 'TXN-4017', date: '2026-02-17', description: 'Client refund — Globex Corp adjustment', amount: '-$1,200.00', type: 'refund' },
  { id: 'TXN-4016', date: '2026-02-16', description: 'Invoice #INV-1039 payment received', amount: '+$12,750.00', type: 'payment' },
  { id: 'TXN-4015', date: '2026-02-15', description: 'Token burn — expired allocation cleanup', amount: '-120,000 tokens', type: 'token' },
  { id: 'TXN-4014', date: '2026-02-15', description: 'Bandwidth overage — CDN charges', amount: '-$890.00', type: 'cost' },
];

function getTagType(type: string) {
  switch (type) {
    case 'payment': return 'green';
    case 'cost': return 'red';
    case 'refund': return 'magenta';
    case 'token': return 'purple';
    default: return 'gray';
  }
}

export default function FinOpsHomePage() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('FinOps Dashboard')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Financial operations overview — revenue, costs, tokens, and insights.')}
        </p>
      </Column>

      {/* KPI Tiles */}
      {kpiData.map((kpi) => (
        <Column key={kpi.label} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ minHeight: '140px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <kpi.icon size={20} />
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t(kpi.label)}</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 600 }}>{kpi.value}</p>
          </Tile>
        </Column>
      ))}

      {/* Charts */}
      <Column lg={8} md={8} sm={4} style={{ marginBottom: '1rem' }}>
        <Tile>
          <DonutChart data={costBreakdownData} options={costBreakdownOptions} />
        </Tile>
      </Column>
      <Column lg={8} md={8} sm={4} style={{ marginBottom: '1rem' }}>
        <Tile>
          <LineChart data={monthlyRevenueData} options={monthlyRevenueOptions} />
        </Tile>
      </Column>

      {/* Quick Links */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <h3>{t('Quick Links')}</h3>
      </Column>
      {quickLinks.map((link) => (
        <Column key={link.title} lg={5} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <ClickableTile href={link.href} style={{ minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <link.icon size={24} />
              <ArrowRight size={16} />
            </div>
            <h4 style={{ margin: '1rem 0 0.5rem' }}>{t(link.title)}</h4>
            <p style={{ fontSize: '0.8125rem', color: '#525252' }}>{t(link.description)}</p>
          </ClickableTile>
        </Column>
      ))}

      {/* Recent Transactions */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <Tile>
          <h3 style={{ marginBottom: '1rem' }}>{t('Recent Transactions')}</h3>
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>{t('ID')}</StructuredListCell>
                <StructuredListCell head>{t('Date')}</StructuredListCell>
                <StructuredListCell head>{t('Description')}</StructuredListCell>
                <StructuredListCell head>{t('Amount')}</StructuredListCell>
                <StructuredListCell head>{t('Type')}</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {recentTransactions.map((txn) => (
                <StructuredListRow key={txn.id}>
                  <StructuredListCell style={{ fontFamily: 'monospace' }}>{txn.id}</StructuredListCell>
                  <StructuredListCell>{txn.date}</StructuredListCell>
                  <StructuredListCell>{txn.description}</StructuredListCell>
                  <StructuredListCell style={{ fontWeight: 600 }}>{txn.amount}</StructuredListCell>
                  <StructuredListCell>
                    <Tag type={getTagType(txn.type)} size="sm">{txn.type}</Tag>
                  </StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </Tile>
      </Column>
    </Grid>
  );
}
