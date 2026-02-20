'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  ProgressBar,
  Section,
  Heading,
} from '@carbon/react';
import { useTranslation } from '@/lib/i18n/context';

const topicClusters = [
  {
    id: 1,
    name: 'Generative AI in Marketing',
    relevance: 92,
    articleCount: 34,
    category: 'AI & ML',
    relatedTo: ['Content Automation', 'Brand Voice AI'],
  },
  {
    id: 2,
    name: 'Content Automation',
    relevance: 87,
    articleCount: 28,
    category: 'Automation',
    relatedTo: ['Generative AI in Marketing', 'SEO Strategy'],
  },
  {
    id: 3,
    name: 'SEO Strategy',
    relevance: 81,
    articleCount: 22,
    category: 'SEO',
    relatedTo: ['Content Automation', 'Keyword Research'],
  },
  {
    id: 4,
    name: 'Brand Voice AI',
    relevance: 78,
    articleCount: 19,
    category: 'AI & ML',
    relatedTo: ['Generative AI in Marketing', 'Audience Targeting'],
  },
  {
    id: 5,
    name: 'Audience Targeting',
    relevance: 74,
    articleCount: 16,
    category: 'Marketing',
    relatedTo: ['Brand Voice AI', 'Sentiment Analysis'],
  },
  {
    id: 6,
    name: 'Sentiment Analysis',
    relevance: 71,
    articleCount: 14,
    category: 'Analytics',
    relatedTo: ['Audience Targeting', 'Social Listening'],
  },
  {
    id: 7,
    name: 'Keyword Research',
    relevance: 69,
    articleCount: 21,
    category: 'SEO',
    relatedTo: ['SEO Strategy', 'Content Automation'],
  },
  {
    id: 8,
    name: 'Social Listening',
    relevance: 65,
    articleCount: 11,
    category: 'Analytics',
    relatedTo: ['Sentiment Analysis', 'Audience Targeting'],
  },
  {
    id: 9,
    name: 'Video Content Strategy',
    relevance: 62,
    articleCount: 9,
    category: 'Content',
    relatedTo: ['Content Automation', 'Audience Targeting'],
  },
  {
    id: 10,
    name: 'E-E-A-T Optimization',
    relevance: 58,
    articleCount: 13,
    category: 'SEO',
    relatedTo: ['SEO Strategy', 'Brand Voice AI'],
  },
  {
    id: 11,
    name: 'Programmatic Advertising',
    relevance: 54,
    articleCount: 8,
    category: 'Marketing',
    relatedTo: ['Audience Targeting', 'Keyword Research'],
  },
  {
    id: 12,
    name: 'Data Privacy & Compliance',
    relevance: 49,
    articleCount: 7,
    category: 'Compliance',
    relatedTo: ['Audience Targeting', 'Social Listening'],
  },
];

const categoryColors: Record<string, string> = {
  'AI & ML': 'blue',
  Automation: 'purple',
  SEO: 'green',
  Marketing: 'teal',
  Analytics: 'cyan',
  Content: 'magenta',
  Compliance: 'red',
};

export default function SemanticMapPage() {
  const { t } = useTranslation();

  return (
    <div>
      <Section level={1}>
        <Heading style={{ marginBottom: '0.5rem' }}>
          {t('Semantic Topic Map')}
        </Heading>
        <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '2rem' }}>
          {t(
            'Visualize topic clusters, their relevance, and interconnections across your content ecosystem.'
          )}
        </p>
      </Section>

      {/* Stats Row */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Total Topics')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>124</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Clusters')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>18</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Avg Relevance')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>76%</p>
          </Tile>
        </Column>
      </Grid>

      {/* Topic Cluster Grid */}
      <Grid narrow>
        {topicClusters.map((cluster) => (
          <Column key={cluster.id} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{cluster.name}</h4>
                <Tag
                  type={categoryColors[cluster.category] as any}
                  size="sm"
                >
                  {cluster.category}
                </Tag>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                    {t('Relevance Score')}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {cluster.relevance}%
                  </span>
                </div>
                <ProgressBar
                  label=""
                  hideLabel
                  value={cluster.relevance}
                  max={100}
                  size="small"
                />
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.75rem' }}>
                {t('Articles')}: <strong>{cluster.articleCount}</strong>
              </p>

              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
                  {t('Connected to')}:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {cluster.relatedTo.map((related) => (
                    <Tag key={related} type="cool-gray" size="sm">
                      {related}
                    </Tag>
                  ))}
                </div>
              </div>
            </Tile>
          </Column>
        ))}
      </Grid>

      {/* Connection Descriptions */}
      <Section level={2} style={{ marginTop: '2rem' }}>
        <Heading style={{ marginBottom: '1rem' }}>{t('Key Topic Connections')}</Heading>
        <Tile>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
              <strong>Generative AI in Marketing</strong> &harr; <strong>Content Automation</strong> — {t('Strong bidirectional link. 14 shared articles covering AI-driven content pipelines.')}
            </li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
              <strong>SEO Strategy</strong> &harr; <strong>Keyword Research</strong> — {t('Core dependency. Keyword research feeds directly into SEO strategy execution.')}
            </li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
              <strong>Audience Targeting</strong> &harr; <strong>Sentiment Analysis</strong> — {t('Emerging connection. Sentiment data increasingly used for micro-targeting segments.')}
            </li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle)' }}>
              <strong>Brand Voice AI</strong> &harr; <strong>E-E-A-T Optimization</strong> — {t('Quality intersection. Brand voice consistency contributes to expertise and trust signals.')}
            </li>
            <li style={{ padding: '0.5rem 0' }}>
              <strong>Social Listening</strong> &harr; <strong>Sentiment Analysis</strong> — {t('Data pipeline. Social listening provides raw signal for sentiment classification models.')}
            </li>
          </ul>
        </Tile>
      </Section>
    </div>
  );
}
