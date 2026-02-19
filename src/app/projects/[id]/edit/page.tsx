'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  Column,
  Tile,
  Button,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  DatePicker,
  DatePickerInput,
  Form,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  Tag,
  InlineNotification,
  NumberInput,
  MultiSelect,
  Toggle,
} from '@carbon/react';
import {
  Save,
  ArrowLeft,
  TrashCan,
  Add,
  Close,
} from '@carbon/icons-react';

// TODO: Integrar com Supabase para dados reais

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface Deliverable {
  id: string;
  name: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [saved, setSaved] = useState(false);
  const [project, setProject] = useState({
    name: 'Website Institucional',
    client: 'client-1',
    status: 'in_progress',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    budget: 25000,
    description: 'Desenvolvimento de website institucional completo com design responsivo e integração com CMS.',
    notes: '',
  });

  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'João Silva', role: 'Designer' },
    { id: '2', name: 'Maria Santos', role: 'Desenvolvedor' },
  ]);

  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: '1', name: 'Wireframes', deadline: '2024-01-25', status: 'completed' },
    { id: '2', name: 'Design Final', deadline: '2024-02-10', status: 'in_progress' },
    { id: '3', name: 'Desenvolvimento', deadline: '2024-03-01', status: 'pending' },
    { id: '4', name: 'Testes e Deploy', deadline: '2024-03-15', status: 'pending' },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // TODO: Salvar no Supabase
  };

  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      role: '',
    };
    setTeam([...team, newMember]);
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeam(team.filter(m => m.id !== id));
  };

  const handleAddDeliverable = () => {
    const newDeliverable: Deliverable = {
      id: Date.now().toString(),
      name: '',
      deadline: '',
      status: 'pending',
    };
    setDeliverables([...deliverables, newDeliverable]);
  };

  const handleRemoveDeliverable = (id: string) => {
    setDeliverables(deliverables.filter(d => d.id !== id));
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/projects">Projetos</BreadcrumbItem>
        <BreadcrumbItem href={`/projects/${projectId}`}>Projeto</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Editar</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Editar Projeto</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>Atualize as informações do projeto</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href={`/projects/${projectId}`}>
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>Cancelar</Button>
          </Link>
          <Button kind="danger--ghost" size="sm" renderIcon={TrashCan}>Excluir Projeto</Button>
        </div>
      </div>

      {saved && (
        <InlineNotification
          kind="success"
          title="Sucesso"
          subtitle="Projeto atualizado com sucesso!"
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Form onSubmit={handleSave}>
        <Grid>
          {/* Informações Básicas */}
          <Column lg={8} md={8} sm={4}>
            <Tile style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Informações Básicas</h3>
              <Stack gap={6}>
                <TextInput
                  id="name"
                  labelText="Nome do Projeto"
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  required
                />
                <Select
                  id="client"
                  labelText="Cliente"
                  value={project.client}
                  onChange={(e) => setProject({ ...project, client: e.target.value })}
                >
                  <SelectItem value="" text="Selecione um cliente" />
                  <SelectItem value="client-1" text="TechCorp Brasil" />
                  <SelectItem value="client-2" text="Startup XYZ" />
                  <SelectItem value="client-3" text="Empresa ABC" />
                </Select>
                <TextArea
                  id="description"
                  labelText="Descrição"
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  rows={4}
                />
                <TextArea
                  id="notes"
                  labelText="Notas Internas"
                  value={project.notes}
                  onChange={(e) => setProject({ ...project, notes: e.target.value })}
                  rows={3}
                  placeholder="Notas visíveis apenas para a equipe..."
                />
              </Stack>
            </Tile>

            {/* Equipe */}
            <Tile style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Equipe do Projeto</h3>
                <Button kind="ghost" size="sm" renderIcon={Add} onClick={handleAddTeamMember}>
                  Adicionar
                </Button>
              </div>
              <Stack gap={4}>
                {team.map((member, index) => (
                  <div key={member.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        id={`member-name-${index}`}
                        labelText="Nome"
                        value={member.name}
                        onChange={(e) => {
                          const newTeam = [...team];
                          newTeam[index].name = e.target.value;
                          setTeam(newTeam);
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Select
                        id={`member-role-${index}`}
                        labelText="Função"
                        value={member.role}
                        onChange={(e) => {
                          const newTeam = [...team];
                          newTeam[index].role = e.target.value;
                          setTeam(newTeam);
                        }}
                      >
                        <SelectItem value="" text="Selecione" />
                        <SelectItem value="Designer" text="Designer" />
                        <SelectItem value="Desenvolvedor" text="Desenvolvedor" />
                        <SelectItem value="Gerente" text="Gerente de Projeto" />
                        <SelectItem value="Redator" text="Redator" />
                        <SelectItem value="Social Media" text="Social Media" />
                      </Select>
                    </div>
                    <Button
                      kind="ghost"
                      size="sm"
                      hasIconOnly
                      iconDescription="Remover"
                      renderIcon={Close}
                      onClick={() => handleRemoveTeamMember(member.id)}
                    />
                  </div>
                ))}
              </Stack>
            </Tile>

            {/* Entregas */}
            <Tile>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Entregas</h3>
                <Button kind="ghost" size="sm" renderIcon={Add} onClick={handleAddDeliverable}>
                  Adicionar
                </Button>
              </div>
              <Stack gap={4}>
                {deliverables.map((deliverable, index) => (
                  <div key={deliverable.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 2 }}>
                      <TextInput
                        id={`deliverable-name-${index}`}
                        labelText="Entrega"
                        value={deliverable.name}
                        onChange={(e) => {
                          const newDeliverables = [...deliverables];
                          newDeliverables[index].name = e.target.value;
                          setDeliverables(newDeliverables);
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        id={`deliverable-deadline-${index}`}
                        labelText="Prazo"
                        type="date"
                        value={deliverable.deadline}
                        onChange={(e) => {
                          const newDeliverables = [...deliverables];
                          newDeliverables[index].deadline = e.target.value;
                          setDeliverables(newDeliverables);
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Select
                        id={`deliverable-status-${index}`}
                        labelText="Status"
                        value={deliverable.status}
                        onChange={(e) => {
                          const newDeliverables = [...deliverables];
                          newDeliverables[index].status = e.target.value as Deliverable['status'];
                          setDeliverables(newDeliverables);
                        }}
                      >
                        <SelectItem value="pending" text="Pendente" />
                        <SelectItem value="in_progress" text="Em Progresso" />
                        <SelectItem value="completed" text="Concluído" />
                      </Select>
                    </div>
                    <Button
                      kind="ghost"
                      size="sm"
                      hasIconOnly
                      iconDescription="Remover"
                      renderIcon={Close}
                      onClick={() => handleRemoveDeliverable(deliverable.id)}
                    />
                  </div>
                ))}
              </Stack>
            </Tile>
          </Column>

          {/* Sidebar */}
          <Column lg={4} md={8} sm={4}>
            <Tile style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Status e Datas</h3>
              <Stack gap={6}>
                <Select
                  id="status"
                  labelText="Status"
                  value={project.status}
                  onChange={(e) => setProject({ ...project, status: e.target.value })}
                >
                  <SelectItem value="planning" text="Planejamento" />
                  <SelectItem value="in_progress" text="Em Progresso" />
                  <SelectItem value="review" text="Em Revisão" />
                  <SelectItem value="completed" text="Concluído" />
                  <SelectItem value="on_hold" text="Pausado" />
                </Select>
                <Select
                  id="priority"
                  labelText="Prioridade"
                  value={project.priority}
                  onChange={(e) => setProject({ ...project, priority: e.target.value })}
                >
                  <SelectItem value="low" text="Baixa" />
                  <SelectItem value="medium" text="Média" />
                  <SelectItem value="high" text="Alta" />
                </Select>
                <TextInput
                  id="startDate"
                  labelText="Data de Início"
                  type="date"
                  value={project.startDate}
                  onChange={(e) => setProject({ ...project, startDate: e.target.value })}
                />
                <TextInput
                  id="endDate"
                  labelText="Data de Entrega"
                  type="date"
                  value={project.endDate}
                  onChange={(e) => setProject({ ...project, endDate: e.target.value })}
                />
              </Stack>
            </Tile>

            <Tile style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Financeiro</h3>
              <Stack gap={6}>
                <NumberInput
                  id="budget"
                  label="Orçamento (R$)"
                  value={project.budget}
                  onChange={(e, { value }) => setProject({ ...project, budget: value as number })}
                  min={0}
                  step={100}
                />
                <Toggle
                  id="billable"
                  labelText="Projeto Faturável"
                  labelA="Não"
                  labelB="Sim"
                  defaultToggled={true}
                />
              </Stack>
            </Tile>

            <Button type="submit" renderIcon={Save} style={{ width: '100%' }}>
              Salvar Alterações
            </Button>
          </Column>
        </Grid>
      </Form>
    </div>
  );
}
