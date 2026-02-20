'use client';

import React, { useRef } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
} from '@carbon/react';
import {
  Search,
  DataConnected,
  ChartNetwork,
  ChartLineSmooth,
  UserMultiple,
  ArrowRight,
  Analytics,
} from '@carbon/icons-react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function AnimatedSection({ children, style, id }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      style={style}
      id={id}
    >
      {children}
    </motion.section>
  );
}

const stats = [
  { value: '3.2x', label: 'Average ROAS Improvement' },
  { value: '68%', label: 'Faster Campaign Launch' },
  { value: '$12M+', label: 'Media Spend Optimized' },
  { value: '150+', label: 'Active Campaigns' },
];

export default function MarketingContent() {
  const { t } = useTranslation();

  const geoFeatures = [
    {
      icon: Search,
      titleKey: 'geoPage.feature1Title',
      descKey: 'geoPage.feature1Desc',
    },
    {
      icon: DataConnected,
      titleKey: 'geoPage.feature2Title',
      descKey: 'geoPage.feature2Desc',
    },
    {
      icon: ChartNetwork,
      titleKey: 'geoPage.feature3Title',
      descKey: 'geoPage.feature3Desc',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: '#161616',
          padding: 'clamp(4rem, 8vw, 6rem) 0 3rem',
        }}
      >
        <Grid fullWidth style={{ maxWidth: 1584, margin: '0 auto', padding: '0 2rem' }}>
          <Column lg={12} md={8} sm={4}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Tag type="purple" size="md" style={{ marginBottom: '1.5rem' }}>
                <Analytics size={16} style={{ marginRight: '0.25rem' }} />
                {t('geoPage.eyebrow')}
              </Tag>
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: '#f4f4f4',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {t('geoPage.headline')}
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                  lineHeight: 1.4,
                  maxWidth: 640,
                  color: '#c6c6c6',
                  marginBottom: '2.5rem',
                  fontStyle: 'italic',
                }}
              >
                {t('geoPage.sub')}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button renderIcon={ArrowRight} size="lg">
                  {t('geoPage.ctaPrimary')}
                </Button>
                <Button kind="ghost" size="lg" style={{ color: '#f4f4f4' }}>
                  {t('geoPage.ctaSecondary')}
                </Button>
              </div>
            </motion.div>
          </Column>
        </Grid>
      </section>

      {/* GEO Features */}
      <AnimatedSection
        style={{
          background: '#f4f4f4',
          padding: 'clamp(4rem, 8vw, 6rem) 0',
        }}
      >
        <Grid fullWidth style={{ maxWidth: 1584, margin: '0 auto', padding: '0 2rem' }}>
          {geoFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Column key={feature.titleKey} lg={5} md={4} sm={4}>
                <motion.div variants={fadeUp} custom={i}>
                  <Tile
                    style={{
                      height: '100%',
                      padding: '2rem',
                      minHeight: 280,
                      borderTop: '3px solid #a56eff',
                      marginBottom: '1rem',
                      background: '#fff',
                    }}
                  >
                    <Icon
                      size={32}
                      style={{
                        marginBottom: '1.25rem',
                        color: '#a56eff',
                      }}
                    />
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        marginBottom: '0.75rem',
                        color: '#161616',
                      }}
                    >
                      {t(feature.titleKey)}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        lineHeight: 1.6,
                        color: '#525252',
                      }}
                    >
                      {t(feature.descKey)}
                    </p>
                  </Tile>
                </motion.div>
              </Column>
            );
          })}
        </Grid>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection
        style={{
          background: '#262626',
          padding: 'clamp(3rem, 6vw, 5rem) 0',
        }}
      >
        <Grid fullWidth style={{ maxWidth: 1584, margin: '0 auto', padding: '0 2rem' }}>
          <Column lg={16} md={8} sm={4}>
            <motion.h2
              variants={fadeUp}
              custom={0}
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 300,
                color: '#f4f4f4',
                marginBottom: '0.5rem',
              }}
            >
              {t('geoPage.statsTitle')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              style={{
                color: '#8d8d8d',
                marginBottom: '2.5rem',
                fontSize: '1rem',
              }}
            >
              {t('geoPage.statsDesc')}
            </motion.p>
          </Column>

          {stats.map((stat, i) => (
            <Column key={stat.label} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
              <motion.div variants={fadeUp} custom={i + 2}>
                <Tile
                  style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    background: '#393939',
                  }}
                >
                  <p
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      color: '#a56eff',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#c6c6c6' }}>
                    {stat.label}
                  </p>
                </Tile>
              </motion.div>
            </Column>
          ))}
        </Grid>
      </AnimatedSection>

      {/* CTA Section */}
      <section
        style={{
          padding: 'clamp(4rem, 8vw, 6rem) 0',
          background: 'linear-gradient(135deg, #a56eff 0%, #0f62fe 100%)',
        }}
      >
        <Grid fullWidth style={{ maxWidth: 1584, margin: '0 auto', padding: '0 2rem' }}>
          <Column lg={10} md={6} sm={4}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              {t('geoPage.ctaTitle')}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,.8)',
                marginBottom: '2rem',
                maxWidth: 480,
                lineHeight: 1.5,
                fontSize: '1.125rem',
              }}
            >
              {t('geoPage.ctaDesc')}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <Button
                renderIcon={ArrowRight}
                size="lg"
                style={{ background: '#fff', color: '#0f62fe' }}
              >
                {t('geoPage.ctaPrimary')}
              </Button>
              <Button
                kind="ghost"
                size="lg"
                style={{ color: '#fff' }}
              >
                {t('geoPage.ctaSecondary')}
              </Button>
            </div>
          </Column>
        </Grid>
      </section>
    </div>
  );
}
