'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  TextInput,
  TextArea,
  Tag,
  Button,
  Section,
  Heading,
} from '@carbon/react';
import { Save, Add, TrashCan } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const initialColors = [
  { name: 'Primary', hex: '#0F62FE' },
  { name: 'Secondary', hex: '#6929C4' },
  { name: 'Accent', hex: '#009D9A' },
  { name: 'Neutral', hex: '#393939' },
];

const initialIndustries = [
  'Technology',
  'SaaS',
  'Digital Marketing',
  'E-commerce',
];

export default function BrandProfilePage() {
  const { t } = useTranslation();
  const [brandName, setBrandName] = useState('Acme Corporation');
  const [description, setDescription] = useState(
    'Acme Corporation is a leading provider of innovative digital solutions that empower businesses to scale. Our brand stands for reliability, cutting-edge technology, and customer-first thinking.'
  );
  const [industries, setIndustries] = useState(initialIndustries);
  const [newIndustry, setNewIndustry] = useState('');
  const [colors, setColors] = useState(initialColors);

  const handleAddIndustry = () => {
    if (newIndustry.trim() && !industries.includes(newIndustry.trim())) {
      setIndustries([...industries, newIndustry.trim()]);
      setNewIndustry('');
    }
  };

  const handleRemoveIndustry = (industry: string) => {
    setIndustries(industries.filter((i) => i !== industry));
  };

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>
            {t('Brand Profile')}
          </Heading>
        </Section>
      </Column>

      {/* Brand Identity Section */}
      <Column lg={8} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile style={{ height: '100%', padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>{t('Brand Identity')}</h4>

          {/* Logo Placeholder */}
          <div
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#e0e0e0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              border: '2px dashed #8d8d8d',
            }}
          >
            <span style={{ color: '#6f6f6f', fontSize: '0.75rem', textAlign: 'center' }}>
              {t('Brand Logo')}
              <br />
              120 x 120
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <TextInput
              id="brand-name"
              labelText={t('Brand Name')}
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <TextArea
              id="brand-description"
              labelText={t('Brand Description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Industries */}
          <div style={{ marginBottom: '1rem' }}>
            <label className="cds--label">{t('Industries')}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {industries.map((industry) => (
                <Tag
                  key={industry}
                  type="blue"
                  filter
                  onClose={() => handleRemoveIndustry(industry)}
                >
                  {industry}
                </Tag>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <TextInput
                id="new-industry"
                labelText=""
                hideLabel
                placeholder={t('Add industry...')}
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddIndustry()}
                size="sm"
              />
              <Button
                size="sm"
                kind="ghost"
                renderIcon={Add}
                hasIconOnly
                iconDescription={t('Add industry')}
                onClick={handleAddIndustry}
              />
            </div>
          </div>
        </Tile>
      </Column>

      {/* Brand Colors Section */}
      <Column lg={8} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>{t('Brand Colors')}</h4>
          <Grid condensed>
            {colors.map((color, index) => (
              <Column key={color.name} lg={4} md={2} sm={2} style={{ marginBottom: '1rem' }}>
                <Tile style={{ padding: '1rem', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '80px',
                      backgroundColor: color.hex,
                      borderRadius: '4px',
                      marginBottom: '0.75rem',
                    }}
                  />
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {color.name}
                  </p>
                  <TextInput
                    id={`color-${index}`}
                    labelText=""
                    hideLabel
                    size="sm"
                    value={color.hex}
                    onChange={(e) => {
                      const updated = [...colors];
                      updated[index] = { ...color, hex: e.target.value };
                      setColors(updated);
                    }}
                  />
                </Tile>
              </Column>
            ))}
          </Grid>
        </Tile>

        {/* Typography Preview */}
        <Tile style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1.5rem' }}>{t('Typography Preview')}</h4>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#6f6f6f', marginBottom: '0.25rem' }}>
              {t('Heading 1 — IBM Plex Sans Bold 36px')}
            </p>
            <p style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2 }}>
              {brandName || 'Brand Name'}
            </p>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#6f6f6f', marginBottom: '0.25rem' }}>
              {t('Heading 2 — IBM Plex Sans Semibold 24px')}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 }}>
              {t('Subheading Preview')}
            </p>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#6f6f6f', marginBottom: '0.25rem' }}>
              {t('Body — IBM Plex Sans Regular 16px')}
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.5 }}>
              {t(
                'The quick brown fox jumps over the lazy dog. This is a preview of body text that would appear across your branded content and collateral.'
              )}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#6f6f6f', marginBottom: '0.25rem' }}>
              {t('Caption — IBM Plex Sans Regular 12px')}
            </p>
            <p style={{ fontSize: '0.75rem', lineHeight: 1.4, color: '#525252' }}>
              {t('Caption and fine print text style preview.')}
            </p>
          </div>
        </Tile>
      </Column>

      {/* Save Button */}
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button renderIcon={Save} size="lg">
            {t('Save Brand Profile')}
          </Button>
        </div>
      </Column>
    </Grid>
  );
}
