'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  TextArea,
  Modal,
} from '@carbon/react';
import {
  ArrowLeft,
  Download,
  Share,
  Edit,
  TrashCan,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Checkmark,
  Close,
  Chat,
  Send,
} from '@carbon/icons-react';

// TODO: Integrar com react-pdf ou similar para visualização de PDF

interface DocumentData {
  id: string;
  name: string;
  type: 'contract' | 'proposal' | 'invoice' | 'report' | 'other';
  status: 'draft' | 'pending' | 'approved' | 'signed';
  project: string;
  client: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  pages: number;
  size: string;
  comments: {
    id: string;
    author: string;
    text: string;
    date: string;
    page?: number;
  }[];
}

const documentData: DocumentData = {
  id: '1',
  name: 'Proposta Comercial - Website TechCorp',
  type: 'proposal',
  status: 'pending',
  project: 'Website Institucional',
  client: 'TechCorp Brasil',
  createdAt: '2024-02-15',
  updatedAt: '2024-02-18',
  createdBy: 'João Silva',
  pages: 8,
  size: '2.4 MB',
  comments: [
    { id: '1', author: 'Cliente', text: 'Podemos revisar o item 3.2 sobre prazo de entrega?', date: '2024-02-18 10:30', page: 3 },
    { id: '2', author: 'João Silva', text: 'Claro, vou ajustar para 45 dias úteis.', date: '2024-02-18 11:00', page: 3 },
  ],
};

const statusConfig = {
  draft: { label: 'Rascunho', color: 'gray' },
  pending: { label: 'Aguardando Aprovação', color: 'blue' },
  approved: { label: 'Aprovado', color: 'green' },
  signed: { label: 'Assinado', color: 'purple' },
} as const;

const typeLabels = {
  contract: 'Contrato',
  proposal: 'Proposta',
  invoice: 'Fatura',
  report: 'Relatório',
  other: 'Outro',
};

export default function DocumentViewPage() {
  const params = useParams();
  const documentId = params.id as string;

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50));
  const handlePrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));
  const handleNextPage = () => setCurrentPage(Math.min(currentPage + 1, documentData.pages));

  const handleAddComment = () => {
    if (newComment.trim()) {
      // TODO: Salvar comentário no Supabase
      console.log('Novo comentário:', newComment, 'Página:', currentPage);
      setNewComment('');
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/documents">Documentos</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Visualizar</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem' }}>{documentData.name}</h1>
            <Tag type={statusConfig[documentData.status].color as any}>
              {statusConfig[documentData.status].label}
            </Tag>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#525252' }}>
            {typeLabels[documentData.type]} • {documentData.client} • {documentData.pages} páginas
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/documents">
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>Voltar</Button>
          </Link>
          <Button kind="secondary" size="sm" renderIcon={Download}>Download</Button>
          <Button kind="secondary" size="sm" renderIcon={Printer}>Imprimir</Button>
          <Button kind="secondary" size="sm" renderIcon={Share}>Compartilhar</Button>
          {documentData.status === 'pending' && (
            <Button size="sm" renderIcon={Checkmark} onClick={() => setIsApproveModalOpen(true)}>
              Aprovar
            </Button>
          )}
        </div>
      </div>

      <Grid>
        {/* PDF Viewer */}
        <Column lg={showComments ? 12 : 16} md={8} sm={4}>
          <Tile style={{ padding: 0 }}>
            {/* Viewer Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderBottom: '1px solid #e0e0e0',
              background: '#f4f4f4',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Button kind="ghost" size="sm" hasIconOnly iconDescription="Página anterior" renderIcon={ChevronLeft} onClick={handlePrevPage} disabled={currentPage === 1} />
                <span style={{ minWidth: '100px', textAlign: 'center' }}>
                  Página {currentPage} de {documentData.pages}
                </span>
                <Button kind="ghost" size="sm" hasIconOnly iconDescription="Próxima página" renderIcon={ChevronRight} onClick={handleNextPage} disabled={currentPage === documentData.pages} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Button kind="ghost" size="sm" hasIconOnly iconDescription="Diminuir zoom" renderIcon={ZoomOut} onClick={handleZoomOut} />
                <span style={{ minWidth: '60px', textAlign: 'center' }}>{zoom}%</span>
                <Button kind="ghost" size="sm" hasIconOnly iconDescription="Aumentar zoom" renderIcon={ZoomIn} onClick={handleZoomIn} />
                <div style={{ width: '1px', height: '20px', background: '#e0e0e0', margin: '0 0.5rem' }} />
                <Button
                  kind={showComments ? 'secondary' : 'ghost'}
                  size="sm"
                  renderIcon={Chat}
                  onClick={() => setShowComments(!showComments)}
                >
                  Comentários ({documentData.comments.length})
                </Button>
              </div>
            </div>

            {/* Document Preview Area */}
            <div style={{
              height: 'calc(100vh - 300px)',
              minHeight: '500px',
              background: '#525252',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'auto',
            }}>
              {/* Placeholder para o PDF */}
              <div style={{
                width: `${(595 * zoom) / 100}px`,
                height: `${(842 * zoom) / 100}px`,
                background: 'white',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem',
              }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ margin: 0 }}>PROPOSTA COMERCIAL</h2>
                  <p style={{ color: '#525252' }}>{documentData.client}</p>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: '#8d8d8d' }}>
                    <p style={{ fontSize: '1.25rem' }}>Página {currentPage}</p>
                    <p style={{ fontSize: '0.875rem' }}>Pré-visualização do documento</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
                      Integrar react-pdf ou similar<br />para visualização real
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8d8d8d' }}>
                  Página {currentPage} de {documentData.pages}
                </div>
              </div>
            </div>
          </Tile>
        </Column>

        {/* Comments Panel */}
        {showComments && (
          <Column lg={4} md={8} sm={4}>
            <Tile style={{ height: 'calc(100vh - 220px)', minHeight: '570px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '1rem' }}>Comentários</h3>

              {/* Comments List */}
              <div style={{ flex: 1, overflow: 'auto', marginBottom: '1rem' }}>
                {documentData.comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: '0.75rem',
                      background: '#f4f4f4',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.875rem' }}>{comment.author}</strong>
                      {comment.page && (
                        <Tag type="gray" size="sm">Pág. {comment.page}</Tag>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#525252' }}>{comment.text}</p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#8d8d8d' }}>{comment.date}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div>
                <TextArea
                  id="new-comment"
                  labelText="Adicionar comentário"
                  placeholder="Digite seu comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#525252' }}>
                    Na página {currentPage}
                  </span>
                  <Button size="sm" renderIcon={Send} onClick={handleAddComment} disabled={!newComment.trim()}>
                    Enviar
                  </Button>
                </div>
              </div>
            </Tile>
          </Column>
        )}
      </Grid>

      {/* Approve Modal */}
      <Modal
        open={isApproveModalOpen}
        onRequestClose={() => setIsApproveModalOpen(false)}
        modalHeading="Aprovar Documento"
        primaryButtonText="Confirmar Aprovação"
        secondaryButtonText="Cancelar"
        onRequestSubmit={() => {
          // TODO: Aprovar no Supabase
          setIsApproveModalOpen(false);
        }}
      >
        <p>
          Você está prestes a aprovar o documento <strong>{documentData.name}</strong>.
        </p>
        <p style={{ color: '#525252', marginTop: '1rem' }}>
          Após a aprovação, o cliente será notificado e poderá prosseguir com a assinatura.
        </p>
      </Modal>
    </div>
  );
}
