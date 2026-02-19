'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Grid,
  Column,
  Tile,
  Button,
  ProgressIndicator,
  ProgressStep,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  InlineNotification,
  Tag,
} from '@carbon/react';
import { ArrowLeft, ArrowRight, Checkmark, Add, Email } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import PricingTable from '@/components/billing/PricingTable';

interface FormData {
  // Step 0 - Welcome
  orgName: string;
  industry: string;
  teamSize: string;
  // Step 1 - Brand
  brandName: string;
  brandColor: string;
  brandDescription: string;
  // Step 2 - Team
  emails: string[];
  // Step 3 - First Client
  clientName: string;
  clientEmail: string;
  clientCompany: string;
}

const initialFormData: FormData = {
  orgName: '',
  industry: '',
  teamSize: '',
  brandName: '',
  brandColor: '#000000',
  brandDescription: '',
  emails: ['', '', ''],
  clientName: '',
  clientEmail: '',
  clientCompany: '',
};

export default function OnboardingContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEmail = (index: number, value: string) => {
    setFormData((prev) => {
      const emails = [...prev.emails];
      emails[index] = value;
      return { ...prev, emails };
    });
  };

  const addEmailField = () => {
    setFormData((prev) => ({ ...prev, emails: [...prev.emails, ''] }));
  };

  const handleNext = async () => {
    setError(null);
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: currentStep, data: formData }),
      });
    } catch {
      // Non-blocking - continue even if save fails
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await fetch('/api/onboarding', { method: 'PUT' });
      router.push('/dashboard');
    } catch {
      setError('Failed to complete setup. Please try again.');
      setIsSubmitting(false);
    }
  };

  const steps = [
    t('onboarding.step0'),
    t('onboarding.step1'),
    t('onboarding.step2'),
    t('onboarding.step3'),
    t('onboarding.step4'),
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--cds-background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 1rem',
      }}
    >
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '960px', marginBottom: '2rem' }}>
        <h1 className="page-header" style={{ marginBottom: '0.5rem' }}>
          {t('onboarding.title')}
        </h1>
      </div>

      {/* Progress Indicator */}
      <div style={{ width: '100%', maxWidth: '960px', marginBottom: '2rem' }}>
        <ProgressIndicator currentIndex={currentStep} spaceEqually>
          {steps.map((label, index) => (
            <ProgressStep key={index} label={label} />
          ))}
        </ProgressIndicator>
      </div>

      {/* Step Content */}
      <div style={{ width: '100%', maxWidth: '960px' }}>
        <Tile style={{ padding: '2rem' }}>
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <Grid>
              <Column lg={16} md={8} sm={4}>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('onboarding.step0')}</h2>
              </Column>
              <Column lg={8} md={8} sm={4}>
                <TextInput
                  id="orgName"
                  labelText={t('onboarding.orgName')}
                  value={formData.orgName}
                  onChange={(e) => updateField('orgName', e.target.value)}
                  style={{ marginBottom: '1rem' }}
                />
              </Column>
              <Column lg={8} md={8} sm={4}>
                <Select
                  id="industry"
                  labelText={t('onboarding.industry')}
                  value={formData.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  style={{ marginBottom: '1rem' }}
                >
                  <SelectItem value="" text={t('common.select')} />
                  <SelectItem value="technology" text={t('onboarding.industryTech')} />
                  <SelectItem value="marketing" text={t('onboarding.industryMarketing')} />
                  <SelectItem value="finance" text={t('onboarding.industryFinance')} />
                  <SelectItem value="healthcare" text={t('onboarding.industryHealthcare')} />
                  <SelectItem value="education" text={t('onboarding.industryEducation')} />
                  <SelectItem value="other" text={t('onboarding.industryOther')} />
                </Select>
              </Column>
              <Column lg={8} md={8} sm={4}>
                <Select
                  id="teamSize"
                  labelText={t('onboarding.teamSize')}
                  value={formData.teamSize}
                  onChange={(e) => updateField('teamSize', e.target.value)}
                >
                  <SelectItem value="" text={t('common.select')} />
                  <SelectItem value="1-5" text="1–5" />
                  <SelectItem value="6-20" text="6–20" />
                  <SelectItem value="21-50" text="21–50" />
                  <SelectItem value="50+" text="50+" />
                </Select>
              </Column>
            </Grid>
          )}

          {/* Step 1: Brand Setup */}
          {currentStep === 1 && (
            <Grid>
              <Column lg={16} md={8} sm={4}>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('onboarding.step1')}</h2>
              </Column>
              <Column lg={8} md={8} sm={4}>
                <TextInput
                  id="brandName"
                  labelText={t('onboarding.brandName')}
                  value={formData.brandName}
                  onChange={(e) => updateField('brandName', e.target.value)}
                  style={{ marginBottom: '1rem' }}
                />
              </Column>
              <Column lg={8} md={8} sm={4}>
                <TextInput
                  id="brandColor"
                  labelText={t('onboarding.brandColor')}
                  value={formData.brandColor}
                  onChange={(e) => updateField('brandColor', e.target.value)}
                  placeholder="#000000"
                  style={{ marginBottom: '1rem' }}
                />
              </Column>
              <Column lg={16} md={8} sm={4}>
                <TextArea
                  id="brandDescription"
                  labelText={t('onboarding.brandDescription')}
                  value={formData.brandDescription}
                  onChange={(e) => updateField('brandDescription', e.target.value)}
                  rows={4}
                />
              </Column>
            </Grid>
          )}

          {/* Step 2: Team */}
          {currentStep === 2 && (
            <Grid>
              <Column lg={16} md={8} sm={4}>
                <h2 style={{ marginBottom: '1.5rem' }}>{t('onboarding.step2')}</h2>
              </Column>
              <Column lg={16} md={8} sm={4}>
                <p style={{ marginBottom: '1rem', color: 'var(--cds-text-secondary)' }}>
                  {t('onboarding.inviteEmails')}
                </p>
              </Column>
              {formData.emails.map((email, index) => (
                <Column key={index} lg={8} md={8} sm={4}>
                  <TextInput
                    id={`email-${index}`}
                    labelText={`${t('onboarding.emailPlaceholder').replace('colega@', `${index + 1}. `)}`}
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder={t('onboarding.emailPlaceholder')}
                    type="email"
                    style={{ marginBottom: '1rem' }}
                  />
                </Column>
              ))}
              <Column lg={16} md={8} sm={4}>
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={Add}
                  onClick={addEmailField}
                >
                  {t('onboarding.addAnother')}
                </Button>
              </Column>
            </Grid>
          )}

          {/* Step 3: First Client (optional) */}
          {currentStep === 3 && (
            <Grid>
              <Column lg={16} md={8} sm={4}>
                <h2 style={{ marginBottom: '0.5rem' }}>{t('onboarding.step3')}</h2>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Tag type="warm-gray">{t('common.optional')}</Tag>
                </div>
              </Column>
              <Column lg={16} md={8} sm={4}>
                <InlineNotification
                  kind="info"
                  title={t('onboarding.optionalStep')}
                  lowContrast
                  style={{ marginBottom: '1.5rem' }}
                />
              </Column>
              <Column lg={8} md={8} sm={4}>
                <TextInput
                  id="clientName"
                  labelText={t('onboarding.clientName')}
                  value={formData.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  style={{ marginBottom: '1rem' }}
                />
              </Column>
              <Column lg={8} md={8} sm={4}>
                <TextInput
                  id="clientEmail"
                  labelText={t('onboarding.clientEmail')}
                  value={formData.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  type="email"
                  style={{ marginBottom: '1rem' }}
                />
              </Column>
              <Column lg={8} md={8} sm={4}>
                <TextInput
                  id="clientCompany"
                  labelText={t('onboarding.clientCompany')}
                  value={formData.clientCompany}
                  onChange={(e) => updateField('clientCompany', e.target.value)}
                />
              </Column>
            </Grid>
          )}

          {/* Step 4: Choose Plan */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ marginBottom: '1.5rem' }}>{t('onboarding.step4')}</h2>
              <PricingTable />
            </div>
          )}

          {/* Error notification */}
          {error && (
            <div style={{ marginTop: '1rem' }}>
              <InlineNotification
                kind="error"
                title="Error"
                subtitle={error}
                lowContrast
              />
            </div>
          )}
        </Tile>

        {/* Navigation buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1.5rem',
          }}
        >
          <Button
            kind="secondary"
            renderIcon={ArrowLeft}
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            {t('common.back')}
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button
              kind="primary"
              renderIcon={ArrowRight}
              onClick={handleNext}
            >
              {t('common.next')}
            </Button>
          ) : (
            <Button
              kind="primary"
              renderIcon={Checkmark}
              onClick={handleComplete}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('onboarding.completeSetup')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
