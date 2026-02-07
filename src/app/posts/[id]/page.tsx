'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Tag,
  TextArea,
  SkeletonText,
  Grid,
  Column,
  Tile,
  InlineNotification,
} from '@carbon/react';
import {
  ArrowLeft,
  Edit,
  Calendar,
  View,
  Send,
  CheckmarkFilled,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  platform: string;
  scheduled_date: string | null;
  format: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
}

const statusWorkflow = ['draft', 'review', 'approved', 'published'];
const statusLabels: { [key: string]: string } = {
  draft: 'Rascunho',
  review: 'Em Revisão',
  approved: 'Aprovado',
  published: 'Publicado',
};

type TagType = 'red' | 'magenta' | 'purple' | 'blue' | 'cyan' | 'teal' | 'green' | 'gray' | 'cool-gray' | 'warm-gray' | 'high-contrast' | 'outline';
const statusColors: { [key: string]: TagType } = {
  draft: 'gray',
  review: 'blue',
  approved: 'cyan',
  published: 'green',
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('posts_v2')
          .select('*')
          .eq('id', postId)
          .single();

        if (fetchError) throw fetchError;
        if (data) {
          setPost(data);
          setEditedContent(data.content);
        }
      } catch (err) {
        setError('Erro ao carregar post. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!post) return;

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('posts_v2')
        .update({ status: newStatus })
        .eq('id', postId);

      if (updateError) throw updateError;

      setPost({ ...post, status: newStatus });
    } catch (err) {
      setError('Erro ao atualizar status.');
      console.error(err);
    }
  };

  const handleSaveContent = async () => {
    if (!post) return;

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('posts_v2')
        .update({ content: editedContent })
        .eq('id', postId);

      if (updateError) throw updateError;

      setPost({ ...post, content: editedContent });
      setIsEditing(false);
    } catch (err) {
      setError('Erro ao salvar conteúdo.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <SkeletonText paragraph lineCount={5} />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: '2rem' }}>
        <Button
          kind="ghost"
          renderIcon={ArrowLeft}
          onClick={() => router.push('/posts')}
        >
          Voltar
        </Button>
        <p style={{ marginTop: '1rem', color: '#da1e28' }}>Post não encontrado.</p>
      </div>
    );
  }

  const currentStatusIndex = statusWorkflow.indexOf(post.status);
  const nextStatuses = statusWorkflow.slice(currentStatusIndex + 1);

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

      <div style={{ marginBottom: '2rem' }}>
        <Button
          kind="ghost"
          renderIcon={ArrowLeft}
          onClick={() => router.push('/posts')}
        >
          Voltar
        </Button>
      </div>

      <Grid>
        <Column lg={8}>
          {/* Title and Main Content */}
          <Tile style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '1.5rem',
              }}
            >
              <h1 style={{ fontSize: '2rem', margin: 0 }}>{post.title}</h1>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={Edit}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>

            {isEditing ? (
              <div>
                <TextArea
                  id="post-content"
                  labelText="Conteúdo"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={10}
                  style={{ marginBottom: '1rem' }}
                />
                <Button
                  kind="primary"
                  renderIcon={Send}
                  onClick={handleSaveContent}
                >
                  Salvar
                </Button>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#f4f4f4',
                  padding: '1rem',
                  borderRadius: '4px',
                  minHeight: '300px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {post.content}
              </div>
            )}
          </Tile>

          {/* Status Workflow Buttons */}
          <Tile style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Fluxo de Status</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {nextStatuses.map((status) => (
                <Button
                  key={status}
                  kind="secondary"
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                >
                  {statusLabels[status] || status}
                </Button>
              ))}
            </div>
          </Tile>
        </Column>

        {/* Side Panel - Metadata */}
        <Column lg={4}>
          <Tile style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Status</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <Tag
                type={statusColors[post.status] || 'gray'}
                size="lg"
                style={{ marginBottom: '1rem' }}
              >
                {statusLabels[post.status] || post.status}
              </Tag>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '0.25rem' }}>
                Plataforma
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {post.platform}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '0.25rem' }}>
                Formato
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {post.format}
              </p>
            </div>

            {post.scheduled_date && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '0.25rem' }}>
                  <Calendar size={14} style={{ marginRight: '0.25rem' }} />
                  Data Agendada
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  {new Date(post.scheduled_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '0.25rem' }}>
                Cliente
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {post.client_id}
              </p>
            </div>
          </Tile>

          <Tile style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Informações</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '0.25rem' }}>
                Criado em
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                {new Date(post.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '0.25rem' }}>
                Atualizado em
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                {new Date(post.updated_at).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {post.assigned_to && (
              <div>
                <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '0.25rem' }}>
                  Atribuído a
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {post.assigned_to}
                </p>
              </div>
            )}
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
