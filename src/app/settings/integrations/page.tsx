'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Search,
  Modal,
  TextInput,
  Breadcrumb,
  BreadcrumbItem,
  InlineNotification,
  Toggle,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import {
  Connect,
  Checkmark,
  Close,
  Settings,
  Launch,
  LogoInstagram,
  LogoLinkedin,
  LogoFacebook,
  LogoTwitter,
  LogoSlack,
  Api,
  Cloud,
  Email,
  Calendar,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

// TODO: Integrar com APIs reais

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'social' | 'storage' | 'communication' | 'calendar' | 'other';
  status: 'connected' | 'disconnected' | 'error';
  icon: typeof LogoInstagram;
  connectedAt?: string;
  lastSync?: string;
}

const integrations: Integration[] = [
  { id: '1', name: 'Instagram', description: 'Publicação e gerenciamento de posts', category: 'social', status: 'connected', icon: LogoInstagram, connectedAt: '2024-01-15', lastSync: '2024-02-19 10:00' },
  { id: '2', name: 'LinkedIn', description: 'Publicação em perfil e company page', category: 'social', status: 'connected', icon: LogoLinkedin, connectedAt: '2024-01-15', lastSync: '2024-02-19 10:00' },
  { id: '3', name: 'Facebook', description: 'Publicação em páginas', category: 'social', status: 'disconnected', icon: LogoFacebook },
  { id: '4', name: 'X (Twitter)', description: 'Publicação de tweets', category: 'social', status: 'disconnected', icon: LogoTwitter },
  { id: '5', name: 'Google Drive', description: 'Sincronização de arquivos', category: 'storage', status: 'connected', icon: Cloud, connectedAt: '2024-01-20', lastSync: '2024-02-19 09:30' },
  { id: '6', name: 'Slack', description: 'Notificações e alertas', category: 'communication', status: 'connected', icon: LogoSlack, connectedAt: '2024-02-01', lastSync: '2024-02-19 10:15' },
  { id: '7', name: 'Google Calendar', description: 'Sincronização de eventos', category: 'calendar', status: 'disconnected', icon: Calendar },
  { id: '8', name: 'Zapier', description: 'Automações personalizadas', category: 'other', status: 'disconnected', icon: Api },
];

