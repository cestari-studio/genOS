'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
  Select,
  SelectItem,
  Tag,
  Toggle,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  Grid,
  Column,
  Tile,
  ToastNotification,
  InlineLoading,
  SkeletonText,
  SkeletonPlaceholder,
  Dropdown,
  DatePicker,
  DatePickerInput,
} from '@carbon/react';
import {
  UserAdmin,
  Security,
  CurrencyDollar,
  Report,
  Add,
  TrashCan,
  Edit,
  View,
  Checkmark,
  Close,
  Settings,
  ArrowRight,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

// Types
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'manager' | 'designer' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  last_login?: string;
  organization_id: string;
}

interface Organization {
  id: string;
  name: string;
  plan_type: 'free' | 'pro' | 'enterprise';
}

interface PermissionSet {
  dashboard: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  clients: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  projects: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  posts: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  briefings: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  financial: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  analytics: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  terminal_ia: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  helian_ia: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  settings: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
  admin: Record<'view' | 'create' | 'edit' | 'delete', boolean>;
}

interface AuditLogEntry {
  id: string;
  date: string;
  user: string;
  action: string;
  detail: string;
}

interface Plan {
  name: string;
  type: 'free' | 'pro' | 'enterprise';
  price: string;
  features: string[];
  memberLimit: number;
  storageGb: number;
  apiCallsPerMonth: number;
}

const FEATURES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'clients', label: 'Clientes' },
  { key: 'projects', label: 'Projetos' },
  { key: 'posts', label: 'Posts' },
  { key: 'briefings', label: 'Briefings' },
  { key: 'financial', label: 'Financeiro' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'terminal_ia', label: 'Terminal IA' },
  { key: 'helian_ia', label: 'Helian IA' },
  { key: 'settings', label: 'Configurações' },
  { key: 'admin', label: 'Admin' },
];

const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete'];

const DEFAULT_PERMISSIONS: Record<string, PermissionSet> = {
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    clients: { view: true, create: true, edit: true, delete: true },
    projects: { view: true, create: true, edit: true, delete: true },
    posts: { view: true, create: true, edit: true, delete: true },
    briefings: { view: true, create: true, edit: true, delete: true },
    financial: { view: true, create: true, edit: true, delete: true },
    analytics: { view: true, create: true, edit: true, delete: true },
    terminal_ia: { view: true, create: true, edit: true, delete: true },
    helian_ia: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true },
    admin: { view: true, create: true, edit: true, delete: true },
  },
  manager: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    clients: { view: true, create: true, edit: true, delete: false },
    projects: { view: true, create: true, edit: true, delete: false },
    posts: { view: true, create: true, edit: true, delete: true },
    briefings: { view: true, create: true, edit: true, delete: false },
    financial: { view: true, create: false, edit: false, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    terminal_ia: { view: true, create: false, edit: false, delete: false },
    helian_ia: { view: true, create: true, edit: false, delete: false },
    settings: { view: true, create: false, edit: false, delete: false },
    admin: { view: false, create: false, edit: false, delete: false },
  },
  designer: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    clients: { view: true, create: false, edit: false, delete: false },
    projects: { view: true, create: true, edit: true, delete: false },
    posts: { view: true, create: true, edit: true, delete: false },
    briefings: { view: true, create: true, edit: true, delete: false },
    financial: { view: false, create: false, edit: false, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    terminal_ia: { view: false, create: false, edit: false, delete: false },
    helian_ia: { view: true, create: true, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    admin: { view: false, create: false, edit: false, delete: false },
  },
  editor: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    clients: { view: true, create: false, edit: false, delete: false },
    projects: { view: true, create: false, edit: false, delete: false },
    posts: { view: true, create: false, edit: true, delete: false },
    briefings: { view: true, create: false, edit: true, delete: false },
    financial: { view: false, create: false, edit: false, delete: false },
    analytics: { view: false, create: false, edit: false, delete: false },
    terminal_ia: { view: false, create: false, edit: false, delete: false },
    helian_ia: { view: true, create: true, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    admin: { view: false, create: false, edit: false, delete: false },
  },
  viewer: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    clients: { view: true, create: false, edit: false, delete: false },
    projects: { view: true, create: false, edit: false, delete: false },
    posts: { view: true, create: false, edit: false, delete: false },
    briefings: { view: true, create: false, edit: false, delete: false },
    financial: { view: false, create: false, edit: false, delete: false },
    analytics: { view: false, create: false, edit: false, delete: false },
    terminal_ia: { view: false, create: false, edit: false, delete: false },
    helian_ia: { view: false, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    admin: { view: false, create: false, edit: false, delete: false },
  },
};

