'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Tag,
  Toggle,
  Button,
  Search,
  Layer,
} from '@carbon/react';
import {
  Analytics,
  Earth,
  Bot,
  DocumentMultiple_01,
  CloudMonitoring,
  Security,
  ChartMultitype,
  Connect,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Addon {
  id: string;
  name: string;
  description: string;
  price: string;
  pricePeriod: string;
  category: string;
  categoryColor: 'blue' | 'green' | 'purple' | 'teal' | 'cyan' | 'magenta' | 'red' | 'warm-gray';
  icon: React.ElementType;
  enabled: boolean;
  popular?: boolean;
}

const initialAddons: Addon[] = [
  {
    id: 'social-media-hub',
    name: 'Social Media Hub',
    description:
      'Manage all social media channels from a single dashboard. Schedule posts, track engagement, and analyze performance across platforms.',
    price: '$49',
    pricePeriod: '/month',
    category: 'Marketing',
    categoryColor: 'blue',
    icon: Connect,
    enabled: false,
    popular: true,
  },
  {
    id: 'geo-intelligence',
    name: 'GEO Intelligence',
    description:
      'Advanced geospatial analytics and location-based insights. Heatmaps, territory mapping, and demographic overlays for strategic planning.',
    price: '$79',
    pricePeriod: '/month',
    category: 'Analytics',
    categoryColor: 'teal',
    icon: Earth,
    enabled: true,
  },
  {
    id: 'helian-ai',
    name: 'Helian AI',
    description:
      'AI-powered content generation, sentiment analysis, and predictive modeling. Built on multi-model architecture with Claude, Gemini, and Granite.',
    price: '$129',
    pricePeriod: '/month',
    category: 'AI / ML',
    categoryColor: 'purple',
    icon: Bot,
    enabled: false,
    popular: true,
  },
  {
    id: 'content-factory-pro',
    name: 'Content Factory Pro',
    description:
      'End-to-end content production pipeline with approval workflows, version control, asset management, and multi-channel publishing.',
    price: '$89',
    pricePeriod: '/month',
    category: 'Content',
    categoryColor: 'magenta',
    icon: DocumentMultiple_01,
    enabled: false,
  },
  {
    id: 'cloud-monitor',
    name: 'Cloud Monitor',
    description:
      'Real-time infrastructure monitoring with alerting, uptime tracking, and detailed performance dashboards for all connected services.',
    price: '$39',
    pricePeriod: '/month',
    category: 'DevOps',
    categoryColor: 'cyan',
    icon: CloudMonitoring,
    enabled: true,
  },
  {
    id: 'compliance-shield',
    name: 'Compliance Shield',
    description:
      'Automated compliance checks for GDPR, LGPD, SOC 2, and HIPAA. Audit trail generation and policy enforcement across all tenants.',
    price: '$99',
    pricePeriod: '/month',
    category: 'Security',
    categoryColor: 'red',
    icon: Security,
    enabled: false,
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description:
      'Custom report builder with drag-and-drop charts, scheduled exports, data blending from multiple sources, and executive summary generation.',
    price: '$69',
    pricePeriod: '/month',
    category: 'Analytics',
    categoryColor: 'teal',
    icon: ChartMultitype,
    enabled: false,
  },
  {
    id: 'performance-insights',
    name: 'Performance Insights',
    description:
      'Deep-dive campaign performance analytics with attribution modeling, funnel analysis, and ROI forecasting powered by machine learning.',
    price: '$59',
    pricePeriod: '/month',
    category: 'Marketing',
    categoryColor: 'blue',
    icon: Analytics,
    enabled: false,
  },
];

export default function MarketplacePage() {
  const { t } = useTranslation();
  const [addons, setAddons] = useState<Addon[]>(initialAddons);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = (id: string) => {
    setAddons((prev) =>
      prev.map((addon) =>
        addon.id === id ? { ...addon, enabled: !addon.enabled } : addon
      )
    );
  };

  const filteredAddons = addons.filter(
    (addon) =>
      addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addon.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enabledCount = addons.filter((a) => a.enabled).length;
  const totalCost = addons
    .filter((a) => a.enabled)
    .reduce((sum, a) => sum + parseInt(a.price.replace('$', ''), 10), 0);

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Addon Marketplace
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '2rem' }}>
          Extend your genOS platform with powerful addons. Enable or disable them at any time.
        </p>
      </Column>

      <Column lg={12} md={6} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Search
          id="addon-search"
          labelText="Search addons"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          size="lg"
        />
      </Column>

      <Column lg={4} md={2} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>
            Active Addons
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{enabledCount}</p>
          <p style={{ fontSize: '0.75rem', color: '#525252', marginTop: '0.25rem' }}>
            Est. ${totalCost}/month
          </p>
        </Tile>
      </Column>

      {filteredAddons.map((addon) => {
        const IconComponent = addon.icon;
        return (
          <Column key={addon.id} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Layer>
              <ClickableTile
                style={{
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: addon.enabled ? '2px solid #0f62fe' : '1px solid #e0e0e0',
                  position: 'relative',
                }}
                onClick={() => handleToggle(addon.id)}
              >
                {addon.popular && (
                  <Tag
                    type="green"
                    size="sm"
                    style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
                  >
                    Popular
                  </Tag>
                )}

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <IconComponent size={24} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{addon.name}</h3>
                  </div>

                  <Tag type={addon.categoryColor} size="sm" style={{ marginBottom: '0.75rem' }}>
                    {addon.category}
                  </Tag>

                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: '#525252',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                    }}
                  >
                    {addon.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #e0e0e0',
                    paddingTop: '0.75rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{addon.price}</span>
                    <span style={{ fontSize: '0.75rem', color: '#525252' }}>
                      {addon.pricePeriod}
                    </span>
                  </div>
                  <Toggle
                    id={`toggle-${addon.id}`}
                    size="sm"
                    labelA="Off"
                    labelB="On"
                    toggled={addon.enabled}
                    onToggle={() => handleToggle(addon.id)}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    hideLabel
                  />
                </div>
              </ClickableTile>
            </Layer>
          </Column>
        );
      })}

      <Column lg={16} md={8} sm={4} style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button kind="secondary">Back</Button>
          <Button kind="primary">
            Continue with {enabledCount} addon{enabledCount !== 1 ? 's' : ''}
          </Button>
        </div>
      </Column>
    </Grid>
  );
}
