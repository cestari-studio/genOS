'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  TextInput,
  Button,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  InlineNotification,
  Select,
  SelectItem,
  Layer,
} from '@carbon/react';
import { Purchase, Locked, ArrowRight } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const orderSummary = [
  { item: 'genOS Professional Plan', quantity: '1', price: '$299.00' },
  { item: 'GEO Intelligence Addon', quantity: '1', price: '$79.00' },
  { item: 'Cloud Monitor Addon', quantity: '1', price: '$39.00' },
  { item: 'Additional User Seats (5)', quantity: '5', price: '$50.00' },
];

export default function PaymentPage() {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [processing, setProcessing] = useState(false);

  const subtotal = 467.0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 && cardName && expiry.length === 5 && cvv.length >= 3;

  const handleSubmit = () => {
    setProcessing(true);
    setTimeout(() => setProcessing(false), 2000);
  };

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Purchase size={24} />
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Payment Setup</h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '2rem' }}>
          Enter your payment details to complete your genOS subscription setup.
        </p>
      </Column>

      <Column lg={16} md={8} sm={4} style={{ marginBottom: '1rem' }}>
        <InlineNotification
          kind="info"
          title="Secure Payment"
          subtitle="All payment data is encrypted with TLS 1.3 and processed via Stripe. We never store your full card number on our servers."
          lowContrast
          hideCloseButton
        />
      </Column>

      <Column lg={9} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Card Information
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <TextInput
              id="card-name"
              labelText="Cardholder Name"
              placeholder="e.g. Maria Oliveira"
              value={cardName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardName(e.target.value)}
            />

            <TextInput
              id="card-number"
              labelText="Card Number"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCardNumber(formatCardNumber(e.target.value))
              }
              maxLength={19}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <TextInput
                  id="card-expiry"
                  labelText="Expiry Date"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setExpiry(formatExpiry(e.target.value))
                  }
                  maxLength={5}
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextInput
                  id="card-cvv"
                  labelText="CVV"
                  placeholder="123"
                  value={cvv}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>

            <Layer>
              <Select
                id="billing-country"
                labelText="Billing Country"
                value={billingCountry}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBillingCountry(e.target.value)}
              >
                <SelectItem value="" text="Select a country" />
                <SelectItem value="br" text="Brazil" />
                <SelectItem value="us" text="United States" />
                <SelectItem value="pt" text="Portugal" />
                <SelectItem value="de" text="Germany" />
                <SelectItem value="gb" text="United Kingdom" />
                <SelectItem value="jp" text="Japan" />
              </Select>
            </Layer>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
              color: '#525252',
              fontSize: '0.75rem',
            }}
          >
            <Locked size={16} />
            <span>Your payment information is securely encrypted</span>
          </div>
        </Tile>
      </Column>

      <Column lg={7} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
            Order Summary
          </h2>

          <StructuredListWrapper isCondensed>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Item</StructuredListCell>
                <StructuredListCell head>Qty</StructuredListCell>
                <StructuredListCell head>Price</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {orderSummary.map((item) => (
                <StructuredListRow key={item.item}>
                  <StructuredListCell>{item.item}</StructuredListCell>
                  <StructuredListCell>{item.quantity}</StructuredListCell>
                  <StructuredListCell>{item.price}</StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListBody>
          </StructuredListWrapper>

          <div style={{ borderTop: '1px solid #e0e0e0', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>Subtotal</span>
              <span style={{ fontSize: '0.875rem' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>Tax (8%)</span>
              <span style={{ fontSize: '0.875rem' }}>${tax.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '2px solid #161616',
              }}
            >
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Total / month</span>
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </Tile>

        <InlineNotification
          kind="info"
          title="Billing Cycle"
          subtitle="Your first charge will occur today. Subsequent charges on the 1st of each month."
          lowContrast
          hideCloseButton
        />
      </Column>

      <Column lg={16} md={8} sm={4}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            borderTop: '1px solid #e0e0e0',
            paddingTop: '1.5rem',
          }}
        >
          <Button kind="secondary">Back to Contract</Button>
          <Button
            kind="primary"
            renderIcon={ArrowRight}
            disabled={!isFormValid || processing}
            onClick={handleSubmit}
          >
            {processing ? 'Processing...' : `Complete Setup - $${total.toFixed(2)}/mo`}
          </Button>
        </div>
      </Column>
    </Grid>
  );
}
