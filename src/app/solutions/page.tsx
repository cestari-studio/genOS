'use client';

import React from 'react';
import {
  Grid,
  Column,
  ClickableTile,
  Tag,
} from '@carbon/react';
import {
  Chip,
  MediaLibrary,
  IbmCloudHyperProtectCryptoServices,
  Share,
  Analytics,
  Application,
  Store,
  Bot,
  ArrowRight,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const solutions = [
  {
    icon: Chip,
    title: 'genOS',
    description:
      'The AI-native operating system for agencies. Orchestrate teams, clients, and workflows from a unified platform.',
    href: '/',
    tag: 'Platform',
    tagType: 'blue' as const,
  },
  {
    icon: MediaLibrary,
    title: 'Content Factory',
    description:
      'End-to-end content production pipeline — from brief to publish — powered by generative AI and human creativity.',
    href: '/content',
    tag: 'Content',
    tagType: 'purple' as const,
  },
  {
    icon: IbmCloudHyperProtectCryptoServices,
    title: 'Helian',
    description:
      'Enterprise AI infrastructure for fine-tuning, deploying, and monitoring custom language models at scale.',
    href: '/helian',
    tag: 'AI / ML',
    tagType: 'cyan' as const,
  },
  {
    icon: Share,
    title: 'Social Media',
    description:
      'Unified social management with AI-powered scheduling, listening, analytics, and influencer tools.',
    href: '/social-media',
    tag: 'Social',
    tagType: 'teal' as const,
  },
  {
    icon: Analytics,
    title: 'Predictive Marketing',
    description:
      'AI-driven campaign optimization, customer segmentation, and ROI forecasting for data-led growth.',
    href: '/marketing',
    tag: 'Marketing',
    tagType: 'magenta' as const,
  },
  {
    icon: Application,
    title: 'Websites & Apps',
    description:
      'Enterprise digital experiences built on Next.js, Carbon Design, and edge infrastructure.',
    href: '/websites',
    tag: 'Development',
    tagType: 'cool-gray' as const,
  },
  {
    icon: Store,
    title: 'Ecommerce',
    description:
      'Full-stack commerce intelligence — from product catalog AI and dynamic pricing to supply chain visibility.',
    href: '/ecommerce',
    tag: 'Commerce',
    tagType: 'green' as const,
  },
  {
    icon: Bot,
    title: 'AI Agents',
    description:
      'Custom AI agents for HR, sales, support, and operations — automate complex business processes end-to-end.',
    href: '/ai-agents',
    tag: 'Automation',
    tagType: 'red' as const,
  },
];

export default function SolutionsPage() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth style={{ maxWidth: '1584px', margin: '0 auto' }}>
      {/* Header */}
      <Column lg={16} md={8} sm={4} style={{ padding: '4rem 0 1rem' }}>
        <h1
          style={{
            fontSize: '3.375rem',
            fontWeight: 300,
            lineHeight: 1.15,
            marginBottom: '1rem',
          }}
        >
          Solutions
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            lineHeight: 1.5,
            maxWidth: '640px',
            color: 'var(--cds-text-secondary)',
            marginBottom: '3rem',
          }}
        >
          A modular suite of AI-powered products designed for modern agencies
          and enterprise teams. Mix and match to fit your workflow.
        </p>
      </Column>

      {/* Solutions Grid */}
      {solutions.map((solution) => {
        const Icon = solution.icon;
        return (
          <Column key={solution.title} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <ClickableTile
              href={solution.href}
              style={{
                height: '100%',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <Icon size={32} style={{ color: 'var(--cds-interactive)' }} />
                <Tag type={solution.tagType} size="sm">
                  {solution.tag}
                </Tag>
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {solution.title}
              </h2>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--cds-text-secondary)',
                  flex: 1,
                }}
              >
                {solution.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--cds-link-primary)',
                }}
              >
                Learn more <ArrowRight size={16} />
              </div>
            </ClickableTile>
          </Column>
        );
      })}
    </Grid>
  );
}
