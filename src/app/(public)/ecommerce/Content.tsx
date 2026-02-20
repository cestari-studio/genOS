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
  ShoppingCart,
  InventoryManagement,
  Currency,
  DeliveryTruck,
  UserActivity,
  Purchase,
  ArrowRight,
  Store,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const features = [
  {
    icon: ShoppingCart,
    title: 'Product Catalog AI',
    description:
      'Intelligent product enrichment, auto-tagging, and recommendation engines that boost discoverability and conversion.',
  },
  {
    icon: InventoryManagement,
    title: 'Inventory Optimization',
    description:
      'Demand forecasting and automated reorder points ensure optimal stock levels across every warehouse and channel.',
  },
  {
    icon: Currency,
    title: 'Dynamic Pricing',
    description:
      'Real-time competitive pricing powered by market signals, elasticity models, and margin guardrails.',
  },
  {
    icon: DeliveryTruck,
    title: 'Supply Chain Visibility',
    description:
      'End-to-end tracking from supplier to doorstep with predictive ETA, bottleneck detection, and risk alerts.',
  },
  {
    icon: UserActivity,
    title: 'Customer Journey',
    description:
      'Map and optimize every touchpoint — from first visit to post-purchase loyalty — with behavioral analytics.',
  },
  {
    icon: Purchase,
    title: 'Payment Processing',
    description:
      'PCI-compliant payment orchestration supporting 40+ methods, smart routing, and automatic retry logic.',
  },
];

const stats = [
  { value: '$2M+', label: 'GMV Processed' },
  { value: '500K+', label: 'Products Managed' },
  { value: '99.9%', label: 'Uptime' },
];

export default function EcommerceContent() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth style={{ maxWidth: '1584px', margin: '0 auto' }}>
      {/* Hero Section */}
      <Column lg={16} md={8} sm={4} style={{ padding: '4rem 0 2rem' }}>
        <Tag type="green" size="md" style={{ marginBottom: '1rem' }}>
          <Store size={16} style={{ marginRight: '0.25rem' }} />
          Ecommerce &amp; Supply Chain
        </Tag>
        <h1
          style={{
            fontSize: '3.375rem',
            fontWeight: 300,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}
        >
          Ecommerce &amp; Supply Chain Intelligence
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
          From storefront to fulfillment, power every layer of your commerce
          operation with AI that drives revenue and efficiency.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button renderIcon={ArrowRight} size="lg">
            Launch Your Store
          </Button>
          <Button kind="tertiary" size="lg">
            See a Demo
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
          Commerce Capabilities
        </h2>
        <p
          style={{
            color: 'var(--cds-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '540px',
          }}
        >
          Full-stack commerce intelligence from catalog to last-mile delivery.
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
            Scale your commerce operation with confidence
          </h2>
          <p
            style={{
              color: 'var(--cds-text-secondary)',
              marginBottom: '2rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
            }}
          >
            Whether you sell 100 or 500,000 SKUs, our platform adapts to your
            complexity and grows with your business.
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
