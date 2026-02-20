'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Tag,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import { VideoAdd, Image, Add } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const templates = [
  { id: '1', name: 'Product Showcase', platform: 'Instagram', duration: '15s', gradient: 'linear-gradient(135deg, #0f62fe, #6929c4)' },
  { id: '2', name: 'Behind the Scenes', platform: 'Instagram', duration: '30s', gradient: 'linear-gradient(135deg, #24a148, #0e6027)' },
  { id: '3', name: 'Quick Tips', platform: 'TikTok', duration: '60s', gradient: 'linear-gradient(135deg, #da1e28, #f1c21b)' },
  { id: '4', name: 'Testimonial', platform: 'LinkedIn', duration: '45s', gradient: 'linear-gradient(135deg, #0043ce, #4589ff)' },
  { id: '5', name: 'Countdown', platform: 'Instagram', duration: '15s', gradient: 'linear-gradient(135deg, #8a3ffc, #d4bbff)' },
  { id: '6', name: 'Poll / Question', platform: 'Instagram', duration: '15s', gradient: 'linear-gradient(135deg, #005d5d, #009d9a)' },
];

const drafts = [
  { id: '1', name: 'Summer Collection Preview', platform: 'Instagram', status: 'draft', date: '2026-02-18' },
  { id: '2', name: 'Client Success Story', platform: 'LinkedIn', status: 'draft', date: '2026-02-17' },
];

const published = [
  { id: '1', name: 'New Feature Announcement', platform: 'Instagram', views: '12.4K', date: '2026-02-15' },
  { id: '2', name: 'Team Spotlight', platform: 'TikTok', views: '8.7K', date: '2026-02-13' },
  { id: '3', name: 'Product Demo Reel', platform: 'Instagram', views: '24.1K', date: '2026-02-10' },
];

const platformColors: Record<string, 'purple' | 'blue' | 'red'> = {
  Instagram: 'purple',
  TikTok: 'red',
  LinkedIn: 'blue',
};

export default function StoriesPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <VideoAdd size={20} />
          <h1 style={{ margin: 0 }}>Story Studio</h1>
        </div>
        <p>Create and manage short-form content for Stories, Reels, and TikTok</p>
      </div>

      <Tabs>
        <TabList aria-label="Story tabs">
          <Tab>Templates</Tab>
          <Tab>Drafts ({drafts.length})</Tab>
          <Tab>Published ({published.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
              <h3>Story Templates</h3>
              <Button renderIcon={Add} size="sm">Create Blank</Button>
            </div>
            <Grid fullWidth>
              {templates.map((tmpl) => (
                <Column key={tmpl.id} lg={5} md={4} sm={4}>
                  <ClickableTile href="#" style={{ marginBottom: '1rem', padding: 0, overflow: 'hidden' }}>
                    <div style={{
                      height: '160px', background: tmpl.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Image size={32} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>{tmpl.name}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Tag type={platformColors[tmpl.platform] || 'gray'} size="sm">{tmpl.platform}</Tag>
                        <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>{tmpl.duration}</span>
                      </div>
                    </div>
                  </ClickableTile>
                </Column>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid fullWidth style={{ marginTop: '1rem' }}>
              {drafts.map((draft) => (
                <Column key={draft.id} lg={8} md={4} sm={4}>
                  <Tile style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem' }}>{draft.name}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Tag type={platformColors[draft.platform] || 'gray'} size="sm">{draft.platform}</Tag>
                          <Tag type="gray" size="sm">{draft.status}</Tag>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', margin: 0 }}>{draft.date}</p>
                        <Button kind="ghost" size="sm" style={{ marginTop: '0.5rem' }}>Edit</Button>
                      </div>
                    </div>
                  </Tile>
                </Column>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid fullWidth style={{ marginTop: '1rem' }}>
              {published.map((item) => (
                <Column key={item.id} lg={8} md={4} sm={4}>
                  <Tile style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem' }}>{item.name}</h4>
                        <Tag type={platformColors[item.platform] || 'gray'} size="sm">{item.platform}</Tag>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{item.views}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', margin: 0 }}>views</p>
                      </div>
                    </div>
                  </Tile>
                </Column>
              ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