const webhooks = [
  { id: '1', name: 'Novo Cliente', url: 'https://hooks.example.com/client', events: ['client.created'], active: true },
  { id: '2', name: 'Projeto Concluído', url: 'https://hooks.example.com/project', events: ['project.completed'], active: true },
  { id: '3', name: 'Fatura Paga', url: 'https://hooks.example.com/invoice', events: ['invoice.paid'], active: false },
];

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);

  const categoryLabels = {
    social: t('integrations.categorySocial'),
    storage: t('integrations.categoryStorage'),
    communication: t('integrations.categoryCommunication'),
    calendar: t('integrations.categoryCalendar'),
    other: t('integrations.categoryOther'),
  };

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConnectModalOpen(true);
  };

  const handleConnectConfirm = () => {
    setIsConnectModalOpen(false);
    setConnectionSuccess(true);
    setTimeout(() => setConnectionSuccess(false), 3000);
  };

  const renderIntegrationCard = (integration: Integration) => {
    const IconComponent = integration.icon;
    const isConnected = integration.status === 'connected';

    return (
      <Column key={integration.id} lg={4} md={4} sm={4}>
        <Tile style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: 'var(--cds-background)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <IconComponent size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0 }}>{integration.name}</h4>
                <Tag
                  type={isConnected ? 'green' : 'gray'}
                  size="sm"
                >
                  {isConnected ? t('integrations.connected') : t('integrations.disconnected')}
                </Tag>
              </div>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                {integration.description}
              </p>
            </div>
          </div>

          {isConnected && (
            <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
              {t('integrations.lastSync')} {integration.lastSync}
            </div>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
            {isConnected ? (
              <>
                <Button kind="secondary" size="sm" renderIcon={Settings}>{t('integrations.configure')}</Button>
                <Button kind="danger--ghost" size="sm" renderIcon={Close}>{t('integrations.disconnect')}</Button>
              </>
            ) : (
              <Button kind="primary" size="sm" renderIcon={Connect} onClick={() => handleConnect(integration)}>
                {t('integrations.connect')}
              </Button>
            )}
          </div>
        </Tile>
      </Column>
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/settings">{t('settings.title')}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('integrations.title')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{t('integrations.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
            {t('integrations.activeCount', { active: connectedCount, total: integrations.length })}
          </p>
        </div>
      </div>

      {connectionSuccess && (
        <InlineNotification
          kind="success"
          title={t('integrations.connectionSuccess')}
          subtitle={t('integrations.connectionSuccessSubtitle')}
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Tabs>
        <TabList aria-label={t('integrations.title')}>
          <Tab>{t('integrations.apps')}</Tab>
          <Tab>{t('integrations.webhooks')}</Tab>
          <Tab>{t('integrations.api')}</Tab>
        </TabList>
        <TabPanels>
          {/* Aplicativos */}
          <TabPanel>
            {/* Search */}
            <div style={{ marginTop: '1rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
              <Search
                size="sm"
                placeholder={t('integrations.searchPlaceholder')}
                labelText="Buscar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categorias */}
            {Object.entries(categoryLabels).map(([category, label]) => {
              const categoryIntegrations = filteredIntegrations.filter(i => i.category === category);
              if (categoryIntegrations.length === 0) return null;

              return (
                <div key={category} style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>{label}</h3>
                  <Grid>
                    {categoryIntegrations.map(renderIntegrationCard)}
                  </Grid>
                </div>
              );
            })}
          </TabPanel>

          {/* Webhooks */}
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ margin: 0, color: 'var(--cds-text-secondary)' }}>
                  {t('integrations.webhookDescription')}
                </p>
                <Button size="sm" renderIcon={Api} onClick={() => setIsWebhookModalOpen(true)}>
                  {t('integrations.newWebhook')}
                </Button>
              </div>

              {webhooks.map(webhook => (
                <Tile key={webhook.id} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>{webhook.name}</strong>
                        <Tag type={webhook.active ? 'green' : 'gray'} size="sm">
                          {webhook.active ? t('integrations.active') : t('integrations.inactive')}
                        </Tag>
                      </div>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                        {webhook.url}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {webhook.events.map(event => (
                          <Tag key={event} type="blue" size="sm">{event}</Tag>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Toggle
                        id={`webhook-toggle-${webhook.id}`}
                        size="sm"
                        labelText=""
                        hideLabel
                        toggled={webhook.active}
                      />
                      <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('common.edit')} renderIcon={Settings} />
                      <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('integrations.test')} renderIcon={Launch} />
                    </div>
                  </div>
                </Tile>
              ))}
            </div>
          </TabPanel>

          {/* API */}
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              <Grid>
                <Column lg={8} md={8} sm={4}>
                  <Tile>
                    <h3 style={{ marginBottom: '1rem' }}>{t('integrations.apiKeys')}</h3>
                    <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                      {t('integrations.apiKeysDescription')}
                    </p>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>{t('integrations.publicKey')}</label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <TextInput
                          id="public-key"
                          labelText={t('integrations.publicKey')}
                          hideLabel
                          value="pk_live_xxxxxxxxxxxxxxxxxxxxx"
                          readOnly
                          style={{ fontFamily: 'monospace' }}
                        />
                        <Button kind="secondary" size="sm">{t('integrations.copy')}</Button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>{t('integrations.secretKey')}</label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <TextInput
                          id="secret-key"
                          labelText={t('integrations.secretKey')}
                          hideLabel
                          type="password"
                          value="sk_live_xxxxxxxxxxxxxxxxxxxxx"
                          readOnly
                          style={{ fontFamily: 'monospace' }}
                        />
                        <Button kind="secondary" size="sm">{t('integrations.reveal')}</Button>
                        <Button kind="secondary" size="sm">{t('integrations.copy')}</Button>
                      </div>
                    </div>

                    <Button kind="danger--ghost" size="sm">{t('integrations.regenerateKeys')}</Button>
                  </Tile>
                </Column>
                <Column lg={8} md={8} sm={4}>
                  <Tile>
                    <h3 style={{ marginBottom: '1rem' }}>{t('integrations.documentation')}</h3>
                    <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                      {t('integrations.documentationDescription')}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Button kind="tertiary" size="sm" renderIcon={Launch}>
                        {t('integrations.apiDocs')}
                      </Button>
                      <Button kind="tertiary" size="sm" renderIcon={Launch}>
                        {t('integrations.quickStart')}
                      </Button>
                      <Button kind="tertiary" size="sm" renderIcon={Launch}>
                        {t('integrations.codeExamples')}
                      </Button>
                    </div>
                  </Tile>
                </Column>
              </Grid>

              <Tile style={{ marginTop: '1rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>{t('integrations.availableEndpoints')}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('integrations.method')}</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('integrations.endpoint')}</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>{t('integrations.description')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                      <td style={{ padding: '0.75rem' }}><Tag type="green" size="sm">GET</Tag></td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>/api/v1/clients</td>
                      <td style={{ padding: '0.75rem', color: 'var(--cds-text-secondary)' }}>{t('integrations.endpointListClients')}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                      <td style={{ padding: '0.75rem' }}><Tag type="blue" size="sm">POST</Tag></td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>/api/v1/clients</td>
                      <td style={{ padding: '0.75rem', color: 'var(--cds-text-secondary)' }}>{t('integrations.endpointCreateClient')}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                      <td style={{ padding: '0.75rem' }}><Tag type="green" size="sm">GET</Tag></td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>/api/v1/projects</td>
                      <td style={{ padding: '0.75rem', color: 'var(--cds-text-secondary)' }}>{t('integrations.endpointListProjects')}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                      <td style={{ padding: '0.75rem' }}><Tag type="green" size="sm">GET</Tag></td>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>/api/v1/invoices</td>
                      <td style={{ padding: '0.75rem', color: 'var(--cds-text-secondary)' }}>{t('integrations.endpointListInvoices')}</td>
                    </tr>
                  </tbody>
                </table>
              </Tile>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Connect Modal */}
      <Modal
        open={isConnectModalOpen}
        onRequestClose={() => {
          setIsConnectModalOpen(false);
          setSelectedIntegration(null);
        }}
        modalHeading={t('integrations.connect') + ' ' + (selectedIntegration?.name ?? '')}
        primaryButtonText={t('integrations.connect')}
        secondaryButtonText={t('common.cancel')}
        onRequestSubmit={handleConnectConfirm}
      >
        {selectedIntegration && (
          <div>
            <p style={{ marginBottom: '1rem' }}>
              {t('integrations.connectDescription', { name: selectedIntegration.name })}
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--cds-text-secondary)' }}>
              <li>{t('integrations.connectPermAccount')}</li>
              <li>{t('integrations.connectPermPublish')}</li>
              <li>{t('integrations.connectPermMetrics')}</li>
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('integrations.revokeAccess')}
            </p>
          </div>
        )}
      </Modal>

      {/* Webhook Modal */}
      <Modal
        open={isWebhookModalOpen}
        onRequestClose={() => setIsWebhookModalOpen(false)}
        modalHeading={t('integrations.newWebhook')}
        primaryButtonText={t('integrations.create')}
        secondaryButtonText={t('common.cancel')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            id="webhook-name"
            labelText={t('integrations.webhookName')}
            placeholder={t('integrations.webhookNamePlaceholder')}
          />
          <TextInput
            id="webhook-url"
            labelText={t('integrations.webhookUrl')}
            placeholder={t('integrations.webhookUrlPlaceholder')}
          />
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
              {t('integrations.events')}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Toggle id="event-client" labelText="client.created" size="sm" />
              <Toggle id="event-project" labelText="project.completed" size="sm" />
              <Toggle id="event-invoice" labelText="invoice.paid" size="sm" />
              <Toggle id="event-content" labelText="content.published" size="sm" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
