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
import { useTranslation } from '@/lib/i18n/context';

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
  const { t } = useTranslation();
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
        <BreadcrumbItem href="/content">{t('content.title')}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('common.edit')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{t('editor.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
            {content.status === 'draft' && t('content.status.draft')}
            {content.status === 'review' && t('editor.awaitingReview')}
            {content.status === 'approved' && t('content.status.approved')}
            {content.status === 'published' && t('content.status.published')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/content">
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>{t('common.back')}</Button>
          </Link>
          <Button kind="secondary" size="sm" renderIcon={View}>{t('common.view')}</Button>
          <Button kind="secondary" size="sm" renderIcon={Send}>{t('editor.sendToReview')}</Button>
          <Button size="sm" renderIcon={Save} onClick={handleSave}>{t('common.save')}</Button>
        </div>
      </div>

      {saved && (
        <InlineNotification
          kind="success"
          title={t('editor.success')}
          subtitle={t('editor.savedMessage')}
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
              labelText={t('editor.fieldTitle')}
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              style={{ marginBottom: '1rem' }}
            />
            <TextArea
              id="excerpt"
              labelText={t('editor.fieldExcerpt')}
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
              <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('editor.bold')} renderIcon={TextBold} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('editor.italic')} renderIcon={TextItalic} />
              <div style={{ width: '1px', background: 'var(--cds-layer-accent-01)', margin: '0 0.5rem' }} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('editor.list')} renderIcon={ListBulleted} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('editor.numberedList')} renderIcon={ListNumbered} />
              <div style={{ width: '1px', background: 'var(--cds-layer-accent-01)', margin: '0 0.5rem' }} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('editor.quote')} renderIcon={Quotes} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('editor.code')} renderIcon={Code} />
              <div style={{ width: '1px', background: 'var(--cds-layer-accent-01)', margin: '0 0.5rem' }} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('editor.image')} renderIcon={Image} />
              <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('editor.link')} renderIcon={LinkIcon} />
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
                {t('editor.markdownSupport', { count: content.content.length })}
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
            <h3 style={{ marginBottom: '1rem' }}>{t('editor.media')}</h3>
            <FileUploader
              labelTitle={t('editor.dragMedia')}
              labelDescription={t('editor.mediaFormats')}
              buttonLabel={t('editor.addMedia')}
              filenameStatus="edit"
              accept={['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov']}
              multiple
            />
          </Tile>
        </Column>

        {/* Sidebar */}
        <Column lg={6} md={8} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>{t('editor.publication')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Select
                id="status"
                labelText={t('editor.status')}
                value={content.status}
                onChange={(e) => setContent({ ...content, status: e.target.value as ContentData['status'] })}
              >
                <SelectItem value="draft" text={t('content.status.draft')} />
                <SelectItem value="review" text={t('content.status.review')} />
                <SelectItem value="approved" text={t('content.status.approved')} />
                <SelectItem value="published" text={t('content.status.published')} />
              </Select>
              <TextInput
                id="scheduledAt"
                labelText={t('editor.schedulePublication')}
                type="datetime-local"
                value={content.scheduledAt}
                onChange={(e) => setContent({ ...content, scheduledAt: e.target.value })}
              />
            </div>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>{t('editor.contentType')}</h3>
            <Select
              id="type"
              labelText={t('editor.format')}
              value={content.type}
              onChange={(e) => setContent({ ...content, type: e.target.value as ContentData['type'] })}
            >
              <SelectItem value="post" text={t('editor.typePost')} />
              <SelectItem value="page" text={t('editor.typePage')} />
              <SelectItem value="story" text={t('editor.typeStory')} />
              <SelectItem value="reel" text={t('editor.typeReel')} />
            </Select>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>{t('editor.platforms')}</h3>
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
            <h3 style={{ marginBottom: '1rem' }}>{t('editor.tags')}</h3>
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
              labelText={t('editor.addTag')}
              placeholder={t('editor.tagPlaceholder')}
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
            context={t('editor.aiContext', { type: content.type, platforms: content.platform.join(', '), tags: content.tags.join(', ') })}
            placeholder={t('editor.aiPlaceholder')}
            onContentGenerated={(generated, meta) => {
              setContent(prev => ({ ...prev, content: prev.content + '\n\n' + generated }));
              if (meta) setAiMeta(meta);
            }}
          />

          <Button kind="danger--ghost" renderIcon={TrashCan} style={{ width: '100%', marginTop: '1rem' }}>
            {t('editor.deleteContent')}
          </Button>
        </Column>
      </Grid>
    </div>
  );
}
