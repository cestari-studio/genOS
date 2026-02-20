'use client';

import { useState } from 'react';
import {
  FileUploader,
  Tile,
  Grid,
  Column,
  Button,
  TextInput,
  Tag,
} from '@carbon/react';
import { ColorPalette, Image, Upload } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface UploadedLogo {
  id: string;
  name: string;
  size: string;
  variant: string;
  uploadedAt: string;
}

interface ColorValue {
  label: string;
  hex: string;
}

interface PaletteGroup {
  name: string;
  colors: ColorValue[];
}

const mockUploadedLogos: UploadedLogo[] = [
  { id: 'logo-1', name: 'logo-primary.svg', size: '24 KB', variant: 'Primary', uploadedAt: '2026-02-18' },
  { id: 'logo-2', name: 'logo-white.svg', size: '22 KB', variant: 'White', uploadedAt: '2026-02-18' },
  { id: 'logo-3', name: 'logo-icon-only.png', size: '18 KB', variant: 'Icon Only', uploadedAt: '2026-02-17' },
  { id: 'logo-4', name: 'logo-horizontal.svg', size: '31 KB', variant: 'Horizontal', uploadedAt: '2026-02-17' },
];

const mockColorPalette: PaletteGroup[] = [
  {
    name: 'Primary',
    colors: [
      { label: 'Primary 100', hex: '#0f62fe' },
      { label: 'Primary 80', hex: '#3d82fe' },
      { label: 'Primary 60', hex: '#6ea6ff' },
      { label: 'Primary 10', hex: '#edf5ff' },
    ],
  },
  {
    name: 'Secondary',
    colors: [
      { label: 'Secondary 100', hex: '#6929c4' },
      { label: 'Secondary 80', hex: '#8a3ffc' },
      { label: 'Secondary 60', hex: '#a56eff' },
      { label: 'Secondary 10', hex: '#f6f2ff' },
    ],
  },
  {
    name: 'Accent',
    colors: [
      { label: 'Accent 100', hex: '#005d5d' },
      { label: 'Accent 80', hex: '#007d79' },
      { label: 'Accent 60', hex: '#009d9a' },
      { label: 'Accent 10', hex: '#d9fbfb' },
    ],
  },
];

