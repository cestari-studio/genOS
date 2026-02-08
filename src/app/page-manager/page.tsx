'use client';

import React, { useState, useEffect } from 'react';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
  Modal,
  TextInput,
  TextArea,
  Tag,
  Grid,
  Column,
  Layer,
  OverflowMenu,
  OverflowMenuItem,
  Tile,
} from '@carbon/react';
import {
  Add,
  TrashCan,
  Edit,
  Launch,
  CheckmarkFilled,
  WarningFilled,
  Settings,
  View,
} from '@carbon/icons-react';
import './page-manager.scss';

interface PageItem {
  id: string;
  name: string;
  route: string;
  status: 'ativo' | 'em desenvolvimento' | 'planejado';
  description: string;
  improvements: string;
}

const defaultPages: PageItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    route: '/dashboard',
    status: 'ativo',
    description: 'Visão geral e métricas',
    improvements: '',
  },
  {
    id: 'brands',
    name: 'Marcas',
    route: '/brands',
    status: 'ativo',
    description: 'Gestão de marcas',
    improvements: '',
  },
  {
    id: 'brand-detail',
    name: 'Detalhe da Marca',
    route: '/brands/[id]',
    status: 'ativo',
    description: 'Visualização detalhada de marca',
    improvements: '',
  },
  {
    id: 'posts',
    name: 'Posts',
    route: '/posts',
    status: 'ativo',
    description: 'Gerenciamento de posts',
    improvements: '',
  },
  {
    id: 'posts-new',
    name: 'Novo Post',
    route: '/posts/new',
    status: 'em desenvolvimento',
    description: 'Criar novo post',
    improvements: '',
  },
  {
    id: 'posts-detail',
    name: 'Detalhe do Post',
    route: '/posts/[id]',
    status: 'ativo',
    description: 'Visualização detalhada de post',
    improvements: '',
  },
  {
    id: 'credits',
    name: 'Créditos',
    route: '/credits',
    status: 'ativo',
    description: 'Sistema de créditos',
    improvements: '',
  },
  {
    id: 'projects',
    name: 'Projetos',
    route: '/projects',
    status: 'ativo',
    description: 'Gerenciamento de projetos',
    improvements: '',
  },
  {
    id: 'clients',
    name: 'Clientes',
    route: '/clients',
    status: 'ativo',
    description: 'Gerenciamento de clientes',
    improvements: '',
  },
  {
    id: 'clients-detail',
    name: 'Detalhe do Cliente',
    route: '/clients/[id]',
    status: 'ativo',
    description: 'Visualização detalhada de cliente',
    improvements: '',
  },
  {
    id: 'briefings',
    name: 'Briefings',
    route: '/briefings',
    status: 'em desenvolvimento',
    description: 'Briefings de projetos',
    improvements: '',
  },
  {
    id: 'documents',
    name: 'Documentos',
    route: '/documents',
    status: 'ativo',
    description: 'Biblioteca de documentos',
    improvements: '',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    route: '/analytics',
    status: 'planejado',
    description: 'Relatórios e métricas',
    improvements: '',
  },
  {
    id: 'team',
    name: 'Equipe',
    route: '/team',
    status: 'ativo',
    description: 'Gerenciamento de equipe',
    improvements: '',
  },
  {
    id: 'services',
    name: 'Serviços',
    route: '/services',
    status: 'em desenvolvimento',
    description: 'Configuração de serviços',
    improvements: '',
  },
  {
    id: 'helian',
    name: 'IA Helian',
    route: '/helian',
    status: 'ativo',
    description: 'Assistente de IA',
    improvements: '',
  },
  {
    id: 'terminal',
    name: 'Terminal IA',
    route: '/terminal',
    status: 'ativo',
    description: 'Interface terminal',
    improvements: '',
  },
  {
    id: 'notifications',
    name: 'Notificações',
    route: '/notifications',
    status: 'em desenvolvimento',
    description: 'Sistema de notificações',
    improvements: '',
  },
  {
    id: 'settings',
    name: 'Configurações',
    route: '/settings',
    status: 'ativo',
    description: 'Configurações da aplicação',
    improvements: '',
  },
  {
    id: 'admin',
    name: 'Admin',
    route: '/admin',
    status: 'planejado',
    description: 'Painel administrativo',
    improvements: '',
  },
  {
    id: 'login',
    name: 'Login',
    route: '/login',
    status: 'ativo',
    description: 'Autenticação',
    improvements: '',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo':
      return 'green';
    case 'em desenvolvimento':
      return 'blue';
    case 'planejado':
      return 'gray';
    default:
      return 'gray';
  }
};

