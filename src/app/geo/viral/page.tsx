'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  ProgressBar,
  Button,
  Section,
  Heading,
} from '@carbon/react';
import { Time, Send } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const viralContent = [
  {
    id: 1,
    title: '10 AI Tools Reshaping Content Marketing in 2026',
    platform: 'LinkedIn',
    viralScore: 94,
    predictedReach: '245K',
    optimalTime: 'Tue 9:15 AM EST',
    confidence: 'high',
  },
  {
    id: 2,
    title: 'Why GEO Is Replacing Traditional SEO',
    platform: 'Twitter',
    viralScore: 88,
    predictedReach: '182K',
    optimalTime: 'Wed 12:30 PM EST',
    confidence: 'high',
  },
  {
    id: 3,
    title: 'Behind the Scenes: How We Built Our AI Content Pipeline',
    platform: 'YouTube',
    viralScore: 82,
    predictedReach: '156K',
    optimalTime: 'Thu 3:00 PM EST',
    confidence: 'medium',
  },
  {
    id: 4,
    title: 'The Death of Keyword Stuffing: A Data Analysis',
    platform: 'Reddit',
    viralScore: 77,
    predictedReach: '98K',
    optimalTime: 'Mon 8:00 AM EST',
    confidence: 'medium',
  },
  {
    id: 5,
    title: 'Infographic: Content Strategy Framework for AI-First Brands',
    platform: 'LinkedIn',
    viralScore: 73,
    predictedReach: '87K',
    optimalTime: 'Tue 11:00 AM EST',
    confidence: 'medium',
  },
  {
    id: 6,
    title: 'Quick Thread: 5 Mistakes in Enterprise Content Ops',
    platform: 'Twitter',
    viralScore: 69,
    predictedReach: '72K',
    optimalTime: 'Fri 10:45 AM EST',
    confidence: 'low',
  },
  {
    id: 7,
    title: 'Case Study: How Brand X Tripled Organic Traffic with GEO',
    platform: 'Blog',
    viralScore: 65,
    predictedReach: '54K',
    optimalTime: 'Wed 9:00 AM EST',
    confidence: 'medium',
  },
  {
    id: 8,
    title: 'Poll: What AI Model Powers Your Content Workflow?',
    platform: 'LinkedIn',
    viralScore: 61,
    predictedReach: '41K',
    optimalTime: 'Mon 2:00 PM EST',
    confidence: 'low',
  },
  {
    id: 9,
    title: 'Deep Dive: Semantic Search and E-E-A-T in 2026',
    platform: 'Blog',
    viralScore: 56,
    predictedReach: '33K',
    optimalTime: 'Thu 10:00 AM EST',
    confidence: 'low',
  },
];

const platformColors: Record<string, string> = {
  LinkedIn: 'blue',
  Twitter: 'cyan',
  YouTube: 'red',
  Reddit: 'purple',
  Blog: 'teal',
};

const confidenceColors: Record<string, string> = {
  high: 'green',
  medium: 'teal',
  low: 'cool-gray',
};

export default function ViralPage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '2rem' }}>
      <Section level={1}>
        <Heading style={{ marginBottom: '0.5rem' }}>
          {t('Viral Prediction')}
        </Heading>
        <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '2rem' }}>
          {t('AI-powered predictions for content virality. Identify high-potential pieces and optimal publishing windows.')}
        </p>
      </Section>

      <Grid narrow>
        {viralContent.map((content) => (
          <Column key={content.id} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, lineHeight: '1.4' }}>
                    {content.title}
                  </h4>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <Tag type={platformColors[content.platform] as any} size="sm">
                    {content.platform}
                  </Tag>
                  <Tag type={confidenceColors[content.confidence] as any} size="sm">
                    {content.confidence.charAt(0).toUpperCase() + content.confidence.slice(1)} {t('confidence')}
                  </Tag>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                      {t('Viral Score')}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      {content.viralScore}/100
                    </span>
                  </div>
                  <ProgressBar
                    label=""
                    hideLabel
                    value={content.viralScore}
                    max={100}
                    size="small"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)' }}>
                    {t('Predicted Reach')}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    {content.predictedReach}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Time size={16} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)' }}>
                    {t('Optimal')}: <strong>{content.optimalTime}</strong>
                  </span>
                </div>
              </div>

              <Button
                kind="tertiary"
                size="sm"
                renderIcon={Send}
                style={{ width: '100%' }}
              >
                {t('Schedule Optimal Time')}
              </Button>
            </Tile>
          </Column>
        ))}
      </Grid>
    </div>
  );
}
