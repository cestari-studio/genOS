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
  ChatBot,
  Calendar,
  Analytics,
  UserMultiple,
  CurrencyDollar,
  Hearing,
  ArrowRight,
  Share,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const features = [
  {
    icon: ChatBot,
    title: 'Unified Inbox',
    description:
      'Manage all your social conversations from a single, intelligent inbox powered by AI triage and sentiment analysis.',
  },
  {
    icon: Calendar,
    title: 'Content Scheduler',
    description:
      'Plan, schedule, and auto-publish content across all platforms with optimal timing recommendations.',
  },
  {
    icon: Analytics,
    title: 'Analytics Dashboard',
    description:
      'Real-time performance metrics, audience insights, and competitive benchmarking in one unified view.',
  },
  {
    icon: UserMultiple,
    title: 'Influencer Network',
    description:
      'Discover, vet, and manage influencer partnerships with AI-driven matching and ROI tracking.',
  },
  {
    icon: CurrencyDollar,
    title: 'Ad Manager',
    description:
      'Cross-platform ad creation, budget optimization, and automated A/B testing for maximum ROAS.',
  },
  {
    icon: Hearing,
    title: 'Social Listening',
    description:
      'Monitor brand mentions, track trends, and detect crises in real time across the entire social web.',
  },
];

const stats = [
  { value: '245K+', label: 'Posts Managed' },
  { value: '50+', label: 'Brands' },
  { value: '12', label: 'Platforms' },
];

export default function SocialMediaPage() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth style={{ maxWidth: '1584px', margin: '0 auto' }}>
      {/* Hero Section */}
      <Column lg={16} md={8} sm={4} style={{ padding: '4rem 0 2rem' }}>
        <Tag type="cyan" size="md" style={{ marginBottom: '1rem' }}>
          <Share size={16} style={{ marginRight: '0.25rem' }} />
          Social Media Intelligence
        </Tag>
        <h1
          style={{
            fontSize: '3.375rem',
            fontWeight: 300,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}
        >
          Social Media Intelligence Hub
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
          Unify your social presence across every platform. AI-powered tools to
          publish, engage, analyze, and grow — all from one command center.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button renderIcon={ArrowRight} size="lg">
            Start Free Trial
          </Button>
          <Button kind="tertiary" size="lg">
            Watch Demo
          </Button>
        </div>
      </Column>

      {/* Stats Section */}
      {stats.map((stat) => (
        <Column key={stat.label} lg={5} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <p
              style={{
                fontSize: '2.625rem',
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
      <Column lg={1} md={0} sm={0} />

      {/* Features Grid */}
      <Column lg={16} md={8} sm={4} style={{ padding: '3rem 0 1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          Platform Features
        </h2>
        <p
          style={{
            color: 'var(--cds-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '540px',
          }}
        >
          Everything you need to dominate social media at scale.
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
            Ready to transform your social strategy?
          </h2>
          <p
            style={{
              color: 'var(--cds-text-secondary)',
              marginBottom: '2rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
            }}
          >
            Join 50+ brands already using the Social Media Intelligence Hub to
            drive engagement and revenue.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button renderIcon={ArrowRight} size="lg">
              Get Started
            </Button>
            <Button kind="secondary" size="lg">
              Contact Sales
            </Button>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
