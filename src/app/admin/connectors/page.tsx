'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  Button,
  Modal,
  TextInput,
  Select,
  SelectItem,
  InlineNotification,
  Layer,
} from '@carbon/react';
import { Add, ConnectionSignal, Renew, TrashCan } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Connector {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastTested: string;
  apiKeyMasked: string;
  environment: string;
}

const initialConnectors: Connector[] = [
  {
    id: '1',
    name: 'Claude API',
    provider: 'Anthropic',
    status: 'connected',
    lastTested: '2026-02-19 09:14 UTC',
    apiKeyMasked: 'sk-ant-****...x7Qm',
    environment: 'Production',
  },
  {
    id: '2',
    name: 'Gemini API',
    provider: 'Google',
    status: 'connected',
    lastTested: '2026-02-19 08:45 UTC',
    apiKeyMasked: 'AIza****...dF9k',
    environment: 'Production',
  },
  {
    id: '3',
    name: 'Granite',
    provider: 'IBM',
    status: 'disconnected',
    lastTested: '2026-02-18 22:30 UTC',
    apiKeyMasked: 'ibm-****...pL2n',
    environment: 'Staging',
  },
  {
    id: '4',
    name: 'Stripe',
    provider: 'Stripe',
    status: 'connected',
    lastTested: '2026-02-19 09:00 UTC',
    apiKeyMasked: 'sk_live_****...mN4r',
    environment: 'Production',
  },
  {
    id: '5',
    name: 'Qiskit Runtime',
    provider: 'IBM Quantum',
    status: 'error',
    lastTested: '2026-02-18 16:12 UTC',
    apiKeyMasked: 'qisk-****...hY8w',
    environment: 'Staging',
  },
  {
    id: '6',
    name: 'SendGrid',
    provider: 'Twilio',
    status: 'connected',
    lastTested: '2026-02-19 07:30 UTC',
    apiKeyMasked: 'SG.****...vK3p',
    environment: 'Production',
  },
];

const headers = [
  { key: 'name', header: 'Connector Name' },
  { key: 'provider', header: 'Provider' },
  { key: 'status', header: 'Status' },
  { key: 'apiKeyMasked', header: 'API Key' },
  { key: 'environment', header: 'Environment' },
  { key: 'lastTested', header: 'Last Tested' },
  { key: 'actions', header: 'Actions' },
];