const PLANS: Plan[] = [
  {
    name: 'Free',
    type: 'free',
    price: 'R$ 0',
    features: ['Até 3 membros', '1 GB de armazenamento', '10 mil chamadas API/mês'],
    memberLimit: 3,
    storageGb: 1,
    apiCallsPerMonth: 10000,
  },
  {
    name: 'Pro',
    type: 'pro',
    price: 'R$ 99/mês',
    features: ['Até 15 membros', '50 GB de armazenamento', '100 mil chamadas API/mês', 'Suporte prioritário'],
    memberLimit: 15,
    storageGb: 50,
    apiCallsPerMonth: 100000,
  },
  {
    name: 'Enterprise',
    type: 'enterprise',
    price: 'Personalizado',
    features: ['Membros ilimitados', 'Armazenamento ilimitado', 'Chamadas API ilimitadas', 'Suporte dedicado', 'SSO'],
    memberLimit: Infinity,
    storageGb: Infinity,
    apiCallsPerMonth: Infinity,
  },
];

const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  { id: '1', date: '2025-02-07 14:32', user: 'João Silva', action: 'Membro convidado', detail: 'maria@example.com adicionada como designer' },
  { id: '2', date: '2025-02-07 13:15', user: 'Admin', action: 'Permissão alterada', detail: 'Role de Carlos mudado de editor para manager' },
  { id: '3', date: '2025-02-07 11:48', user: 'Maria Santos', action: 'Post publicado', detail: 'Post ID: 5642 publicado' },
  { id: '4', date: '2025-02-06 16:22', user: 'João Silva', action: 'Membro removido', detail: 'ana@example.com removida da organização' },
  { id: '5', date: '2025-02-06 14:00', user: 'Admin', action: 'Configuração alterada', detail: 'Plano atualizado de Free para Pro' },
  { id: '6', date: '2025-02-06 10:30', user: 'Carlos Mendes', action: 'Briefing criado', detail: 'Briefing ID: 1248 para cliente Acme Corp' },
  { id: '7', date: '2025-02-05 15:45', user: 'Maria Santos', action: 'Projeto finalizado', detail: 'Projeto ID: 892 concluído com sucesso' },
  { id: '8', date: '2025-02-05 12:20', user: 'João Silva', action: 'Membro convidado', detail: 'pedro@example.com adicionado como viewer' },
  { id: '9', date: '2025-02-05 09:15', user: 'Admin', action: 'Login realizado', detail: 'Acesso ao painel de administração' },
  { id: '10', date: '2025-02-04 18:00', user: 'Carlos Mendes', action: 'Documento criado', detail: 'Documento ID: 4521 adicionado ao projeto 892' },
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false,
  });

  // Members tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'manager' | 'designer' | 'editor' | 'viewer'>('viewer');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Permissions tab state
  const [permissions, setPermissions] = useState<Record<string, PermissionSet>>(DEFAULT_PERMISSIONS);
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [permissionDirty, setPermissionDirty] = useState(false);

  // Audit tab state
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG);
  const [auditFilter, setAuditFilter] = useState<string>('all');
  const [auditDateRange, setAuditDateRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Initialize
  useEffect(() => {
    loadAdminData();
    loadPermissionsFromStorage();
  }, []);

  const loadAdminData = async () => {
    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        setToast({ message: 'Não autenticado. Redirecionando...', type: 'error', visible: true });
        return;
      }

      // Get current user details
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (!userData) {
        setToast({ message: 'Usuário não encontrado', type: 'error', visible: true });
        return;
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        status: 'active',
        organization_id: userData.organization_id,
      };

      setCurrentUser(user);

      // Check admin access
      if (userData.role !== 'admin') {
        setHasAdminAccess(false);
        setToast({ message: 'Acesso negado: apenas administradores podem acessar este painel', type: 'error', visible: true });
        return;
      }

      setHasAdminAccess(true);

      // Get organization
      const { data: orgData } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', userData.organization_id)
        .single();

      if (orgData) {
        setOrganization(orgData);
      }

      // Get organization members
      const { data: membersData } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', userData.organization_id)
        .order('first_name', { ascending: true });

      if (membersData) {
        const formattedMembers: User[] = membersData.map((m: any) => ({
          id: m.id,
          email: m.email,
          first_name: m.first_name,
          last_name: m.last_name,
          role: m.role,
          status: m.last_login ? 'active' : 'inactive',
          last_login: m.last_login,
          organization_id: m.organization_id,
        }));
        setMembers(formattedMembers);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setToast({ message: 'Erro ao carregar dados de administração', type: 'error', visible: true });
    } finally {
      setLoading(false);
    }
  };

  const loadPermissionsFromStorage = () => {
    try {
      const stored = localStorage.getItem('genos-permissions-config');
      if (stored) {
        setPermissions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const savePermissions = () => {
    try {
      localStorage.setItem('genos-permissions-config', JSON.stringify(permissions));
      setPermissionDirty(false);
      setToast({ message: 'Permissões salvas com sucesso', type: 'success', visible: true });
    } catch (error) {
      console.error('Error saving permissions:', error);
      setToast({ message: 'Erro ao salvar permissões', type: 'error', visible: true });
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail || !organization) {
      setToast({ message: 'Preencha todos os campos', type: 'error', visible: true });
      return;
    }

    try {
      // In a real implementation, this would send an invitation email
      const supabase = createClient();

      // Create user in auth (simplified - in production, use proper invitation flow)
      setToast({ message: `Convite enviado para ${inviteEmail} como ${inviteRole}`, type: 'success', visible: true });
      setInviteModalOpen(false);
      setInviteEmail('');
      setInviteRole('viewer');

      // Reload members
      await loadAdminData();
    } catch (error) {
      console.error('Error inviting member:', error);
      setToast({ message: 'Erro ao enviar convite', type: 'error', visible: true });
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setToast({ message: 'Membro removido com sucesso', type: 'success', visible: true });
      setMembers(members.filter(m => m.id !== memberId));
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error removing member:', error);
      setToast({ message: 'Erro ao remover membro', type: 'error', visible: true });
    }
  };

  const togglePermission = (role: string, feature: string, action: string) => {
    setPermissions(prev => {
      const roleCopy = JSON.parse(JSON.stringify(prev[role])) as PermissionSet;
      const feat = feature as keyof PermissionSet;
      const act = action as 'view' | 'create' | 'edit' | 'delete';
      roleCopy[feat][act] = !roleCopy[feat][act];
      return { ...prev, [role]: roleCopy };
    });
    setPermissionDirty(true);
  };

  const filteredMembers = members.filter(m =>
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const memberHeaders = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Função' },
    { key: 'status', header: 'Status' },
    { key: 'last_login', header: 'Último Acesso' },
    { key: 'actions', header: 'Ações' },
  ];

  const auditHeaders = [
    { key: 'date', header: 'Data' },
    { key: 'user', header: 'Usuário' },
    { key: 'action', header: 'Ação' },
    { key: 'detail', header: 'Detalhe' },
  ];

  const filteredAuditLog = auditLog.filter(entry => {
    if (auditFilter !== 'all') {
      return entry.action.toLowerCase().includes(auditFilter.toLowerCase());
    }
    return true;
  });

  const currentPlan = PLANS.find(p => p.type === organization?.plan_type);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <SkeletonText heading width="30%" />
        <SkeletonPlaceholder />
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#a8192b' }}>
        <h2>Acesso Negado</h2>
        <p>Apenas administradores podem acessar este painel.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: 'var(--cds-ui-01, #f4f4f4)' }}>
      {/* Toast notification */}
      {toast.visible && (
        <ToastNotification
          style={{ marginBottom: '1rem' }}
          title={toast.type === 'success' ? 'Sucesso' : toast.type === 'error' ? 'Erro' : 'Informação'}
          subtitle={toast.message}
          kind={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
          timeout={4000}
        />
      )}

      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--cds-text-01, #161616)' }}>
          Painel de Administração
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--cds-text-02, #525252)' }}>
          Controle de acessos e permissões da organização
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultSelectedIndex={0}>
        <TabList style={{ borderBottom: '1px solid var(--cds-border-subtle, #e8e8e8)' }}>
          <Tab renderIcon={UserAdmin}>Membros</Tab>
          <Tab renderIcon={Security}>Permissões</Tab>
          <Tab renderIcon={CurrencyDollar}>Plano</Tab>
          <Tab renderIcon={Report}>Auditoria</Tab>
        </TabList>

        <TabPanels>
          {/* Tab 1: Membros */}
          <TabPanel>
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <Button
                  kind="primary"
                  renderIcon={Add}
                  onClick={() => setInviteModalOpen(true)}
                  size="md"
                >
                  Convidar Membro
                </Button>
              </div>

              {/* Invite Modal */}
              <Modal
                open={inviteModalOpen}
                onRequestClose={() => setInviteModalOpen(false)}
                primaryButtonText="Enviar Convite"
                secondaryButtonText="Cancelar"
                onRequestSubmit={inviteMember}
                modalHeading="Convidar Novo Membro"
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <TextInput
                    id="invite-email"
                    labelText="Email"
                    placeholder="usuario@example.com"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    style={{ marginBottom: '1rem' }}
                  />
                  <Select
                    id="invite-role"
                    labelText="Função"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                  >
                    <SelectItem value="admin" text="Admin" />
                    <SelectItem value="manager" text="Manager" />
                    <SelectItem value="designer" text="Designer" />
                    <SelectItem value="editor" text="Editor" />
                    <SelectItem value="viewer" text="Viewer" />
                  </Select>
                </div>
              </Modal>

              {/* Members Table */}
              <DataTable
                rows={filteredMembers.map(m => ({
                  id: m.id,
                  name: `${m.first_name} ${m.last_name}`,
                  email: m.email,
                  role: m.role,
                  status: m.status,
                  last_login: m.last_login ? new Date(m.last_login).toLocaleDateString('pt-BR') : '—',
                }))}
                headers={memberHeaders}
              >
                {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                  <TableContainer title="Membros da Organização">
                    <TableToolbar>
                      <TableToolbarContent>
                        <TableToolbarSearch
                          value={searchQuery}
                          onChange={(_e: '' | React.ChangeEvent<HTMLInputElement>, v?: string) => setSearchQuery(v ?? '')}
                          placeholder="Pesquisar membro..."
                        />
                      </TableToolbarContent>
                    </TableToolbar>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader {...getHeaderProps({ header })} key={header.key}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>
                                {cell.info.header === 'role' ? (
                                  <Tag type="blue" size="md">{cell.value}</Tag>
                                ) : cell.info.header === 'status' ? (
                                  <Tag type={cell.value === 'active' ? 'green' : 'gray'} size="md">
                                    {cell.value === 'active' ? 'Ativo' : 'Inativo'}
                                  </Tag>
                                ) : cell.info.header === 'actions' ? (
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                      kind="ghost"
                                      size="sm"
                                      renderIcon={Edit}
                                      iconDescription="Editar"
                                      onClick={() => {}}
                                    />
                                    <Button
                                      kind="danger--ghost"
                                      size="sm"
                                      renderIcon={TrashCan}
                                      iconDescription="Remover"
                                      onClick={() => setConfirmDelete(row.id)}
                                    />
                                  </div>
                                ) : (
                                  cell.value
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>

              {/* Delete Confirmation Modal */}
              {confirmDelete && (
                <Modal
                  open={!!confirmDelete}
                  onRequestClose={() => setConfirmDelete(null)}
                  primaryButtonText="Remover"
                  secondaryButtonText="Cancelar"
                  onRequestSubmit={() => removeMember(confirmDelete)}
                  modalHeading="Confirmar Remoção"
                  danger
                >
                  <p>Tem certeza de que deseja remover este membro? Esta ação não pode ser desfeita.</p>
                </Modal>
              )}
            </div>
          </TabPanel>

          {/* Tab 2: Permissões */}
          <TabPanel>
            <div style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <Select
                  id="role-select"
                  labelText="Selecione a Função"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <SelectItem value="admin" text="Admin" />
                  <SelectItem value="manager" text="Manager" />
                  <SelectItem value="designer" text="Designer" />
                  <SelectItem value="editor" text="Editor" />
                  <SelectItem value="viewer" text="Viewer" />
                </Select>
              </div>

              {/* Permission Matrix */}
              <div style={{ overflowX: 'auto' }}>
                <StructuredListWrapper>
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head style={{ width: '200px' }}>
                        Recurso
                      </StructuredListCell>
                      {PERMISSION_ACTIONS.map(action => (
                        <StructuredListCell head key={action} style={{ width: '100px', textAlign: 'center' }}>
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </StructuredListCell>
                      ))}
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    {FEATURES.map(feature => (
                      <StructuredListRow key={feature.key}>
                        <StructuredListCell>
                          <span style={{ fontWeight: '500' }}>{feature.label}</span>
                        </StructuredListCell>
                        {PERMISSION_ACTIONS.map(action => (
                          <StructuredListCell key={`${feature.key}-${action}`} style={{ textAlign: 'center' }}>
                            <Toggle
                              id={`perm-${feature.key}-${action}`}
                              toggled={permissions[selectedRole]?.[feature.key as keyof PermissionSet]?.[action as 'view' | 'create' | 'edit' | 'delete'] || false}
                              onToggle={() => togglePermission(selectedRole, feature.key, action)}
                              size="sm"
                            />
                          </StructuredListCell>
                        ))}
                      </StructuredListRow>
                    ))}
                  </StructuredListBody>
                </StructuredListWrapper>
              </div>

              {/* Save Button */}
              <div style={{ marginTop: '2rem' }}>
                <Button
                  kind={permissionDirty ? 'primary' : 'secondary'}
                  onClick={savePermissions}
                  disabled={!permissionDirty}
                  renderIcon={Checkmark}
                >
                  Salvar Permissões
                </Button>
              </div>
            </div>
          </TabPanel>

          {/* Tab 3: Plano */}
          <TabPanel>
            <div style={{ padding: '2rem' }}>
              {/* Current Plan */}
              <Tile style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                  Plano Atual
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                      {currentPlan?.name}
                    </p>
                    <p style={{ color: 'var(--cds-text-02, #525252)' }}>
                      {currentPlan?.price}
                    </p>
                  </div>
                  {organization?.plan_type !== 'enterprise' && (
                    <Button
                      kind="primary"
                      renderIcon={ArrowRight}
                      onClick={() => setToast({ message: 'Formulário de upgrade em desenvolvimento', type: 'info', visible: true })}
                    >
                      Fazer Upgrade
                    </Button>
                  )}
                </div>
              </Tile>

              {/* Usage Stats */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                  Uso do Plano
                </h3>
                <Grid fullWidth>
                  <Column lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                    <Tile style={{ padding: '1.5rem', textAlign: 'center' }}>
                      <p style={{ color: 'var(--cds-text-02, #525252)', marginBottom: '0.5rem' }}>
                        Membros
                      </p>
                      <p style={{ fontSize: '2rem', fontWeight: '700' }}>
                        {members.length} / {currentPlan?.memberLimit === Infinity ? '∞' : currentPlan?.memberLimit}
                      </p>
                    </Tile>
                  </Column>
                  <Column lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                    <Tile style={{ padding: '1.5rem', textAlign: 'center' }}>
                      <p style={{ color: 'var(--cds-text-02, #525252)', marginBottom: '0.5rem' }}>
                        Armazenamento
                      </p>
                      <p style={{ fontSize: '2rem', fontWeight: '700' }}>
                        2.3 GB / {currentPlan?.storageGb === Infinity ? '∞' : currentPlan?.storageGb + ' GB'}
                      </p>
                    </Tile>
                  </Column>
                  <Column lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                    <Tile style={{ padding: '1.5rem', textAlign: 'center' }}>
                      <p style={{ color: 'var(--cds-text-02, #525252)', marginBottom: '0.5rem' }}>
                        Chamadas API/Mês
                      </p>
                      <p style={{ fontSize: '2rem', fontWeight: '700' }}>
                        45.2K / {currentPlan?.apiCallsPerMonth === Infinity ? '∞' : ((currentPlan?.apiCallsPerMonth ?? 0) / 1000).toFixed(0) + 'K'}
                      </p>
                    </Tile>
                  </Column>
                </Grid>
              </div>

              {/* Plan Comparison */}
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                  Comparação de Planos
                </h3>
                <Grid fullWidth>
                  {PLANS.map(plan => (
                    <Column lg={4} md={4} sm={4} key={plan.type} style={{ marginBottom: '1rem' }}>
                      <Tile
                        style={{
                          padding: '1.5rem',
                          border: organization?.plan_type === plan.type ? '2px solid var(--cds-interactive-01, #0f62fe)' : '1px solid var(--cds-border-subtle, #e8e8e8)',
                        }}
                      >
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          {plan.name}
                        </h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                          {plan.price}
                        </p>
                        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8' }}>
                          {plan.features.map((feature, idx) => (
                            <li key={idx} style={{ marginBottom: '0.5rem', color: 'var(--cds-text-02, #525252)' }}>
                              • {feature}
                            </li>
                          ))}
                        </ul>
                        {organization?.plan_type === plan.type && (
                          <Tag type="green" style={{ marginTop: '1rem' }}>
                            Plano Atual
                          </Tag>
                        )}
                      </Tile>
                    </Column>
                  ))}
                </Grid>
              </div>
            </div>
          </TabPanel>

          {/* Tab 4: Auditoria */}
          <TabPanel>
            <div style={{ padding: '2rem' }}>
              {/* Filters */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Select
                  id="audit-filter"
                  labelText="Filtrar por Ação"
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  style={{ width: '250px' }}
                >
                  <SelectItem value="all" text="Todas as ações" />
                  <SelectItem value="convidado" text="Membro convidado" />
                  <SelectItem value="permissão" text="Permissão alterada" />
                  <SelectItem value="publicado" text="Post publicado" />
                  <SelectItem value="removido" text="Membro removido" />
                </Select>
                <Select
                  id="audit-date"
                  labelText="Intervalo de Data"
                  value={auditDateRange}
                  onChange={(e) => setAuditDateRange(e.target.value as any)}
                  style={{ width: '200px' }}
                >
                  <SelectItem value="7d" text="Últimos 7 dias" />
                  <SelectItem value="30d" text="Últimos 30 dias" />
                  <SelectItem value="90d" text="Últimos 90 dias" />
                </Select>
              </div>

              {/* Audit Table */}
              <DataTable
                rows={filteredAuditLog.map(entry => ({
                  id: entry.id,
                  date: entry.date,
                  user: entry.user,
                  action: entry.action,
                  detail: entry.detail,
                }))}
                headers={auditHeaders}
              >
                {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                  <TableContainer title="Log de Auditoria">
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader {...getHeaderProps({ header })} key={header.key}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>
                                {cell.value}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
