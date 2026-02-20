'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Grid,
  Column,
  Tile,
  Button,
  Form,
  Stack,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Toggle,
  FileUploader,
  Breadcrumb,
  BreadcrumbItem,
  InlineNotification,
  SkeletonText,
} from '@carbon/react';
import { Save, TrashCan, ArrowLeft } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  client_type?: string;
  notes?: string;
}

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const isNew = clientId === 'new';

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchClient();
    }
  }, [clientId]);

  async function fetchClient() {
    const supabase = createClient();
    const { data, error } = await supabase.from('clients').select('*').eq('id', clientId).single();
    if (data) setClient(data);
    if (error) setError('Cliente não encontrado');
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const clientData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      status: formData.get('status') as string,
      client_type: formData.get('client_type') as string,
      notes: formData.get('notes') as string || null,
    };

    if (isNew) {
      const { data, error } = await supabase.from('clients').insert(clientData).select().single();
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
      router.push(`/clients/${data.id}`);
    } else {
      const { error } = await supabase.from('clients').update(clientData).eq('id', clientId);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
      setSuccess(true);
      setSaving(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    const supabase = createClient();
    const { error } = await supabase.from('clients').delete().eq('id', clientId);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/clients');
  };

  if (loading) {
    return (
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <SkeletonText heading width="30%" />
        </Column>
      </Grid>
    );
  }

  return (
    <Grid fullWidth>
      {/* Breadcrumb */}
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="/clients">Clientes</BreadcrumbItem>
          {!isNew && <BreadcrumbItem href={`/clients/${clientId}`}>{client?.name}</BreadcrumbItem>}
          <BreadcrumbItem isCurrentPage>{isNew ? 'Novo Cliente' : 'Editar'}</BreadcrumbItem>
        </Breadcrumb>
      </Column>

      {/* Header */}
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 1.5rem' }}>
          <h1>{isNew ? 'Novo Cliente' : 'Editar Cliente'}</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button kind="secondary" renderIcon={ArrowLeft} onClick={() => router.back()}>
              Voltar
            </Button>
            {!isNew && (
              <Button kind="danger" renderIcon={TrashCan} onClick={handleDelete}>
                Excluir
              </Button>
            )}
          </div>
        </div>
      </Column>

      {/* Notifications */}
      <Column lg={16} md={8} sm={4}>
        {error && (
          <InlineNotification kind="error" title="Erro" subtitle={error} hideCloseButton style={{ marginBottom: '1rem' }} />
        )}
        {success && (
          <InlineNotification kind="success" title="Sucesso" subtitle="Cliente salvo com sucesso!" hideCloseButton style={{ marginBottom: '1rem' }} />
        )}
      </Column>

      {/* Form */}
      <Column lg={12} md={8} sm={4}>
        <Tile>
          <Form onSubmit={handleSubmit}>
            <Stack gap={6}>
              <h4>Informações Básicas</h4>

              <Grid narrow>
                <Column lg={8} md={4} sm={4}>
                  <TextInput
                    id="name"
                    name="name"
                    labelText="Nome completo"
                    defaultValue={client?.name || ''}
                    required
                  />
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <TextInput
                    id="email"
                    name="email"
                    labelText="Email"
                    type="email"
                    defaultValue={client?.email || ''}
                    required
                  />
                </Column>
              </Grid>

              <Grid narrow>
                <Column lg={8} md={4} sm={4}>
                  <TextInput
                    id="phone"
                    name="phone"
                    labelText="Telefone"
                    defaultValue={client?.phone || ''}
                  />
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <Select
                    id="client_type"
                    name="client_type"
                    labelText="Tipo de Cliente"
                    defaultValue={client?.client_type || 'individual'}
                  >
                    <SelectItem value="individual" text="Pessoa Física" />
                    <SelectItem value="company" text="Empresa" />
                    <SelectItem value="agency" text="Agência" />
                  </Select>
                </Column>
              </Grid>

              <Select
                id="status"
                name="status"
                labelText="Status"
                defaultValue={client?.status || 'active'}
              >
                <SelectItem value="active" text="Ativo" />
                <SelectItem value="inactive" text="Inativo" />
                <SelectItem value="prospect" text="Prospect" />
                <SelectItem value="archived" text="Arquivado" />
              </Select>

              <TextArea
                id="notes"
                name="notes"
                labelText="Observações"
                defaultValue={client?.notes || ''}
                rows={4}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <Button kind="secondary" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" renderIcon={Save} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </Stack>
          </Form>
        </Tile>
      </Column>

      {/* Sidebar */}
      <Column lg={4} md={8} sm={4}>
        <Tile>
          <h4 style={{ marginBottom: '1rem' }}>Avatar</h4>
          <FileUploader
            labelTitle=""
            labelDescription="Max 1MB. PNG, JPG"
            buttonLabel="Upload"
            filenameStatus="edit"
            accept={['.jpg', '.png']}
          />
        </Tile>
      </Column>
    </Grid>
  );
}
