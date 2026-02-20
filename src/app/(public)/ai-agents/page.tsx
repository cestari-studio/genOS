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
  UserMultiple,
  SalesOps,
  CustomerService,
  DocumentTasks,
  FlowModeler,
  DecisionTree,
  ArrowRight,
  Bot,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const features = [
  {
    icon: UserMultiple,
    title: 'HR Automation',
    description:
      'Streamline recruitment screening, onboarding workflows, employee Q&A, and policy compliance with dedicated HR agents.',
  },
  {
    icon: SalesOps,
    title: 'Sales Intelligence',
    description:
      'AI agents that qualify leads, draft proposals, update CRM records, and surface deal insights automatically.',
  },
  {
    icon: CustomerService,
    title: 'Customer Support AI',
    description:
      'Resolve tickets, escalate intelligently, and maintain brand voice across chat, email, and voice channels.',
  },
  {
    icon: DocumentTasks,
    title: 'Document Processing',
    description:
      'Extract, classify, and route information from contracts, invoices, and forms with high accuracy.',
  },
  {
    icon: FlowModeler,
    title: 'Workflow Automation',
    description:
      'Design multi-step agent workflows that coordinate across systems, APIs, and human-in-the-loop checkpoints.',
  },
  {
    icon: DecisionTree,
    title: 'Decision Support',
    description:
      'Agents that analyze data, generate recommendations, and present options with confidence scores for faster decisions.',
  },
];

const useCases = [
  {
    title: 'Talent Acquisition',
    description:
      'Screen 1,000+ resumes per hour, rank candidates, and schedule interviews without human intervention.',
    tag: 'HR',
    tagType: 'blue' as const,
  },
  {
    title: 'Pipeline Forecasting',
    description:
      'Predict quarterly revenue with deal-level granularity and automatically flag at-risk opportunities.',
    tag: 'Sales',
    tagType: 'green' as const,
  },
  {
    title: 'Invoice Reconciliation',
    description:
      'Match POs to invoices, flag discrepancies, and auto-approve within policy thresholds.',
    tag: 'Operations',
    tagType: 'purple' as const,
  },
  {
    title: 'IT Help Desk',
    description:
      'Resolve password resets, access requests, and common troubleshooting without opening a ticket.',
    tag: 'Support',
    tagType: 'cyan' as const,
  },
];

export default function AiAgentsPage() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth style={{ maxWidth: '1584px', margin: '0 auto' }}>
      {/* Hero Section */}
      <Column lg={16} md={8} sm={4} style={{ padding: '4rem 0 2rem' }}>
        <Tag type="magenta" size="md" style={{ marginBottom: '1rem' }}>
          <Bot size={16} style={{ marginRight: '0.25rem' }} />
          AI Agents
        </Tag>
        <h1
          style={{
            fontSize: '3.375rem',
            fontWeight: 300,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}
        >
          Custom AI Agents — HR, Sales &amp; Operations
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
          Deploy purpose-built AI agents that handle complex business processes
          end-to-end — from talent acquisition to supply chain decisions.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button renderIcon={ArrowRight} size="lg">
            Build Your Agent
          </Button>
          <Button kind="tertiary" size="lg">
            Explore Use Cases
          </Button>
        </div>
      </Column>

      {/* Features Grid */}
      <Column lg={16} md={8} sm={4} style={{ padding: '2rem 0 1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          Agent Capabilities
        </h2>
        <p
          style={{
            color: 'var(--cds-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '540px',
          }}
        >
          Modular AI agents tailored to your department and domain.
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

      {/* Use Case Cards */}
      <Column lg={16} md={8} sm={4} style={{ padding: '3rem 0 1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 400, marginBottom: '0.5rem' }}>
          Use Cases
        </h2>
        <p
          style={{
            color: 'var(--cds-text-secondary)',
            marginBottom: '2rem',
            maxWidth: '540px',
          }}
        >
          Real-world scenarios where AI agents deliver measurable impact.
        </p>
      </Column>

      {useCases.map((useCase) => (
        <Column key={useCase.title} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <ClickableTile
            href="#"
            style={{ height: '100%', padding: '1.5rem' }}
          >
            <Tag type={useCase.tagType} size="sm" style={{ marginBottom: '0.75rem' }}>
              {useCase.tag}
            </Tag>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {useCase.title}
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
              {useCase.description}
            </p>
          </ClickableTile>
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
            Ready to put AI agents to work?
          </h2>
          <p
            style={{
              color: 'var(--cds-text-secondary)',
              marginBottom: '2rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
            }}
          >
            Tell us your workflow challenge and we will design a custom agent
            that integrates with your existing systems.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button renderIcon={ArrowRight} size="lg">
              Schedule a Workshop
            </Button>
            <Button kind="secondary" size="lg">
              View Documentation
            </Button>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
