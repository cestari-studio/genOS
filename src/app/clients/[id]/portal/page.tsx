'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Breadcrumb,
  BreadcrumbItem,
  Modal,
  TextArea,
  SkeletonPlaceholder,
} from '@carbon/react';
import {
  Checkmark,
  Close,
  Chat,
  Download,
  Image,
  Document,
  Play,
  View,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface ContentItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document';
  status: 'pending' | 'approved' | 'rejected';
  thumbnail?: string;
  created_at: string;
}

// Mock data - substituir por dados reais
const mockContent: ContentItem[] = [
  { id: '1', title: 'Post Instagram - Janeiro', type: 'image', status: 'pending', created_at: '2025-01-15' },
  { id: '2', title: 'Story Promocional', type: 'image', status: 'approved', created_at: '2025-01-14' },
  { id: '3', title: 'Vídeo Institucional', type: 'video', status: 'pending', created_at: '2025-01-13' },
  { id: '4', title: 'Apresentação Comercial', type: 'document', status: 'rejected', created_at: '2025-01-12' },
];

const statusConfig = {
  pending: { color: 'blue' as const, label: 'Aguardando' },
  approved: { color: 'green' as const, label: 'Aprovado' },
  rejected: { color: 'red' as const, label: 'Rejeitado' },
};

const typeIcons = {
  image: Image,
  video: Play,
  document: Document,
};

export default function ClientPortalPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = (id: string) => {
    setContent(content.map(item =>
      item.id === id ? { ...item, status: 'approved' as const } : item
    ));
  };

  const handleReject = (id: string) => {
    setSelectedItem(content.find(item => item.id === id) || null);
    setFeedbackModal(true);
  };

  const submitRejection = () => {
    if (selectedItem) {
      setContent(content.map(item =>
        item.id === selectedItem.id ? { ...item, status: 'rejected' as const } : item
      ));
    }
    setFeedbackModal(false);
    setFeedback('');
    setSelectedItem(null);
  };

  const pendingCount = content.filter(c => c.status === 'pending').length;
  const approvedCount = content.filter(c => c.status === 'approved').length;

  return (
    <Grid>
      {/* Breadcrumb */}
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="/clients">Clientes</BreadcrumbItem>
          <BreadcrumbItem href={`/clients/${clientId}`}>Cliente</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Portal</BreadcrumbItem>
        </Breadcrumb>
      </Column>

      {/* Header */}
      <Column lg={16} md={8} sm={4}>
        <div className="page-header">
          <h1>Portal do Cliente</h1>
          <p>Área de aprovação de conteúdos e materiais</p>
        </div>
      </Column>

      {/* Stats */}
      <Column lg={16} md={8} sm={4}>
        <Grid narrow style={{ marginBottom: '1rem' }}>
          <Column lg={4} md={2} sm={2}>
            <Tile className="stat-card">
              <span className="stat-label">Aguardando Aprovação</span>
              <div className="stat-value" style={{ color: 'var(--cds-link-primary)' }}>{pendingCount}</div>
            </Tile>
          </Column>
          <Column lg={4} md={2} sm={2}>
            <Tile className="stat-card">
              <span className="stat-label">Aprovados</span>
              <div className="stat-value" style={{ color: 'var(--cds-support-success)' }}>{approvedCount}</div>
            </Tile>
          </Column>
          <Column lg={4} md={2} sm={2}>
            <Tile className="stat-card">
              <span className="stat-label">Total</span>
              <div className="stat-value">{content.length}</div>
            </Tile>
          </Column>
        </Grid>
      </Column>

      {/* Tabs */}
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="Conteúdos">
            <Tab>Todos ({content.length})</Tab>
            <Tab>Pendentes ({pendingCount})</Tab>
            <Tab>Aprovados ({approvedCount})</Tab>
          </TabList>
          <TabPanels>
            {/* Todos */}
            <TabPanel>
              <Grid narrow style={{ marginTop: '1rem' }}>
                {content.map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <Column lg={4} md={4} sm={4} key={item.id}>
                      <Tile style={{ marginBottom: '1rem' }}>
                        {/* Thumbnail */}
                        <div style={{
                          height: '150px',
                          background: 'var(--cds-layer-accent-01)',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem',
                        }}>
                          <Icon size={48} style={{ color: 'var(--cds-text-helper)' }} />
                        </div>

                        {/* Info */}
                        <div style={{ marginBottom: '1rem' }}>
                          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{item.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-helper)' }}>
                            {new Date(item.created_at).toLocaleDateString('pt-BR')}
                          </span>
                          <Tag type={statusConfig[item.status].color} size="sm" style={{ marginLeft: '0.5rem' }}>
                            {statusConfig[item.status].label}
                          </Tag>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button kind="ghost" size="sm" hasIconOnly iconDescription="Visualizar" renderIcon={View} />
                          <Button kind="ghost" size="sm" hasIconOnly iconDescription="Download" renderIcon={Download} />
                          {item.status === 'pending' && (
                            <>
                              <Button kind="primary" size="sm" hasIconOnly iconDescription="Aprovar" renderIcon={Checkmark}
                                onClick={() => handleApprove(item.id)} />
                              <Button kind="danger" size="sm" hasIconOnly iconDescription="Rejeitar" renderIcon={Close}
                                onClick={() => handleReject(item.id)} />
                            </>
                          )}
                        </div>
                      </Tile>
                    </Column>
                  );
                })}
              </Grid>
            </TabPanel>

            {/* Pendentes */}
            <TabPanel>
              <Grid narrow style={{ marginTop: '1rem' }}>
                {content.filter(c => c.status === 'pending').map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <Column lg={4} md={4} sm={4} key={item.id}>
                      <Tile style={{ marginBottom: '1rem', borderLeft: '3px solid var(--cds-link-primary)' }}>
                        <div style={{ height: '150px', background: 'var(--cds-layer-accent-01)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                          <Icon size={48} style={{ color: 'var(--cds-text-helper)' }} />
                        </div>
                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{item.title}</strong>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button kind="primary" size="sm" renderIcon={Checkmark} onClick={() => handleApprove(item.id)}>Aprovar</Button>
                          <Button kind="danger--tertiary" size="sm" renderIcon={Close} onClick={() => handleReject(item.id)}>Rejeitar</Button>
                        </div>
                      </Tile>
                    </Column>
                  );
                })}
              </Grid>
            </TabPanel>

            {/* Aprovados */}
            <TabPanel>
              <Grid narrow style={{ marginTop: '1rem' }}>
                {content.filter(c => c.status === 'approved').map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <Column lg={4} md={4} sm={4} key={item.id}>
                      <Tile style={{ marginBottom: '1rem', borderLeft: '3px solid var(--cds-support-success)' }}>
                        <div style={{ height: '150px', background: 'var(--cds-layer-accent-01)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                          <Icon size={48} style={{ color: 'var(--cds-text-helper)' }} />
                        </div>
                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{item.title}</strong>
                        <Tag type="green" size="sm">Aprovado</Tag>
                      </Tile>
                    </Column>
                  );
                })}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>

      {/* Feedback Modal */}
      <Modal
        open={feedbackModal}
        onRequestClose={() => setFeedbackModal(false)}
        modalHeading="Motivo da Rejeição"
        primaryButtonText="Enviar"
        secondaryButtonText="Cancelar"
        onRequestSubmit={submitRejection}
      >
        <TextArea
          id="feedback"
          labelText="Feedback"
          placeholder="Descreva o motivo da rejeição e sugestões de alteração..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
        />
      </Modal>
    </Grid>
  );
}
