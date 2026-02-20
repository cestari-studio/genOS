'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  Button,
} from '@carbon/react';
import {
  Finance,
  Money,
  UserMultiple,
  DataVis_1,
  Renew,
  ArrowUp,
  ArrowDown,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  changeDirection: 'up' | 'down';
  changeType: 'positive' | 'negative';
  icon: React.ElementType;
}

const stats: StatCard[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$142,380',
    change: '+12.4%',
    changeDirection: 'up',
    changeType: 'positive',
    icon: Money,
  },
  {
    id: 'subscriptions',
    label: 'Active Subscriptions',
    value: '89',
    change: '+7',
    changeDirection: 'up',
    changeType: 'positive',
    icon: UserMultiple,
  },
  {
    id: 'tokens',
    label: 'Token Usage',
    value: '2.4M',
    change: '+18.2%',
    changeDirection: 'up',
    changeType: 'negative',
    icon: Renew,
  },
  {
    id: 'cost-per-token',
    label: 'Cost per Token',
    value: '$0.003',
    change: '-5.1%',
    changeDirection: 'down',
    changeType: 'positive',
    icon: DataVis_1,
  },
];

const topTenants = [
  { id: '1', tenant: 'Acme Corporation', plan: 'Enterprise', spend: '$12,450', tokens: '428K', trend: 'up' },
  { id: '2', tenant: 'Nova Digital Agency', plan: 'Professional', spend: '$8,920', tokens: '312K', trend: 'up' },
  { id: '3', tenant: 'Stellar Brands Co.', plan: 'Enterprise', spend: '$7,680', tokens: '256K', trend: 'down' },
  { id: '4', tenant: 'Quantum Marketing Ltd.', plan: 'Professional', spend: '$6,340', tokens: '198K', trend: 'up' },
  { id: '5', tenant: 'Apex Media Group', plan: 'Professional', spend: '$5,870', tokens: '187K', trend: 'up' },
  { id: '6', tenant: 'BlueSky Ventures', plan: 'Starter', spend: '$4,210', tokens: '145K', trend: 'down' },
  { id: '7', tenant: 'ClearPath Solutions', plan: 'Professional', spend: '$3,990', tokens: '132K', trend: 'up' },
  { id: '8', tenant: 'DataForge Analytics', plan: 'Enterprise', spend: '$3,750', tokens: '120K', trend: 'up' },
  { id: '9', tenant: 'EcoTech Innovations', plan: 'Starter', spend: '$2,890', tokens: '98K', trend: 'down' },
  { id: '10', tenant: 'FutureWave Digital', plan: 'Professional', spend: '$2,540', tokens: '84K', trend: 'up' },
];

const tenantHeaders = [
  { key: 'tenant', header: 'Tenant' },
  { key: 'plan', header: 'Plan' },
  { key: 'spend', header: 'Monthly Spend' },
  { key: 'tokens', header: 'Token Usage' },
  { key: 'trend', header: 'Trend' },
];

const costDistribution = [
  { label: 'AI Model Inference', percentage: 42, color: '#0f62fe' },
  { label: 'Infrastructure', percentage: 23, color: '#6929c4' },
  { label: 'Data Storage', percentage: 15, color: '#1192e8' },
  { label: 'Network / CDN', percentage: 10, color: '#005d5d' },
  { label: 'Support & Operations', percentage: 7, color: '#9f1853' },
  { label: 'Other', percentage: 3, color: '#878d96' },
];

export default function FinOpsPage() {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const planTagType = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return 'purple';
      case 'Professional':
        return 'blue';
      case 'Starter':
        return 'teal';
      default:
        return 'gray';
    }
  };

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={12} md={6} sm={4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Finance size={24} />
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Global FinOps Dashboard</h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '2rem' }}>
          Financial operations overview across all tenants. Monitor revenue, costs, and resource consumption.
        </p>
      </Column>

      <Column lg={4} md={2} sm={4} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <Button
              key={period}
              kind={selectedPeriod === period ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </Column>

      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const ChangeIcon = stat.changeDirection === 'up' ? ArrowUp : ArrowDown;
        return (
          <Column key={stat.id} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#525252' }}>{stat.label}</span>
                <IconComponent size={20} style={{ color: '#525252' }} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{stat.value}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <ChangeIcon
                  size={16}
                  style={{
                    color: stat.changeType === 'positive' ? '#198038' : '#da1e28',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: stat.changeType === 'positive' ? '#198038' : '#da1e28',
                  }}
                >
                  {stat.change}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#525252', marginLeft: '0.25rem' }}>
                  vs last {selectedPeriod}
                </span>
              </div>
            </Tile>
          </Column>
        );
      })}

      <Column lg={10} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Top Tenants by Spend
        </h2>
        <DataTable rows={topTenants} headers={tenantHeaders} isSortable>
          {({
            rows: tableRows,
            headers: tableHeaders,
            getTableProps,
            getHeaderProps,
            getRowProps,
            onInputChange,
          }: any) => (
            <>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} placeholder="Search tenants..." />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header: any) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row: any) => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell: any) => {
                        if (cell.info.header === 'plan') {
                          return (
                            <TableCell key={cell.id}>
                              <Tag type={planTagType(cell.value)} size="sm">
                                {cell.value}
                              </Tag>
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'trend') {
                          const TrendIcon = cell.value === 'up' ? ArrowUp : ArrowDown;
                          return (
                            <TableCell key={cell.id}>
                              <TrendIcon
                                size={16}
                                style={{ color: cell.value === 'up' ? '#198038' : '#da1e28' }}
                              />
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'spend') {
                          return (
                            <TableCell key={cell.id}>
                              <span style={{ fontWeight: 600 }}>{cell.value}</span>
                            </TableCell>
                          );
                        }
                        return <TableCell key={cell.id}>{cell.value}</TableCell>;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DataTable>
      </Column>

      <Column lg={6} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <Tile>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Cost Distribution
          </h2>

          {/* Donut Chart Placeholder */}
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              margin: '0 auto 1.5rem',
              position: 'relative',
              background: `conic-gradient(${costDistribution
                .reduce(
                  (acc, item, i) => {
                    const start = i === 0 ? 0 : costDistribution.slice(0, i).reduce((s, c) => s + c.percentage, 0);
                    const end = start + item.percentage;
                    return `${acc}${i > 0 ? ', ' : ''}${item.color} ${start}% ${end}%`;
                  },
                  ''
                )})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>$58.6K</span>
              <span style={{ fontSize: '0.625rem', color: '#525252' }}>Total Cost</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {costDistribution.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: item.color,
                    }}
                  />
                  <span style={{ fontSize: '0.8125rem' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </Tile>

        <Tile style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', color: '#525252' }}>Avg Revenue / Tenant</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>$1,599</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', color: '#525252' }}>Gross Margin</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#198038' }}>58.8%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', color: '#525252' }}>Churn Rate (30d)</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>2.1%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8125rem', color: '#525252' }}>MRR Growth</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#198038' }}>+$8,420</span>
            </div>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
