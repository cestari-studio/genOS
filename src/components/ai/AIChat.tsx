'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Tile,
  Button,
  TextArea,
  Tag,
  IconButton,
  InlineNotification,
} from '@carbon/react';
import {
  Send,
  Renew,
  Copy,
  WatsonxAi,
  Maximize,
  Minimize,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  threadId?: string;
}

interface AIChatProps {
  onContentGenerated?: (content: string, meta?: { model: string; threadId: string }) => void;
  brandId?: string;
  context?: string;
  placeholder?: string;
}

export default function AIChat({
  onContentGenerated,
  brandId,
  context,
  placeholder,
}: AIChatProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('ai.defaultPlaceholder');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage.content,
          content_type: 'post',
          brand_id: brandId,
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

  return (
    <Tile
      className="ai-gradient"
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        height: isExpanded ? '600px' : '400px',
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
            AI Assistant
          </span>
          <Tag type="purple" size="sm">Beta</Tag>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
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

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
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
                {msg.model && (
                  <Tag type="cool-gray" size="sm" style={{ marginLeft: 'auto' }}>
                    {msg.model}
                  </Tag>
                )}
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
          id="ai-chat-input"
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
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        />
      </div>
    </Tile>
  );
}
