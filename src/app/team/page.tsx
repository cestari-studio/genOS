'use client';

import { useEffect, useState, useMemo } from 'react';
import {
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
  TableContainer,
  Button,
  Tag,
  OverflowMenu,
  OverflowMenuItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  Select,
  SelectItem,
  Toggle,
  Checkbox,
  NumberInput,
  Pagination,
  Tile,
  Tooltip,
  InlineLoading,
} from '@carbon/react';
import {
  Add,
  Edit,
  View,
  Renew,
  Download,
  CheckmarkFilled,
  Close,
  UserFollow,
  Information,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  UserRole,
  USER_ROLE_CONFIG,
  TeamMemberFormData,
} from '@/types/database';
import './team.scss';


// Role color mapping
const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'red',
  agency_owner: 'red',
  agency_manager: 'blue',
  agency_member: 'gray',
  client_owner: 'purple',
  client_member: 'purple',
  freelancer: 'green',
  employee: 'cyan',
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    email: '',
    first_name: '',
    last_name: '',
    role: 'agency_member',
    can_see_client_data: false,
    can_see_analytics: false,
    can_manage_team: false,
    can_publish_posts: false,
    is_freelancer: false,
    hourly_rate: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  // Load team members from Supabase
  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading team members:', error);
        setTeamMembers([]);
      } else {
        setTeamMembers(data || []);
      }
    } catch (err) {
      console.error('Error loading team members:', err);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadTeamMembers();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: teamMembers.length,
      active: teamMembers.filter((m) => m.is_active).length,
      freelancers: teamMembers.filter((m) => m.is_freelancer).length,
      uniqueRoles: new Set(teamMembers.map((m) => m.role)).size,
    };
  }, [teamMembers]);

  // Filter members by role and search
  useEffect(() => {
    let filtered = teamMembers;

    if (selectedRole !== 'all') {
      filtered = filtered.filter((m) => m.role === selectedRole);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.first_name?.toLowerCase().includes(term) ||
          m.last_name?.toLowerCase().includes(term) ||
          m.email?.toLowerCase().includes(term)
      );
    }

    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [selectedRole, searchTerm, teamMembers]);

  // Paginate
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMembers.slice(startIndex, startIndex + pageSize);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  // Get avatar initials
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return `${first}${last}`.slice(0, 2) || 'U';
  };

  // Get avatar background color based on role
  const getAvatarBgColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      super_admin: 'var(--genos-danger)',
      agency_owner: 'var(--genos-danger)',
      agency_manager: 'var(--genos-primary)',
      agency_member: 'var(--genos-secondary)',
      client_owner: 'var(--genos-secondary)',
      client_member: 'var(--genos-secondary)',
      freelancer: 'var(--genos-success)',
      employee: 'var(--genos-info)',
    };
    return colors[role];
  };

  // Handle modal open
  const handleOpenModal = (member?: User) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        email: member.email,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        role: member.role,
        can_see_client_data: member.can_see_client_data,
        can_see_analytics: member.can_see_analytics,
        can_manage_team: member.can_manage_team,
        can_publish_posts: member.can_publish_posts,
        is_freelancer: member.is_freelancer,
        hourly_rate: member.hourly_rate,
      });
    } else {
      setEditingMember(null);
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'agency_member',
        can_see_client_data: false,
        can_see_analytics: false,
        can_manage_team: false,
        can_publish_posts: false,
        is_freelancer: false,
        hourly_rate: null,
      });
    }
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  // Handle form submit
  const handleFormSubmit = async () => {
    try {
      const supabase = createClient();
      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from('users')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingMember.id);

        if (error) {
          console.error('Error updating member:', error);
          return;
        }
      } else {
        // Create new member
        const { error } = await supabase
          .from('users')
          .insert([
            {
              ...formData,
              organization_id: '213247a0-ac0f-4a1f-b337-0c2d963f2c7c',
              is_active: true,
              email_verified: false,
              preferences: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (error) {
          console.error('Error creating member:', error);
          return;
        }
      }

      // Reload data and close modal
      await loadTeamMembers();
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  // Handle activate/deactivate
  const handleToggleActive = async (member: User) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('users')
        .update({ is_active: !member.is_active })
        .eq('id', member.id);

      if (error) {
        console.error('Error updating member status:', error);
        return;
      }

      // Reload data
      await loadTeamMembers();
    } catch (err) {
      console.error('Error toggling member status:', err);
    }
  };

  // Handle export
  const handleExport = () => {
    const csv = [
      ['Nome', 'Email', 'Cargo', 'Status', 'Freelancer'],
      ...teamMembers.map((m) => [
        `${m.first_name} ${m.last_name}`,
        m.email,
        USER_ROLE_CONFIG[m.role].label,
        m.is_active ? 'Ativo' : 'Inativo',
        m.is_freelancer ? 'Sim' : 'Não',
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equipe-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="team-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__content">
          <h1>Equipe</h1>
          <p>Gerencie os membros da sua organização</p>
        </div>
        <div className="page-header__actions">
          <Button
            kind="primary"
            renderIcon={Add}
            onClick={() => handleOpenModal()}
          >
            Convidar Membro
          </Button>
          <Button kind="secondary" renderIcon={Download} onClick={handleExport}>
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      {loading ? (
        <div className="loading-container">
          <InlineLoading description="Carregando membros da equipe..." />
        </div>
      ) : (
        <div className="team-stats">
          <Tile className="stat-tile stat-tile--blue">
            <div className="stat-tile__content">
              <div className="stat-tile__value">{stats.total}</div>
              <div className="stat-tile__label">Total Membros</div>
            </div>
          </Tile>
          <Tile className="stat-tile stat-tile--green">
            <div className="stat-tile__content">
              <div className="stat-tile__value">{stats.active}</div>
              <div className="stat-tile__label">Ativos</div>
            </div>
          </Tile>
          <Tile className="stat-tile stat-tile--purple">
            <div className="stat-tile__content">
              <div className="stat-tile__value">{stats.freelancers}</div>
              <div className="stat-tile__label">Freelancers</div>
            </div>
          </Tile>
          <Tile className="stat-tile stat-tile--cyan">
            <div className="stat-tile__content">
              <div className="stat-tile__value">{stats.uniqueRoles}</div>
              <div className="stat-tile__label">Tipos de Cargo</div>
            </div>
          </Tile>
        </div>
      )}

      {/* Role Filter Bar */}
      <div className="role-filter-bar">
        <div className="role-filter-bar__scroll">
          <Tag
            type={selectedRole === 'all' ? 'blue' : 'outline'}
            onClick={() => setSelectedRole('all')}
            className="role-filter-tag"
          >
            Todos
          </Tag>
          {Object.entries(USER_ROLE_CONFIG).map(([roleKey, roleConfig]) => (
            <Tag
              key={roleKey}
              type={selectedRole === roleKey ? 'blue' : 'outline'}
              onClick={() => setSelectedRole(roleKey as UserRole)}
              className="role-filter-tag"
            >
              {roleConfig.label}
            </Tag>
          ))}
        </div>
      </div>

      {/* DataTable */}
      <DataTable rows={paginatedMembers} headers={[]}>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  persistent
                  placeholder="Buscar membro..."
                  onChange={(_e: '' | React.ChangeEvent<HTMLInputElement>, value?: string) => setSearchTerm(value ?? '')}
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableHeader>Membro</TableHeader>
                  <TableHeader>Cargo</TableHeader>
                  <TableHeader>Permissões</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMembers.map((member) => (
                  <TableRow key={member.id}>
                    {/* Member Cell */}
                    <TableCell>
                      <div className="member-cell">
                        <div
                          className="member-cell__avatar"
                          style={{
                            backgroundColor: getAvatarBgColor(member.role),
                          }}
                        >
                          {getInitials(member.first_name, member.last_name)}
                        </div>
                        <div className="member-cell__info">
                          <div className="member-cell__name">
                            {member.first_name} {member.last_name}
                          </div>
                          <div className="member-cell__email">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role Cell */}
                    <TableCell>
                      <Tag
                        type={ROLE_COLORS[member.role] as any}
                      >
                        {USER_ROLE_CONFIG[member.role].label}
                      </Tag>
                    </TableCell>

                    {/* Permissions Cell */}
                    <TableCell>
                      <div className="permissions-row">
                        <Tooltip
                          label="Visualizar dados de clientes"
                          align="bottom"
                        >
                          <div
                            className={`permission-dot ${
                              member.can_see_client_data ? 'active' : ''
                            }`}
                          />
                        </Tooltip>
                        <Tooltip label="Visualizar análises" align="bottom">
                          <div
                            className={`permission-dot ${
                              member.can_see_analytics ? 'active' : ''
                            }`}
                          />
                        </Tooltip>
                        <Tooltip label="Gerenciar equipe" align="bottom">
                          <div
                            className={`permission-dot ${
                              member.can_manage_team ? 'active' : ''
                            }`}
                          />
                        </Tooltip>
                        <Tooltip label="Publicar posts" align="bottom">
                          <div
                            className={`permission-dot ${
                              member.can_publish_posts ? 'active' : ''
                            }`}
                          />
                        </Tooltip>
                      </div>
                    </TableCell>

                    {/* Status Cell */}
                    <TableCell>
                      <Tag
                        type={member.is_active ? 'green' : 'gray'}
                      >
                        {member.is_active ? 'Ativo' : 'Inativo'}
                      </Tag>
                    </TableCell>

                    {/* Actions Cell */}
                    <TableCell>
                      <OverflowMenu flipped>
                        <OverflowMenuItem
                          itemText="Editar"
                          onClick={() => handleOpenModal(member)}
                        />
                        <OverflowMenuItem itemText="Ver detalhes" />
                        <OverflowMenuItem
                          itemText={
                            member.is_active ? 'Desativar' : 'Ativar'
                          }
                          isDelete={member.is_active}
                          onClick={() => handleToggleActive(member)}
                        />
                      </OverflowMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      {/* Pagination */}
      <div className="pagination-container">
        <Pagination
          backwardText="Anterior"
          forwardText="Próxima"
          pageNumberText="Página"
          pageSize={pageSize}
          pageSizes={[10, 25, 50]}
          totalItems={filteredMembers.length}
          onChange={(e) => setCurrentPage(e.page)}
        />
      </div>

      {/* Invite/Edit Modal */}
      <Modal
        open={isModalOpen}
        onRequestClose={handleCloseModal}
        modalHeading={editingMember ? 'Editar Membro' : 'Convidar Membro'}
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
        onRequestSubmit={handleFormSubmit}
        size="lg"
      >
        <ModalBody>
          <div className="form-group">
            <TextInput
              id="email"
              labelText="Email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.currentTarget.value })
              }
              disabled={!!editingMember}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <TextInput
                id="first_name"
                labelText="Primeiro Nome"
                placeholder="João"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    first_name: e.currentTarget.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <TextInput
                id="last_name"
                labelText="Sobrenome"
                placeholder="Silva"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.currentTarget.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <Select
              id="role"
              labelText="Cargo"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.currentTarget.value as UserRole,
                })
              }
            >
              {Object.entries(USER_ROLE_CONFIG).map(([roleKey, roleConfig]) => (
                <SelectItem key={roleKey} value={roleKey} text={roleConfig.label} />
              ))}
            </Select>
            <div className="role-description">
              {USER_ROLE_CONFIG[formData.role].description}
            </div>
          </div>

          <div className="form-divider">
            <h4>Permissões</h4>
          </div>

          <div className="form-group">
            <Toggle
              id="can_see_client_data"
              labelText="Visualizar dados de clientes"
              toggled={formData.can_see_client_data}
              onToggle={(checked) =>
                setFormData({ ...formData, can_see_client_data: checked })
              }
            />
          </div>

          <div className="form-group">
            <Toggle
              id="can_see_analytics"
              labelText="Visualizar análises"
              toggled={formData.can_see_analytics}
              onToggle={(checked) =>
                setFormData({ ...formData, can_see_analytics: checked })
              }
            />
          </div>

          <div className="form-group">
            <Toggle
              id="can_manage_team"
              labelText="Gerenciar equipe"
              toggled={formData.can_manage_team}
              onToggle={(checked) =>
                setFormData({ ...formData, can_manage_team: checked })
              }
            />
          </div>

          <div className="form-group">
            <Toggle
              id="can_publish_posts"
              labelText="Publicar posts"
              toggled={formData.can_publish_posts}
              onToggle={(checked) =>
                setFormData({ ...formData, can_publish_posts: checked })
              }
            />
          </div>

          <div className="form-divider">
            <h4>Informações Adicionais</h4>
          </div>

          <div className="form-group">
            <Checkbox
              id="is_freelancer"
              labelText="É um freelancer?"
              checked={formData.is_freelancer}
              onChange={(_e: React.ChangeEvent<HTMLInputElement>, { checked }: { checked: boolean }) =>
                setFormData({
                  ...formData,
                  is_freelancer: checked,
                  hourly_rate: checked ? formData.hourly_rate || 0 : null,
                })
              }
            />
          </div>

          {formData.is_freelancer && (
            <div className="form-group">
              <NumberInput
                id="hourly_rate"
                label="Taxa por Hora (R$)"
                value={formData.hourly_rate ?? 0}
                onChange={(_e: any, { value }: { value: number | string }) =>
                  setFormData({
                    ...formData,
                    hourly_rate: typeof value === 'number' ? value : parseFloat(value) || null,
                  })
                }
                step={0.5}
                min={0}
              />
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
