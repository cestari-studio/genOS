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
  ClickableTile,
} from '@carbon/react';
import {
  ColorPalette,
  Analytics,
  Document,
  UserProfile,
  Tag as TagIcon,
  Email,
  Phone,
  Globe,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface BrandData {
  id: string;
  name: string;
  industry: string;
  status: 'active' | 'inactive' | 'onboarding';
  description: string;
  website: string;
  email: string;
  phone: string;
  voice: string;
  tone: string[];
  colors: { name: string; hex: string }[];
  keywords: string[];
  recentContent: { id: string; title: string; type: string; date: string; status: string }[];
  kpis: { label: string; value: string; change: string }[];
}

const mockBrand: BrandData = {
  id: '1',
  name: 'Acme Corporation',
  industry: 'Technology',
  status: 'active',
  description:
    'Acme Corporation is a leading technology company specializing in innovative SaaS solutions for enterprise clients. Founded in 2018, Acme has grown to serve over 500 businesses worldwide with cutting-edge AI-powered tools for marketing, sales, and operations.',
  website: 'https://acme.example.com',
  email: 'brand@acme.example.com',
  phone: '+1 (555) 123-4567',
  voice:
    'Professional yet approachable. We speak with confidence and clarity, avoiding jargon while maintaining authority in our domain. Our communication is warm, inclusive, and forward-thinking.',
  tone: ['Confident', 'Approachable', 'Innovative', 'Trustworthy'],
  colors: [
    { name: 'Primary Blue', hex: '#0f62fe' },
    { name: 'Secondary Teal', hex: '#009d9a' },
    { name: 'Accent Orange', hex: '#ff832b' },
    { name: 'Neutral Dark', hex: '#161616' },
    { name: 'Neutral Light', hex: '#f4f4f4' },
  ],
  keywords: [
    'innovation',
    'enterprise',
    'AI-powered',
    'scalable',
    'secure',
    'cloud-native',
    'automation',
    'data-driven',
    'customer-first',
    'digital transformation',
  ],
  recentContent: [
    { id: 'c1', title: 'Q1 Product Update Announcement', type: 'post', date: '2026-02-18', status: 'published' },
    { id: 'c2', title: 'Customer Success: Enterprise Case Study', type: 'page', date: '2026-02-16', status: 'approved' },
    { id: 'c3', title: 'Behind the Scenes: Engineering Team', type: 'reel', date: '2026-02-15', status: 'draft' },
    { id: 'c4', title: 'Weekly Tips: Productivity Series', type: 'carousel', date: '2026-02-14', status: 'published' },
    { id: 'c5', title: 'New Feature: AI Assistant Launch', type: 'story', date: '2026-02-13', status: 'review' },
  ],
  kpis: [
    { label: 'Total Content Pieces', value: '342', change: '+12%' },
    { label: 'Avg. Engagement Rate', value: '4.7%', change: '+0.8%' },
    { label: 'Brand Consistency Score', value: '92/100', change: '+3' },
    { label: 'Monthly Reach', value: '1.2M', change: '+18%' },
  ],
};

const statusTagColor: Record<string, string> = {
  active: 'green',
  inactive: 'gray',
  onboarding: 'blue',
  draft: 'gray',
  review: 'blue',
  approved: 'teal',
  published: 'purple',
};

export default function BrandDetailPage() {
  const { t } = useTranslation();
  const brand = mockBrand;

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem href="/dashboard">{t('Dashboard')}</BreadcrumbItem>
          <BreadcrumbItem href="/brands">{t('Brands')}</BreadcrumbItem>
          <BreadcrumbItem href={`/brands/${brand.id}`} isCurrentPage>
            {brand.name}
          </BreadcrumbItem>
        </Breadcrumb>
      </Column>

      {/* Header Tile */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ marginBottom: '0.5rem' }}>{brand.name}</h1>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Tag type={statusTagColor[brand.industry.toLowerCase()] || 'high-contrast' as any} size="sm">
                  {brand.industry}
                </Tag>
                <Tag type={statusTagColor[brand.status] as any} size="sm">
                  {brand.status.charAt(0).toUpperCase() + brand.status.slice(1)}
                </Tag>
              </div>
            </div>
          </div>
        </Tile>
      </Column>

      {/* Tabs */}
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label={t('Brand sections')}>
            <Tab>{t('Overview')}</Tab>
            <Tab>{t('Brand DNA')}</Tab>
            <Tab>{t('Content')}</Tab>
            <Tab>{t('Analytics')}</Tab>
          </TabList>
          <TabPanels>
            {/* Overview Tab */}
            <TabPanel>
              <Grid fullWidth style={{ padding: '1.5rem 0' }}>
                <Column lg={10} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile>
                    <h4 style={{ marginBottom: '1rem' }}>{t('About')}</h4>
                    <p style={{ lineHeight: 1.6, color: '#525252' }}>{brand.description}</p>
                  </Tile>
                </Column>
                <Column lg={6} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile style={{ height: '100%' }}>
                    <h4 style={{ marginBottom: '1rem' }}>{t('Contact Information')}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={16} />
                        <a href={brand.website} style={{ color: '#0f62fe' }}>{brand.website}</a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Email size={16} />
                        <span>{brand.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={16} />
                        <span>{brand.phone}</span>
                      </div>
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Brand DNA Tab */}
            <TabPanel>
              <Grid fullWidth style={{ padding: '1.5rem 0' }}>
                {/* Brand Voice */}
                <Column lg={16} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <UserProfile size={20} />
                      <h4>{t('Brand Voice')}</h4>
                    </div>
                    <p style={{ lineHeight: 1.6, color: '#525252', marginBottom: '1rem' }}>{brand.voice}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {brand.tone.map((t_item) => (
                        <Tag key={t_item} type="blue" size="sm">
                          {t_item}
                        </Tag>
                      ))}
                    </div>
                  </Tile>
                </Column>

                {/* Colors */}
                <Column lg={16} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <ColorPalette size={20} />
                      <h4>{t('Brand Colors')}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {brand.colors.map((color) => (
                        <div key={color.hex} style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '8px',
                              backgroundColor: color.hex,
                              border: '1px solid #e0e0e0',
                              marginBottom: '0.5rem',
                            }}
                          />
                          <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>{color.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#525252' }}>{color.hex}</p>
                        </div>
                      ))}
                    </div>
                  </Tile>
                </Column>

                {/* Keywords */}
                <Column lg={16} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
                  <Tile>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <TagIcon size={20} />
                      <h4>{t('Keywords')}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {brand.keywords.map((keyword) => (
                        <Tag key={keyword} type="cool-gray" size="sm">
                          {keyword}
                        </Tag>
                      ))}
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Content Tab */}
            <TabPanel>
              <Grid fullWidth style={{ padding: '1.5rem 0' }}>
                <Column lg={16} md={8} sm={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Document size={20} />
                    <h4>{t('Recent Content')}</h4>
                  </div>
                  {brand.recentContent.map((content) => (
                    <ClickableTile
                      key={content.id}
                      href={`/content/${content.id}`}
                      style={{ marginBottom: '0.5rem' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <strong>{content.title}</strong>
                          <Tag type="teal" size="sm">
                            {content.type}
                          </Tag>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Tag type={statusTagColor[content.status] as any} size="sm">
                            {content.status}
                          </Tag>
                          <span style={{ fontSize: '0.875rem', color: '#525252' }}>{content.date}</span>
                        </div>
                      </div>
                    </ClickableTile>
                  ))}
                </Column>
              </Grid>
            </TabPanel>

            {/* Analytics Tab */}
            <TabPanel>
              <Grid fullWidth style={{ padding: '1.5rem 0' }}>
                {brand.kpis.map((kpi) => (
                  <Column key={kpi.label} lg={4} md={2} sm={4} style={{ marginBottom: '1rem' }}>
                    <Tile style={{ height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Analytics size={20} />
                        <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t(kpi.label)}</span>
                      </div>
                      <p style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.25rem' }}>{kpi.value}</p>
                      <Tag type="green" size="sm">
                        {kpi.change}
                      </Tag>
                    </Tile>
                  </Column>
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
