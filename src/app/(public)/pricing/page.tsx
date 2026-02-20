'use client';

import { useRef } from 'react';
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
import { motion, useInView } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedDiv({ children, style }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function PricingPage() {
  const { t } = useTranslation();

  const plans = [
    {
      nameKey: 'pricingPage.seed',
      priceKey: 'pricingPage.seedPrice',
      descKey: 'pricingPage.seedDesc',
      recommended: false,
      features: [
        '1 Tenant',
        'GEO B\u00e1sico',
        '10,000 AI tokens/mo',
        '1 user',
        'Basic AI (Claude Haiku)',
        '5 content pieces/mo',
        'Email support',
      ],
    },
    {
      nameKey: 'pricingPage.grow',
      priceKey: 'pricingPage.growPrice',
      descKey: 'pricingPage.growDesc',
      recommended: true,
      features: [
        '10 Tenants',
        'Content Factory',
        '50,000 AI tokens/mo',
        '5 users',
        'Advanced AI (Claude Sonnet)',
        '50 content pieces/mo',
        'Priority support',
        '5 brand profiles',
        'Social scheduler',
      ],
    },
    {
      nameKey: 'pricingPage.scale',
      priceKey: 'pricingPage.scalePrice',
      descKey: 'pricingPage.scaleDesc',
      recommended: false,
      features: [
        '50 Tenants',
        'AgentOps',
        '200,000 AI tokens/mo',
        '20 users',
        'Full AI (Claude + Gemini + Granite)',
        'Unlimited content',
        'GEO Intelligence',
        '20 brand profiles',
        'Advanced analytics',
        'API access',
      ],
    },
    {
      nameKey: 'pricingPage.enterprise',
      priceKey: 'pricingPage.enterprisePrice',
      descKey: 'pricingPage.enterpriseDesc',
      recommended: false,
      features: [
        'RLS Auth',
        'Qiskit Integration',
        'Unlimited tokens',
        'Unlimited users',
        'All AI models + Helian Quantum',
        'Unlimited everything',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'On-premise option',
      ],
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

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          padding: 'clamp(3rem, 6vw, 5rem) 2rem 3rem',
          textAlign: 'center',
          background: '#161616',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 600,
              color: '#f4f4f4',
              margin: '0 0 1rem',
              letterSpacing: '-0.01em',
            }}
          >
            {t('pricingPage.headline')}
          </h1>
          <p
            style={{
              color: '#c6c6c6',
              fontSize: '1.125rem',
              maxWidth: 560,
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            {t('pricingPage.sub')}
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: '3rem 2rem 4rem', background: '#f4f4f4' }}>
        <AnimatedDiv>
          <Grid fullWidth style={{ maxWidth: 1584, margin: '0 auto' }}>
            {plans.map((plan, idx) => (
              <Column key={plan.nameKey} lg={4} md={4} sm={4}>
                <motion.div variants={fadeUp} custom={idx}>
                  <Tile
                    style={{
                      marginBottom: '1rem',
                      border: plan.recommended
                        ? '2px solid #0f62fe'
                        : '1px solid var(--cds-border-subtle-01, #e0e0e0)',
                      position: 'relative',
                      padding: '2rem 1.5rem',
                      background: '#fff',
                      minHeight: 520,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {plan.recommended && (
                      <Tag
                        type="blue"
                        size="sm"
                        style={{
                          position: 'absolute',
                          top: '-0.75rem',
                          right: '1rem',
                        }}
                      >
                        {t('pricingPage.recommended')}
                      </Tag>
                    )}
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: '#161616',
                      }}
                    >
                      {t(plan.nameKey)}
                    </h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 600, color: '#161616' }}>
                        {t(plan.priceKey)}
                      </span>
                      {plan.priceKey !== 'pricingPage.enterprisePrice' && (
                        <span style={{ color: '#525252' }}>{t('pricingPage.perMonth')}</span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#525252',
                        marginBottom: '1.5rem',
                        minHeight: '2.5rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {t(plan.descKey)}
                    </p>
                    <Button
                      style={{
                        width: '100%',
                        maxWidth: 'none',
                        marginBottom: '1.5rem',
                      }}
                      kind={plan.recommended ? 'primary' : 'tertiary'}
                      renderIcon={ArrowRight}
                    >
                      {plan.nameKey === 'pricingPage.enterprise'
                        ? t('pricingPage.contactSales')
                        : t('pricingPage.startTrial')}
                    </Button>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            padding: '0.375rem 0',
                            fontSize: '0.875rem',
                          }}
                        >
                          <Checkmark
                            size={16}
                            style={{
                              color: '#198038',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          />
                          <span style={{ color: '#161616' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Tile>
                </motion.div>
              </Column>
            ))}
          </Grid>
        </AnimatedDiv>
      </section>

      {/* FAQ */}
      <section
        style={{ padding: '4rem 2rem', background: 'var(--cds-layer-01, #f4f4f4)' }}
      >
        <Grid fullWidth style={{ maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={16} md={8} sm={4}>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 300,
                marginBottom: '2rem',
                color: '#161616',
              }}
            >
              {t('pricingPage.faqTitle')}
            </h2>
            <Accordion>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} title={faq.q}>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{faq.a}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </Column>
        </Grid>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: 'clamp(3rem, 6vw, 5rem) 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0f62fe 0%, #a56eff 100%)',
          color: '#fff',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>
          {t('pricingPage.ctaTitle')}
        </h2>
        <p style={{ color: '#d0e2ff', marginBottom: '2rem' }}>
          {t('pricingPage.ctaDesc')}
        </p>
        <Button kind="secondary" size="lg" renderIcon={ArrowRight}>
          {t('pricingPage.startTrial')}
        </Button>
      </section>
    </div>
  );
}
