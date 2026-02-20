'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ClickableTile,
} from '@carbon/react';
import {
  Edit,
  View,
  Checkmark,
  WarningAlt,
  Version,
  Analytics,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';

type ContentStatus = 'draft' | 'review' | 'approved' | 'published';

interface ContentData {
  id: string;
  title: string;
  type: string;
  status: ContentStatus;
  platforms: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  body: string;
  aiScores: { label: string; score: number; maxScore: number; status: 'good' | 'warning' | 'error' }[];
  versions: { id: string; version: string; date: string; author: string; changes: string }[];
}

const mockContent: ContentData = {
  id: '1',
  title: 'Summer Campaign - Instagram Post',
  type: 'post',
  status: 'published',
  platforms: ['Instagram', 'Facebook', 'LinkedIn'],
  createdAt: '2026-02-10',
  updatedAt: '2026-02-18',
  author: 'Maria Santos',
  body: `Introducing our Summer 2026 Collection — where innovation meets style.

This season, we're pushing boundaries with sustainable materials, AI-driven design, and a color palette inspired by the Mediterranean coast.

Key highlights:
• 100% recycled packaging across all product lines
• Smart-fit technology powered by our proprietary AI sizing engine
• Limited edition collaboration with emerging artists

Whether you're looking to refresh your wardrobe or elevate your everyday essentials, our Summer Collection has something for everyone.

Shop now and be part of the movement. Link in bio.

#Summer2026 #SustainableFashion #Innovation #NewCollection`,
  aiScores: [
    { label: 'Brand Voice Alignment', score: 92, maxScore: 100, status: 'good' },
    { label: 'Readability Score', score: 88, maxScore: 100, status: 'good' },
    { label: 'SEO Optimization', score: 74, maxScore: 100, status: 'warning' },
    { label: 'Engagement Prediction', score: 85, maxScore: 100, status: 'good' },
    { label: 'Accessibility', score: 68, maxScore: 100, status: 'warning' },
    { label: 'Sentiment', score: 95, maxScore: 100, status: 'good' },
  ],
  versions: [
    { id: 'v5', version: 'v5 (current)', date: '2026-02-18', author: 'Maria Santos', changes: 'Final copy edits and hashtag optimization' },
    { id: 'v4', version: 'v4', date: '2026-02-17', author: 'Maria Santos', changes: 'Updated CTA based on A/B test results' },
    { id: 'v3', version: 'v3', date: '2026-02-16', author: 'Carlos Rivera', changes: 'Incorporated brand review feedback' },
    { id: 'v2', version: 'v2', date: '2026-02-14', author: 'Maria Santos', changes: 'AI-assisted tone refinement' },
    { id: 'v1', version: 'v1', date: '2026-02-10', author: 'Maria Santos', changes: 'Initial draft from content brief' },
  ],
};

const statusTagColor: Record<ContentStatus, string> = {
  draft: 'gray',
  review: 'blue',
  approved: 'green',
  published: 'purple',
};

const platformTagColor: Record<string, string> = {
  Instagram: 'magenta',
  Facebook: 'blue',
  LinkedIn: 'cyan',
  Twitter: 'teal',
  TikTok: 'purple',
  YouTube: 'red',
};

const scoreStatusIcon: Record<string, React.ComponentType<any>> = {
  good: Checkmark,
  warning: WarningAlt,
  error: WarningAlt,
};

const scoreStatusColor: Record<string, string> = {
  good: '#24a148',
  warning: '#f1c21b',
  error: '#da1e28',
};

export default function ContentDetailPage() {
  const { t } = useTranslation();
  const content = mockContent;

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem href="/dashboard">{t('Dashboard')}</BreadcrumbItem>
          <BreadcrumbItem href="/content">{t('Content')}</BreadcrumbItem>
          <BreadcrumbItem href={`/content/${content.id}`} isCurrentPage>
            {content.title}
          </BreadcrumbItem>
        </Breadcrumb>
      </Column>

      {/* Header Tile */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ marginBottom: '0.75rem' }}>{content.title}</h1>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Tag type="teal" size="sm">
                  {content.type}
                </Tag>
                <Tag type={statusTagColor[content.status] as any} size="sm">
                  {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                </Tag>
                {content.platforms.map((platform) => (
                  <Tag key={platform} type={platformTagColor[platform] as any || 'gray'} size="sm">
                    {platform}
                  </Tag>
                ))}
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#525252' }}>
                <span>{t('By')} {content.author}</span>
                <span style={{ margin: '0 0.5rem' }}>&middot;</span>
                <span>{t('Created')} {content.createdAt}</span>
                <span style={{ margin: '0 0.5rem' }}>&middot;</span>
                <span>{t('Updated')} {content.updatedAt}</span>
              </div>
            </div>
            <Link href={`/content/${content.id}/edit`}>
              <Button renderIcon={Edit} size="md">
                {t('Edit Content')}
              </Button>
            </Link>
          </div>
        </Tile>
      </Column>

      {/* Tabs */}
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label={t('Content sections')}>
            <Tab>{t('Preview')}</Tab>
            <Tab>{t('Edit')}</Tab>
            <Tab>{t('AI Feedback')}</Tab>
            <Tab>{t('Versions')}</Tab>
          </TabList>
          <TabPanels>
            {/* Preview Tab */}
            <TabPanel>
              <Grid fullWidth style={{ padding: '1.5rem 0' }}>
                <Column lg={12} md={8} sm={4}>
                  <Tile>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <View size={20} />
                      <h4>{t('Content Preview')}</h4>
                    </div>
                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.7,
                        fontSize: '0.9375rem',
                        color: '#161616',
                        padding: '1rem',
                        background: '#f4f4f4',
                        borderRadius: '4px',
                      }}
                    >
                      {content.body}
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Edit Tab */}
            <TabPanel>
              <Grid fullWidth style={{ padding: '1.5rem 0' }}>
                <Column lg={16} md={8} sm={4}>
                  <Tile>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', gap: '1rem' }}>
                      <Edit size={48} style={{ color: '#8d8d8d' }} />
                      <p style={{ color: '#525252' }}>{t('Open the full editor to make changes to this content.')}</p>
                      <Link href={`/content/${content.id}/edit`}>
                        <Button renderIcon={Edit}>
                          {t('Open Editor')}
                        </Button>
                      </Link>
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* AI Feedback Tab */}
            <TabPanel>
              <Grid fullWidth style={{ padding: '1.5rem 0' }}>
                <Column lg={16} md={8} sm={4} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Analytics size={20} />
                    <h4>{t('AI Quality Scores')}</h4>
                  </div>
                </Column>

                {content.aiScores.map((score) => {
                  const StatusIcon = scoreStatusIcon[score.status];
                  return (
                    <Column key={score.label} lg={5} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                      <Tile style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t(score.label)}</span>
                          <StatusIcon size={16} style={{ color: scoreStatusColor[score.status] }} />
                        </div>
                        <p style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                          {score.score}
                          <span style={{ fontSize: '1rem', fontWeight: 400, color: '#525252' }}>/{score.maxScore}</span>
                        </p>
                        {/* Score bar */}
                        <div
                          style={{
                            width: '100%',
                            height: '4px',
                            background: '#e0e0e0',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${(score.score / score.maxScore) * 100}%`,
                              height: '100%',
                              background: scoreStatusColor[score.status],
                              borderRadius: '2px',
                            }}
                          />
                        </div>
                      </Tile>
                    </Column>
                  );
                })}
              </Grid>
            </TabPanel>

            {/* Versions Tab */}
            <TabPanel>
              <Grid fullWidth style={{ padding: '1.5rem 0' }}>
                <Column lg={16} md={8} sm={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Version size={20} />
                    <h4>{t('Version History')}</h4>
                  </div>

                  {content.versions.map((version, index) => (
                    <Tile
                      key={version.id}
                      style={{
                        marginBottom: '0.5rem',
                        borderLeft: index === 0 ? '3px solid #0f62fe' : '3px solid transparent',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <strong>{version.version}</strong>
                            {index === 0 && (
                              <Tag type="blue" size="sm">
                                {t('Current')}
                              </Tag>
                            )}
                          </div>
                          <p style={{ fontSize: '0.875rem', color: '#525252' }}>{version.changes}</p>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#525252' }}>
                          <p>{version.author}</p>
                          <p>{version.date}</p>
                        </div>
                      </div>
                    </Tile>
                  ))}
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