export default function PageManager() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [filteredPages, setFilteredPages] = useState<PageItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    description: '',
  });
  const [searchValue, setSearchValue] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('genos-page-manager');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPages(parsed);
        setFilteredPages(parsed);
      } catch {
        setPages(defaultPages);
        setFilteredPages(defaultPages);
      }
    } else {
      setPages(defaultPages);
      setFilteredPages(defaultPages);
    }
  }, []);

  // Save to localStorage whenever pages change
  useEffect(() => {
    localStorage.setItem('genos-page-manager', JSON.stringify(pages));
  }, [pages]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = pages.filter(
      (page) =>
        page.name.toLowerCase().includes(value.toLowerCase()) ||
        page.route.toLowerCase().includes(value.toLowerCase()) ||
        page.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPages(filtered);
  };

  const handleAddPage = () => {
    if (formData.name && formData.route) {
      const newPage: PageItem = {
        id: `custom-${Date.now()}`,
        name: formData.name,
        route: formData.route,
        status: 'planejado',
        description: formData.description,
        improvements: '',
      };
      setPages([...pages, newPage]);
      setFilteredPages([...filteredPages, newPage]);
      setFormData({ name: '', route: '', description: '' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setPageToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pageToDelete) {
      const updated = pages.filter((p) => p.id !== pageToDelete);
      setPages(updated);
      setFilteredPages(updated.filter((p) => !searchValue || p.name.toLowerCase().includes(searchValue.toLowerCase())));
    }
    setIsDeleteConfirmOpen(false);
    setPageToDelete(null);
  };

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleImprovementsChange = (id: string, value: string) => {
    const updated = pages.map((p) => (p.id === id ? { ...p, improvements: value } : p));
    setPages(updated);
  };

  return (
    <Layer>
      <div className="page-manager">
        <Grid className="page-manager__grid">
          <Column lg={16} md={8} sm={4} className="page-manager__content">
            <Tile className="page-manager__header-tile">
              <h1 className="page-manager__title">Gerenciador de Páginas</h1>
              <p className="page-manager__subtitle">
                Gerencie todas as páginas do sistema, acompanhe o status e implemente melhorias
              </p>
            </Tile>

            <div className="page-manager__table-wrapper">
              <DataTable
                rows={filteredPages.map((page, idx) => ({
                  id: page.id,
                  cells: [page.name, page.route, page.status, page.description],
                  data: page,
                }))}
                headers={[
                  { key: 'name', header: 'Página' },
                  { key: 'route', header: 'Rota' },
                  { key: 'status', header: 'Status' },
                  { key: 'description', header: 'Descrição' },
                ]}
              >
                {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                  <TableContainer>
                    <TableToolbar>
                      <TableToolbarContent>
                        <TableToolbarSearch
                          placeholder="Buscar páginas..."
                          value={searchValue}
                          onChange={(_e, value) => handleSearch(value || '')}
                        />
                        <Button
                          kind="primary"
                          renderIcon={Add}
                          onClick={() => setIsModalOpen(true)}
                          size="sm"
                        >
                          Adicionar Página
                        </Button>
                      </TableToolbarContent>
                    </TableToolbar>

                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map((header) => (
                            <TableHeader {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          ))}
                          <TableHeader>Ações</TableHeader>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rows.map((row) => {
                          const pageData = pages.find(p => p.id === row.id);
                          const isExpanded = expandedRows.has(row.id);

                          return (
                            <React.Fragment key={row.id}>
                              <TableRow {...getRowProps({ row })}>
                                {row.cells.map((cell) => (
                                  <TableCell key={cell.id}>
                                    {cell.info?.header === 'status' ? (
                                      <Tag
                                        type={getStatusColor(String(cell.value))}
                                        title={String(cell.value)}
                                      >
                                        {String(cell.value)}
                                      </Tag>
                                    ) : (
                                      String(cell.value)
                                    )}
                                  </TableCell>
                                ))}
                                <TableCell>
                                  <div className="page-manager__actions">
                                    <Button
                                      hasIconOnly
                                      renderIcon={isExpanded ? View : Edit}
                                      kind="ghost"
                                      size="sm"
                                      onClick={() => toggleRowExpand(row.id)}
                                      iconDescription={
                                        isExpanded ? 'Ocultar melhorias' : 'Mostrar melhorias'
                                      }
                                    />
                                    <Button
                                      hasIconOnly
                                      renderIcon={TrashCan}
                                      kind="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteClick(row.id)}
                                      iconDescription="Remover página"
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>

                              {isExpanded && pageData && (
                                <TableRow>
                                  <TableCell colSpan={5}>
                                    <div className="page-manager__expansion">
                                      <label className="page-manager__expansion-label">
                                        Melhorias a implementar
                                      </label>
                                      <TextArea
                                        labelText=""
                                        hideLabel
                                        value={pageData.improvements}
                                        onChange={(e) =>
                                          handleImprovementsChange(
                                            pageData.id,
                                            e.currentTarget.value
                                          )
                                        }
                                        placeholder="Descreva as melhorias que devem ser implementadas nesta página..."
                                        rows={4}
                                      />
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            </div>
          </Column>
        </Grid>
      </div>

      <Modal
        modalHeading="Adicionar Nova Página"
        primaryButtonText="Adicionar"
        secondaryButtonText="Cancelar"
        open={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={handleAddPage}
      >
        <div className="page-manager__modal-content">
          <TextInput
            id="page-name"
            labelText="Nome da Página"
            placeholder="Ex: Novo Dashboard"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
          />
          <TextInput
            id="page-route"
            labelText="Rota"
            placeholder="Ex: /novo-dashboard"
            value={formData.route}
            onChange={(e) => setFormData({ ...formData, route: e.currentTarget.value })}
          />
          <TextArea
            id="page-description"
            labelText="Descrição"
            placeholder="Descreva o propósito desta página..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
            rows={3}
          />
        </div>
      </Modal>

      <Modal
        modalHeading="Confirmar Exclusão"
        primaryButtonText="Remover"
        secondaryButtonText="Cancelar"
        danger
        open={isDeleteConfirmOpen}
        onRequestClose={() => setIsDeleteConfirmOpen(false)}
        onRequestSubmit={handleConfirmDelete}
      >
        <p>Tem certeza que deseja remover esta página? Esta ação não pode ser desfeita.</p>
      </Modal>
    </Layer>
  );
}
