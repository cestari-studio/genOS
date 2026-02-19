'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Search,
  Select,
  SelectItem,
  Modal,
  TextArea,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import {
  Checkmark,
  Close,
  View,
  Chat,
  Document,
  Image,
  Video,
  Time,
  Filter,
} from '@carbon/icons-react';

// TODO: Integrar com Supabase para dados reais

interface ApprovalItem {
  id: string;
  title: string;
  type: 'content' | 'design' | 'document' | 'video';
  project: string;
  client: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  preview?: string;
  comments: number;
}

const approvalItems: ApprovalItem[] = [
  { id: '1', title: 'Post Instagram - Lançamento', type: 'content', project: 'Social Media TechCorp', client: 'TechCorp', submittedBy: 'João Silva', submittedAt: '2024-02-19 09:30', status: 'pending', priority: 'high', comments: 2 },
  { id: '2', title: 'Banner Homepage', type: 'design', project: 'Website Institucional', client: 'Startup XYZ', submittedBy: 'Maria Santos', submittedAt: '2024-02-18 15:45', status: 'pending', priority: 'urgent', comments: 5 },
  { id: '3', title: 'Vídeo Institucional v2', type: 'video', project: 'Vídeo Marketing', client: 'TechCorp', submittedBy: 'Carlos Oliveira', submittedAt: '2024-02-18 11:00', status: 'revision', priority: 'normal', comments: 3 },
  { id: '4', title: 'Proposta Comercial', type: 'document', project: 'Novo Cliente ABC', client: 'Empresa ABC', submittedBy: 'João Silva', submittedAt: '2024-02-17 16:30', status: 'approved', priority: 'normal', comments: 1 },
  { id: '5', title: 'Stories - Campanha Verão', type: 'content', project: 'Social Media TechCorp', client: 'TechCorp', submittedBy: 'Maria Santos', submittedAt: '2024-02-17 10:00', status: 'approved', priority: 'low', comments: 0 },
  { id: '6', title: 'Logo Redesign - Opção A', type: 'design', project: 'Rebranding', client: 'Startup XYZ', submittedBy: 'João Silva', submittedAt: '2024-02-16 14:00', status: 'rejected', priority: 'high', comments: 8 },
];

const typeIcons = {
  content: Document,
  design: Image,
  document: Document,
  video: Video,
};

const typeColors = {
  content: 'blue',
  design: 'purple',
  document: 'gray',
  video: 'magenta',
} as const;

const statusConfig = {
  pending: { label: 'Pendente', color: 'gray' },
  approved: { label: 'Aprovado', color: 'green' },
  rejected: { label: 'Rejeitado', color: 'red' },
  revision: { label: 'Revisão', color: 'purple' },
} as const;

const priorityConfig = {
  low: { label: 'Baixa', color: 'gray' },
  normal: { label: 'Normal', color: 'blue' },
  high: { label: 'Alta', color: 'orange' },
  urgent: { label: 'Urgente', color: 'red' },
} as const;

