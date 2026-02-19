'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Tile,
  Button,
  TextArea,
  Tag,
  IconButton,
  InlineNotification,
  Select,
  SelectItem,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from '@carbon/react';
import {
  Send,
  Renew,
  Copy,
  WatsonxAi,
  Maximize,
  Minimize,
  ThumbsUp,
  ThumbsDown,
  Information,
  RecentlyViewed,
  ChevronDown,
  ChevronUp,
} from '@carbon/icons-react';
import AIContentLabel from '@/components/ai/AIContentLabel';
import { useTranslation } from '@/lib/i18n/context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  threadId?: string;
}

interface Brand {
  id: string;
  name: string;
}

interface HistoryThread {
  thread_id: string;
  prompt: string;
  created_at: string;
}

interface AIAssistantProps {
  onContentGenerated?: (content: string, meta?: { model: string; threadId: string }) => void;
  brandId?: string;
  context?: string;
  placeholder?: string;
  contentType?: string;
}

export default function AIAssistant({
  onContentGenerated,
  brandId: initialBrandId,
  context,
  placeholder,
  contentType: initialContentType,
}: AIAssistantProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('ai.defaultPlaceholder');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, 'up' | 'down'>>({});
  const [feedbackNotice, setFeedbackNotice] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState(initialBrandId ?? '');
  const [selectedContentType, setSelectedContentType] = useState(initialContentType ?? 'post');
  const [history, setHistory] = useState<HistoryThread[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(json => { if (json.data) setBrands(json.data); })
      .catch(() => {});
  }, []);

  const loadHistory = useCallback(() => {
    setHistoryLoading(true);
    fetch('/api/ai/history')
      .then(res => res.json())
      .then(json => { if (json.data) setHistory(json.data); })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    if (showHistory) loadHistory();
  }, [showHistory, loadHistory]);

  const handleSend = async (promptOverride?: string) => {
    const text = promptOverride ?? input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!promptOverride) setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          content_type: selectedContentType,
          brand_id: selectedBrandId || undefined,
          ...(context ? { tone: context } : {}),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || t('ai.generateError'));
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: json.data.content,
        timestamp: new Date(),
        model: json.data.model,
        threadId: json.data.threadId,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ai.unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleUseContent = (msg: Message) => {
    onContentGenerated?.(msg.content, {
      model: msg.model ?? 'unknown',
      threadId: msg.threadId ?? '',
    });
  };

  const handleFeedback = async (msgId: string, threadId: string | undefined, rating: 'up' | 'down') => {
    setFeedbackSent(prev => ({ ...prev, [msgId]: rating }));
    setFeedbackNotice(true);
    setTimeout(() => setFeedbackNotice(false), 2000);

    try {
      await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_id: threadId ?? msgId,
          rating: rating === 'up' ? 1 : -1,
        }),
      });
    } catch {
      // Feedback is best-effort
    }
  };

  const promptTemplates = [
    { key: 'templatePost', label: t('ai.templatePost') },
    { key: 'templateCaption', label: t('ai.templateCaption') },
    { key: 'templateBriefing', label: t('ai.templateBriefing') },
    { key: 'templateIdeas', label: t('ai.templateIdeas') },
  ];

  return (
    <Tile
      className="ai-gradient"
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        height: isExpanded ? '700px' : '500px',
        transition: 'height 150ms cubic-bezier(0.2, 0, 0.38, 0.9)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--cds-border-subtle-01)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <WatsonxAi size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {t('ai.assistant')}
          </span>
          <Tag type="purple" size="sm">Beta</Tag>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <IconButton
            kind="ghost"
            size="sm"
            label={t('ai.threadHistory')}
            onClick={() => setShowHistory(!showHistory)}
          >
            <RecentlyViewed size={16} />
          </IconButton>
          <IconButton
            kind="ghost"
            size="sm"
            label={isExpanded ? t('ai.minimize') : t('ai.expand')}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize size={16} /> : <Maximize size={16} />}
          </IconButton>
        </div>
      </div>

      {/* Selectors row */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid var(--cds-border-subtle-01)',
        alignItems: 'flex-end',
      }}>
        <Select
          id="ai-brand-select"
          labelText={t('ai.selectBrand')}
          size="sm"
          value={selectedBrandId}
          onChange={(e) => setSelectedBrandId(e.target.value)}
          style={{ flex: 1 }}
        >
          <SelectItem value="" text="--" />
          {brands.map(b => (
            <SelectItem key={b.id} value={b.id} text={b.name} />
          ))}
        </Select>
        <Select
          id="ai-content-type-select"
          labelText={t('ai.selectContentType')}
          size="sm"
          value={selectedContentType}
          onChange={(e) => setSelectedContentType(e.target.value)}
          style={{ flex: 1 }}
        >
          <SelectItem value="post" text="Post" />
          <SelectItem value="caption" text="Caption" />
          <SelectItem value="story" text="Story" />
          <SelectItem value="reel" text="Reel" />
          <SelectItem value="hashtags" text="Hashtags" />
          <SelectItem value="title" text="Title" />
        </Select>
      </div>

      {/* History sidebar overlay */}
      {showHistory && (
        <div style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--cds-border-subtle-01)',
          maxHeight: '150px',
          overflowY: 'auto',
          background: 'var(--cds-layer-01)',
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
            {t('ai.threadHistory')}
          </p>
          {historyLoading && (
            <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-helper)', margin: 0 }}>
              {t('ai.loadingHistory')}
            </p>
          )}
          {!historyLoading && history.length === 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-helper)', margin: 0 }}>
              {t('ai.noHistory')}
            </p>
          )}
          {history.map(h => (
            <div
              key={h.thread_id}
              style={{
                padding: '0.25rem 0',
                fontSize: '0.75rem',
                borderBottom: '1px solid var(--cds-border-subtle-01)',
                cursor: 'pointer',
              }}
              onClick={() => setShowHistory(false)}
            >
              <span style={{ color: 'var(--cds-text-primary)' }}>
                {h.prompt.length > 60 ? h.prompt.slice(0, 60) + '...' : h.prompt}
              </span>
              <span style={{ color: 'var(--cds-text-helper)', marginLeft: '0.5rem' }}>
                {new Date(h.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Prompt templates */}
      {messages.length === 0 && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          flexWrap: 'wrap',
        }}>
          {promptTemplates.map(pt => (
            <Button
              key={pt.key}
              kind="ghost"
              size="sm"
              onClick={() => handleSend(pt.label)}
            >
              {pt.label}
            </Button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'var(--cds-text-helper)',
            padding: '2rem',
          }}>
            <WatsonxAi size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {t('ai.emptyStateTitle')}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem' }}>
              {t('ai.emptyStateDescription')}
            </p>
          </div>
        )}

        {error && (
          <InlineNotification
            kind="error"
            title={t('ai.error')}
            subtitle={error}
            lowContrast
            onClose={() => setError(null)}
            style={{ marginBottom: '0.5rem' }}
          />
        )}

        {feedbackNotice && (
          <InlineNotification
            kind="success"
            title={t('ai.feedbackThanks')}
            lowContrast
            hideCloseButton
            style={{ marginBottom: '0.5rem' }}
          />
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
              background: msg.role === 'user'
                ? 'var(--cds-background-brand)'
                : 'var(--cds-layer-01)',
              color: msg.role === 'user'
                ? 'var(--cds-text-on-color)'
                : 'var(--cds-text-primary)',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
            {msg.role === 'assistant' && (
              <div style={{
                display: 'flex',
                gap: '0.25rem',
                marginTop: '0.25rem',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <Button
                  kind="ghost"
                  size="sm"
                  hasIconOnly
                  iconDescription={t('ai.copy')}
                  renderIcon={Copy}
                  onClick={() => handleCopyMessage(msg.content)}
                />
                <Button
                  kind="ghost"
                  size="sm"
                  hasIconOnly
                  iconDescription={t('ai.regenerate')}
                  renderIcon={Renew}
                />
                {onContentGenerated && (
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={() => handleUseContent(msg)}
                  >
                    {t('ai.useContent')}
                  </Button>
                )}

                {/* Feedback */}
                <IconButton
                  kind="ghost"
                  size="sm"
                  label={t('ai.helpful')}
                  disabled={!!feedbackSent[msg.id]}
                  onClick={() => handleFeedback(msg.id, msg.threadId, 'up')}
                >
                  <ThumbsUp size={16} />
                </IconButton>
                <IconButton
                  kind="ghost"
                  size="sm"
                  label={t('ai.notHelpful')}
                  disabled={!!feedbackSent[msg.id]}
                  onClick={() => handleFeedback(msg.id, msg.threadId, 'down')}
                >
                  <ThumbsDown size={16} />
                </IconButton>

                {/* Explainability */}
                <Toggletip align="bottom-left">
                  <ToggletipButton label={t('ai.howGenerated')}>
                    <Information size={16} />
                  </ToggletipButton>
                  <ToggletipContent>
                    <p style={{ fontSize: '0.75rem', margin: 0 }}>
                      {t('ai.explainability')}
                    </p>
                    {msg.model && (
                      <p style={{ fontSize: '0.75rem', margin: '0.5rem 0 0', fontWeight: 600 }}>
                        Model: {msg.model}
                      </p>
                    )}
                  </ToggletipContent>
                </Toggletip>

                {/* Confidence indicator */}
                <div style={{ marginLeft: 'auto' }}>
                  <AIContentLabel
                    model={msg.model}
                    size="mini"
                    onCopy={() => handleCopyMessage(msg.content)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '0.75rem 1rem',
            borderRadius: '12px 12px 12px 0',
            background: 'var(--cds-layer-01)',
            fontSize: '0.875rem',
          }}>
            <span className="ai-typing-indicator">{t('ai.generating')}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid var(--cds-border-subtle-01)',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'flex-end',
      }}>
        <TextArea
          id="ai-assistant-input"
          labelText=""
          hideLabel
          placeholder={resolvedPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          style={{ flex: 1 }}
        />
        <Button
          kind="primary"
          size="md"
          hasIconOnly
          iconDescription={t('ai.send')}
          renderIcon={Send}
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
        />
      </div>
    </Tile>
  );
}