const mockTypography = [
  { role: 'Heading', family: 'IBM Plex Sans', weight: '600', sizeRem: '2rem', sample: 'The quick brown fox' },
  { role: 'Subheading', family: 'IBM Plex Sans', weight: '500', sizeRem: '1.25rem', sample: 'Jumps over the lazy dog' },
  { role: 'Body', family: 'IBM Plex Sans', weight: '400', sizeRem: '1rem', sample: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { role: 'Caption', family: 'IBM Plex Mono', weight: '400', sizeRem: '0.75rem', sample: 'Supporting metadata and labels' },
];

export default function DnaVisualPage() {
  const { t } = useTranslation();

  const [logos, setLogos] = useState<UploadedLogo[]>(mockUploadedLogos);
  const [palette, setPalette] = useState<PaletteGroup[]>(mockColorPalette);
  const [editingColor, setEditingColor] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleRemoveLogo = (id: string) => {
    setLogos((prev) => prev.filter((logo) => logo.id !== id));
  };

  const handleColorClick = (groupName: string, label: string, currentHex: string) => {
    const key = `${groupName}-${label}`;
    setEditingColor(key);
    setEditValue(currentHex);
  };

  const handleColorSave = (groupName: string, label: string) => {
    setPalette((prev) =>
      prev.map((group) => {
        if (group.name !== groupName) return group;
        return {
          ...group,
          colors: group.colors.map((c) =>
            c.label === label ? { ...c, hex: editValue } : c
          ),
        };
      })
    );
    setEditingColor(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ColorPalette size={20} />
          DNA Setup &mdash; Visual Identity
        </h1>
        <p style={{ color: '#525252', maxWidth: '640px' }}>
          Upload your brand logos, define your color palette, and configure typography settings
          to establish the visual foundation of your brand DNA.
        </p>
      </div>

      <Grid>
        {/* Logo Upload Section */}
        <Column lg={16} md={8} sm={4} style={{ marginBottom: '2rem' }}>
          <Tile style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Upload size={20} />
              Logo Assets
            </h3>
            <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Upload your brand logos in SVG or PNG format. Include all variants (primary, white, icon-only, etc.).
            </p>

            <FileUploader
              accept={['.svg', '.png', '.jpg']}
              buttonKind="tertiary"
              buttonLabel="Add files"
              filenameStatus="edit"
              iconDescription="Remove file"
              labelDescription="Max file size is 5MB. Accepted formats: SVG, PNG, JPG."
              labelTitle="Upload"
              size="md"
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem' }}>
              {logos.map((logo) => (
                <Tile
                  key={logo.id}
                  style={{
                    padding: '1rem',
                    width: '200px',
                    border: '1px solid #e0e0e0',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '80px',
                      background: '#f4f4f4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem',
                      borderRadius: '4px',
                    }}
                  >
                    <Image size={20} />
                  </div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    {logo.name}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <Tag type="blue" size="sm">{logo.variant}</Tag>
                    <span style={{ fontSize: '0.75rem', color: '#525252' }}>{logo.size}</span>
                  </div>
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={() => handleRemoveLogo(logo.id)}
                    style={{ padding: 0 }}
                  >
                    Remove
                  </Button>
                </Tile>
              ))}
            </div>
          </Tile>
        </Column>

        {/* Color Palette Section */}
        <Column lg={16} md={8} sm={4} style={{ marginBottom: '2rem' }}>
          <Tile style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ColorPalette size={20} />
              Color Palette
            </h3>
            <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Define primary, secondary, and accent colors for your brand. Click any swatch to edit its hex value.
            </p>

            {palette.map((group) => (
              <div key={group.name} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem' }}>{group.name}</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {group.colors.map((color) => {
                    const key = `${group.name}-${color.label}`;
                    const isEditing = editingColor === key;
                    return (
                      <div key={color.label} style={{ width: '140px' }}>
                        <div
                          style={{
                            width: '100%',
                            height: '64px',
                            background: color.hex,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: '1px solid #e0e0e0',
                            marginBottom: '0.5rem',
                          }}
                          onClick={() => handleColorClick(group.name, color.label, color.hex)}
                        />
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.125rem' }}>
                          {color.label}
                        </p>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <TextInput
                              id={`color-edit-${key}`}
                              labelText=""
                              hideLabel
                              size="sm"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              style={{ width: '100px' }}
                            />
                            <Button
                              kind="primary"
                              size="sm"
                              onClick={() => handleColorSave(group.name, color.label)}
                            >
                              OK
                            </Button>
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.75rem', color: '#525252' }}>{color.hex}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </Tile>
        </Column>

        {/* Typography Preview */}
        <Column lg={16} md={8} sm={4} style={{ marginBottom: '2rem' }}>
          <Tile style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.25rem' }}>Typography Preview</h3>
            <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Review the typographic hierarchy for your brand.
            </p>

            {mockTypography.map((typo) => (
              <div
                key={typo.role}
                style={{
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Tag type="gray" size="sm">{typo.role}</Tag>
                  <span style={{ fontSize: '0.75rem', color: '#525252' }}>
                    {typo.family} &middot; {typo.weight} &middot; {typo.sizeRem}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: typo.family,
                    fontWeight: Number(typo.weight),
                    fontSize: typo.sizeRem,
                  }}
                >
                  {typo.sample}
                </p>
              </div>
            ))}
          </Tile>
        </Column>
      </Grid>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        <Button kind="secondary" size="md">
          Back
        </Button>
        <Button kind="primary" size="md">
          Save &amp; Continue
        </Button>
      </div>
    </div>
  );
}
