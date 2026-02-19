'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Breadcrumb,
  BreadcrumbItem,
  SkeletonText,
  SkeletonPlaceholder,
} from '@carbon/react';
import {
  Edit,
  Email,
  Phone,
  Location,
  Calendar,
  Folder,
  Document,
  Chat,
  ArrowRight,
  UserAvatar,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  client_type?: string;
  notes?: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, 'green' | 'gray' | 'blue' | 'red'> = {
  active: 'green',
  inactive: 'gray',
  prospect: 'blue',
  archived: 'red',
};

export default function ClientProfilePage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [clientRes, projectsRes] = await Promise.all([
        supabase.from('clients').select('*').eq('id', clientId).single(),
        supabase.from('projects').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
      ]);

      if (clientRes.data) setClient(clientRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      setLoading(false);
    }

    fetchData();
  }, [clientId]);

  if (loading) {
    return (
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <SkeletonText heading width="30%" />
          <SkeletonPlaceholder style={{ height: '200px', marginTop: '1rem' }} />
        </Column>
      </Grid>
    );
  }

  if (!client) {
    return (
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <Tile>
            <p>Cliente não encontrado</p>
            <Link href="/clients">Voltar para lista</Link>
          </Tile>
        </Column>
      </Grid>
    );
  }

  return (
    <Grid>
      {/* Breadcrumb */}
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="/clients">Clientes</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>{client.name}</BreadcrumbItem>
        </Breadcrumb>
      </Column>

      {/* Header */}
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserAvatar size={32} />
            </div>
            <div>
              <h1 style={{ margin: 0 }}>{client.name}</h1>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Tag type={statusColors[client.status]} size="sm">{client.status}</Tag>
                {client.client_type && <Tag type="outline" size="sm">{client.client_type}</Tag>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href={`/clients/${client.id}/portal`}>
              <Button kind="secondary" size="sm">Portal do Cliente</Button>
            </Link>
            <Link href={`/clients/${client.id}/edit`}>
              <Button kind="primary" size="sm" renderIcon={Edit}>Editar</Button>
            </Link>
          </div>
        </div>
      </Column>

      {/* Tabs */}
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="Perfil do cliente">
            <Tab>Informações</Tab>
            <Tab>Projetos ({projects.length})</Tab>
            <Tab>Documentos</Tab>
            <Tab>Timeline</Tab>
          </TabList>
          <TabPanels>
            {/* Informações */}
            <TabPanel>
              <Grid style={{ marginTop: '1rem' }}>
                <Column lg={8} md={4} sm={4}>
                  <Tile>
                    <h4 style={{ marginBottom: '1rem' }}>Contato</h4>
                    <StructuredListWrapper>
                      <StructuredListBody>
                        <StructuredListRow>
                          <StructuredListCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Email size={16} /> Email
                            </div>
                          </StructuredListCell>
                          <StructuredListCell>{client.email}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Phone size={16} /> Telefone
                            </div>
                          </StructuredListCell>
                          <StructuredListCell>{client.phone || '-'}</StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Calendar size={16} /> Cliente desde
                            </div>
                          </StructuredListCell>
                          <StructuredListCell>
                            {new Date(client.created_at).toLocaleDateString('pt-BR')}
                          </StructuredListCell>
                        </StructuredListRow>
                      </StructuredListBody>
                    </StructuredListWrapper>
                  </Tile>
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <Tile>
                    <h4 style={{ marginBottom: '1rem' }}>Observações</h4>
                    <p style={{ color: '#525252' }}>{client.notes || 'Nenhuma observação registrada.'}</p>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Projetos */}
            <TabPanel>
              <div style={{ marginTop: '1rem' }}>
                {projects.length === 0 ? (
                  <Tile style={{ textAlign: 'center', padding: '2rem' }}>
                    <Folder size={48} style={{ color: '#8d8d8d', marginBottom: '1rem' }} />
                    <p style={{ color: '#8d8d8d' }}>Nenhum projeto encontrado</p>
                    <Button kind="primary" style={{ marginTop: '1rem' }}>Criar Projeto</Button>
                  </Tile>
                ) : (
                  projects.map((project) => (
                    <Tile key={project.id} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{project.name}</strong>
                          <Tag type="blue" size="sm" style={{ marginLeft: '0.5rem' }}>{project.status}</Tag>
                        </div>
                        <Link href={`/projects/${project.id}`}>
                          <Button kind="ghost" size="sm" hasIconOnly iconDescription="Ver projeto" renderIcon={ArrowRight} />
                        </Link>
                      </div>
                    </Tile>
                  ))
                )}
              </div>
            </TabPanel>

            {/* Documentos */}
            <TabPanel>
              <Tile style={{ marginTop: '1rem', textAlign: 'center', padding: '2rem' }}>
                <Document size={48} style={{ color: '#8d8d8d', marginBottom: '1rem' }} />
                <p style={{ color: '#8d8d8d' }}>Nenhum documento encontrado</p>
                <Button kind="primary" style={{ marginTop: '1rem' }}>Upload Documento</Button>
              </Tile>
            </TabPanel>

            {/* Timeline */}
            <TabPanel>
              <Tile style={{ marginTop: '1rem', textAlign: 'center', padding: '2rem' }}>
                <Chat size={48} style={{ color: '#8d8d8d', marginBottom: '1rem' }} />
                <p style={{ color: '#8d8d8d' }}>Histórico de atividades</p>
                <p style={{ color: '#8d8d8d', fontSize: '0.75rem' }}>Em desenvolvimento</p>
              </Tile>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
