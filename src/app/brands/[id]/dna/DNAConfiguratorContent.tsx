'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Grid,
  Column,
  Tile,
  Button,
  ProgressIndicator,
  ProgressStep,
  Slider,
  Tag,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Breadcrumb,
  BreadcrumbItem,
  InlineNotification,
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Save, Checkmark } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';

interface FormData {
  // Step 0 – Brand Voice
  tone: number;
  personality: string;
  traits: string[];

  // Step 1 – Visual Identity
  primaryColor: string;
  secondaryColor: string;
  primaryFont: string;
  secondaryFont: string;

  // Step 2 – Target Audience
  ageRange: string;
  gender: string;
  psychographics: string;
  interests: string;

  // Step 3 – Content Pillars
  themes: string;
  forbiddenWords: string;
  hashtags: string;
}

const AVAILABLE_TRAITS = [
  'Professional',
  'Friendly',
  'Bold',
  'Innovative',
  'Traditional',
  'Playful',
];

const initialFormData: FormData = {
  tone: 50,
  personality: '',
  traits: [],
  primaryColor: '#0f62fe',
  secondaryColor: '#161616',
  primaryFont: 'IBM Plex Sans',
  secondaryFont: 'IBM Plex Mono',
  ageRange: '25-44',
  gender: 'all',
  psychographics: '',
  interests: '',
  themes: '',
  forbiddenWords: '',
  hashtags: '',
};