export default function ConnectorsPage() {
  const { t } = useTranslation();
  const [connectors, setConnectors] = useState<Connector[]>(initialConnectors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProvider, setNewProvider] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newName, setNewName] = useState('');
  const [newEnvironment, setNewEnvironment] = useState('production');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean } | null>(null);

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTestResult(null);
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setTestingId(null);
      setTestResult({ id, success });
      if (success) {
        setConnectors((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, status: 'connected' as const, lastTested: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC' } : c
          )
        );
      }
      setTimeout(() => setTestResult(null), 3000);
    }, 1500);
  };

  const handleAddConnector = () => {
    if (!newName || !newProvider || !newApiKey) return;
    const connector: Connector = {
      id: String(connectors.length + 1),
      name: newName,
      provider: newProvider,
      status: 'disconnected',
      lastTested: 'Never',
      apiKeyMasked: newApiKey.slice(0, 4) + '****...' + newApiKey.slice(-4),
      environment: newEnvironment === 'production' ? 'Production' : 'Staging',
    };
    setConnectors((prev) => [...prev, connector]);
    setNewName('');
    setNewProvider('');
    setNewApiKey('');
    setNewEnvironment('production');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setConnectors((prev) => prev.filter((c) => c.id !== id));
  };

  const statusTagType = (status: string) => {
    switch (status) {
      case 'connected':
        return 'green';
      case 'disconnected':
        return 'cool-gray';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const rows = connectors.map((c) => ({
    id: c.id,
    name: c.name,
    provider: c.provider,
    status: c.status,
    apiKeyMasked: c.apiKeyMasked,
    environment: c.environment,
    lastTested: c.lastTested,
    actions: c.id,
  }));

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ConnectionSignal size={24} />
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>API Connectors</h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '2rem' }}>
          Manage external API integrations and monitor their connection status.
        </p>
      </Column>

      {testResult && (
        <Column lg={16} md={8} sm={4} style={{ marginBottom: '1rem' }}>
          <InlineNotification
            kind={testResult.success ? 'success' : 'error'}
            title={testResult.success ? 'Connection Successful' : 'Connection Failed'}
            subtitle={
              testResult.success
                ? `Connector ${connectors.find((c) => c.id === testResult.id)?.name} is responding normally.`
                : `Unable to reach ${connectors.find((c) => c.id === testResult.id)?.name}. Please verify the API key and try again.`
            }
            onCloseButtonClick={() => setTestResult(null)}
          />
        </Column>
      )}

      <Column lg={4} md={2} sm={2} style={{ marginBottom: '1.5rem' }}>
        <Tile>
          <p style={{ fontSize: '0.75rem', color: '#525252' }}>Total Connectors</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{connectors.length}</p>
        </Tile>
      </Column>
      <Column lg={4} md={2} sm={2} style={{ marginBottom: '1.5rem' }}>
        <Tile>
          <p style={{ fontSize: '0.75rem', color: '#525252' }}>Connected</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#198038' }}>
            {connectors.filter((c) => c.status === 'connected').length}
          </p>
        </Tile>
      </Column>
      <Column lg={4} md={2} sm={2} style={{ marginBottom: '1.5rem' }}>
        <Tile>
          <p style={{ fontSize: '0.75rem', color: '#525252' }}>Disconnected</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#525252' }}>
            {connectors.filter((c) => c.status === 'disconnected').length}
          </p>
        </Tile>
      </Column>
      <Column lg={4} md={2} sm={2} style={{ marginBottom: '1.5rem' }}>
        <Tile>
          <p style={{ fontSize: '0.75rem', color: '#525252' }}>Errors</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#da1e28' }}>
            {connectors.filter((c) => c.status === 'error').length}
          </p>
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <DataTable rows={rows} headers={headers} isSortable>
          {({
            rows: tableRows,
            headers: tableHeaders,
            getTableProps,
            getHeaderProps,
            getRowProps,
            onInputChange,
          }: any) => (
            <>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} placeholder="Search connectors..." />
                  <Button
                    kind="primary"
                    renderIcon={Add}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Add Connector
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header: any) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row: any) => {
                    const connector = connectors.find((c) => c.id === row.id);
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell: any) => {
                          if (cell.info.header === 'status') {
                            return (
                              <TableCell key={cell.id}>
                                <Tag type={statusTagType(cell.value)} size="sm">
                                  {cell.value}
                                </Tag>
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'environment') {
                            return (
                              <TableCell key={cell.id}>
                                <Tag type={cell.value === 'Production' ? 'blue' : 'warm-gray'} size="sm">
                                  {cell.value}
                                </Tag>
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'apiKeyMasked') {
                            return (
                              <TableCell key={cell.id}>
                                <code style={{ fontSize: '0.75rem' }}>{cell.value}</code>
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'actions') {
                            return (
                              <TableCell key={cell.id}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <Button
                                    kind="ghost"
                                    size="sm"
                                    renderIcon={Renew}
                                    iconDescription="Test connection"
                                    hasIconOnly
                                    onClick={() => handleTestConnection(row.id)}
                                    disabled={testingId === row.id}
                                  />
                                  <Button
                                    kind="danger--ghost"
                                    size="sm"
                                    renderIcon={TrashCan}
                                    iconDescription="Delete connector"
                                    hasIconOnly
                                    onClick={() => handleDelete(row.id)}
                                  />
                                </div>
                              </TableCell>
                            );
                          }
                          return <TableCell key={cell.id}>{cell.value}</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </DataTable>
      </Column>

      <Modal
        open={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={handleAddConnector}
        modalHeading="Add New Connector"
        primaryButtonText="Add Connector"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={!newName || !newProvider || !newApiKey}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem 0' }}>
          <TextInput
            id="new-connector-name"
            labelText="Connector Name"
            placeholder="e.g. OpenAI API"
            value={newName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
          />
          <Layer>
            <Select
              id="new-connector-provider"
              labelText="Provider"
              value={newProvider}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewProvider(e.target.value)}
            >
              <SelectItem value="" text="Select a provider" />
              <SelectItem value="Anthropic" text="Anthropic (Claude)" />
              <SelectItem value="Google" text="Google (Gemini)" />
              <SelectItem value="IBM" text="IBM (Granite)" />
              <SelectItem value="OpenAI" text="OpenAI (GPT)" />
              <SelectItem value="Stripe" text="Stripe" />
              <SelectItem value="Twilio" text="Twilio (SendGrid)" />
              <SelectItem value="IBM Quantum" text="IBM Quantum (Qiskit)" />
              <SelectItem value="AWS" text="AWS (Bedrock)" />
              <SelectItem value="Custom" text="Custom / Other" />
            </Select>
          </Layer>
          <TextInput
            id="new-connector-key"
            labelText="API Key"
            placeholder="Enter your API key"
            type="password"
            value={newApiKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewApiKey(e.target.value)}
            helperText="Your API key will be encrypted and stored securely."
          />
          <Layer>
            <Select
              id="new-connector-env"
              labelText="Environment"
              value={newEnvironment}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewEnvironment(e.target.value)}
            >
              <SelectItem value="production" text="Production" />
              <SelectItem value="staging" text="Staging" />
            </Select>
          </Layer>
        </div>
      </Modal>
    </Grid>
  );
}
