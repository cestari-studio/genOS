'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Select,
  SelectItem,
  TextArea,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  NumberInput,
  Tag,
  AILabel,
  AILabelContent,
} from '@carbon/react';
import { WatsonHealthAiResults, Save, Renew } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface GeneratedImage {
  id: string;
  color: string;
  label: string;
  prompt: string;
}

const generatedImages: GeneratedImage[] = [
  { id: '1', color: '#8a3ffc', label: 'Variation 1', prompt: 'Ethereal sunset over ocean, warm tones' },
  { id: '2', color: '#0f62fe', label: 'Variation 2', prompt: 'Ethereal sunset over ocean, cool tones' },
  { id: '3', color: '#007d79', label: 'Variation 3', prompt: 'Ethereal sunset over ocean, muted palette' },
  { id: '4', color: '#b28600', label: 'Variation 4', prompt: 'Ethereal sunset over ocean, high contrast' },
];

const savedImages: GeneratedImage[] = [
  { id: 's1', color: '#da1e28', label: 'Brand Hero', prompt: 'Modern workspace with brand colors' },
  { id: 's2', color: '#24a148', label: 'Nature Scene', prompt: 'Lush green forest with sunlight' },
  { id: 's3', color: '#4589ff', label: 'Tech Abstract', prompt: 'Abstract technology background, blue' },
  { id: 's4', color: '#ff832b', label: 'Product Mockup', prompt: 'Clean product photography, white bg' },
];

const templateImages: GeneratedImage[] = [
  { id: 't1', color: '#6929c4', label: 'Social Media Banner', prompt: 'Vibrant gradient background for social post' },
  { id: 't2', color: '#1192e8', label: 'Blog Header', prompt: 'Professional abstract header image' },
  { id: 't3', color: '#005d5d', label: 'Email Hero', prompt: 'Clean minimal hero image for email' },
  { id: 't4', color: '#9f1853', label: 'Ad Creative', prompt: 'Bold attention-grabbing ad background' },
];

export default function VisualPromptStudioPage() {
  const { t } = useTranslation();
  const [model, setModel] = useState('claude');
  const [prompt, setPrompt] = useState(
    'A serene sunset over a calm ocean, with warm golden and purple tones. Photorealistic style with soft lighting and gentle waves reflecting the sky colors. Wide aspect ratio, cinematic composition.'
  );
  const [creativity, setCreativity] = useState(70);

  const renderImageGrid = (images: GeneratedImage[]) => (
    <Grid narrow>
      {images.map((img) => (
        <Column key={img.id} sm={2} md={2} lg={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                backgroundColor: img.color,
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {img.label}
            </div>
            <div style={{ padding: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                {img.label}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.5rem' }}>
                {img.prompt}
              </p>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <Button kind="ghost" size="sm" renderIcon={Save} hasIconOnly iconDescription={t('Save')} />
                <Button kind="ghost" size="sm" renderIcon={Renew} hasIconOnly iconDescription={t('Regenerate')} />
              </div>
            </div>
          </Tile>
        </Column>
      ))}
    </Grid>
  );

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>
        {t('Visual Prompt Studio')}
      </h1>
      <p style={{ marginBottom: '2rem', color: '#525252' }}>
        {t('Generate AI-powered images with custom prompts and creative controls.')}
      </p>

      <Grid narrow>
        {/* Controls */}
        <Column sm={4} md={8} lg={5}>
          <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
              {t('Generation Settings')}
            </h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <Select
                id="ai-model"
                labelText={t('AI Model')}
                value={model}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setModel(e.target.value)}
              >
                <SelectItem value="claude" text="Claude (Anthropic)" />
                <SelectItem value="gemini" text="Gemini (Google)" />
                <SelectItem value="granite" text="Granite (IBM)" />
              </Select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <TextArea
                id="image-prompt"
                labelText={t('Image Prompt')}
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                rows={6}
                placeholder={t('Describe the image you want to generate...')}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <NumberInput
                id="creativity-level"
                label={t('Creativity Level')}
                min={0}
                max={100}
                step={5}
                value={creativity}
                onChange={(_e: any, state: any) => {
                  if (typeof state?.value === 'number') {
                    setCreativity(state.value);
                  }
                }}
                helperText={t('Higher values produce more creative and unexpected results')}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.5rem' }}>
                {t('Current Settings')}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Tag type="blue" size="sm">
                  {model === 'claude' ? 'Claude' : model === 'gemini' ? 'Gemini' : 'Granite'}
                </Tag>
                <Tag type="purple" size="sm">
                  {t('Creativity')}: {creativity}%
                </Tag>
                <Tag type="teal" size="sm">
                  4 {t('variations')}
                </Tag>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <AILabel size="mini"><AILabelContent><p style={{ fontSize: '0.75rem' }}>{t('Images are generated by AI models. Results vary based on prompt, model, and creativity settings.')}</p></AILabelContent></AILabel>
            </div>

            <Button
              kind="primary"
              renderIcon={WatsonHealthAiResults}
              style={{ width: '100%' }}
            >
              {t('Generate Images')}
            </Button>
          </Tile>
        </Column>

        {/* Results */}
        <Column sm={4} md={8} lg={11}>
          <Tabs>
            <TabList aria-label={t('Image categories')}>
              <Tab>{t('Generated')}</Tab>
              <Tab>{t('Saved')}</Tab>
              <Tab>{t('Templates')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div style={{ paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#525252' }}>
                      {t('4 images generated from your prompt')}
                    </p>
                    <Button kind="ghost" size="sm" renderIcon={Renew}>
                      {t('Regenerate All')}
                    </Button>
                  </div>
                  {renderImageGrid(generatedImages)}
                </div>
              </TabPanel>
              <TabPanel>
                <div style={{ paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1rem' }}>
                    {t('Your saved images for this content item')}
                  </p>
                  {renderImageGrid(savedImages)}
                </div>
              </TabPanel>
              <TabPanel>
                <div style={{ paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1rem' }}>
                    {t('Pre-built prompt templates for common use cases')}
                  </p>
                  {renderImageGrid(templateImages)}
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>
    </div>
  );
}
