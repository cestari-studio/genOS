'use client';

import React from 'react';
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
  TableContainer,
  Tag,
} from '@carbon/react';
import { ChartLine, Growth, Checkmark, Analytics } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

const forecastChartData = [
  { group: 'Actual Revenue', date: 'Sep 2025', value: 98000 },
  { group: 'Actual Revenue', date: 'Oct 2025', value: 105000 },
  { group: 'Actual Revenue', date: 'Nov 2025', value: 112000 },
  { group: 'Actual Revenue', date: 'Dec 2025', value: 120000 },
  { group: 'Actual Revenue', date: 'Jan 2026', value: 131000 },
  { group: 'Actual Revenue', date: 'Feb 2026', value: 142000 },
  { group: 'Projected Revenue', date: 'Feb 2026', value: 142000 },
  { group: 'Projected Revenue', date: 'Mar 2026', value: 105000 },
  { group: 'Projected Revenue', date: 'Apr 2026', value: 115000 },
  { group: 'Projected Revenue', date: 'May 2026', value: 128000 },
  { group: 'Projected Revenue', date: 'Jun 2026', value: 142000 },
];
const forecastChartOptions = {
  title: 'Revenue Forecast Projection',
  resizable: true,
  height: '350px',
  theme: 'g10' as const,
  axes: {
    bottom: { mapsTo: 'date', scaleType: 'labels' as any },
    left: { mapsTo: 'value' },
  },
  curve: 'curveMonotoneX' as const,
};

const kpiData = [
  { label: 'Projected Q1 Revenue', value: '$420K', icon: ChartLine },
  { label: 'Growth Rate', value: '+22%', icon: Growth },
  { label: 'Confidence', value: 'High', icon: Analytics },
  { label: 'Break-even', value: 'Achieved', icon: Checkmark },
];

const monthlyProjections = [
  { month: 'March 2026', projectedRevenue: '$105,000', confidence: 'high' },
  { month: 'April 2026', projectedRevenue: '$115,000', confidence: 'high' },
  { month: 'May 2026', projectedRevenue: '$128,000', confidence: 'medium' },
  { month: 'June 2026', projectedRevenue: '$142,000', confidence: 'medium' },
];

const assumptions = [
  { id: 'ASM-001', variable: 'Monthly Active Clients', currentValue: '24', projected: '32', impact: 'High' },
  { id: 'ASM-002', variable: 'Avg. Revenue per Client', currentValue: '$5,900', projected: '$6,400', impact: 'High' },
  { id: 'ASM-003', variable: 'Client Churn Rate', currentValue: '4.2%', projected: '3.5%', impact: 'Medium' },
  { id: 'ASM-004', variable: 'AI API Cost per Request', currentValue: '$0.032', projected: '$0.028', impact: 'Medium' },
  { id: 'ASM-005', variable: 'Content Volume Growth', currentValue: '+15%/mo', projected: '+20%/mo', impact: 'High' },
  { id: 'ASM-006', variable: 'Infrastructure Scaling Factor', currentValue: '1.0x', projected: '1.3x', impact: 'Low' },
  { id: 'ASM-007', variable: 'Token Price Stability', currentValue: '$0.003', projected: '$0.0035', impact: 'Medium' },
  { id: 'ASM-008', variable: 'New Client Acquisition Rate', currentValue: '3/month', projected: '5/month', impact: 'High' },
];

const assumptionHeaders = [
  { key: 'variable', header: 'Variable' },
  { key: 'currentValue', header: 'Current Value' },
  { key: 'projected', header: 'Projected' },
  { key: 'impact', header: 'Impact' },
];

function getConfidenceTag(confidence: string) {
  switch (confidence) {
    case 'high': return <Tag type="green" size="sm">High</Tag>;
    case 'medium': return <Tag type="blue" size="sm">Medium</Tag>;
    case 'low': return <Tag type="warm-gray" size="sm">Low</Tag>;
    default: return <Tag type="gray" size="sm">{confidence}</Tag>;
  }
}

function getImpactTag(impact: string) {
  switch (impact) {
    case 'High': return <Tag type="red" size="sm">High</Tag>;
    case 'Medium': return <Tag type="blue" size="sm">Medium</Tag>;
    case 'Low': return <Tag type="cool-gray" size="sm">Low</Tag>;
    default: return <Tag type="gray" size="sm">{impact}</Tag>;
  }
}

export default function ForecastPage() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Financial Forecast')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Revenue projections, growth assumptions, and confidence modeling.')}
        </p>
      </Column>

      {/* KPI Tiles */}
      {kpiData.map((kpi) => (
        <Column key={kpi.label} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ minHeight: '130px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <kpi.icon size={20} />
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t(kpi.label)}</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{kpi.value}</p>
          </Tile>
        </Column>
      ))}

      {/* Forecast Chart */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: '1rem' }}>
        <Tile>
          <LineChart data={forecastChartData} options={forecastChartOptions} />
        </Tile>
      </Column>

      {/* Monthly Projections */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{t('Monthly Projections')}</h3>
      </Column>
      {monthlyProjections.map((proj) => (
        <Column key={proj.month} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ minHeight: '120px' }}>
            <h4 style={{ marginBottom: '0.75rem', color: '#525252' }}>{proj.month}</h4>
            <p style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              {proj.projectedRevenue}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: '#525252' }}>{t('Confidence')}:</span>
              {getConfidenceTag(proj.confidence)}
            </div>
          </Tile>
        </Column>
      ))}

      {/* Assumptions Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1.5rem' }}>
        <DataTable rows={assumptions} headers={assumptionHeaders} isSortable>
          {({ rows, headers: tHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title={t('Forecast Assumptions')}>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tHeaders.map((header) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {t(String(header.header))}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'impact' ? (
                            getImpactTag(cell.value)
                          ) : cell.info.header === 'currentValue' || cell.info.header === 'projected' ? (
                            <span style={{ fontFamily: 'monospace' }}>{cell.value}</span>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </Column>
    </Grid>
  );
}
