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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  InlineNotification,
} from '@carbon/react';
import {
  Edit,
  ArrowLeft,
  DocumentPdf,
  Share,
  Checkmark,
  Close,
  Download,
  Copy,
  Send,
} from '@carbon/icons-react';

// TODO: Integrar com Supabase para dados reais

interface BriefingData {
  id: string;
  title: string;
  project: string;
  client: string;
  status: 'draft' | 'sent' | 'approved' | 'revision';
  createdAt: string;
  updatedAt: string;
  sections: {
    overview: {
      objective: string;
      targetAudience: string;
      competitors: string[];
      references: string[];
    };
    brand: {
      tone: string[];
      colors: string;
      fonts: string;
      guidelines: string;
    };
    deliverables: {
      name: string;
      description: string;
      quantity: number;
    }[];
    timeline: {
      startDate: string;
      deadline: string;
      milestones: { name: string; date: string }[];
    };
    budget: {
      total: number;
      breakdown: { item: string; value: number }[];
    };
  };
  comments: {
    id: string;
    author: string;
    text: string;
    date: string;
  }[];
}

const briefingData: BriefingData = {
  id: '1',
  title: 'Briefing - Website Institucional',
  project: 'Website TechCorp',
  client: 'TechCorp Brasil',
  status: 'approved',
  createdAt: '2024-01-10',
  updatedAt: '2024-01-15',
  sections: {
    overview: {
      objective: 'Desenvolver um website institucional moderno e responsivo que transmita profissionalismo e inovação, destacando os serviços e diferenciais da empresa.',
      targetAudience: 'Empresas B2B do setor de tecnologia, gerentes de TI, CTOs e decisores de médias e grandes empresas.',
      competitors: ['CompetitorA.com', 'CompetitorB.com.br', 'CompetitorC.io'],
      references: ['apple.com', 'stripe.com', 'linear.app'],
    },
    brand: {
      tone: ['Profissional', 'Inovador', 'Confiável', 'Técnico'],
      colors: 'Azul principal (#0066CC), cinza escuro, branco',
      fonts: 'Sans-serif moderna (sugestão: Inter ou IBM Plex Sans)',
      guidelines: 'Manter consistência com material existente, usar espaçamento generoso, imagens de alta qualidade.',
    },
    deliverables: [
      { name: 'Homepage', description: 'Página inicial com hero, serviços e depoimentos', quantity: 1 },
      { name: 'Páginas Institucionais', description: 'Sobre, Equipe, Contato', quantity: 3 },
      { name: 'Páginas de Serviços', description: 'Uma página para cada serviço principal', quantity: 5 },
      { name: 'Blog', description: 'Listagem e template de artigos', quantity: 2 },
      { name: 'Landing Pages', description: 'Páginas de conversão para campanhas', quantity: 3 },
    ],
    timeline: {
      startDate: '2024-01-15',
      deadline: '2024-03-15',
      milestones: [
        { name: 'Aprovação de Wireframes', date: '2024-01-25' },
        { name: 'Aprovação de Design', date: '2024-02-10' },
        { name: 'Versão Beta', date: '2024-03-01' },
        { name: 'Entrega Final', date: '2024-03-15' },
      ],
    },
    budget: {
      total: 25000,
      breakdown: [
        { item: 'Design UI/UX', value: 8000 },
        { item: 'Desenvolvimento Front-end', value: 10000 },
        { item: 'Integração CMS', value: 4000 },
        { item: 'Testes e Deploy', value: 3000 },
      ],
    },
  },
  comments: [
    { id: '1', author: 'Cliente', text: 'Aprovado! Podem seguir com o desenvolvimento.', date: '2024-01-15 14:30' },
    { id: '2', author: 'Equipe', text: 'Perfeito, iniciando os wireframes.', date: '2024-01-15 15:00' },
  ],
};

const statusConfig = {
  draft: { label: 'Rascunho', color: 'gray' },
  sent: { label: 'Enviado', color: 'blue' },
  approved: { label: 'Aprovado', color: 'green' },
  revision: { label: 'Em Revisão', color: 'purple' },
} as const;

