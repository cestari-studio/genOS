'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  FileUploader,
} from '@carbon/react';
import {
  Save,
  ArrowLeft,
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

interface ContentData {
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

export default function NewContentPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiMeta, setAiMeta] = useState<{ model: string; threadId: string } | null>(null);
  const [content, setContent] = useState<ContentData>({
    title: '',
    type: 'post',
    status: 'draft',
    platform: [],
    content: '',
    excerpt: '',
    scheduledAt: '',
    tags: [],
    media: [],
  });

  const handleSave = async () => {
    if (!content.title.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: content.title,
          type: content.type,
          platform: content.platform,
          status: content.status,
          body: content.content,
          metadata: {
            excerpt: content.excerpt,
            scheduled_at: content.scheduledAt || null,
            tags: content.tags,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to create content');
      }

      setSaved(true);
      setTimeout(() => {
        router.push(`/content/${json.data.id}/edit`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/content">{t('content.title')}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('common.create')}</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{t('editor.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
            {t('content.status.draft')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/content">
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>{t('common.back')}</Button>
          </Link>
          <Button kind="secondary" size="sm" renderIcon={View} disabled>{t('common.view')}</Button>
          <Button kind="secondary" size="sm" renderIcon={Send} disabled>{t('editor.sendToReview')}</Button>
          <Button size="sm" renderIcon={Save} onClick={handleSave} disabled={saving || !content.title.trim()}>
            {saving ? t('common.saving') : t('common.save')}
          </Button>
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

      {error && (
        <InlineNotification
          kind="error"
          title={t('common.error')}
          subtitle={error}
          onClose={() => setError(null)}
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Grid fullWidth>
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

          <Tile>
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
                onRegenerate={() => {}}
                onCopy={() => navigator.clipboard.writeText(content.content)}
              />
            </div>
          </Tile>

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
              {['instagram', 'linkedin', 'facebook', 'twitter', 'blog'].map((p) => (
                <Toggle
                  key={p}
                  id={`platform-${p}`}
                  labelText={p === 'twitter' ? 'X (Twitter)' : p.charAt(0).toUpperCase() + p.slice(1)}
                  labelA=""
                  labelB=""
                  toggled={content.platform.includes(p)}
                  onToggle={(checked) => {
                    const platforms = checked
                      ? [...content.platform, p]
                      : content.platform.filter(x => x !== p);
                    setContent({ ...content, platform: platforms });
                  }}
                />
              ))}
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

          <AIChat
            brandId={undefined}
            context={t('editor.aiContext', { type: content.type, platforms: content.platform.join(', '), tags: content.tags.join(', ') })}
            placeholder={t('editor.aiPlaceholder')}
            onContentGenerated={(generated, meta) => {
              setContent(prev => ({ ...prev, content: prev.content + '\n\n' + generated }));
              if (meta) setAiMeta(meta);
            }}
          />
        </Column>
      </Grid>
    </div>
  );
}