export default function DNAConfiguratorContent() {
  const { t } = useTranslation();
  const params = useParams();
  const brandId = params?.id as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saved, setSaved] = useState(false);

  const steps = [
    t('dna.step0Title'),
    t('dna.step1Title'),
    t('dna.step2Title'),
    t('dna.step3Title'),
    t('dna.step4Title'),
  ];

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTrait = (trait: string) => {
    setFormData((prev) => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter((t) => t !== trait)
        : [...prev.traits, trait],
    }));
  };

  const handleSave = () => {
    // TODO: persist to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const canGoNext = currentStep < steps.length - 1;
  const canGoBack = currentStep > 0;

  // ── Step renderers ──────────────────────────────────────────────────────────

  const renderStep0 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem' }}>{t('dna.tone')}</h3>
        <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0 0 1rem' }}>
          {t('dna.toneFormal')} ← → {t('dna.toneCasual')}
        </p>
        <Slider
          id="tone-slider"
          labelText={t('dna.tone')}
          hideTextInput
          min={0}
          max={100}
          step={1}
          value={formData.tone}
          onChange={({ value }) => updateField('tone', value)}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--cds-text-secondary)',
            marginTop: '0.5rem',
          }}
        >
          <span>{t('dna.toneFormal')}</span>
          <span style={{ fontWeight: 600, color: 'var(--cds-text-primary)' }}>
            {formData.tone}
          </span>
          <span>{t('dna.toneCasual')}</span>
        </div>
      </div>

      <div>
        <TextArea
          id="personality"
          labelText={t('dna.personality')}
          placeholder="Describe how this brand communicates and what makes its voice unique..."
          rows={4}
          value={formData.personality}
          onChange={(e) => updateField('personality', e.target.value)}
        />
      </div>

      <div>
        <label
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: '1.333',
            letterSpacing: '0.32px',
            color: 'var(--cds-text-secondary)',
            marginBottom: '0.5rem',
          }}
        >
          {t('dna.traits')}
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {AVAILABLE_TRAITS.map((trait) => {
            const isSelected = formData.traits.includes(trait);
            return (
              <Tag
                key={trait}
                type={isSelected ? 'blue' : 'gray'}
                size="md"
                onClick={() => toggleTrait(trait)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                {isSelected && (
                  <Checkmark size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                )}
                {trait}
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Grid fullWidth>
      <Column lg={8} md={4} sm={4}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <TextInput
              id="primary-color"
              labelText={t('dna.primaryColor')}
              placeholder="#0f62fe"
              value={formData.primaryColor}
              onChange={(e) => updateField('primaryColor', e.target.value)}
            />
            {formData.primaryColor && (
              <div
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  height: '32px',
                  borderRadius: '4px',
                  background: formData.primaryColor,
                  border: '1px solid var(--cds-border-subtle-01)',
                }}
              />
            )}
          </div>
          <div>
            <TextInput
              id="secondary-color"
              labelText={t('dna.secondaryColor')}
              placeholder="#161616"
              value={formData.secondaryColor}
              onChange={(e) => updateField('secondaryColor', e.target.value)}
            />
            {formData.secondaryColor && (
              <div
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  height: '32px',
                  borderRadius: '4px',
                  background: formData.secondaryColor,
                  border: '1px solid var(--cds-border-subtle-01)',
                }}
              />
            )}
          </div>
        </div>
      </Column>
      <Column lg={8} md={4} sm={4}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <TextInput
            id="primary-font"
            labelText={t('dna.primaryFont')}
            placeholder="IBM Plex Sans"
            value={formData.primaryFont}
            onChange={(e) => updateField('primaryFont', e.target.value)}
          />
          <TextInput
            id="secondary-font"
            labelText={t('dna.secondaryFont')}
            placeholder="IBM Plex Mono"
            value={formData.secondaryFont}
            onChange={(e) => updateField('secondaryFont', e.target.value)}
          />
          {(formData.primaryFont || formData.secondaryFont) && (
            <Tile style={{ padding: '1rem' }}>
              <p
                style={{
                  fontFamily: formData.primaryFont || 'inherit',
                  fontSize: '1.25rem',
                  margin: '0 0 0.5rem',
                }}
              >
                {formData.primaryFont || 'Primary Font'}
              </p>
              <p
                style={{
                  fontFamily: formData.secondaryFont || 'inherit',
                  fontSize: '0.875rem',
                  color: 'var(--cds-text-secondary)',
                  margin: 0,
                }}
              >
                {formData.secondaryFont || 'Secondary Font'}
              </p>
            </Tile>
          )}
        </div>
      </Column>
    </Grid>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Grid fullWidth>
        <Column lg={8} md={4} sm={4}>
          <TextInput
            id="age-range"
            labelText={t('dna.ageRange')}
            placeholder="25-44"
            value={formData.ageRange}
            onChange={(e) => updateField('ageRange', e.target.value)}
          />
        </Column>
        <Column lg={8} md={4} sm={4}>
          <Select
            id="gender"
            labelText={t('dna.gender')}
            value={formData.gender}
            onChange={(e) => updateField('gender', e.target.value)}
          >
            <SelectItem value="all" text={t('dna.genderAll')} />
            <SelectItem value="male" text={t('dna.genderMale')} />
            <SelectItem value="female" text={t('dna.genderFemale')} />
          </Select>
        </Column>
      </Grid>
      <TextArea
        id="psychographics"
        labelText={t('dna.psychographics')}
        placeholder="Describe values, attitudes, lifestyle, and motivations of your target audience..."
        rows={4}
        value={formData.psychographics}
        onChange={(e) => updateField('psychographics', e.target.value)}
      />
      <TextInput
        id="interests"
        labelText={t('dna.interests')}
        placeholder="technology, design, startups, sustainability, coffee..."
        value={formData.interests}
        onChange={(e) => updateField('interests', e.target.value)}
        helperText="Separate with commas"
      />
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <TextArea
        id="themes"
        labelText={t('dna.themes')}
        placeholder={`Innovation\nSustainability\nDigital transformation\nCustomer success`}
        rows={5}
        value={formData.themes}
        onChange={(e) => updateField('themes', e.target.value)}
        helperText="Enter one theme per line"
      />
      <TextInput
        id="forbidden-words"
        labelText={t('dna.forbiddenWords')}
        placeholder="cheap, problem, failure, ..."
        value={formData.forbiddenWords}
        onChange={(e) => updateField('forbiddenWords', e.target.value)}
        helperText="Separate with commas"
      />
      <TextArea
        id="hashtags"
        labelText={t('dna.hashtags')}
        placeholder={`#innovation\n#digitalfuture\n#brandname`}
        rows={4}
        value={formData.hashtags}
        onChange={(e) => updateField('hashtags', e.target.value)}
        helperText="Enter one hashtag per line"
      />
    </div>
  );

  const renderStep4 = () => {
    const summaryRows: { label: string; value: string | undefined }[] = [
      { label: t('dna.tone'), value: `${formData.tone} — ${formData.tone < 40 ? t('dna.toneFormal') : formData.tone > 60 ? t('dna.toneCasual') : 'Balanced'}` },
      { label: t('dna.traits'), value: formData.traits.length > 0 ? formData.traits.join(', ') : '—' },
      { label: t('dna.personality'), value: formData.personality || '—' },
      { label: t('dna.primaryColor'), value: formData.primaryColor || '—' },
      { label: t('dna.secondaryColor'), value: formData.secondaryColor || '—' },
      { label: t('dna.primaryFont'), value: formData.primaryFont || '—' },
      { label: t('dna.secondaryFont'), value: formData.secondaryFont || '—' },
      { label: t('dna.ageRange'), value: formData.ageRange || '—' },
      { label: t('dna.gender'), value: formData.gender === 'all' ? t('dna.genderAll') : formData.gender === 'male' ? t('dna.genderMale') : t('dna.genderFemale') },
      { label: t('dna.psychographics'), value: formData.psychographics || '—' },
      { label: t('dna.interests'), value: formData.interests || '—' },
      { label: t('dna.themes'), value: formData.themes || '—' },
      { label: t('dna.forbiddenWords'), value: formData.forbiddenWords || '—' },
      { label: t('dna.hashtags'), value: formData.hashtags || '—' },
    ];

    return (
      <div>
        <h3 style={{ marginBottom: '1rem' }}>{t('dna.reviewSummary')}</h3>
        <Tile style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {summaryRows.map(({ label, value }, idx) => (
                <tr
                  key={label}
                  style={{
                    borderBottom:
                      idx < summaryRows.length - 1
                        ? '1px solid var(--cds-border-subtle-01)'
                        : 'none',
                  }}
                >
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      fontWeight: 600,
                      width: '35%',
                      verticalAlign: 'top',
                      color: 'var(--cds-text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tile>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
          }}
        >
          <Button renderIcon={Save} size="lg" onClick={handleSave}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    );
  };

  const stepContent = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">{t('sidebar.dashboard')}</BreadcrumbItem>
        <BreadcrumbItem href="/brands">{t('brands.title')}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('dna.title')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{t('dna.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
            Brand ID: {brandId}
          </p>
        </div>
        <Link href="/brands" style={{ textDecoration: 'none' }}>
          <Button kind="ghost" size="sm" renderIcon={ArrowLeft}>
            {t('common.back')}
          </Button>
        </Link>
      </div>

      {/* Save success notification */}
      {saved && (
        <InlineNotification
          kind="success"
          title={t('dna.saveSuccess')}
          subtitle=""
          hideCloseButton
          style={{ marginBottom: '1.5rem' }}
        />
      )}

      {/* Progress Indicator */}
      <div style={{ marginBottom: '2.5rem', overflowX: 'auto' }}>
        <ProgressIndicator currentIndex={currentStep} spaceEqually>
          {steps.map((label, idx) => (
            <ProgressStep
              key={idx}
              label={label}
              complete={idx < currentStep}
              current={idx === currentStep}
            />
          ))}
        </ProgressIndicator>
      </div>

      {/* Step content */}
      <Tile style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>{steps[currentStep]}</h2>
        {stepContent[currentStep]()}
      </Tile>

      {/* Navigation buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          kind="secondary"
          renderIcon={ArrowLeft}
          disabled={!canGoBack}
          onClick={() => setCurrentStep((s) => s - 1)}
        >
          {t('common.back')}
        </Button>

        <span style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
          {currentStep + 1} / {steps.length}
        </span>

        {canGoNext ? (
          <Button
            renderIcon={ArrowRight}
            onClick={() => setCurrentStep((s) => s + 1)}
          >
            {t('common.next')}
          </Button>
        ) : (
          <Button renderIcon={Save} onClick={handleSave}>
            {t('common.save')}
          </Button>
        )}
      </div>
    </div>
  );
}
