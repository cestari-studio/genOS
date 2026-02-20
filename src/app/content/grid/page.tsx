'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  ClickableTile,
  Tag,
  Select,
  SelectItem,
  Layer,
} from '@carbon/react';
import { useTranslation } from '@/lib/i18n/context';

interface ContentItem {
  id: string;
  title: string;
  platform: 'Instagram' | 'LinkedIn' | 'Twitter' | 'Blog';
  status: 'draft' | 'review' | 'approved' | 'published';
  date: string;
  thumbnailColor: string;
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Summer Campaign Launch Post',
    platform: 'Instagram',
    status: 'published',
    date: '2026-02-18',
    thumbnailColor: '#e74c3c',
  },
  {
    id: '2',
    title: 'Q1 Product Roadmap Update',
    platform: 'LinkedIn',
    status: 'approved',
    date: '2026-02-17',
    thumbnailColor: '#3498db',
  },
  {
    id: '3',
    title: 'Flash Sale Announcement',
    platform: 'Twitter',
    status: 'review',
    date: '2026-02-16',
    thumbnailColor: '#2ecc71',
  },
  {
    id: '4',
    title: 'Behind the Scenes: Design Team',
    platform: 'Blog',
    status: 'draft',
    date: '2026-02-15',
    thumbnailColor: '#9b59b6',
  },
  {
    id: '5',
    title: 'Customer Testimonial Spotlight',
    platform: 'Instagram',
    status: 'approved',
    date: '2026-02-14',
    thumbnailColor: '#f39c12',
  },
  {
    id: '6',
    title: 'Industry Trends Report 2026',
    platform: 'LinkedIn',
    status: 'published',
    date: '2026-02-13',
    thumbnailColor: '#1abc9c',
  },
  {
    id: '7',
    title: 'New Feature Teaser Thread',
    platform: 'Twitter',
    status: 'draft',
    date: '2026-02-12',
    thumbnailColor: '#e67e22',
  },
  {
    id: '8',
    title: 'How We Build Accessible Products',
    platform: 'Blog',
    status: 'review',
    date: '2026-02-11',
    thumbnailColor: '#34495e',
  },
  {
    id: '9',
    title: 'Valentine\'s Day Promo',
    platform: 'Instagram',
    status: 'published',
    date: '2026-02-10',
    thumbnailColor: '#e91e63',
  },
  {
    id: '10',
    title: 'Team Hiring Update',
    platform: 'LinkedIn',
    status: 'approved',
    date: '2026-02-09',
    thumbnailColor: '#00bcd4',
  },
  {
    id: '11',
    title: 'Product Poll: What\'s Next?',
    platform: 'Twitter',
    status: 'draft',
    date: '2026-02-08',
    thumbnailColor: '#8bc34a',
  },
  {
    id: '12',
    title: 'The Future of AI in Marketing',
    platform: 'Blog',
    status: 'review',
    date: '2026-02-07',
    thumbnailColor: '#ff5722',
  },
];

const platformTagType: Record<string, 'red' | 'blue' | 'teal' | 'purple'> = {
  Instagram: 'red',
  LinkedIn: 'blue',
  Twitter: 'teal',
  Blog: 'purple',
};

const statusTagType: Record<string, 'gray' | 'blue' | 'green' | 'cyan'> = {
  draft: 'gray',
  review: 'blue',
  approved: 'green',
  published: 'cyan',
};

export default function ContentGridPage() {
  const { t } = useTranslation();
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContent = mockContent.filter((item) => {
    const matchesPlatform =
      platformFilter === 'all' || item.platform === platformFilter;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    return matchesPlatform && matchesStatus;
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>
        {t('Content Matrix')}
      </h1>

      <Grid narrow style={{ marginBottom: '2rem' }}>
        <Column sm={4} md={4} lg={4}>
          <Select
            id="platform-filter"
            labelText={t('Platform')}
            value={platformFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPlatformFilter(e.target.value)
            }
          >
            <SelectItem value="all" text={t('All Platforms')} />
            <SelectItem value="Instagram" text="Instagram" />
            <SelectItem value="LinkedIn" text="LinkedIn" />
            <SelectItem value="Twitter" text="Twitter" />
            <SelectItem value="Blog" text="Blog" />
          </Select>
        </Column>
        <Column sm={4} md={4} lg={4}>
          <Select
            id="status-filter"
            labelText={t('Status')}
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value)
            }
          >
            <SelectItem value="all" text={t('All Statuses')} />
            <SelectItem value="draft" text={t('Draft')} />
            <SelectItem value="review" text={t('Review')} />
            <SelectItem value="approved" text={t('Approved')} />
            <SelectItem value="published" text={t('Published')} />
          </Select>
        </Column>
      </Grid>

      <Layer>
        <Grid narrow>
          {filteredContent.map((item) => (
            <Column key={item.id} sm={4} md={4} lg={4} style={{ marginBottom: '1rem' }}>
              <ClickableTile
                href={`/content/${item.id}`}
                style={{ height: '100%', padding: 0 }}
              >
                <div
                  style={{
                    backgroundColor: item.thumbnailColor,
                    height: '140px',
                    width: '100%',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    {item.title}
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <Tag type={platformTagType[item.platform]} size="sm">
                      {item.platform}
                    </Tag>
                    <Tag type={statusTagType[item.status]} size="sm">
                      {item.status}
                    </Tag>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#525252' }}>
                    {item.date}
                  </p>
                </div>
              </ClickableTile>
            </Column>
          ))}
        </Grid>
      </Layer>
    </div>
  );
}
