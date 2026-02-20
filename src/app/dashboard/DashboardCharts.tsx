'use client';

import { useEffect, useState } from 'react';
import { Grid, Column, Tile, Loading } from '@carbon/react';
import { LineChart, SimpleBarChart } from '@carbon/charts-react';
import { useTranslation } from '@/lib/i18n/context';

import '@carbon/charts-react/styles.css';

interface ChartData {
  contentVolume: { group: string; date: string; value: number }[];
  engagement: { group: string; date: string; value: number }[];
  revenue: { group: string; date: string; value: number }[];
}

export default function DashboardCharts() {
  const { t } = useTranslation();
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/engagement')
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loading description={t('common.loading')} withOverlay={false} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
        {t('dashboard.charts.title')}
      </h2>
      <Grid fullWidth>
        <Column lg={8} md={4} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <LineChart
              data={data.contentVolume}
              options={{
                title: t('dashboard.charts.contentVolume'),
                axes: {
                  bottom: { mapsTo: 'date', scaleType: 'labels' as any },
                  left: { mapsTo: 'value', title: t('dashboard.charts.posts') },
                },
                height: '300px',
                theme: 'g100' as any,
                color: { scale: { Content: '#0f62fe' } },
              }}
            />
          </Tile>
        </Column>

        <Column lg={8} md={4} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <SimpleBarChart
              data={data.revenue || data.engagement}
              options={{
                title: t('dashboard.charts.revenue'),
                axes: {
                  bottom: { mapsTo: 'date', scaleType: 'labels' as any },
                  left: { mapsTo: 'value', title: 'R$' },
                },
                height: '300px',
                theme: 'g100' as any,
                color: { scale: { Revenue: '#198038', Engagement: '#8a3ffc' } },
              }}
            />
          </Tile>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <LineChart
              data={data.engagement}
              options={{
                title: t('dashboard.charts.engagementRate'),
                axes: {
                  bottom: { mapsTo: 'date', scaleType: 'labels' as any },
                  left: { mapsTo: 'value', title: '%' },
                },
                height: '250px',
                theme: 'g100' as any,
                curve: 'curveMonotoneX' as any,
                color: { scale: { Engagement: '#8a3ffc' } },
              }}
            />
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
