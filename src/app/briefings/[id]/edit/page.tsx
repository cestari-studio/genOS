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
  Form,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  Accordion,
  AccordionItem,
  Tag,
  InlineNotification,
  NumberInput,
} from '@carbon/react';
import {
  Save,
  ArrowLeft,
  Add,
  Close,
  TrashCan,
} from '@carbon/icons-react';

// TODO: Integrar com Supabase para dados reais

interface Deliverable {
  id: string;
  name: string;
  description: string;
  quantity: number;
}

interface Milestone {
  id: string;
  name: string;
  date: string;
}

interface BudgetItem {
  id: string;
  item: string;
  value: number;
}

export default function EditBriefingPage() {
  const params = useParams();
  const router = useRouter();
  const briefingId = params.id as string;

  const [saved, setSaved] = useState(false);

  // Estados do formulário
  const [basicInfo, setBasicInfo] = useState({
    title: 'Briefing - Website Institucional',
    project: 'project-1',
    client: 'client-1',
    status: 'draft',
  });

  const [overview, setOverview] = useState({
    objective: 'Desenvolver um website institucional moderno e responsivo que transmita profissionalismo e inovação.',
    targetAudience: 'Empresas B2B do setor de tecnologia, gerentes de TI, CTOs.',
    competitors: 'CompetitorA.com, CompetitorB.com.br',
    references: 'apple.com, stripe.com, linear.app',
  });

  const [brand, setBrand] = useState({
    tone: 'Profissional, Inovador, Confiável',
    colors: 'Azul principal (#0066CC), cinza escuro, branco',
    fonts: 'Sans-serif moderna (sugestão: Inter ou IBM Plex Sans)',
    guidelines: 'Manter consistência com material existente.',
  });

  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: '1', name: 'Homepage', description: 'Página inicial com hero', quantity: 1 },
    { id: '2', name: 'Páginas Institucionais', description: 'Sobre, Equipe, Contato', quantity: 3 },
  ]);

  const [timeline, setTimeline] = useState({
    startDate: '2024-01-15',
    deadline: '2024-03-15',
  });

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', name: 'Aprovação de Wireframes', date: '2024-01-25' },
    { id: '2', name: 'Aprovação de Design', date: '2024-02-10' },
  ]);

  const [budget, setBudget] = useState({
    total: 25000,
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', item: 'Design UI/UX', value: 8000 },
    { id: '2', item: 'Desenvolvimento', value: 12000 },
    { id: '3', item: 'Testes e Deploy', value: 5000 },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // TODO: Salvar no Supabase
  };

  const addDeliverable = () => {
    setDeliverables([...deliverables, { id: Date.now().toString(), name: '', description: '', quantity: 1 }]);
  };

  const removeDeliverable = (id: string) => {
    setDeliverables(deliverables.filter(d => d.id !== id));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now().toString(), name: '', date: '' }]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, { id: Date.now().toString(), item: '', value: 0 }]);
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(b => b.id !== id));
  };

  const calculatedTotal = budgetItems.reduce((acc, item) => acc + item.value, 0);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/briefings">Briefings</BreadcrumbItem>
        <BreadcrumbItem href={`/briefings/${briefingId}`}>Briefing</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Editar</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Editar Briefing</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>Atualize as informações do briefing</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href={`/briefings/${briefingId}`}>
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>Cancelar</Button>
          </Link>
          <Button kind="danger--ghost" size="sm" renderIcon={TrashCan}>Excluir</Button>
        </div>
      </div>

      {saved && (
        <InlineNotification
          kind="success"
          title="Sucesso"
          subtitle="Briefing salvo com sucesso!"
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Form onSubmit={handleSave}>
        <Grid fullWidth>
          <Column lg={12} md={8} sm={4}>
            <Accordion>
              {/* Informações Básicas */}
              <AccordionItem title="Informações Básicas" open>
                <Stack gap={6} style={{ padding: '1rem 0' }}>
                  <TextInput
                    id="title"
                    labelText="Título do Briefing"
                    value={basicInfo.title}
                    onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
                    required
                  />
                  <Grid fullWidth>
                    <Column lg={6} md={4} sm={4}>
                      <Select
                        id="client"
                        labelText="Cliente"
                        value={basicInfo.client}
                        onChange={(e) => setBasicInfo({ ...basicInfo, client: e.target.value })}
                      >
                        <SelectItem value="" text="Selecione" />
                        <SelectItem value="client-1" text="TechCorp Brasil" />
                        <SelectItem value="client-2" text="Startup XYZ" />
                      </Select>
                    </Column>
                    <Column lg={6} md={4} sm={4}>
                      <Select
                        id="status"
                        labelText="Status"
                        value={basicInfo.status}
                        onChange={(e) => setBasicInfo({ ...basicInfo, status: e.target.value })}
                      >
                        <SelectItem value="draft" text="Rascunho" />
                        <SelectItem value="sent" text="Enviado" />
                        <SelectItem value="approved" text="Aprovado" />
                        <SelectItem value="revision" text="Em Revisão" />
                      </Select>
                    </Column>
                  </Grid>
                </Stack>
              </AccordionItem>

              {/* Visão Geral */}
              <AccordionItem title="Visão Geral">
                <Stack gap={6} style={{ padding: '1rem 0' }}>
                  <TextArea
                    id="objective"
                    labelText="Objetivo do Projeto"
                    value={overview.objective}
                    onChange={(e) => setOverview({ ...overview, objective: e.target.value })}
                    rows={4}
                  />
                  <TextArea
                    id="targetAudience"
                    labelText="Público-Alvo"
                    value={overview.targetAudience}
                    onChange={(e) => setOverview({ ...overview, targetAudience: e.target.value })}
                    rows={3}
                  />
                  <TextInput
                    id="competitors"
                    labelText="Concorrentes (separados por vírgula)"
                    value={overview.competitors}
                    onChange={(e) => setOverview({ ...overview, competitors: e.target.value })}
                  />
                  <TextInput
                    id="references"
                    labelText="Referências (separadas por vírgula)"
                    value={overview.references}
                    onChange={(e) => setOverview({ ...overview, references: e.target.value })}
                  />
                </Stack>
              </AccordionItem>

              {/* Marca */}
              <AccordionItem title="Identidade da Marca">
                <Stack gap={6} style={{ padding: '1rem 0' }}>
                  <TextInput
                    id="tone"
                    labelText="Tom de Voz (separados por vírgula)"
                    value={brand.tone}
                    onChange={(e) => setBrand({ ...brand, tone: e.target.value })}
                  />
                  <TextInput
                    id="colors"
                    labelText="Paleta de Cores"
                    value={brand.colors}
                    onChange={(e) => setBrand({ ...brand, colors: e.target.value })}
                  />
                  <TextInput
                    id="fonts"
                    labelText="Tipografia"
                    value={brand.fonts}
                    onChange={(e) => setBrand({ ...brand, fonts: e.target.value })}
                  />
                  <TextArea
                    id="guidelines"
                    labelText="Diretrizes Adicionais"
                    value={brand.guidelines}
                    onChange={(e) => setBrand({ ...brand, guidelines: e.target.value })}
                    rows={3}
                  />
                </Stack>
              </AccordionItem>

              {/* Entregas */}
              <AccordionItem title="Entregas">
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <Button kind="ghost" size="sm" renderIcon={Add} onClick={addDeliverable}>
                      Adicionar Entrega
                    </Button>
                  </div>
                  <Stack gap={4}>
                    {deliverables.map((d, index) => (
                      <div key={d.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', padding: '1rem', background: 'var(--cds-background)', borderRadius: '4px' }}>
                        <div style={{ flex: 2 }}>
                          <TextInput
                            id={`del-name-${index}`}
                            labelText="Nome"
                            value={d.name}
                            onChange={(e) => {
                              const updated = [...deliverables];
                              updated[index].name = e.target.value;
                              setDeliverables(updated);
                            }}
                          />
                        </div>
                        <div style={{ flex: 3 }}>
                          <TextInput
                            id={`del-desc-${index}`}
                            labelText="Descrição"
                            value={d.description}
                            onChange={(e) => {
                              const updated = [...deliverables];
                              updated[index].description = e.target.value;
                              setDeliverables(updated);
                            }}
                          />
                        </div>
                        <div style={{ width: '100px' }}>
                          <NumberInput
                            id={`del-qty-${index}`}
                            label="Qtd."
                            value={d.quantity}
                            min={1}
                            onChange={(e, { value }) => {
                              const updated = [...deliverables];
                              updated[index].quantity = value as number;
                              setDeliverables(updated);
                            }}
                          />
                        </div>
                        <Button
                          kind="ghost"
                          size="sm"
                          hasIconOnly
                          iconDescription="Remover"
                          renderIcon={Close}
                          onClick={() => removeDeliverable(d.id)}
                        />
                      </div>
                    ))}
                  </Stack>
                </div>
              </AccordionItem>

              {/* Cronograma */}
              <AccordionItem title="Cronograma">
                <div style={{ padding: '1rem 0' }}>
                  <Grid fullWidth style={{ marginBottom: '1.5rem' }}>
                    <Column lg={6} md={4} sm={4}>
                      <TextInput
                        id="startDate"
                        labelText="Data de Início"
                        type="date"
                        value={timeline.startDate}
                        onChange={(e) => setTimeline({ ...timeline, startDate: e.target.value })}
                      />
                    </Column>
                    <Column lg={6} md={4} sm={4}>
                      <TextInput
                        id="deadline"
                        labelText="Prazo Final"
                        type="date"
                        value={timeline.deadline}
                        onChange={(e) => setTimeline({ ...timeline, deadline: e.target.value })}
                      />
                    </Column>
                  </Grid>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0 }}>Marcos</h4>
                    <Button kind="ghost" size="sm" renderIcon={Add} onClick={addMilestone}>
                      Adicionar Marco
                    </Button>
                  </div>
                  <Stack gap={3}>
                    {milestones.map((m, index) => (
                      <div key={m.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 2 }}>
                          <TextInput
                            id={`milestone-name-${index}`}
                            labelText="Nome do Marco"
                            value={m.name}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[index].name = e.target.value;
                              setMilestones(updated);
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <TextInput
                            id={`milestone-date-${index}`}
                            labelText="Data"
                            type="date"
                            value={m.date}
                            onChange={(e) => {
                              const updated = [...milestones];
                              updated[index].date = e.target.value;
                              setMilestones(updated);
                            }}
                          />
                        </div>
                        <Button
                          kind="ghost"
                          size="sm"
                          hasIconOnly
                          iconDescription="Remover"
                          renderIcon={Close}
                          onClick={() => removeMilestone(m.id)}
                        />
                      </div>
                    ))}
                  </Stack>
                </div>
              </AccordionItem>

              {/* Orçamento */}
              <AccordionItem title="Orçamento">
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ color: 'var(--cds-text-secondary)' }}>Total Calculado: </span>
                      <strong style={{ fontSize: '1.25rem' }}>R$ {calculatedTotal.toLocaleString('pt-BR')}</strong>
                    </div>
                    <Button kind="ghost" size="sm" renderIcon={Add} onClick={addBudgetItem}>
                      Adicionar Item
                    </Button>
                  </div>
                  <Stack gap={3}>
                    {budgetItems.map((b, index) => (
                      <div key={b.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 2 }}>
                          <TextInput
                            id={`budget-item-${index}`}
                            labelText="Item"
                            value={b.item}
                            onChange={(e) => {
                              const updated = [...budgetItems];
                              updated[index].item = e.target.value;
                              setBudgetItems(updated);
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <NumberInput
                            id={`budget-value-${index}`}
                            label="Valor (R$)"
                            value={b.value}
                            min={0}
                            step={100}
                            onChange={(e, { value }) => {
                              const updated = [...budgetItems];
                              updated[index].value = value as number;
                              setBudgetItems(updated);
                            }}
                          />
                        </div>
                        <Button
                          kind="ghost"
                          size="sm"
                          hasIconOnly
                          iconDescription="Remover"
                          renderIcon={Close}
                          onClick={() => removeBudgetItem(b.id)}
                        />
                      </div>
                    ))}
                  </Stack>
                </div>
              </AccordionItem>
            </Accordion>
          </Column>

          <Column lg={4} md={8} sm={4}>
            <Tile style={{ position: 'sticky', top: '1rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Salvar Briefing</h3>
              <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Revise todas as seções antes de salvar. Você pode enviar ao cliente após salvar.
              </p>
              <Button type="submit" renderIcon={Save} style={{ width: '100%' }}>
                Salvar Alterações
              </Button>
            </Tile>
          </Column>
        </Grid>
      </Form>
    </div>
  );
}
