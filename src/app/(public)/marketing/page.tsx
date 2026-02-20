'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Button,
  Tag,
} from '@carbon/react';
import {
  ChartLineSmooth,
  UserMultiple,
  SettingsAdjust,
  Finance,
  Compare,
  FlowConnection,
  ArrowRight,
  Analytics,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const features = [
  {
    icon: ChartLineSmooth,
    title: 'Predictive Analytics',
    description:
      'Forecast campaign performance, customer lifetime value, and market trends before committing budget.',
  },
  {
    icon: UserMultiple,
    title: 'Customer Segmentation',
    description:
      'AI-driven micro-segmentation that discovers high-value audiences and hidden behavioral patterns.',
  },
  {
    icon: SettingsAdjust,
    title: 'Campaign Optimization',
    description:
      'Continuous real-time optimization of creative, targeting, and bidding across every channel.',
  },
  {
    icon: Finance,
    title: 'ROI Forecasting',
    description:
      'Predict return on investment for proposed campaigns with confidence intervals and scenario modeling.',
  },
  {
    icon: Compare,
    title: 'A/B Testing AI',
    description:
      'Autonomous multivariate testing that identifies winning variants faster with adaptive allocation.',
  },
  {
    icon: FlowConnection,
    title: 'Attribution Modeling',
    description:
      'Multi-touch attribution powered by machine learning — understand every touchpoint\'s true contribution.',
  },
];

const stats = [
  { value: '3.2x', label: 'Average ROAS Improvement' },
  { value: '68%', label: 'Faster Campaign Launch' },
  { value: '$12M+', label: 'Media Spend Optimized' },
  { value: '150+', label: 'Active Campaigns' },
];

export default function MarketingPage() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth style={{ maxWidth: '1584px', margin: '0 auto' }}>
      {/* Hero Section */}
      <Column lg={16} md={8} sm={4} style={{ padding: '4rem 0 2rem' }}>
        <Tag type="purple" size="md" style={{ marginBottom: '1rem' }}>
          <Analytics size={16} style={{ marginRight: '0.25rem' }} />
          Predictive Marketing
        </Tag>
        <h1
          style={{
            fontSize: '3.375rem',
            fontWeight: 300,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}
        >
          Marketing Preditivo — AI-Driven Marketing Intelligence
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            lineHeight: 1.5,
            maxWidth: '640px',
            color: 'var(--cds-text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Stop guessing and start predicting. Harness machine learning to
          forecast performance, optimize spend, and unlock growth at every stage
          of the funnel.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button renderIcon={ArrowRight} size="lg">
            Request a Demo
          </Button>
          <Button kind="tertiary" size="lg">
            Explore Platform
          </Button>
        </div>
      </Column>

      {/* Stats Tiles */}
      {stats.map((stat) => (
        <Column key={stat.label} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <p
              style={{
                fontSize: '2.25rem',
                fontWeight: 600,
                color: 'var(--cds-interactive)',
              }}
            >
              {stat.value}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {stat.label}
            </p>
          </Tile>
        </Column>
      ))}

      {/* Features Grid */}
      <Column lg={16} md={8} sm={4} style={{ padding: '3rem 0 1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          Intelligence Capabilities
        </h2>
        <p
          style={{
            color: 'var(--cds-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '540px',
          }}
        >
          AI-powered tools that turn marketing data into actionable insight.
        </p>
      </Column>

      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Column key={feature.title} lg={5} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile style={{ height: '100%', padding: '1.5rem' }}>
              <Icon size={32} style={{ marginBottom: '1rem', color: 'var(--cds-interactive)' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
                {feature.description}
              </p>
            </Tile>
          </Column>
        );
      })}

      {/* CTA Section */}
      <Column lg={16} md={8} sm={4} style={{ padding: '4rem 0' }}>
        <Tile
          style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'var(--cds-layer-02)',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>
            Predict. Optimize. Grow.
          </h2>
          <p
            style={{
              color: 'var(--cds-text-secondary)',
              marginBottom: '2rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
            }}
          >
            See how predictive marketing intelligence can transform your
            campaigns and deliver measurable ROI.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button renderIcon={ArrowRight} size="lg">
              Start Free Trial
            </Button>
            <Button kind="secondary" size="lg">
              Talk to an Expert
            </Button>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
