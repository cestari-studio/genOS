'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Accordion,
  AccordionItem,
} from '@carbon/react';
import { ArrowRight, Checkmark } from '@carbon/icons-react';

const plans = [
  {
    name: 'Seed',
    price: '$49',
    period: '/mo',
    description: 'For individual creators and small teams getting started.',
    popular: false,
    features: ['10,000 AI tokens/mo', '1 user', 'Basic AI (Claude Haiku)', '5 content pieces/mo', 'Email support', '1 brand profile'],
  },
  {
    name: 'Grow',
    price: '$149',
    period: '/mo',
    description: 'For growing teams scaling their content operations.',
    popular: false,
    features: ['50,000 AI tokens/mo', '5 users', 'Advanced AI (Claude Sonnet)', '50 content pieces/mo', 'Priority support', '5 brand profiles', 'Social scheduler', 'Basic analytics'],
  },
  {
    name: 'Scale',
    price: '$299',
    period: '/mo',
    description: 'For agencies and enterprises requiring full AI capabilities.',
    popular: true,
    features: ['200,000 AI tokens/mo', '20 users', 'Full AI (Claude + Gemini + Granite)', 'Unlimited content', 'GEO Intelligence', '20 brand profiles', 'Social Hub', 'Advanced analytics', 'API access', 'Custom workflows'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom requirements.',
    popular: false,
    features: ['Unlimited tokens', 'Unlimited users', 'All AI models + Helian Quantum', 'Unlimited everything', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'On-premise option', 'Quantum optimization', 'Custom AI training'],
  },
];

const faqs = [
  { q: 'Can I change plans at any time?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.' },
  { q: 'What happens when I run out of tokens?', a: 'You can purchase additional token packs or upgrade your plan. Your content will still be accessible, but AI generation will pause until tokens are replenished.' },
  { q: 'Do you offer a free trial?', a: 'Yes! All plans include a 14-day free trial with full access to features. No credit card required to start.' },
  { q: 'What AI models are included?', a: 'Seed uses Claude Haiku for fast, lightweight tasks. Grow includes Claude Sonnet for advanced reasoning. Scale and Enterprise include Claude Opus, Google Gemini, and IBM Granite for maximum capability.' },
  { q: 'Is there a discount for annual billing?', a: 'Yes, annual billing saves you 20% compared to monthly pricing. Contact sales for enterprise annual agreements.' },
  { q: 'What is GEO Intelligence?', a: 'GEO (Generative Engine Optimization) is our proprietary system that optimizes content for AI-powered search engines, improving your brand visibility in AI responses.' },
];

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--cds-background)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, margin: '0 0 0.5rem' }}>Plans & Pricing</h1>
        <p style={{ color: 'var(--cds-text-secondary)', fontSize: '1.125rem', maxWidth: '500px', margin: '0 auto' }}>
          Choose the plan that fits your content operations. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ padding: '0 2rem 4rem' }}>
        <Grid>
          {plans.map((plan) => (
            <Column key={plan.name} lg={4} md={4} sm={4}>
              <Tile style={{
                marginBottom: '1rem',
                border: plan.popular ? '2px solid #0f62fe' : '1px solid var(--cds-border-subtle-01)',
                position: 'relative',
                padding: '2rem 1.5rem',
              }}>
                {plan.popular && (
                  <Tag type="blue" size="sm" style={{ position: 'absolute', top: '-0.75rem', right: '1rem' }}>
                    Most Popular
                  </Tag>
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{plan.name}</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 600 }}>{plan.price}</span>
                  <span style={{ color: 'var(--cds-text-secondary)' }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '1.5rem', minHeight: '2.5rem' }}>
                  {plan.description}
                </p>
                <Button
                  style={{ width: '100%', maxWidth: 'none', marginBottom: '1.5rem' }}
                  kind={plan.popular ? 'primary' : 'tertiary'}
                  renderIcon={ArrowRight}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </Button>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                      padding: '0.375rem 0', fontSize: '0.875rem',
                    }}>
                      <Checkmark size={16} style={{ color: 'var(--cds-support-success)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Tile>
            </Column>
          ))}
        </Grid>
      </div>

      {/* FAQ */}
      <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--cds-layer-01)' }}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <Accordion>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} title={faq.q}>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{faq.a}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </Column>
        </Grid>
      </div>

      {/* CTA */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#0f62fe', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>Ready to Get Started?</h2>
        <p style={{ color: '#d0e2ff', marginBottom: '2rem' }}>Start your 14-day free trial today. No credit card required.</p>
        <Button kind="secondary" size="lg" renderIcon={ArrowRight}>Start Free Trial</Button>
      </div>
    </div>
  );
}
