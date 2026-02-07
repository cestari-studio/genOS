'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableBatchActions,
  TableBatchAction,
  TableContainer,
  Button,
  Tag,
  OverflowMenu,
  OverflowMenuItem,
  Modal,
  TextInput,
  Select,
  SelectItem,
  TextArea,
  Pagination,
  InlineLoading,
  Dropdown,
  IconButton,
  Tooltip,
  SkeletonText,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tile,
} from '@carbon/react';
import {
  Add,
  Edit,
  TrashCan,
  View,
  Email,
  Phone,
  Filter,
  Download,
  Upload,
  Renew,
  Star,
  StarFilled,
  ChevronRight,
  UserMultiple,
  Money,
  Folder,
  Chat,
  ArrowUp,
  ArrowDown,
  CheckmarkFilled,
  WarningFilled,
  Information,
  Close,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { AILabel } from '@/components/ui';
import './clients.scss';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  created_at: string;
  notes: string | null;
  total_projects?: number;
  total_revenue?: number;
  is_favorite?: boolean;
}

interface ClientStats {
  total: number;
  active: number;
  prospects: number;
  inactive: number;
  totalRevenue: number;
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'suggestion';
  clientId: string;
  message: string;
}

function ClientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showAiPanel, setShowAiPanel] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'prospect',
    notes: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Check URL for new client modal
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      resetForm();
      setEditingClient(null);
      setModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map clients with favorites from localStorage
      const savedFavorites: string[] = JSON.parse(localStorage.getItem('genos_favorite_clients') || '[]');
      const enrichedClients = (data || []).map((client) => ({
        ...client,
        total_projects: 0,
        total_revenue: 0,
        is_favorite: savedFavorites.includes(client.id),
      }));

      setClients(enrichedClients);
      generateAIInsights(enrichedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = (clientList: Client[]) => {
    const insights: AIInsight[] = [];
    
    // Find high-value clients without recent activity
    const highValueInactive = clientList.filter(c => (c.total_revenue || 0) > 20000 && c.status === 'inactive');
    highValueInactive.forEach(client => {
      insights.push({
        id: `insight-${client.id}-reactive`,
        type: 'opportunity',
        clientId: client.id,
        message: `${client.name} tem histórico de R$ ${(client.total_revenue || 0).toLocaleString('pt-BR')} mas está inativo. Considere uma campanha de reativação.`,
      });
    });

    // Find prospects with no projects
    const prospectNoProjects = clientList.filter(c => c.status === 'prospect' && (c.total_projects || 0) === 0);
    prospectNoProjects.slice(0, 2).forEach(client => {
      insights.push({
        id: `insight-${client.id}-followup`,
        type: 'suggestion',
        clientId: client.id,
        message: `${client.name} é um prospect sem projetos. Agende um follow-up para apresentar seu portfólio.`,
      });
    });

    setAiInsights(insights);
  };

  const handleSave = async () => {
    try {
      const supabase = createClient();
      
      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(formData)
          .eq('id', editingClient.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([formData]);
        if (error) throw error;
      }

      setModalOpen(false);
      setEditingClient(null);
      resetForm();
      loadClients();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientToDelete.id);
      if (error) throw error;
      
      setDeleteModalOpen(false);
      setClientToDelete(null);
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) return;
    if (!confirm(`Tem certeza que deseja excluir ${selectedRows.length} clientes?`)) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('clients')
        .delete()
        .in('id', selectedRows);
      if (error) throw error;
      
      setSelectedRows([]);
      loadClients();
    } catch (error) {
      console.error('Error deleting clients:', error);
    }
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      status: client.status,
      notes: client.notes || '',
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'prospect',
      notes: '',
    });
  };

  const toggleFavorite = async (client: Client) => {
    const newValue = !client.is_favorite;
    setClients(prev => prev.map(c =>
      c.id === client.id ? { ...c, is_favorite: newValue } : c
    ));
    // Persist to localStorage
    const saved: string[] = JSON.parse(localStorage.getItem('genos_favorite_clients') || '[]');
    const updated = newValue ? [...saved, client.id] : saved.filter(id => id !== client.id);
    localStorage.setItem('genos_favorite_clients', JSON.stringify(updated));
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Stats calculation
  const stats: ClientStats = useMemo(() => {
    return {
      total: clients.length,
      active: clients.filter(c => c.status === 'active').length,
      prospects: clients.filter(c => c.status === 'prospect').length,
      inactive: clients.filter(c => c.status === 'inactive').length,
      totalRevenue: clients.reduce((sum, c) => sum + (c.total_revenue || 0), 0),
    };
  }, [clients]);

  // Filtering and sorting
  const filteredClients = useMemo(() => {
    let result = clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof Client] || '';
        const bVal = b[sortConfig.key as keyof Client] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [clients, searchTerm, statusFilter, sortConfig]);

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { type: 'green' | 'blue' | 'gray' | 'red' | 'purple'; text: string }> = {
      active: { type: 'green', text: 'Ativo' },
      prospect: { type: 'blue', text: 'Prospect' },
      inactive: { type: 'gray', text: 'Inativo' },
      cancelled: { type: 'red', text: 'Cancelado' },
      vip: { type: 'purple', text: 'VIP' },
    };
    return configs[status] || { type: 'gray', text: status };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const headers = [
    { key: 'favorite', header: '', isSortable: false },
    { key: 'name', header: 'Cliente', isSortable: true },
    { key: 'company', header: 'Empresa', isSortable: true },
    { key: 'email', header: 'Contato', isSortable: false },
    { key: 'total_projects', header: 'Projetos', isSortable: true },
    { key: 'total_revenue', header: 'Receita Total', isSortable: true },
    { key: 'status', header: 'Status', isSortable: true },
    { key: 'actions', header: '', isSortable: false },
  ];

  const rows = paginatedClients.map(client => ({
    ...client,
  }));

  return (
    <div className="clients-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__content">
          <h1>Clientes</h1>
          <p>Gerencie sua base de clientes e prospects</p>
        </div>
        <div className="page-header__actions">
          <Button kind="ghost" size="md" renderIcon={Renew} onClick={loadClients} hasIconOnly iconDescription="Atualizar" />
          <Button kind="tertiary" renderIcon={Download} size="md">
            Exportar
          </Button>
          <Button 
            renderIcon={Add} 
            onClick={() => {
              resetForm();
              setEditingClient(null);
              setModalOpen(true);
            }}
          >
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="clients-stats">
        <Tile className="stat-tile">
          <UserMultiple size={24} />
          <div className="stat-tile__content">
            <span className="stat-tile__value">{stats.total}</span>
            <span className="stat-tile__label">Total de Clientes</span>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--green">
          <CheckmarkFilled size={24} />
          <div className="stat-tile__content">
            <span className="stat-tile__value">{stats.active}</span>
            <span className="stat-tile__label">Clientes Ativos</span>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--blue">
          <Folder size={24} />
          <div className="stat-tile__content">
            <span className="stat-tile__value">{stats.prospects}</span>
            <span className="stat-tile__label">Prospects</span>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--purple">
          <Money size={24} />
          <div className="stat-tile__content">
            <span className="stat-tile__value">{formatCurrency(stats.totalRevenue)}</span>
            <span className="stat-tile__label">Receita Total</span>
          </div>
        </Tile>
      </div>

      {/* AI Insights Panel */}
      {showAiPanel && aiInsights.length > 0 && (
        <div className="ai-insights-panel">
          <div className="ai-insights-panel__header">
            <div className="ai-insights-panel__title">
              <Chat size={18} />
              <span>Insights da IA</span>
              <AILabel size="mini" />
            </div>
            <IconButton 
              kind="ghost" 
              size="sm" 
              label="Fechar" 
              onClick={() => setShowAiPanel(false)}
            >
              <Close size={16} />
            </IconButton>
          </div>
          <div className="ai-insights-panel__content">
            {aiInsights.map(insight => (
              <div key={insight.id} className={`ai-insight ai-insight--${insight.type}`}>
                {insight.type === 'opportunity' && <ArrowUp size={16} />}
                {insight.type === 'warning' && <WarningFilled size={16} />}
                {insight.type === 'suggestion' && <Information size={16} />}
                <p>{insight.message}</p>
                <Button kind="ghost" size="sm" renderIcon={ChevronRight}>
                  Ver cliente
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="clients-table-container">
        <DataTable rows={rows} headers={headers} isSortable>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getSelectionProps,
            getToolbarProps,
            getBatchActionProps,
            selectedRows,
            getTableProps,
            getTableContainerProps,
          }) => {
            const batchActionProps = getBatchActionProps();
            
            return (
              <TableContainer {...getTableContainerProps()}>
                <TableToolbar {...getToolbarProps()}>
                  <TableBatchActions {...batchActionProps}>
                    <TableBatchAction
                      tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                      renderIcon={TrashCan}
                      onClick={handleBatchDelete}
                    >
                      Excluir
                    </TableBatchAction>
                    <TableBatchAction
                      tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                      renderIcon={Download}
                      onClick={() => {}}
                    >
                      Exportar
                    </TableBatchAction>
                  </TableBatchActions>
                  <TableToolbarContent>
                    <TableToolbarSearch
                      placeholder="Buscar clientes..."
                      onChange={(e: any) => setSearchTerm(e.target?.value || '')}
                      persistent
                    />
                    <Dropdown
                      id="status-filter"
                      titleText=""
                      label="Status"
                      size="md"
                      items={[
                        { id: 'all', text: 'Todos os status' },
                        { id: 'active', text: 'Ativos' },
                        { id: 'prospect', text: 'Prospects' },
                        { id: 'inactive', text: 'Inativos' },
                      ]}
                      itemToString={(item: any) => item?.text || ''}
                      onChange={({ selectedItem }: any) => 
                        setStatusFilter(selectedItem?.id || 'all')
                      }
                    />
                    <Button
                      kind="ghost"
                      size="md"
                      hasIconOnly
                      renderIcon={Chat}
                      iconDescription="Mostrar insights"
                      onClick={() => setShowAiPanel(!showAiPanel)}
                    />
                  </TableToolbarContent>
                </TableToolbar>

                {loading ? (
                  <div className="table-loading">
                    <InlineLoading description="Carregando clientes..." />
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="table-empty">
                    <UserMultiple size={48} />
                    <h3>Nenhum cliente encontrado</h3>
                    <p>{searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando seu primeiro cliente'}</p>
                    <Button renderIcon={Add} onClick={() => setModalOpen(true)}>
                      Adicionar Cliente
                    </Button>
                  </div>
                ) : (
                  <>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          <TableSelectAll {...getSelectionProps()} />
                          {headers.map((header: any, idx: number) => {
                            const headerProps = getHeaderProps({ header });
                            return (
                              <TableHeader 
                                {...headerProps}
                                key={headerProps.key || `header-${idx}`}
                                isSortable={header.isSortable}
                                onClick={() => header.isSortable && handleSort(header.key)}
                                sortDirection={(sortConfig && sortConfig.key === header.key) ? (sortConfig.direction === 'asc' ? 'ASC' : 'DESC') : 'NONE'}
                              >
                                {header.header}
                              </TableHeader>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row: any) => {
                          const client = paginatedClients.find(c => c.id === row.id)!;
                          const statusConfig = getStatusConfig(client.status);
                          const rowProps = getRowProps({ row });
                          
                          return (
                            <TableRow {...rowProps} key={rowProps.key || row.id}>
                              <TableSelectRow {...getSelectionProps({ row })} />
                              <TableCell>
                                <IconButton
                                  kind="ghost"
                                  size="sm"
                                  label={client.is_favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                  onClick={() => toggleFavorite(client)}
                                  className={`favorite-btn ${client.is_favorite ? 'favorite-btn--active' : ''}`}
                                >
                                  {client.is_favorite ? <StarFilled size={16} /> : <Star size={16} />}
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <Link href={`/clients/${client.id}`} className="client-name-link">
                                  <span className="client-name">{client.name}</span>
                                </Link>
                              </TableCell>
                              <TableCell>{client.company || '-'}</TableCell>
                              <TableCell>
                                <div className="contact-cell">
                                  {client.email && (
                                    <a href={`mailto:${client.email}`} className="contact-link">
                                      <Email size={14} />
                                      <span>{client.email}</span>
                                    </a>
                                  )}
                                  {client.phone && (
                                    <a href={`tel:${client.phone}`} className="contact-link">
                                      <Phone size={14} />
                                      <span>{client.phone}</span>
                                    </a>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="projects-count">{client.total_projects || 0}</span>
                              </TableCell>
                              <TableCell>
                                <span className="revenue-value">
                                  {formatCurrency(client.total_revenue || 0)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Tag type={statusConfig.type} size="sm">{statusConfig.text}</Tag>
                              </TableCell>
                              <TableCell>
                                <OverflowMenu flipped size="sm" ariaLabel="Ações">
                                  <OverflowMenuItem
                                    itemText="Ver detalhes"
                                    onClick={() => router.push(`/clients/${client.id}`)}
                                  />
                                  <OverflowMenuItem
                                    itemText="Editar"
                                    onClick={() => openEditModal(client)}
                                  />
                                  <OverflowMenuItem
                                    itemText="Novo projeto"
                                    onClick={() => router.push(`/projects?new=true&client_id=${client.id}`)}
                                  />
                                  <OverflowMenuItem
                                    itemText="Excluir"
                                    isDelete
                                    onClick={() => {
                                      setClientToDelete(client);
                                      setDeleteModalOpen(true);
                                    }}
                                  />
                                </OverflowMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    <Pagination
                      totalItems={filteredClients.length}
                      pageSize={pageSize}
                      page={currentPage}
                      pageSizes={[10, 20, 50]}
                      onChange={({ page, pageSize }: { page: number; pageSize: number }) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                      }}
                      itemsPerPageText="Itens por página:"
                      pageRangeText={(current, total) => `de ${total} páginas`}
                      itemRangeText={(min, max, total) => `${min}–${max} de ${total} itens`}
                    />
                  </>
                )}
              </TableContainer>
            );
          }}
        </DataTable>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          setEditingClient(null);
          resetForm();
        }}
        onRequestSubmit={handleSave}
        modalHeading={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
        size="md"
      >
        <div className="client-form">
          <TextInput
            id="name"
            labelText="Nome *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextInput
            id="company"
            labelText="Empresa"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <div className="client-form__row">
            <TextInput
              id="email"
              labelText="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextInput
              id="phone"
              labelText="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <Select
            id="status"
            labelText="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <SelectItem value="prospect" text="Prospect" />
            <SelectItem value="active" text="Ativo" />
            <SelectItem value="inactive" text="Inativo" />
            <SelectItem value="vip" text="VIP" />
          </Select>
          <TextArea
            id="notes"
            labelText="Observações"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onRequestClose={() => {
          setDeleteModalOpen(false);
          setClientToDelete(null);
        }}
        onRequestSubmit={handleDelete}
        modalHeading="Excluir Cliente"
        primaryButtonText="Excluir"
        secondaryButtonText="Cancelar"
        danger
        size="sm"
      >
        <p>
          Tem certeza que deseja excluir <strong>{clientToDelete?.name}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="table-loading"><InlineLoading description="Carregando clientes..." /></div>}>
      <ClientsContent />
    </Suspense>
  );
}
