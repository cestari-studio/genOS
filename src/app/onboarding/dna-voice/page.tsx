'use client';

import { useState } from 'react';
import {
  Slider,
  Tile,
  RadioButtonGroup,
  RadioButton,
  TextArea,
  Button,
  Tag,
} from '@carbon/react';
import { VoiceActivate, Language } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface VoiceDimension {
  id: string;
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  description: string;
}

interface ExampleOutput {
  id: string;
  persona: string;
  text: string;
}

const mockVoiceDimensions: VoiceDimension[] = [
  {
    id: 'formality',
    label: 'Formality',
    lowLabel: 'Casual',
    highLabel: 'Formal',
    value: 65,
    description: 'How formal or casual the language should feel in written communications.',
  },
  {
    id: 'technicality',
    label: 'Technicality',
    lowLabel: 'Simple',
    highLabel: 'Technical',
    value: 40,
    description: 'The level of technical jargon and complexity in content.',
  },
  {
    id: 'tone',
    label: 'Tone',
    lowLabel: 'Playful',
    highLabel: 'Serious',
    value: 50,
    description: 'The overall emotional register from lighthearted to authoritative.',
  },
  {
    id: 'conciseness',
    label: 'Conciseness',
    lowLabel: 'Expansive',
    highLabel: 'Concise',
    value: 70,
    description: 'Preference for brevity versus detailed, long-form explanations.',
  },
  {
    id: 'personality',
    label: 'Personality',
    lowLabel: 'Neutral',
    highLabel: 'Opinionated',
    value: 55,
    description: 'How much personal voice and perspective shines through in the writing.',
  },
];

const mockExampleOutputs: ExampleOutput[] = [
  {
    id: 'ex-blog',
    persona: 'Blog Post Intro',
    text: 'Content marketing is evolving fast. Here is what the latest data tells us about where the industry is headed — and how your team can stay ahead of the curve.',
  },
  {
    id: 'ex-social',
    persona: 'Social Media Post',
    text: 'Your audience is not waiting around. New research shows that brands publishing consistent, quality content see 3x more engagement. Time to level up your strategy.',
  },
  {
    id: 'ex-email',
    persona: 'Email Subject Line',
    text: 'Your Q2 content plan just got smarter — see what changed',
  },
  {
    id: 'ex-landing',
    persona: 'Landing Page Headline',
    text: 'AI-powered content that speaks your brand, every single time.',
  },
];

export default function DnaVoicePage() {
  const { t } = useTranslation();

  const [dimensions, setDimensions] = useState<VoiceDimension[]>(mockVoiceDimensions);
  const [selectedLanguage, setSelectedLanguage] = useState('en-us');
  const [regionalisms, setRegionalisms] = useState(
    'Use "you all" instead of "y\'all".\nPrefer "analyze" over "analyse".\nAvoid region-specific idioms unless targeting local audiences.'
  );
  const [activeExample, setActiveExample] = useState<string>('ex-blog');

  const handleSliderChange = (id: string, newValue: number) => {
    setDimensions((prev) =>
      prev.map((dim) => (dim.id === id ? { ...dim, value: newValue } : dim))
    );
  };

  const currentExample = mockExampleOutputs.find((e) => e.id === activeExample) || mockExampleOutputs[0];

  const getVoiceSummaryTags = (): string[] => {
    const tags: string[] = [];
    dimensions.forEach((dim) => {
      if (dim.value <= 30) tags.push(dim.lowLabel);
      else if (dim.value >= 70) tags.push(dim.highLabel);
    });
    return tags;
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <VoiceActivate size={20} />
          DNA Setup &mdash; Brand Voice
        </h1>
        <p style={{ color: '#525252', maxWidth: '640px' }}>
          Calibrate your brand voice by adjusting tone dimensions, setting language preferences,
          and reviewing AI-generated example outputs that reflect your settings.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Sliders & Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Voice Dimensions */}
          <Tile style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.25rem' }}>Voice Dimensions</h3>
            <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Drag each slider to define where your brand voice sits on each spectrum.
            </p>

            {dimensions.map((dim) => (
              <div key={dim.id} style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#525252',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span>{dim.lowLabel}</span>
                  <span>{dim.highLabel}</span>
                </div>
                <Slider
                  id={`slider-${dim.id}`}
                  labelText={dim.label}
                  min={0}
                  max={100}
                  step={5}
                  value={dim.value}
                  onChange={({ value }: { value: number }) => handleSliderChange(dim.id, value)}
                />
                <p style={{ fontSize: '0.75rem', color: '#6f6f6f', marginTop: '0.25rem' }}>
                  {dim.description}
                </p>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {getVoiceSummaryTags().map((tag) => (
                <Tag key={tag} type="blue" size="sm">
                  {tag}
                </Tag>
              ))}
              {getVoiceSummaryTags().length === 0 && (
                <Tag type="gray" size="sm">Balanced across all dimensions</Tag>
              )}
            </div>
          </Tile>

          {/* Language Preferences */}
          <Tile style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Language size={20} />
              Language &amp; Regional Preferences
            </h3>
            <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Select the primary language variant and add any regionalisms or style notes.
            </p>

            <RadioButtonGroup
              legendText="Primary language variant"
              name="language-variant"
              valueSelected={selectedLanguage}
              onChange={(value: any) => setSelectedLanguage(value)}
              style={{ marginBottom: '1rem' }}
            >
              <RadioButton id="lang-en-us" labelText="English (US)" value="en-us" />
              <RadioButton id="lang-en-gb" labelText="English (UK)" value="en-gb" />
              <RadioButton id="lang-es-mx" labelText="Spanish (Mexico)" value="es-mx" />
              <RadioButton id="lang-es-es" labelText="Spanish (Spain)" value="es-es" />
              <RadioButton id="lang-pt-br" labelText="Portuguese (Brazil)" value="pt-br" />
            </RadioButtonGroup>

            <TextArea
              id="regionalisms-input"
              labelText="Regionalisms & style notes"
              placeholder="Add notes on regional language preferences, idioms to avoid, or spelling conventions..."
              value={regionalisms}
              onChange={(e) => setRegionalisms(e.target.value)}
              rows={5}
            />
          </Tile>
        </div>

        {/* Right Column: Example Output Preview */}
        <div>
          <Tile style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
            <h3 style={{ marginBottom: '0.25rem' }}>Example Output Preview</h3>
            <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1rem' }}>
              See how your voice settings translate into real content. Select a content type to preview.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {mockExampleOutputs.map((ex) => (
                <Tag
                  key={ex.id}
                  type={activeExample === ex.id ? 'blue' : 'gray'}
                  size="md"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveExample(ex.id)}
                >
                  {ex.persona}
                </Tag>
              ))}
            </div>

            <Tile
              style={{
                padding: '1.5rem',
                background: '#f4f4f4',
                minHeight: '160px',
                marginBottom: '1rem',
              }}
            >
              <p style={{ fontSize: '0.75rem', color: '#6f6f6f', marginBottom: '0.5rem' }}>
                {currentExample.persona}
              </p>
              <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>{currentExample.text}</p>
            </Tile>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {dimensions.map((dim) => (
                <Tag key={dim.id} type="outline" size="sm">
                  {dim.label}: {dim.value}%
                </Tag>
              ))}
            </div>
          </Tile>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
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
