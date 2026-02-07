'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  TextArea,
  Select,
  SelectItem,
  DatePicker,
  DatePickerInput,
  Button,
  Tile,
  InlineNotification,
  Grid,
  Column,
  SkeletonText,
} from '@carbon/react';
import { Save, ArrowLeft, View, Send } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface Client {
  id: string;
  name: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: '',
    format: '',
    client_id: '',
    scheduled_date: '',
    status: 'draft',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('id, name')
          .order('name');

        if (fetchError) throw fetchError;
        setClients(data || []);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setError('Erro ao carregar clientes.');
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (dates: Date[]) => {
    if (dates && dates.length > 0) {
      setFormData((prev) => ({
        ...prev,
        scheduled_date: dates[0].toISOString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!formData.title.trim()) {
      setError('Título é obrigatório.');
      setSubmitting(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Conteúdo é obrigatório.');
      setSubmitting(false);
      return;
    }

    if (!formData.platform) {
      setError('Plataforma é obrigatória.');
      setSubmitting(false);
      return;
    }

    if (!formData.format) {
      setError('Formato é obrigatório.');
      setSubmitting(false);
      return;
    }

    if (!formData.client_id) {
      setError('Cliente é obrigatório.');
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();

      const postData = {
        title: formData.title,
        content: formData.content,
        platform: formData.platform,
        format: formData.format,
        client_id: formData.client_id,
        status: 'draft',
        scheduled_date: formData.scheduled_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error: insertError } = await supabase
        .from('posts_v2')
        .insert([postData])
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push(`/posts/${data.id}`);
      }, 1000);
    } catch (err) {
      console.error('Erro ao criar post:', err);
      setError('Erro ao criar post. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {error && (
        <InlineNotification
          kind="error"
          title="Erro"
          subtitle={error}
          onClose={() => setError(null)}
          style={{ marginBottom: '1.5rem' }}
        />
      )}

      {success && (
        <InlineNotification
          kind="success"
          title="Sucesso"
          subtitle="Post criado com sucesso. Redirecionando..."
          style={{ marginBottom: '1.5rem' }}
        />
      )}

      <div style={{ marginBottom: '2rem' }}>
        <Button
          kind="ghost"
          renderIcon={ArrowLeft}
          onClick={() => router.push('/posts')}
        >
          Voltar
        </Button>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Novo Post</h1>

      <Grid>
        <Column lg={8}>
          <form onSubmit={handleSubmit}>
            <Tile style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                Informações do Post
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <TextInput
                  id="title"
                  name="title"
                  labelText="Título"
                  placeholder="Digite o título do post"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <TextArea
                  id="content"
                  name="content"
                  labelText="Conteúdo"
                  placeholder="Digite o conteúdo completo do post"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <Select
                  id="platform"
                  name="platform"
                  labelText="Plataforma"
                  value={formData.platform}
                  onChange={handleInputChange}
                  required
                >
                  <SelectItem value="" text="Selecione uma plataforma" />
                  <SelectItem value="Instagram" text="Instagram" />
                  <SelectItem value="LinkedIn" text="LinkedIn" />
                  <SelectItem value="Twitter" text="Twitter" />
                  <SelectItem value="Facebook" text="Facebook" />
                  <SelectItem value="TikTok" text="TikTok" />
                  <SelectItem value="Blog" text="Blog" />
                </Select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <Select
                  id="format"
                  name="format"
                  labelText="Formato"
                  value={formData.format}
                  onChange={handleInputChange}
                  required
                >
                  <SelectItem value="" text="Selecione um formato" />
                  <SelectItem value="Image" text="Imagem" />
                  <SelectItem value="Carousel" text="Carrossel" />
                  <SelectItem value="Video" text="Vídeo" />
                  <SelectItem value="Reels" text="Reels" />
                  <SelectItem value="Story" text="Story" />
                  <SelectItem value="Article" text="Artigo" />
                </Select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <Select
                  id="client_id"
                  name="client_id"
                  labelText="Cliente"
                  value={formData.client_id}
                  onChange={handleInputChange}
                  required
                  disabled={loadingClients}
                >
                  <SelectItem value="" text="Selecione um cliente" />
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id} text={client.name} />
                  ))}
                </Select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <DatePicker dateFormat="d/m/Y" onChange={handleDateChange}>
                  <DatePickerInput
                    id="scheduled_date"
                    placeholder="dd/mm/aaaa"
                    labelText="Data de Agendamento (Opcional)"
                  />
                </DatePicker>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  kind="primary"
                  type="submit"
                  renderIcon={Send}
                  disabled={submitting || loadingClients}
                >
                  {submitting ? 'Criando...' : 'Criar Post'}
                </Button>
                <Button
                  kind="secondary"
                  type="button"
                  onClick={() => router.push('/posts')}
                >
                  Cancelar
                </Button>
              </div>
            </Tile>
          </form>
        </Column>

        {/* Preview Panel */}
        <Column lg={4}>
          <Tile style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <View size={20} />
              Pré-visualização
            </h2>

            {formData.title ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                    {formData.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#525252' }}>
                    {formData.platform && (
                      <span style={{ display: 'block', marginBottom: '0.25rem' }}>
                        Plataforma: <strong>{formData.platform}</strong>
                      </span>
                    )}
                    {formData.format && (
                      <span style={{ display: 'block', marginBottom: '0.25rem' }}>
                        Formato: <strong>{formData.format}</strong>
                      </span>
                    )}
                  </p>
                </div>

                {formData.content && (
                  <div
                    style={{
                      backgroundColor: '#f4f4f4',
                      padding: '1rem',
                      borderRadius: '4px',
                      maxHeight: '300px',
                      overflow: 'auto',
                      marginBottom: '1.5rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: '0.875rem',
                    }}
                  >
                    {formData.content}
                  </div>
                )}

                {formData.scheduled_date && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#525252' }}>
                      Agendado para: <strong>{new Date(formData.scheduled_date).toLocaleDateString('pt-BR')}</strong>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: '#525252', fontSize: '0.875rem' }}>
                Preencha os campos para visualizar uma pré-visualização do post.
              </p>
            )}
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
