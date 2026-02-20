'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Section,
  Heading,
  Tag,
  Toggle,
} from '@carbon/react';
import { Settings } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Integration {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
}

const initialIntegrations: Integration[] = [
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'Publish and manage content directly to your WordPress sites.',
    enabled: true,
    status: 'connected',
    icon: 'WP',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync product catalogs and manage e-commerce content.',
    enabled: true,
    status: 'connected',
    icon: 'SH',
  },
  {
    id: 'instagram',
    name: 'Instagram API',
    description: 'Schedule posts and analyze engagement metrics.',
    enabled: false,
    status: 'disconnected',
    icon: 'IG',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track performance metrics and content attribution.',
    enabled: true,
    status: 'connected',
    icon: 'GA',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Manage email campaigns and audience segmentation.',
    enabled: false,
    status: 'disconnected',
    icon: 'MC',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync contacts, deals, and marketing automation workflows.',
    enabled: true,
    status: 'error',
    icon: 'HS',
  },
];

const statusTagType: Record<string, 'green' | 'cool-gray' | 'red'> = {
  connected: 'green',
  disconnected: 'cool-gray',
  error: 'red',
};

const statusLabel: Record<string, string> = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  error: 'Error',
};

const iconBgColors: Record<string, string> = {
  WP: '#21759B',
  SH: '#96BF48',
  IG: '#E1306C',
  GA: '#F9AB00',
  MC: '#FFE01B',
  HS: '#FF7A59',
};

export default function ClientIntegrationsPage() {
  const { t } = useTranslation();
  const [integrations, setIntegrations] =
    useState<Integration[]>(initialIntegrations);

  const handleToggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) => {
        if (integration.id === id) {
          const newEnabled = !integration.enabled;
          return {
            ...integration,
            enabled: newEnabled,
            status: newEnabled ? 'connected' : 'disconnected',
          };
        }
        return integration;
      })
    );
  };

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>
            {t('Client Integrations')}
          </Heading>
        </Section>
      </Column>

      {integrations.map((integration) => (
        <Column
          key={integration.id}
          lg={5}
          md={4}
          sm={4}
          style={{ marginBottom: '1rem' }}
        >
          <Tile style={{ padding: '1.5rem', height: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: iconBgColors[integration.icon] || '#393939',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  flexShrink: 0,
                }}
              >
                {integration.icon}
              </div>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>{integration.name}</h4>
                <Tag
                  type={statusTagType[integration.status]}
                  size="sm"
                >
                  {t(statusLabel[integration.status])}
                </Tag>
              </div>
            </div>

            <p
              style={{
                fontSize: '0.875rem',
                color: '#525252',
                marginBottom: '1.5rem',
                lineHeight: 1.4,
              }}
            >
              {t(integration.description)}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Toggle
                id={`toggle-${integration.id}`}
                labelText=""
                hideLabel
                size="sm"
                toggled={integration.enabled}
                onToggle={() => handleToggle(integration.id)}
                labelA={t('Off')}
                labelB={t('On')}
              />
              <Button
                kind="ghost"
                size="sm"
                renderIcon={Settings}
              >
                {t('Configure')}
              </Button>
            </div>
          </Tile>
        </Column>
      ))}
    </Grid>
  );
}