export default function ApprovalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const pendingItems = approvalItems.filter(item => item.status === 'pending');
  const inRevisionItems = approvalItems.filter(item => item.status === 'revision');
  const completedItems = approvalItems.filter(item => item.status === 'approved' || item.status === 'rejected');

  const handleApprove = (item: ApprovalItem) => {
    // TODO: Atualizar status no Supabase
    console.log('Aprovado:', item.id);
  };

  const handleReject = () => {
    if (selectedItem) {
      // TODO: Atualizar status no Supabase com motivo
      console.log('Rejeitado:', selectedItem.id, rejectReason);
      setIsRejectModalOpen(false);
      setSelectedItem(null);
      setRejectReason('');
    }
  };

  const renderApprovalCard = (item: ApprovalItem) => {
    const TypeIcon = typeIcons[item.type];

    return (
      <Tile key={item.id} style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Preview/Icon */}
          <div style={{
            width: '100px',
            height: '100px',
            background: 'var(--cds-background)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TypeIcon size={32} style={{ color: 'var(--cds-text-secondary)' }} />
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                  {item.project} • {item.client}
                </p>
              </div>
              <Tag type={priorityConfig[item.priority].color as any} size="sm">
                {priorityConfig[item.priority].label}
              </Tag>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <Tag type={typeColors[item.type]} size="sm">{item.type}</Tag>
              <Tag type={statusConfig[item.status].color as any} size="sm">
                {statusConfig[item.status].label}
              </Tag>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                <span>Por {item.submittedBy} • {item.submittedAt}</span>
                {item.comments > 0 && (
                  <span style={{ marginLeft: '1rem' }}>
                    <Chat size={12} style={{ marginRight: '0.25rem' }} />
                    {item.comments} comentários
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/approvals/${item.id}`}>
                  <Button kind="ghost" size="sm" renderIcon={View}>Ver</Button>
                </Link>
                {item.status === 'pending' && (
                  <>
                    <Button
                      kind="danger--ghost"
                      size="sm"
                      renderIcon={Close}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsRejectModalOpen(true);
                      }}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      kind="primary"
                      size="sm"
                      renderIcon={Checkmark}
                      onClick={() => handleApprove(item)}
                    >
                      Aprovar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Tile>
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Aprovações</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Central de Aprovações</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
            {pendingItems.length} itens pendentes de aprovação
          </p>
        </div>
      </div>

      {/* Filters */}
      <Tile style={{ marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Search
              size="sm"
              placeholder="Buscar aprovações..."
              labelText="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select id="filter-type" size="sm" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text="Todos os tipos" />
            <SelectItem value="content" text="Conteúdo" />
            <SelectItem value="design" text="Design" />
            <SelectItem value="document" text="Documento" />
            <SelectItem value="video" text="Vídeo" />
          </Select>
          <Select id="filter-client" size="sm" style={{ minWidth: '150px' }}>
            <SelectItem value="all" text="Todos os clientes" />
            <SelectItem value="techcorp" text="TechCorp" />
            <SelectItem value="startup" text="Startup XYZ" />
            <SelectItem value="empresa" text="Empresa ABC" />
          </Select>
        </div>
      </Tile>

      {/* Tabs */}
      <Tabs>
        <TabList aria-label="Status de aprovação">
          <Tab>
            Pendentes
            <Tag type="gray" size="sm" style={{ marginLeft: '0.5rem' }}>{pendingItems.length}</Tag>
          </Tab>
          <Tab>
            Em Revisão
            <Tag type="purple" size="sm" style={{ marginLeft: '0.5rem' }}>{inRevisionItems.length}</Tag>
          </Tab>
          <Tab>
            Histórico
            <Tag type="gray" size="sm" style={{ marginLeft: '0.5rem' }}>{completedItems.length}</Tag>
          </Tab>
        </TabList>
        <TabPanels>
          {/* Pendentes */}
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              {pendingItems.length === 0 ? (
                <Tile style={{ textAlign: 'center', padding: '3rem' }}>
                  <Checkmark size={48} style={{ color: 'var(--cds-support-success)', marginBottom: '1rem' }} />
                  <h3>Tudo em dia!</h3>
                  <p style={{ color: 'var(--cds-text-secondary)' }}>Não há itens pendentes de aprovação.</p>
                </Tile>
              ) : (
                pendingItems.map(renderApprovalCard)
              )}
            </div>
          </TabPanel>

          {/* Em Revisão */}
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              {inRevisionItems.length === 0 ? (
                <Tile style={{ textAlign: 'center', padding: '3rem' }}>
                  <Time size={48} style={{ color: 'var(--cds-text-helper)', marginBottom: '1rem' }} />
                  <h3>Nenhum item em revisão</h3>
                  <p style={{ color: 'var(--cds-text-secondary)' }}>Itens solicitados para revisão aparecerão aqui.</p>
                </Tile>
              ) : (
                inRevisionItems.map(renderApprovalCard)
              )}
            </div>
          </TabPanel>

          {/* Histórico */}
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              {completedItems.map(renderApprovalCard)}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Reject Modal */}
      <Modal
        open={isRejectModalOpen}
        onRequestClose={() => {
          setIsRejectModalOpen(false);
          setSelectedItem(null);
          setRejectReason('');
        }}
        modalHeading="Rejeitar Item"
        primaryButtonText="Confirmar Rejeição"
        secondaryButtonText="Cancelar"
        danger
        onRequestSubmit={handleReject}
      >
        <p style={{ marginBottom: '1rem' }}>
          Você está rejeitando: <strong>{selectedItem?.title}</strong>
        </p>
        <TextArea
          id="reject-reason"
          labelText="Motivo da rejeição"
          placeholder="Descreva o que precisa ser alterado..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  );
}
