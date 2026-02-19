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
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  InlineNotification,
  Toggle,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FileUploader,
} from '@carbon/react';
import {
  Save,
  ArrowLeft,
  TrashCan,
  View,
  Send,
  Image,
  Link as LinkIcon,
  TextBold,
  TextItalic,
  ListBulleted,
  ListNumbered,
  Quotes,
  Code,
} from '@carbon/icons-react';
import AIChat from '@/components/ai/AIChat';
import AIContentLabel from '@/components/ai/AIContentLabel';

// TODO: Integrar @tiptap/react para editor rico

interface ContentData {
  id: string;
  title: string;
  type: 'post' | 'page' | 'story' | 'reel';
  status: 'draft' | 'review' | 'approved' | 'published';
  platform: string[];
  content: string;
  excerpt: string;
  scheduledAt: string;
  tags: string[];
  media: string[];
}

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [saved, setSaved] = useState(false);
  const [aiMeta, setAiMeta] = useState<{ model: string; threadId: string } | null>(null);
  const [content, setContent] = useState<ContentData>({
    id: contentId,
    title: 'Como aumentar o engajamento nas redes sociais',
    type: 'post',
    status: 'draft',
    platform: ['instagram', 'linkedin'],
    content: `# Introdução

O engajamento nas redes sociais é fundamental para o sucesso da sua marca. Neste post, vamos explorar 5 estratégias comprovadas para aumentar suas interações.

## 1. Conheça seu público

Entender quem são seus seguidores é o primeiro passo. Analise os dados demográficos e comportamentais.

## 2. Crie conteúdo de valor

Ofereça informações úteis, entretenimento ou inspiração. Seu conteúdo deve resolver problemas ou atender necessidades.

## 3. Use CTAs claros

Peça para seu público interagir: curta, comente, compartilhe, salve.

## 4. Responda comentários

Engajamento é uma via de mão dupla. Responda seus seguidores.

## 5. Poste nos melhores horários

Analise quando seu público está mais ativo e programe seus posts.`,
    excerpt: 'Descubra 5 estratégias comprovadas para aumentar o engajamento nas suas redes sociais.',
    scheduledAt: '2024-02-20T10:00',
    tags: ['marketing', 'redes sociais', 'engajamento'],
    media: [],
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/content">Conteúdo</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Editar</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Editor de Conteúdo</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
            {content.status === 'draft' && 'Rascunho'}
            {content.status === 'review' && 'Aguardando revisão'}
            {content.status === 'approved' && 'Aprovado'}
            {content.status === 'published' && 'Publicado'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/content">
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>Voltar</Button>
          </Link>
          <Button kind="secondary" size="sm" renderIcon={View}>Visualizar</Button>
          <Button kind="secondary" size="sm" renderIcon={Send}>Enviar para Revisão</Button>
          <Button size="sm" renderIcon={Save} onClick={handleSave}>Salvar</Button>
        </div>
      </div>

      {saved && (
        <InlineNotification
          kind="success"
          title="Sucesso"
          subtitle="Conteúdo salvo com sucesso!"
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Grid>
        {/* Editor Principal */}
        <Column lg={10} md={8} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <TextInput
              id="title"
              labelText="Título"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              style={{ marginBottom: '1rem' }}
            />
            <TextArea
              id="excerpt"
              labelText="Resumo / Descrição"
              value={content.excerpt}
              onChange={(e) => setContent({ ...content, excerpt: e.target.value })}
              rows={2}
              style={{ marginBottom: '1rem' }}
            />
          </Tile>

          {/* Editor de Texto Rico */}
          <Tile>
            {/* Toolbar do Editor */}
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.5rem',
              borderBottom: '1px solid var(--cds-border-subtle-01)',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}>
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Negrito" renderIcon={TextBold} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Itálico" renderIcon={TextItalic} />
              <div style={{ width: '1px', background: 'var(--cds-layer-accent-01)', margin: '0 0.5rem' }} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Lista" renderIcon={ListBulleted} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Lista Numerada" renderIcon={ListNumbered} />
              <div style={{ width: '1px', background: 'var(--cds-layer-accent-01)', margin: '0 0.5rem' }} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Citação" renderIcon={Quotes} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Código" renderIcon={Code} />
              <div style={{ width: '1px', background: 'var(--cds-layer-accent-01)', margin: '0 0.5rem' }} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Imagem" renderIcon={Image} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Link" renderIcon={LinkIcon} />
            </div>

            {/* Área de edição */}
            <TextArea
              id="content"
              labelText=""
              hideLabel
              value={content.content}
              onChange={(e) => setContent({ ...content, content: e.target.value })}
              rows={20}
              style={{ fontFamily: 'monospace' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', margin: 0 }}>
                Suporta Markdown. {content.content.length} caracteres
              </p>
              <AIContentLabel
                size="mini"
                onRegenerate={() => {/* TODO: regenerate via API */}}
                onCopy={() => navigator.clipboard.writeText(content.content)}
              />
            </div>
          </Tile>

          {/* Mídia */}
          <Tile style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Mídia</h3>
            <FileUploader
              labelTitle="Arraste imagens ou vídeos"
              labelDescription="PNG, JPG, GIF, MP4 até 50MB"
              buttonLabel="Adicionar mídia"
              filenameStatus="edit"
              accept={['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov']}
              multiple
            />
          </Tile>
        </Column>

        {/* Sidebar */}
        <Column lg={6} md={8} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Publicação</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Select
                id="status"
                labelText="Status"
                value={content.status}
                onChange={(e) => setContent({ ...content, status: e.target.value as ContentData['status'] })}
              >
                <SelectItem value="draft" text="Rascunho" />
                <SelectItem value="review" text="Em Revisão" />
                <SelectItem value="approved" text="Aprovado" />
                <SelectItem value="published" text="Publicado" />
              </Select>
              <TextInput
                id="scheduledAt"
                labelText="Agendar publicação"
                type="datetime-local"
                value={content.scheduledAt}
                onChange={(e) => setContent({ ...content, scheduledAt: e.target.value })}
              />
            </div>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tipo de Conteúdo</h3>
            <Select
              id="type"
              labelText="Formato"
              value={content.type}
              onChange={(e) => setContent({ ...content, type: e.target.value as ContentData['type'] })}
            >
              <SelectItem value="post" text="Post/Artigo" />
              <SelectItem value="page" text="Página" />
              <SelectItem value="story" text="Story" />
              <SelectItem value="reel" text="Reel/Vídeo Curto" />
            </Select>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Plataformas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Toggle
                id="platform-instagram"
                labelText="Instagram"
                labelA=""
                labelB=""
                toggled={content.platform.includes('instagram')}
                onToggle={(checked) => {
                  const platforms = checked
                    ? [...content.platform, 'instagram']
                    : content.platform.filter(p => p !== 'instagram');
                  setContent({ ...content, platform: platforms });
                }}
              />
              <Toggle
                id="platform-linkedin"
                labelText="LinkedIn"
                labelA=""
                labelB=""
                toggled={content.platform.includes('linkedin')}
                onToggle={(checked) => {
                  const platforms = checked
                    ? [...content.platform, 'linkedin']
                    : content.platform.filter(p => p !== 'linkedin');
                  setContent({ ...content, platform: platforms });
                }}
              />
              <Toggle
                id="platform-facebook"
                labelText="Facebook"
                labelA=""
                labelB=""
                toggled={content.platform.includes('facebook')}
                onToggle={(checked) => {
                  const platforms = checked
                    ? [...content.platform, 'facebook']
                    : content.platform.filter(p => p !== 'facebook');
                  setContent({ ...content, platform: platforms });
                }}
              />
              <Toggle
                id="platform-twitter"
                labelText="X (Twitter)"
                labelA=""
                labelB=""
                toggled={content.platform.includes('twitter')}
                onToggle={(checked) => {
                  const platforms = checked
                    ? [...content.platform, 'twitter']
                    : content.platform.filter(p => p !== 'twitter');
                  setContent({ ...content, platform: platforms });
                }}
              />
              <Toggle
                id="platform-blog"
                labelText="Blog"
                labelA=""
                labelB=""
                toggled={content.platform.includes('blog')}
                onToggle={(checked) => {
                  const platforms = checked
                    ? [...content.platform, 'blog']
                    : content.platform.filter(p => p !== 'blog');
                  setContent({ ...content, platform: platforms });
                }}
              />
            </div>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tags</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {content.tags.map((tag, i) => (
                <Tag
                  key={i}
                  type="blue"
                  filter
                  onClose={() => {
                    setContent({ ...content, tags: content.tags.filter((_, index) => index !== i) });
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
            <TextInput
              id="new-tag"
              labelText="Adicionar tag"
              placeholder="Digite e pressione Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget;
                  if (input.value && !content.tags.includes(input.value)) {
                    setContent({ ...content, tags: [...content.tags, input.value] });
                    input.value = '';
                  }
                  e.preventDefault();
                }
              }}
            />
          </Tile>

          {/* AI Assistant */}
          <AIChat
            brandId={undefined /* TODO: load brandId from project/post data */}
            context={`Tipo: ${content.type}, Plataformas: ${content.platform.join(', ')}, Tags: ${content.tags.join(', ')}`}
            placeholder="Peça para a IA gerar ou melhorar o conteúdo..."
            onContentGenerated={(generated, meta) => {
              setContent(prev => ({ ...prev, content: prev.content + '\n\n' + generated }));
              if (meta) setAiMeta(meta);
            }}
          />

          <Button kind="danger--ghost" renderIcon={TrashCan} style={{ width: '100%', marginTop: '1rem' }}>
            Excluir Conteúdo
          </Button>
        </Column>
      </Grid>
    </div>
  );
}
