'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Grid,
  Column,
  Tile,
  Dropdown,
  Loading,
  Breadcrumb,
  BreadcrumbItem,
} from '@carbon/react';
import { RadarChart } from '@carbon/charts-react';
import { useTranslation } from '@/lib/i18n/context';

import '@carbon/charts-react/styles.css';

interface TrendsData {
  radarData: { group: string; key: string; value: number }[];
  platforms: string[];
}

export default function TrendsContent() {
  const { t } = useTranslation();
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/trends?platform=${selectedPlatform}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedPlatform]);

  return (
    <div>
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem>
          <Link href="/dashboard">{t('sidebar.dashboard')}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('trends.title')}</BreadcrumbItem>
      </Breadcrumb>

      <div className="page-header">
        <h1>{t('trends.title')}</h1>
        <p>{t('trends.subtitle')}</p>
      </div>

      <Grid fullWidth>
        <Column lg={4} md={4} sm={4}>
          <Dropdown
            id="platform-selector"
            titleText={t('trends.platform')}
            label={t('trends.allPlatforms')}
            items={[
              { id: 'all', text: t('trends.allPlatforms') },
              ...(data?.platforms || []).map((p) => ({ id: p.toLowerCase(), text: p })),
            ]}
            itemToString={(item: { id: string; text: string } | null) => item?.text || ''}
            onChange={({ selectedItem }: { selectedItem: { id: string; text: string } | null }) => {
              setSelectedPlatform(selectedItem?.id || 'all');
            }}
          />
        </Column>
      </Grid>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loading description={t('common.loading')} withOverlay={false} />
        </div>
      ) : (
        <Grid fullWidth style={{ marginTop: '1.5rem' }}>
          <Column lg={16} md={8} sm={4}>
            <Tile>
              <RadarChart
                data={data?.radarData || []}
                options={{
                  title: t('trends.radarTitle'),
                  radar: {
                    axes: {
                      angle: 'key',
                      value: 'value',
                    },
                    alignment: 'center' as any,
                  },
                  height: '500px',
                  theme: 'g100' as any,
                }}
              />
            </Tile>
          </Column>

          {/* Platform stat cards */}
          {data?.platforms.map((platform) => {
            const platformData = data.radarData.filter((d) => d.group === platform);
            const avgScore = platformData.length > 0
              ? Math.round(platformData.reduce((s, d) => s + d.value, 0) / platformData.length)
              : 0;
            return (
              <Column key={platform} lg={4} md={4} sm={4}>
                <Tile className="stat-card" style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
                    <span style={{ fontWeight: 600 }}>{platform}</span>
                  </div>
                  <div className="stat-value">{avgScore}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-helper)' }}>
                    {t('trends.avgScore')}
                  </div>
                </Tile>
              </Column>
            );
          })}
        </Grid>
      )}
    </div>
  );
}
