'use client';

import { useState } from 'react';
import {
  Tile,
  ProgressIndicator,
  ProgressStep,
  Button,
  TextArea,
  InlineLoading,
  Tag,
} from '@carbon/react';
import { AiGenerate, Document } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface ScopeSuggestion {
  id: string;
  text: string;
  accepted: boolean;
}

interface ScopeSection {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  suggestions: ScopeSuggestion[];
}

const mockScopeSections: ScopeSection[] = [
  {
    key: 'objectives',
    label: 'Brand Objectives',
    description: 'Define the primary goals and outcomes for this brand.',
    placeholder: 'e.g. Increase brand awareness by 30% in Q2...',
    suggestions: [
      { id: 'obj-1', text: 'Establish thought leadership in the AI-driven marketing space within 6 months', accepted: false },
      { id: 'obj-2', text: 'Achieve 50% increase in organic traffic through content-led growth strategy', accepted: false },
      { id: 'obj-3', text: 'Build a community of 10,000 engaged professionals on LinkedIn by year-end', accepted: false },
    ],
  },
  {
    key: 'audience',
    label: 'Target Audience',
    description: 'Identify the primary and secondary audience segments.',
    placeholder: 'e.g. Marketing directors at mid-size SaaS companies...',
    suggestions: [
      { id: 'aud-1', text: 'CMOs and VP Marketing at B2B SaaS companies (Series B+, 100-500 employees)', accepted: false },
      { id: 'aud-2', text: 'Content marketing managers seeking AI-powered automation tools', accepted: false },
      { id: 'aud-3', text: 'Digital transformation leads at enterprise organizations (1000+ employees)', accepted: false },
    ],
  },
  {
    key: 'channels',
    label: 'Distribution Channels',
    description: 'Select and prioritize the channels for content distribution.',
    placeholder: 'e.g. Blog, LinkedIn, email newsletter...',
    suggestions: [
      { id: 'ch-1', text: 'Company blog with SEO-optimized long-form articles (2x per week)', accepted: false },
      { id: 'ch-2', text: 'LinkedIn organic posts and sponsored content (daily)', accepted: false },
      { id: 'ch-3', text: 'Monthly email newsletter with curated insights and case studies', accepted: false },
      { id: 'ch-4', text: 'YouTube thought leadership series with industry expert interviews (biweekly)', accepted: false },
    ],
  },
  {
    key: 'kpis',
    label: 'Key Performance Indicators',
    description: 'Define measurable KPIs to track progress and success.',
    placeholder: 'e.g. Monthly organic sessions, conversion rate...',
    suggestions: [
      { id: 'kpi-1', text: 'Content engagement rate > 4.5% across all channels', accepted: false },
      { id: 'kpi-2', text: 'Marketing qualified leads (MQLs) from content: 200/month by Q3', accepted: false },
      { id: 'kpi-3', text: 'Brand mention volume increase of 60% quarter-over-quarter', accepted: false },
      { id: 'kpi-4', text: 'Email subscriber growth rate of 15% month-over-month', accepted: false },
    ],
  },
];

export default function AiScopeGeneratorPage() {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);
  const [sections, setSections] = useState<ScopeSection[]>(mockScopeSections);
  const [sectionInputs, setSectionInputs] = useState<Record<string, string>>({
    objectives: '',
    audience: '',
    channels: '',
    kpis: '',
  });
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setSectionInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateSuggestions = (sectionKey: string) => {
    setGeneratingFor(sectionKey);
    setTimeout(() => {
      setGeneratingFor(null);
    }, 2000);
  };

  const handleToggleSuggestion = (sectionKey: string, suggestionId: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.key !== sectionKey) return section;
        return {
          ...section,
          suggestions: section.suggestions.map((s) =>
            s.id === suggestionId ? { ...s, accepted: !s.accepted } : s
          ),
        };
      })
    );
  };

  const handleNext = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const activeSection = sections[currentStep];
  const acceptedCount = sections.reduce(
    (acc, section) => acc + section.suggestions.filter((s) => s.accepted).length,
    0
  );

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <AiGenerate size={20} />
          AI Scope Generator
        </h1>
        <p style={{ color: '#525252', maxWidth: '640px' }}>
          Define your brand scope with AI-powered suggestions. Walk through each section, provide
          context, and let the AI generate tailored recommendations for your strategy.
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <ProgressIndicator currentIndex={currentStep} spaceEqually>
          {sections.map((section) => (
            <ProgressStep key={section.key} label={section.label} />
          ))}
        </ProgressIndicator>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left: Input Panel */}
        <Tile style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.25rem' }}>{activeSection.label}</h3>
          <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {activeSection.description}
          </p>

          <TextArea
            id={`scope-input-${activeSection.key}`}
            labelText="Your input"
            placeholder={activeSection.placeholder}
            value={sectionInputs[activeSection.key]}
            onChange={(e) => handleInputChange(activeSection.key, e.target.value)}
            rows={6}
            style={{ marginBottom: '1rem' }}
          />

          <Button
            kind="tertiary"
            size="md"
            renderIcon={AiGenerate}
            onClick={() => handleGenerateSuggestions(activeSection.key)}
            disabled={generatingFor !== null}
          >
            Generate AI Suggestions
          </Button>

          {generatingFor === activeSection.key && (
            <div style={{ marginTop: '1rem' }}>
              <InlineLoading description="Generating suggestions..." />
            </div>
          )}
        </Tile>

        {/* Right: Suggestions Panel */}
        <Tile style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Document size={20} />
            AI Suggestions
          </h3>
          <p style={{ color: '#525252', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Click a suggestion to accept or reject it. Accepted items will be included in your final scope.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeSection.suggestions.map((suggestion) => (
              <Tile
                key={suggestion.id}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: suggestion.accepted ? '2px solid #0f62fe' : '1px solid #e0e0e0',
                  background: suggestion.accepted ? '#edf5ff' : '#ffffff',
                }}
                onClick={() => handleToggleSuggestion(activeSection.key, suggestion.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: '0.875rem', flex: 1 }}>{suggestion.text}</p>
                  {suggestion.accepted && (
                    <Tag type="blue" size="sm" style={{ marginLeft: '0.5rem', flexShrink: 0 }}>
                      Accepted
                    </Tag>
                  )}
                </div>
              </Tile>
            ))}
          </div>
        </Tile>
      </div>

      {/* Footer Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '2rem',
        }}
      >
        <Tag type="gray" size="md">
          {acceptedCount} suggestions accepted
        </Tag>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button kind="secondary" size="md" onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>
          {currentStep < sections.length - 1 ? (
            <Button kind="primary" size="md" onClick={handleNext}>
              Next Section
            </Button>
          ) : (
            <Button kind="primary" size="md">
              Finalize Scope
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
