'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Tag,
  AspectRatio,
} from '@carbon/react';
import {
  Analytics,
  UserMultiple,
  Calendar,
  SendAlt,
  LogoInstagram,
  LogoLinkedin,
  LogoTwitter,
  LogoYoutube,
  Activity,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const kpiData = [
  { label: 'Total Followers', value: '245K', icon: UserMultiple },
  { label: 'Engagement Rate', value: '4.2%', icon: Analytics },
  { label: 'Posts This Month', value: '89', icon: SendAlt },
  { label: 'Scheduled', value: '24', icon: Calendar },
];

const platformCards = [
  {
    name: 'Instagram',
    icon: LogoInstagram,
    followers: '98.2K',
    growth: '+5.4%',
    color: '#E1306C',
  },
  {
    name: 'LinkedIn',
    icon: LogoLinkedin,
    followers: '52.1K',
    growth: '+3.1%',
    color: '#0077B5',
  },
  {
    name: 'Twitter',
    icon: LogoTwitter,
    followers: '41.7K',
    growth: '+2.8%',
    color: '#1DA1F2',
  },
  {
    name: 'TikTok',
    icon: Activity,
    followers: '38.5K',
    growth: '+12.3%',
    color: '#000000',
  },
  {
    name: 'YouTube',
    icon: LogoYoutube,
    followers: '14.5K',
    growth: '+1.9%',
    color: '#FF0000',
  },
];

const recentPosts = [
  {
    id: 1,
    title: 'New product launch announcement',
    platform: 'Instagram',
    date: '2026-02-19',
    likes: 1243,
    comments: 89,
  },
  {
    id: 2,
    title: 'Behind the scenes: Team culture',
    platform: 'LinkedIn',
    date: '2026-02-18',
    likes: 876,
    comments: 45,
  },
  {
    id: 3,
    title: 'Customer success story thread',
    platform: 'Twitter',
    date: '2026-02-18',
    likes: 2341,
    comments: 156,
  },
  {
    id: 4,
    title: 'Quick tip: Productivity hack #47',
    platform: 'TikTok',
    date: '2026-02-17',
    likes: 15420,
    comments: 732,
  },
  {
    id: 5,
    title: 'Full tutorial: Getting started guide',
    platform: 'YouTube',
    date: '2026-02-16',
    likes: 3210,
    comments: 198,
  },
];

const platformTagColor = (platform: string) => {
  switch (platform) {
    case 'Instagram':
      return 'magenta';
    case 'LinkedIn':
      return 'blue';
    case 'Twitter':
      return 'cyan';
    case 'TikTok':
      return 'purple';
    case 'YouTube':
      return 'red';
    default:
      return 'gray';
  }
};

export default function SocialHubPage() {
  const { t } = useTranslation();

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Social Hub')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Monitor and manage all your social media channels from one place.')}
        </p>
      </Column>

      {/* KPI Tiles */}
      {kpiData.map((kpi) => (
        <Column key={kpi.label} lg={4} md={2} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <kpi.icon size={20} />
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t(kpi.label)}</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{kpi.value}</p>
          </Tile>
        </Column>
      ))}

      {/* Platform Cards */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <h3>{t('Platforms')}</h3>
      </Column>

      {platformCards.map((platform) => (
        <Column key={platform.name} lg={3} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <ClickableTile
            href={`/social/analytics?platform=${platform.name.toLowerCase()}`}
            style={{ height: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <platform.icon size={24} />
              <strong>{platform.name}</strong>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {platform.followers}
            </p>
            <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t('Followers')}</span>
            <div style={{ marginTop: '0.75rem' }}>
              <Tag type="green" size="sm">
                {platform.growth}
              </Tag>
            </div>
          </ClickableTile>
        </Column>
      ))}

      {/* Recent Post Feed */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <h3>{t('Recent Posts')}</h3>
      </Column>

      <Column lg={16} md={8} sm={4}>
        {recentPosts.map((post) => (
          <Tile key={post.id} style={{ marginBottom: '0.5rem' }}>
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
                <Tag type={platformTagColor(post.platform) as any} size="sm">
                  {post.platform}
                </Tag>
                <strong>{post.title}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#525252', fontSize: '0.875rem' }}>
                <span>{post.likes.toLocaleString()} {t('likes')}</span>
                <span>{post.comments} {t('comments')}</span>
                <span>{post.date}</span>
              </div>
            </div>
          </Tile>
        ))}
      </Column>
    </Grid>
  );
}