export default function BriefingDetailPage() {
  const params = useParams();
  const briefingId = params.id as string;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/briefings">Briefings</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{briefingData.title}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ margin: 0 }}>{briefingData.title}</h1>
            <Tag type={statusConfig[briefingData.status].color as any}>
              {statusConfig[briefingData.status].label}
            </Tag>
          </div>
          <p style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>
            {briefingData.client} • Atualizado em {new Date(briefingData.updatedAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/briefings">
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>Voltar</Button>
          </Link>
          <Link href={`/briefings/${briefingId}/edit`}>
            <Button kind="secondary" size="sm" renderIcon={Edit}>Editar</Button>
          </Link>
          <Button kind="secondary" size="sm" renderIcon={DocumentPdf}>Exportar PDF</Button>
          <Button size="sm" renderIcon={Send}>Enviar ao Cliente</Button>
        </div>
      </div>

      {copied && (
        <InlineNotification
          kind="success"
          title="Link copiado!"
          subtitle="O link do briefing foi copiado para a área de transferência."
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Grid fullWidth>
        <Column lg={12} md={8} sm={4}>
          <Tabs>
            <TabList aria-label="Seções do Briefing">
              <Tab>Visão Geral</Tab>
              <Tab>Marca</Tab>
              <Tab>Entregas</Tab>
              <Tab>Cronograma</Tab>
              <Tab>Orçamento</Tab>
            </TabList>
            <TabPanels>
              {/* Visão Geral */}
              <TabPanel>
                <Tile style={{ marginTop: '1rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Objetivo</h3>
                  <p style={{ color: 'var(--cds-text-secondary)', lineHeight: 1.6 }}>{briefingData.sections.overview.objective}</p>
                </Tile>
                <Tile style={{ marginTop: '1rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Público-Alvo</h3>
                  <p style={{ color: 'var(--cds-text-secondary)', lineHeight: 1.6 }}>{briefingData.sections.overview.targetAudience}</p>
                </Tile>
                <Grid fullWidth style={{ marginTop: '1rem' }}>
                  <Column lg={6} md={4} sm={4}>
                    <Tile>
                      <h3 style={{ marginBottom: '1rem' }}>Concorrentes</h3>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--cds-text-secondary)' }}>
                        {briefingData.sections.overview.competitors.map((c, i) => (
                          <li key={i} style={{ marginBottom: '0.5rem' }}>{c}</li>
                        ))}
                      </ul>
                    </Tile>
                  </Column>
                  <Column lg={6} md={4} sm={4}>
                    <Tile>
                      <h3 style={{ marginBottom: '1rem' }}>Referências</h3>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--cds-text-secondary)' }}>
                        {briefingData.sections.overview.references.map((r, i) => (
                          <li key={i} style={{ marginBottom: '0.5rem' }}>{r}</li>
                        ))}
                      </ul>
                    </Tile>
                  </Column>
                </Grid>
              </TabPanel>

              {/* Marca */}
              <TabPanel>
                <Tile style={{ marginTop: '1rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Tom de Voz</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {briefingData.sections.brand.tone.map((t, i) => (
                      <Tag key={i} type="blue">{t}</Tag>
                    ))}
                  </div>
                </Tile>
                <Grid fullWidth style={{ marginTop: '1rem' }}>
                  <Column lg={6} md={4} sm={4}>
                    <Tile>
                      <h3 style={{ marginBottom: '1rem' }}>Cores</h3>
                      <p style={{ color: 'var(--cds-text-secondary)' }}>{briefingData.sections.brand.colors}</p>
                    </Tile>
                  </Column>
                  <Column lg={6} md={4} sm={4}>
                    <Tile>
                      <h3 style={{ marginBottom: '1rem' }}>Tipografia</h3>
                      <p style={{ color: 'var(--cds-text-secondary)' }}>{briefingData.sections.brand.fonts}</p>
                    </Tile>
                  </Column>
                </Grid>
                <Tile style={{ marginTop: '1rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Diretrizes</h3>
                  <p style={{ color: 'var(--cds-text-secondary)', lineHeight: 1.6 }}>{briefingData.sections.brand.guidelines}</p>
                </Tile>
              </TabPanel>

              {/* Entregas */}
              <TabPanel>
                <Tile style={{ marginTop: '1rem' }}>
                  <StructuredListWrapper>
                    <StructuredListHead>
                      <StructuredListRow head>
                        <StructuredListCell head>Entrega</StructuredListCell>
                        <StructuredListCell head>Descrição</StructuredListCell>
                        <StructuredListCell head>Qtd.</StructuredListCell>
                      </StructuredListRow>
                    </StructuredListHead>
                    <StructuredListBody>
                      {briefingData.sections.deliverables.map((d, i) => (
                        <StructuredListRow key={i}>
                          <StructuredListCell noWrap style={{ fontWeight: 500 }}>{d.name}</StructuredListCell>
                          <StructuredListCell>{d.description}</StructuredListCell>
                          <StructuredListCell>{d.quantity}</StructuredListCell>
                        </StructuredListRow>
                      ))}
                    </StructuredListBody>
                  </StructuredListWrapper>
                </Tile>
              </TabPanel>

              {/* Cronograma */}
              <TabPanel>
                <Grid fullWidth style={{ marginTop: '1rem' }}>
                  <Column lg={6} md={4} sm={4}>
                    <Tile>
                      <h3 style={{ marginBottom: '1rem' }}>Período</h3>
                      <p style={{ color: 'var(--cds-text-secondary)' }}>
                        <strong>Início:</strong> {new Date(briefingData.sections.timeline.startDate).toLocaleDateString('pt-BR')}<br />
                        <strong>Prazo:</strong> {new Date(briefingData.sections.timeline.deadline).toLocaleDateString('pt-BR')}
                      </p>
                    </Tile>
                  </Column>
                  <Column lg={6} md={4} sm={4}>
                    <Tile>
                      <h3 style={{ marginBottom: '1rem' }}>Marcos</h3>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {briefingData.sections.timeline.milestones.map((m, i) => (
                          <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                            <span>{m.name}</span>
                            <span style={{ color: 'var(--cds-text-secondary)' }}>{new Date(m.date).toLocaleDateString('pt-BR')}</span>
                          </li>
                        ))}
                      </ul>
                    </Tile>
                  </Column>
                </Grid>
              </TabPanel>

              {/* Orçamento */}
              <TabPanel>
                <Tile style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Detalhamento</h3>
                    <div>
                      <span style={{ color: 'var(--cds-text-secondary)' }}>Total: </span>
                      <strong style={{ fontSize: '1.5rem' }}>
                        R$ {briefingData.sections.budget.total.toLocaleString('pt-BR')}
                      </strong>
                    </div>
                  </div>
                  <StructuredListWrapper>
                    <StructuredListHead>
                      <StructuredListRow head>
                        <StructuredListCell head>Item</StructuredListCell>
                        <StructuredListCell head>Valor</StructuredListCell>
                      </StructuredListRow>
                    </StructuredListHead>
                    <StructuredListBody>
                      {briefingData.sections.budget.breakdown.map((b, i) => (
                        <StructuredListRow key={i}>
                          <StructuredListCell>{b.item}</StructuredListCell>
                          <StructuredListCell>R$ {b.value.toLocaleString('pt-BR')}</StructuredListCell>
                        </StructuredListRow>
                      ))}
                    </StructuredListBody>
                  </StructuredListWrapper>
                </Tile>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>

        {/* Sidebar */}
        <Column lg={4} md={8} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Ações Rápidas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button kind="tertiary" size="sm" renderIcon={Copy} onClick={handleCopyLink} style={{ justifyContent: 'flex-start' }}>
                Copiar Link
              </Button>
              <Button kind="tertiary" size="sm" renderIcon={Download} style={{ justifyContent: 'flex-start' }}>
                Baixar PDF
              </Button>
              <Button kind="tertiary" size="sm" renderIcon={Share} style={{ justifyContent: 'flex-start' }}>
                Compartilhar
              </Button>
            </div>
          </Tile>

          <Tile>
            <h3 style={{ marginBottom: '1rem' }}>Comentários</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {briefingData.comments.map((comment) => (
                <div key={comment.id} style={{ padding: '0.75rem', background: 'var(--cds-background)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.875rem' }}>{comment.author}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>{comment.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>{comment.text}</p>
                </div>
              ))}
            </div>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
