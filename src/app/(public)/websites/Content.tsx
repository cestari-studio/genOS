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
  Carbon,
  Code,
  EdgeCluster,
  MobileCheck,
  DataBase,
  Meter,
  ArrowRight,
  Application,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const features = [
  {
    icon: Carbon,
    title: 'Carbon Design System',
    description:
      'Enterprise-grade UI built on IBM\'s Carbon Design System — accessible, consistent, and themeable out of the box.',
  },
  {
    icon: Code,
    title: 'Next.js 14',
    description:
      'Server components, streaming SSR, and the App Router deliver blazing-fast, SEO-friendly experiences.',
  },
  {
    icon: EdgeCluster,
    title: 'Edge Computing',
    description:
      'Deploy to the edge for sub-50ms response times worldwide with automatic regional failover.',
  },
  {
    icon: MobileCheck,
    title: 'PWA Support',
    description:
      'Installable Progressive Web Apps with offline capability, push notifications, and native-like UX.',
  },
  {
    icon: DataBase,
    title: 'Headless CMS',
    description:
      'Content authoring decoupled from presentation — integrate any headless CMS or use our built-in editor.',
  },
  {
    icon: Meter,
    title: 'Performance Optimization',
    description:
      'Automated image optimization, code splitting, and Core Web Vitals monitoring built into every project.',
  },
];

const techStack = [
  { name: 'React 18', category: 'Frontend' },
  { name: 'Next.js 14', category: 'Framework' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Carbon Design', category: 'UI System' },
  { name: 'Vercel Edge', category: 'Infrastructure' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Cache' },
  { name: 'GraphQL', category: 'API Layer' },
];

export default function WebsitesContent() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth style={{ maxWidth: '1584px', margin: '0 auto' }}>
      {/* Hero Section */}
      <Column lg={16} md={8} sm={4} style={{ padding: '4rem 0 2rem' }}>
        <Tag type="teal" size="md" style={{ marginBottom: '1rem' }}>
          <Application size={16} style={{ marginRight: '0.25rem' }} />
          Websites &amp; Apps
        </Tag>
        <h1
          style={{
            fontSize: '3.375rem',
            fontWeight: 300,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}
        >
          Websites &amp; Apps — Enterprise Digital Experiences
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
          Build production-grade websites and web applications with modern
          frameworks, edge delivery, and enterprise design standards.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button renderIcon={ArrowRight} size="lg">
            Start Building
          </Button>
          <Button kind="tertiary" size="lg">
            View Portfolio
          </Button>
        </div>
      </Column>

      {/* Features Grid */}
      <Column lg={16} md={8} sm={4} style={{ padding: '2rem 0 1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          Core Capabilities
        </h2>
        <p
          style={{
            color: 'var(--cds-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '540px',
          }}
        >
          A modern stack engineered for speed, accessibility, and scale.
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

      {/* Tech Stack Showcase */}
      <Column lg={16} md={8} sm={4} style={{ padding: '3rem 0 1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          Tech Stack
        </h2>
        <p
          style={{
            color: 'var(--cds-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '540px',
          }}
        >
          Battle-tested technologies that power enterprise digital products.
        </p>
      </Column>

      {techStack.map((tech) => (
        <Column key={tech.name} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ padding: '1.25rem' }}>
            <Tag type="cool-gray" size="sm" style={{ marginBottom: '0.5rem' }}>
              {tech.category}
            </Tag>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>{tech.name}</p>
          </Tile>
        </Column>
      ))}

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
            Let&apos;s build your next digital experience
          </h2>
          <p
            style={{
              color: 'var(--cds-text-secondary)',
              marginBottom: '2rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
            }}
          >
            From landing pages to full-scale SaaS platforms — our team delivers
            enterprise-quality products on modern infrastructure.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button renderIcon={ArrowRight} size="lg">
              Get a Quote
            </Button>
            <Button kind="secondary" size="lg">
              See Case Studies
            </Button>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
