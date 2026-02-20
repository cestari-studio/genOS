'use client';

import { Tile } from '@carbon/react';
import { useTranslation } from '@/lib/i18n/context';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: February 2026</p>
      </div>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>1. Data Collection</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          Cestari Studio collects information you provide when creating an account, configuring brands, and
          using the genOS platform. This includes your name, email address, organization details, content data,
          and usage analytics. We also collect technical data such as IP addresses, browser information, and
          device identifiers to improve our services.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>2. How We Use Your Data</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          Your data is used to provide and improve genOS services, including AI content generation, GEO
          intelligence analytics, and personalized recommendations. We use aggregated, anonymized data for
          platform improvements and benchmarking. AI-generated content is processed through our multi-model
          orchestration system (Claude, Gemini, Granite) and may be temporarily stored for quality assurance.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>3. Third-Party Services</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          genOS integrates with third-party services including Supabase (database), Stripe (payments),
          Anthropic Claude API, Google Gemini API, IBM Granite and Qiskit Runtime. Each third-party service
          has its own privacy policy. We share only the minimum data necessary for service operation.
          Social media platform integrations (Instagram, LinkedIn, etc.) require your explicit authorization.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>4. Cookies & Tracking</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          We use essential cookies for authentication and session management. Analytics cookies help us
          understand platform usage patterns. You can manage cookie preferences through your browser settings.
          We do not sell your data to advertisers or use tracking for targeted advertising purposes.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>5. Your Rights</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          Under LGPD (Brazil) and GDPR (EU), you have the right to access, correct, delete, or export your
          personal data. You may request data portability or restriction of processing. To exercise these
          rights, contact our Data Protection Officer at privacy@cestari.studio. We will respond within 15
          business days.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>6. Contact</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          For privacy-related inquiries, contact us at privacy@cestari.studio or write to:<br />
          Cestari Studio — Data Protection Office<br />
          São Paulo, SP — Brazil
        </p>
      </Tile>
    </div>
  );
}
