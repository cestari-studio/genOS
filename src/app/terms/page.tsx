'use client';

import { Tile } from '@carbon/react';
import { useTranslation } from '@/lib/i18n/context';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>Terms of Service</h1>
        <p>Last updated: February 2026</p>
      </div>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          By accessing or using genOS (&quot;the Platform&quot;), operated by Cestari Studio, you agree to be bound by
          these Terms of Service. If you are using the Platform on behalf of an organization, you represent
          that you have the authority to bind that organization to these terms. If you do not agree, you may
          not use the Platform.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>2. Service Description</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          genOS is an AI-powered content operations platform that provides content creation, scheduling,
          analytics, GEO intelligence, social media management, and financial operations tools. The Platform
          uses multiple AI models including Anthropic Claude, Google Gemini, and IBM Granite for content
          generation and optimization. Features are subject to your subscription plan.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>3. User Obligations</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          You are responsible for maintaining the security of your account credentials. You agree not to use
          the Platform for generating harmful, illegal, or misleading content. You must comply with all
          applicable laws and the terms of service of connected third-party platforms (Instagram, LinkedIn, etc.).
          Automated scraping or abuse of AI generation endpoints is prohibited.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>4. Payment Terms</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          Subscription fees are billed monthly or annually as selected. Payments are processed through Stripe.
          Token usage beyond your plan allocation is billed at the per-token rate for your plan tier.
          Refunds are available within 14 days of initial subscription. Downgrades take effect at the next
          billing cycle. Failed payments may result in service suspension after a 7-day grace period.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>5. Intellectual Property</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          Content you create using the Platform belongs to you. Cestari Studio retains ownership of the
          Platform, its technology, and branding. AI-generated content is provided &quot;as-is&quot; and you are
          responsible for reviewing and approving all generated content before publication. The genOS name,
          Helian, and associated logos are trademarks of Cestari Studio.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>6. Limitation of Liability</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          The Platform is provided &quot;as is&quot; without warranties of any kind. Cestari Studio shall not be liable
          for indirect, incidental, or consequential damages arising from your use of the Platform. Our total
          liability is limited to the amount you paid in the 12 months preceding the claim. AI-generated
          content may contain errors; you are responsible for final review and approval.
        </p>
      </Tile>

      <Tile style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>7. Termination</h2>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--cds-text-secondary)' }}>
          Either party may terminate this agreement at any time. Upon termination, you may export your data
          within 30 days. After this period, your data will be permanently deleted. Cestari Studio reserves
          the right to suspend or terminate accounts that violate these terms or engage in abusive behavior.
        </p>
      </Tile>
    </div>
  );
}
