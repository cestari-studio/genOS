'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
} from '@carbon/react';
import { ChartLineData, Growth, FlagFilled, Trophy } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface MonthlyProjection {
  id: string;
  month: string;
  projected: string;
  recurring: string;
  newBusiness: string;
  confidence: 'High' | 'Medium' | 'Low';
}

const monthlyProjections: MonthlyProjection[] = [
  { id: '1', month: 'March 2026', projected: '$52,000', recurring: '$42,000', newBusiness: '$10,000', confidence: 'High' },
  { id: '2', month: 'April 2026', projected: '$55,800', recurring: '$43,500', newBusiness: '$12,300', confidence: 'High' },
  { id: '3', month: 'May 2026', projected: '$58,200', recurring: '$44,200', newBusiness: '$14,000', confidence: 'Medium' },
  { id: '4', month: 'June 2026', projected: '$61,500', recurring: '$45,000', newBusiness: '$16,500', confidence: 'Medium' },
  { id: '5', month: 'July 2026', projected: '$64,000', recurring: '$46,000', newBusiness: '$18,000', confidence: 'Low' },
  { id: '6', month: 'August 2026', projected: '$67,200', recurring: '$47,500', newBusiness: '$19,700', confidence: 'Low' },
];

const confidenceColor: Record<string, 'green' | 'blue' | 'red'> = {
  High: 'green',
  Medium: 'blue',
  Low: 'red',
};

export default function ForecastPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ChartLineData size={24} />
          {t('Revenue Forecast')}
        </h1>
        <p style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
          {t('Projected revenue and growth analysis for upcoming months')}
        </p>
      </div>

      {/* KPI Tiles */}
      <Grid fullWidth style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <ChartLineData size={20} style={{ color: 'var(--cds-link-primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Projected Revenue')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>$156K</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>Next 6 months</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Growth size={20} style={{ color: 'var(--cds-support-success)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Growth Rate')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>+18%</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>vs. previous period</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <FlagFilled size={20} style={{ color: 'var(--cds-support-warning)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Pipeline Value')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>$89K</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>Qualified opportunities</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Trophy size={20} style={{ color: 'var(--cds-link-primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Win Rate')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>72%</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>Last 90 days</p>
          </Tile>
        </Column>
      </Grid>

      {/* Monthly Projections Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
        {t('Monthly Projections')}
      </h2>
      <Grid fullWidth>
        {monthlyProjections.map((projection) => (
          <Column key={projection.id} lg={5} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile style={{ padding: '1.5rem', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{projection.month}</h3>
                <Tag type={confidenceColor[projection.confidence]} size="sm">
                  {projection.confidence} Confidence
                </Tag>
              </div>

              <p style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem' }}>
                {projection.projected}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--cds-text-secondary)' }}>{t('Recurring')}</span>
                  <span style={{ fontWeight: 500 }}>{projection.recurring}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--cds-text-secondary)' }}>{t('New Business')}</span>
                  <span style={{ fontWeight: 500 }}>{projection.newBusiness}</span>
                </div>
              </div>

              {/* Mini bar visualization */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'var(--cds-layer-02)' }}>
                  <div
                    style={{
                      width: `${(parseFloat(projection.recurring.replace(/[$,]/g, '')) / parseFloat(projection.projected.replace(/[$,]/g, ''))) * 100}%`,
                      background: 'var(--cds-link-primary)',
                      borderRadius: '3px 0 0 3px',
                    }}
                  />
                  <div
                    style={{
                      width: `${(parseFloat(projection.newBusiness.replace(/[$,]/g, '')) / parseFloat(projection.projected.replace(/[$,]/g, ''))) * 100}%`,
                      background: 'var(--cds-support-success)',
                      borderRadius: '0 3px 3px 0',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cds-link-primary)', display: 'inline-block' }} />
                    {t('Recurring')}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cds-support-success)', display: 'inline-block' }} />
                    {t('New')}
                  </span>
                </div>
              </div>
            </Tile>
          </Column>
        ))}
      </Grid>
    </div>
  );
}
