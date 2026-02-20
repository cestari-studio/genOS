'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  Checkbox,
  InlineNotification,
  Tag,
} from '@carbon/react';
import { Document, Checkmark, Close } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const planDetails = [
  { feature: 'Plan Name', value: 'genOS Professional' },
  { feature: 'Billing Cycle', value: 'Monthly' },
  { feature: 'Base Price', value: '$299/month' },
  { feature: 'Included Users', value: '25 seats' },
  { feature: 'Token Limit', value: '5,000,000 tokens/month' },
  { feature: 'API Rate Limit', value: '1,000 requests/minute' },
  { feature: 'Storage', value: '100 GB included' },
  { feature: 'Support Level', value: 'Priority (24h SLA)' },
  { feature: 'Data Retention', value: '12 months' },
  { feature: 'SSO / SAML', value: 'Included' },
];

const selectedAddons = [
  { name: 'GEO Intelligence', price: '$79/month' },
  { name: 'Cloud Monitor', price: '$39/month' },
];

const contractTerms = `
GENOS PLATFORM SERVICE AGREEMENT

Effective Date: February 19, 2026
Contract ID: GOS-2026-00847

1. SCOPE OF SERVICE
This agreement ("Agreement") is entered into between the Client ("Tenant") and genOS Platform Inc. ("Provider") for the provision of the genOS multi-tenant SaaS platform services as described herein.

2. SERVICE DESCRIPTION
The Provider agrees to deliver access to the genOS Professional plan, including all base features, selected addons, and support services as outlined in the plan details section of this contract.

3. PAYMENT TERMS
- Billing occurs on the 1st of each calendar month.
- Payment is due within 15 days of invoice date.
- Late payments incur a 1.5% monthly interest charge.
- All prices are in USD and exclusive of applicable taxes.

4. TOKEN USAGE & OVERAGES
- Monthly token allocation: 5,000,000 tokens.
- Overage rate: $0.004 per additional token.
- Usage resets on the 1st of each month at 00:00 UTC.
- Unused tokens do not roll over to subsequent months.

5. DATA PRIVACY & COMPLIANCE
- All data processing complies with LGPD and GDPR regulations.
- Tenant data is stored in the region specified during onboarding.
- Provider implements SOC 2 Type II certified security controls.
- Data encryption at rest (AES-256) and in transit (TLS 1.3).

6. TERMINATION
- Either party may terminate with 30 days written notice.
- Early termination fee: remaining contract value at 50% rate.
- Upon termination, data export is available for 30 days.
- Minimum contract period: 3 months.

7. SERVICE LEVEL AGREEMENT
- Platform uptime guarantee: 99.9%.
- Scheduled maintenance windows: Sundays 02:00-06:00 UTC.
- Credit for downtime exceeding SLA: 5% per hour (max 30%).

8. LIMITATION OF LIABILITY
Provider liability is limited to the total fees paid by Tenant in the 12 months preceding any claim. Provider is not liable for indirect, consequential, or punitive damages.
`.trim();

export default function ContractPage() {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);
  const [termsRead, setTermsRead] = useState(false);
  const [showDeclined, setShowDeclined] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setTermsRead(true);
    }
  };

  const totalMonthly =
    299 + selectedAddons.reduce((sum, a) => sum + parseInt(a.price.replace(/[^0-9]/g, ''), 10), 0);

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Document size={24} />
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Contract Preview</h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '2rem' }}>
          Please review the service agreement and plan details before proceeding.
        </p>
      </Column>

      {showDeclined && (
        <Column lg={16} md={8} sm={4} style={{ marginBottom: '1rem' }}>
          <InlineNotification
            kind="warning"
            title="Contract Declined"
            subtitle="You have declined the contract. You can go back to modify your selections or contact support for custom terms."
            onCloseButtonClick={() => setShowDeclined(false)}
          />
        </Column>
      )}

      <Column lg={10} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Service Agreement</h2>
            <Tag type="blue" size="sm">Contract ID: GOS-2026-00847</Tag>
          </div>
          <div
            onScroll={handleScroll}
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '1rem',
              backgroundColor: '#f4f4f4',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              border: '1px solid #e0e0e0',
            }}
          >
            {contractTerms}
          </div>
          {!termsRead && (
            <p style={{ fontSize: '0.75rem', color: '#525252', marginTop: '0.5rem', fontStyle: 'italic' }}>
              Scroll to the bottom to enable acceptance.
            </p>
          )}
        </Tile>
      </Column>

      <Column lg={6} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Plan Details</h2>
          <StructuredListWrapper isCondensed>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Feature</StructuredListCell>
                <StructuredListCell head>Included</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {planDetails.map((item) => (
                <StructuredListRow key={item.feature}>
                  <StructuredListCell>{item.feature}</StructuredListCell>
                  <StructuredListCell style={{ fontWeight: 500 }}>{item.value}</StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </Tile>

        <Tile style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Selected Addons</h3>
          {selectedAddons.map((addon) => (
            <div
              key={addon.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <span style={{ fontSize: '0.875rem' }}>{addon.name}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{addon.price}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.75rem 0 0',
              marginTop: '0.5rem',
            }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total Monthly</span>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>${totalMonthly}/month</span>
          </div>
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1.5rem' }}>
          <Checkbox
            id="accept-terms"
            labelText="I have read and agree to the genOS Platform Service Agreement, including the payment terms, data privacy provisions, and service level agreement."
            checked={accepted}
            onChange={(_: React.ChangeEvent<HTMLInputElement>, { checked }: { checked: boolean }) =>
              setAccepted(checked)
            }
            disabled={!termsRead}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button kind="secondary" renderIcon={Close}>
              Back to Plan Selection
            </Button>
            <Button
              kind="danger--tertiary"
              renderIcon={Close}
              onClick={() => setShowDeclined(true)}
            >
              Decline
            </Button>
            <Button
              kind="primary"
              renderIcon={Checkmark}
              disabled={!accepted}
            >
              Accept & Continue to Payment
            </Button>
          </div>
        </div>
      </Column>
    </Grid>
  );
}
