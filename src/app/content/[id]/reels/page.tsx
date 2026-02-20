'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Button,
  Tag,
} from '@carbon/react';
import { Play, Add, WatsonHealthAiResults } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

export default function ReelsEditorPage() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('Summer Collection Reveal');
  const [script, setScript] = useState(
    'Open with a close-up of the new product.\nZoom out to show the full collection.\nCut to lifestyle shots with upbeat music.\nEnd with logo and CTA: "Shop Now".'
  );
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [musicTrack, setMusicTrack] = useState('Upbeat Summer Vibes - Royalty Free');
  const [hashtags, setHashtags] = useState<string[]>([
    'SummerCollection',
    'NewArrivals',
    'FashionReels',
    'ShopNow',
    'StyleInspo',
    'OOTD',
  ]);
  const [newHashtag, setNewHashtag] = useState('');

  const addHashtag = () => {
    const cleaned = newHashtag.replace(/^#/, '').trim();
    if (cleaned && !hashtags.includes(cleaned)) {
      setHashtags([...hashtags, cleaned]);
      setNewHashtag('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((h) => h !== tag));
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>
        {t('Short Video / Reels Editor')}
      </h1>
      <p style={{ marginBottom: '2rem', color: '#525252' }}>
        {t('Create and edit short-form video content for social media platforms.')}
      </p>

      <Grid narrow>
        {/* Video Preview */}
        <Column sm={4} md={4} lg={6}>
          <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
              {t('Video Preview')}
            </h3>
            <div
              style={{
                backgroundColor: '#161616',
                height: aspectRatio === '9:16' ? '480px' : aspectRatio === '1:1' ? '320px' : '240px',
                width: '100%',
                maxWidth: aspectRatio === '9:16' ? '270px' : aspectRatio === '1:1' ? '320px' : '100%',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                position: 'relative',
              }}
            >
              <Play size={48} style={{ color: '#ffffff', marginBottom: '0.5rem' }} />
              <p style={{ color: '#a8a8a8', fontSize: '0.75rem' }}>{t('Video Preview')}</p>
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.75rem',
                }}
              >
                {aspectRatio}
              </div>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Tag type="blue" size="sm">{t('Duration')}: 0:30</Tag>
              <Tag type="gray" size="sm" style={{ marginLeft: '0.5rem' }}>{aspectRatio}</Tag>
            </div>
          </Tile>
        </Column>

        {/* Form */}
        <Column sm={4} md={4} lg={10}>
          <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
              {t('Video Details')}
            </h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <TextInput
                id="reel-title"
                labelText={t('Title')}
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <TextArea
                id="reel-script"
                labelText={t('Script')}
                value={script}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScript(e.target.value)}
                rows={5}
                placeholder={t('Write your video script here...')}
              />
            </div>

            <Grid narrow>
              <Column sm={4} md={4} lg={8}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <Select
                    id="aspect-ratio"
                    labelText={t('Aspect Ratio')}
                    value={aspectRatio}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setAspectRatio(e.target.value)
                    }
                  >
                    <SelectItem value="9:16" text="9:16 (Vertical / Reels)" />
                    <SelectItem value="1:1" text="1:1 (Square)" />
                    <SelectItem value="16:9" text="16:9 (Landscape)" />
                  </Select>
                </div>
              </Column>
              <Column sm={4} md={4} lg={8}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <TextInput
                    id="music-track"
                    labelText={t('Music Track')}
                    value={musicTrack}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMusicTrack(e.target.value)
                    }
                    placeholder={t('Search or enter music track...')}
                  />
                </div>
              </Column>
            </Grid>
          </Tile>

          <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
              {t('Hashtags')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {hashtags.map((tag) => (
                <Tag
                  key={tag}
                  type="blue"
                  size="sm"
                  filter
                  onClose={() => removeHashtag(tag)}
                >
                  #{tag}
                </Tag>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <TextInput
                id="new-hashtag"
                labelText={t('Add Hashtag')}
                value={newHashtag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewHashtag(e.target.value)}
                placeholder={t('Enter hashtag...')}
                onKeyDown={handleHashtagKeyDown}
                size="md"
              />
              <Button
                kind="ghost"
                size="md"
                renderIcon={Add}
                hasIconOnly
                iconDescription={t('Add')}
                onClick={addHashtag}
              />
            </div>
          </Tile>

          <Button
            kind="primary"
            renderIcon={WatsonHealthAiResults}
            size="lg"
          >
            {t('Generate with AI')}
          </Button>
        </Column>
      </Grid>
    </div>
  );
}
