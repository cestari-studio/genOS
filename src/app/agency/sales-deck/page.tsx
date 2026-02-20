'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Select,
  SelectItem,
  MultiSelect,
  TextInput,
  Button,
  Tag,
} from '@carbon/react';
import { Report, DocumentExport, Checkmark, ArrowRight } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const templates = [
  { id: 'standard', label: 'Standard' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'startup', label: 'Startup' },
];

const sectionOptions = [
  { id: 'company-overview', text: 'Company Overview' },
  { id: 'case-studies', text: 'Case Studies' },
  { id: 'pricing', text: 'Pricing' },
  { id: 'roi-analysis', text: 'ROI Analysis' },
  { id: 'testimonials', text: 'Testimonials' },
  { id: 'team', text: 'Team & Expertise' },
  { id: 'process', text: 'Our Process' },
  { id: 'technology', text: 'Technology Stack' },
];

interface GeneratedDeck {
  template: string;
  clientName: string;
  sections: string[];
  generatedAt: string;
  estimatedSlides: number;
}

export default function SalesDeckPage() {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [generatedDeck, setGeneratedDeck] = useState<GeneratedDeck | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!clientName.trim() || selectedSections.length === 0) return;

    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setGeneratedDeck({
        template: templates.find((t) => t.id === selectedTemplate)?.label || 'Standard',
        clientName: clientName.trim(),
        sections: selectedSections,
        generatedAt: new Date().toLocaleString(),
        estimatedSlides: selectedSections.length * 3 + 2, // title + closing + 3 per section
      });
      setIsGenerating(false);
    }, 1500);
  };

  const templateDescriptions: Record<string, string> = {
    standard: 'Balanced presentation suitable for most prospects. Clean layout with standard branding.',
    enterprise: 'Executive-focused deck with detailed ROI metrics, compliance info, and SLA details.',
    startup: 'Fast-paced, visually dynamic deck emphasizing agility, innovation, and growth potential.',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Report size={24} />
          {t('Sales Deck Generator')}
        </h1>
        <p style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
          {t('Generate customized sales presentations for client pitches')}
        </p>
      </div>

      <Grid style={{ marginTop: '1.5rem' }}>
        {/* Form Section */}
        <Column lg={8} md={4} sm={4}>
          <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              {t('Configure Deck')}
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <TextInput
                id="client-name"
                labelText={t('Client Name')}
                placeholder={t('Enter client name...')}
                value={clientName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <Select
                id="template-select"
                labelText={t('Deck Template')}
                value={selectedTemplate}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTemplate(e.target.value)}
              >
                {templates.map((tmpl) => (
                  <SelectItem key={tmpl.id} value={tmpl.id} text={tmpl.label} />
                ))}
              </Select>
              <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginTop: '0.5rem' }}>
                {templateDescriptions[selectedTemplate]}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <MultiSelect
                id="sections-select"
                titleText={t('Sections to Include')}
                label={t('Select sections...')}
                items={sectionOptions}
                itemToString={(item: { id: string; text: string } | null) => item?.text || ''}
                onChange={({ selectedItems }: { selectedItems: { id: string; text: string }[] }) =>
                  setSelectedSections(selectedItems.map((item) => item.text))
                }
              />
            </div>

            <Button
              renderIcon={DocumentExport}
              onClick={handleGenerate}
              disabled={!clientName.trim() || selectedSections.length === 0 || isGenerating}
            >
              {isGenerating ? t('Generating...') : t('Generate Deck')}
            </Button>
          </Tile>
        </Column>

        {/* Preview Section */}
        <Column lg={8} md={4} sm={4}>
          <Tile style={{ padding: '1.5rem', minHeight: '400px', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              {t('Deck Preview')}
            </h2>

            {!generatedDeck && !isGenerating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--cds-text-secondary)' }}>
                <Report size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <p style={{ fontSize: '0.875rem' }}>{t('Configure and generate a deck to see the preview')}</p>
              </div>
            )}

            {isGenerating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--cds-text-secondary)' }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid var(--cds-layer-02)', borderTop: '3px solid var(--cds-link-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.875rem' }}>{t('Generating your sales deck...')}</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {generatedDeck && !isGenerating && (
              <div>
                {/* Deck Header Card */}
                <div style={{ background: 'var(--cds-layer-02)', borderRadius: '4px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                      {generatedDeck.clientName} - Sales Proposal
                    </h3>
                    <Tag type="blue" size="sm">{generatedDeck.template}</Tag>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                    Generated: {generatedDeck.generatedAt}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                    Estimated slides: {generatedDeck.estimatedSlides}
                  </p>
                </div>

                {/* Section List */}
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {t('Deck Outline')}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Title slide */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--cds-layer-02)', borderRadius: '4px' }}>
                    <Checkmark size={16} style={{ color: 'var(--cds-support-success)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>1. Title Slide</span>
                    <Tag type="high-contrast" size="sm">Auto</Tag>
                  </div>

                  {generatedDeck.sections.map((section, index) => (
                    <div
                      key={section}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: 'var(--cds-layer-02)',
                        borderRadius: '4px',
                      }}
                    >
                      <Checkmark size={16} style={{ color: 'var(--cds-support-success)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {index + 2}. {section}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginLeft: 'auto' }}>
                        ~3 slides
                      </span>
                    </div>
                  ))}

                  {/* Closing slide */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--cds-layer-02)', borderRadius: '4px' }}>
                    <Checkmark size={16} style={{ color: 'var(--cds-support-success)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {generatedDeck.sections.length + 2}. Next Steps & Contact
                    </span>
                    <Tag type="high-contrast" size="sm">Auto</Tag>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <Button kind="primary" size="sm" renderIcon={DocumentExport}>
                    {t('Download PPTX')}
                  </Button>
                  <Button kind="tertiary" size="sm" renderIcon={ArrowRight}>
                    {t('Open in Editor')}
                  </Button>
                </div>
              </div>
            )}
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
