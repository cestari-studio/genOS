'use client';

import { useState, useRef, useEffect } from 'react';
import {
  TextArea,
  Button,
  IconButton,
  Tag,
  Tile,
  ClickableTile,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Search,
  Dropdown,
} from '@carbon/react';
import {
  Send,
  Microphone,
  Attachment,
  Chat,
  Renew,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Idea,
  Document,
  UserMultiple,
  Analytics,
  Checkmark,
  ArrowRight,
  Information,
  Close,
  Add,
  TrashCan,
  Time,
  Maximize,
  Minimize,
  Settings,
  WatsonHealthTextAnnotationToggle,
  DataBase,
  CloudUpload,
  Edit,
  Star,
  StarFilled,
} from '@carbon/icons-react';
import { renderSafeMarkdown } from '@/lib/security/sanitize';
import './helian.scss';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: { title: string; type: string }[];
  actions?: { label: string; action: string }[];
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  starred: boolean;
}

const suggestedPrompts = [
  {
    icon: UserMultiple,
    title: 'Análise de Clientes',
    prompt: 'Analise meus clientes ativos e me dê insights sobre oportunidades de upsell e padrões de comportamento',
    category: 'Análise',
  },
  {
    icon: Document,
    title: 'Criar Proposta',
    prompt: 'Crie uma proposta comercial profissional para serviços de branding completo incluindo identidade visual e aplicações',
    category: 'Documentos',
  },
  {
    icon: Analytics,
    title: 'Relatório Mensal',
    prompt: 'Gere um relatório executivo dos projetos entregues este mês com métricas de performance e faturamento',
    category: 'Relatórios',
  },
  {
    icon: Idea,
    title: 'Ideias de Conteúdo',
    prompt: 'Sugira 10 ideias criativas de posts para redes sociais sobre design, branding e inovação visual',
    category: 'Criação',
  },
  {
    icon: DataBase,
    title: 'Status dos Projetos',
    prompt: 'Qual o status atual de todos os projetos em andamento? Liste por prioridade e prazo',
    category: 'Projetos',
  },
  {
    icon: WatsonHealthTextAnnotationToggle,
    title: 'Revisar Briefing',
    prompt: 'Analise o último briefing recebido e sugira perguntas de esclarecimento para o cliente',
    category: 'Briefings',
  },
];

const recentConversations: Conversation[] = [
  { id: '1', title: 'Análise Tech Corp', lastMessage: 'Cliente com alto potencial de upsell...', timestamp: new Date('2025-02-01'), starred: true },
  { id: '2', title: 'Proposta Branding', lastMessage: 'Proposta gerada com sucesso...', timestamp: new Date('2025-01-30'), starred: false },
  { id: '3', title: 'Relatório Janeiro', lastMessage: '12 projetos entregues no mês...', timestamp: new Date('2025-01-28'), starred: false },
];

export default function HelianPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(recentConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(userMessage.content),
        timestamp: new Date(),
        sources: [
          { title: 'Base de Clientes', type: 'database' },
          { title: 'Histórico de Projetos', type: 'database' },
        ],
        actions: [
          { label: 'Exportar relatório', action: 'export' },
          { label: 'Criar tarefa', action: 'task' },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateMockResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('cliente') || lowerPrompt.includes('análise')) {
      return `## Análise de Clientes

Baseado nos dados atuais, identifiquei algumas oportunidades importantes:

### 🎯 Clientes com Alto Potencial

| Cliente | Projetos | Ticket Médio | Oportunidade |
|---------|----------|--------------|--------------|
| Tech Corp | 5 | R$ 12.000 | Expansão Digital |
| Startup Inc | 3 | R$ 8.500 | Social Media |
| Fashion Co | 4 | R$ 15.000 | E-commerce |

### 📊 Insights Principais

1. **Tech Corp** tem demonstrado interesse em serviços digitais. Recomendo proposta de website + SEO.

2. **Startup Inc** está em fase de crescimento. Potencial para pacote de branding completo.

3. **Fashion Co** tem maior ticket médio. Considere proposta de design de produto.

### ⚡ Próximos Passos Sugeridos

- Agendar reuniões de follow-up até sexta-feira
- Preparar 3 propostas personalizadas
- Atualizar pipeline no CRM

Deseja que eu gere uma proposta específica para algum desses clientes?`;
    }

    if (lowerPrompt.includes('proposta') || lowerPrompt.includes('comercial')) {
      return `## Proposta Comercial - Serviços de Branding

---

### 📋 Escopo do Projeto

**Fase 1: Descoberta e Estratégia** (2 semanas)
- Pesquisa de mercado e concorrência
- Workshops de brand discovery
- Definição de posicionamento e tom de voz
- Mapeamento de personas

**Fase 2: Identidade Visual** (3 semanas)
- Desenvolvimento de conceitos visuais
- Design de logotipo e variações
- Paleta de cores e tipografia
- Elementos gráficos de apoio

**Fase 3: Aplicações e Manual** (2 semanas)
- Papelaria corporativa
- Templates para apresentações
- Manual de marca digital
- Assets para redes sociais

---

### 💰 Investimento

| Item | Valor |
|------|-------|
| Estratégia e Pesquisa | R$ 5.000 |
| Identidade Visual | R$ 8.000 |
| Aplicações e Manual | R$ 4.000 |
| **Total** | **R$ 17.000** |

*Condições: 40% entrada + 30% na aprovação + 30% na entrega*

---

Deseja que eu personalize essa proposta para um cliente específico?`;
    }

    if (lowerPrompt.includes('relatório') || lowerPrompt.includes('mensal')) {
      return `## Relatório Executivo - Janeiro 2025

### 📈 Visão Geral

| Métrica | Valor | vs. Mês Anterior |
|---------|-------|------------------|
| Projetos Entregues | 12 | +20% |
| Faturamento | R$ 45.000 | +15% |
| Novos Clientes | 3 | +50% |
| Satisfação Média | 4.8/5 | +0.2 |

### 🏆 Destaques do Mês

1. **Rebranding Tech Corp** - Entregue com 2 dias de antecedência
2. **Campanha Fashion Co** - ROI de 340% para o cliente
3. **3 novos contratos** fechados no pipeline

### ⚠️ Pontos de Atenção

- Briefing pendente: Startup Inc (5 dias)
- Prazo apertado: Website Nova Corp (10 dias)
- Feedback aguardando: Logo ABC Company

### 📅 Próximo Mês

- 8 projetos em andamento
- Previsão de faturamento: R$ 52.000
- 2 propostas em negociação

Deseja mais detalhes sobre algum projeto específico?`;
    }

    return `Olá! Sou a **Helian**, sua assistente de IA integrada ao genOS.

Posso ajudar você com diversas tarefas:

- 📊 **Análise de dados**: Insights sobre clientes, projetos e métricas
- 📝 **Criação de conteúdo**: Propostas, textos e ideias criativas
- 📄 **Geração de documentos**: Relatórios, contratos e apresentações
- 🔍 **Busca inteligente**: Encontrar informações na sua base de dados
- ⚡ **Automação**: Criar tarefas, agendar follow-ups e mais

Experimente me perguntar sobre:
- "Qual o status dos meus projetos?"
- "Crie uma proposta de branding"
- "Analise meus clientes ativos"

Como posso ajudar você hoje?`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    textAreaRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const startNewConversation = () => {
    setMessages([]);
    setActiveConversation(null);
  };

  const toggleStarred = (id: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, starred: !conv.starred } : conv
      )
    );
  };

  return (
    <>
      <div className="helian-container">
        {/* Sidebar */}
        <aside className={`helian-sidebar ${sidebarCollapsed ? 'helian-sidebar--collapsed' : ''}`}>
          <div className="helian-sidebar__header">
            <div className="helian-logo">
              <div className="helian-logo__icon">
                <Chat size={24} />
              </div>
              {!sidebarCollapsed && (
                <div className="helian-logo__text">
                  <span className="helian-logo__name">Helian</span>
                  <Tag type="purple" size="sm">IA</Tag>
                </div>
              )}
            </div>
            <IconButton
              kind="ghost"
              size="sm"
              label={sidebarCollapsed ? 'Expandir' : 'Recolher'}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <Maximize size={16} /> : <Minimize size={16} />}
            </IconButton>
          </div>

          {!sidebarCollapsed && (
            <>
              <div className="helian-sidebar__action">
                <Button 
                  kind="primary" 
                  size="sm" 
                  renderIcon={Add}
                  onClick={startNewConversation}
                  className="new-chat-btn"
                >
                  Nova conversa
                </Button>
              </div>

              <div className="helian-sidebar__section">
                <h4>Conversas Recentes</h4>
                <div className="conversations-list">
                  {conversations.map((conv) => (
                    <div 
                      key={conv.id} 
                      className={`conversation-item ${activeConversation === conv.id ? 'active' : ''}`}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <div className="conversation-item__content">
                        <span className="conversation-item__title">{conv.title}</span>
                        <span className="conversation-item__preview">{conv.lastMessage}</span>
                      </div>
                      <IconButton
                        kind="ghost"
                        size="sm"
                        label={conv.starred ? 'Remover favorito' : 'Favoritar'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarred(conv.id);
                        }}
                        className="conversation-item__star"
                      >
                        {conv.starred ? <StarFilled size={14} /> : <Star size={14} />}
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>

              <div className="helian-sidebar__section">
                <h4>Sugestões Rápidas</h4>
                <div className="suggested-prompts">
                  {suggestedPrompts.slice(0, 4).map((item, index) => (
                    <button
                      key={index}
                      className="suggested-prompt"
                      onClick={() => handleSuggestedPrompt(item.prompt)}
                    >
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="helian-sidebar__footer">
                <div className="helian-status">
                  <span className="helian-status__dot"></span>
                  <span>Online • Powered by Claude</span>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Chat Area */}
        <main className="helian-chat">
          {messages.length === 0 ? (
            <div className="helian-welcome">
              <div className="helian-welcome__header">
                <div className="helian-welcome__icon">
                  <Chat size={48} />
                </div>
                <h1>Olá! Sou a Helian 👋</h1>
                <p>
                  Sua assistente de IA integrada ao genOS. Posso ajudar você a analisar dados,
                  criar documentos, gerar conteúdo e automatizar tarefas do dia a dia.
                </p>
              </div>
              
              <div className="helian-welcome__grid">
                <h3>O que você gostaria de fazer?</h3>
                <div className="welcome-prompts-grid">
                  {suggestedPrompts.map((item, index) => (
                    <ClickableTile
                      key={index}
                      className="welcome-prompt-tile"
                      onClick={() => handleSuggestedPrompt(item.prompt)}
                    >
                      <div className="welcome-prompt-tile__header">
                        <div className="welcome-prompt-tile__icon">
                          <item.icon size={20} />
                        </div>
                        <Tag type="gray" size="sm">{item.category}</Tag>
                      </div>
                      <div className="welcome-prompt-tile__content">
                        <strong>{item.title}</strong>
                        <p>{item.prompt}</p>
                      </div>
                      <ArrowRight size={16} className="welcome-prompt-tile__arrow" />
                    </ClickableTile>
                  ))}
                </div>
              </div>

              <div className="helian-welcome__tips">
                <h4><Information size={16} /> Dicas de uso</h4>
                <ul>
                  <li>Seja específico nas suas perguntas para melhores resultados</li>
                  <li>Use comandos como "criar", "analisar", "listar" para ações diretas</li>
                  <li>Peça para exportar relatórios em diferentes formatos</li>
                  <li>Mencione clientes ou projetos específicos pelo nome</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="helian-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message chat-message--${message.role}`}
                >
                  <div className={`chat-message__avatar chat-message__avatar--${message.role}`}>
                    {message.role === 'assistant' ? (
                      <Chat size={18} />
                    ) : (
                      <span>OC</span>
                    )}
                  </div>
                  <div className="chat-message__wrapper">
                    <div className={`chat-message__content chat-message__content--${message.role}`}>
                      <div
                        className="chat-message__text"
                        dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(message.content) }}
                      />
                      
                      {message.sources && message.sources.length > 0 && (
                        <div className="chat-message__sources">
                          <span className="chat-message__sources-label">
                            <DataBase size={12} /> Fontes consultadas:
                          </span>
                          {message.sources.map((source, idx) => (
                            <Tag key={idx} type="gray" size="sm">{source.title}</Tag>
                          ))}
                        </div>
                      )}
                      
                      {message.actions && message.actions.length > 0 && (
                        <div className="chat-message__actions-row">
                          {message.actions.map((action, idx) => (
                            <Button key={idx} kind="ghost" size="sm">
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="chat-message__footer">
                      <span className="chat-message__time">{formatTime(message.timestamp)}</span>
                      
                      {message.role === 'assistant' && (
                        <div className="chat-message__actions">
                          <IconButton
                            kind="ghost"
                            size="sm"
                            label="Copiar"
                            onClick={() => { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(message.content).catch(() => {}); } }}
                          >
                            <Copy size={14} />
                          </IconButton>
                          <IconButton kind="ghost" size="sm" label="Útil">
                            <ThumbsUp size={14} />
                          </IconButton>
                          <IconButton kind="ghost" size="sm" label="Não útil">
                            <ThumbsDown size={14} />
                          </IconButton>
                          <IconButton kind="ghost" size="sm" label="Regenerar">
                            <Renew size={14} />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="chat-message chat-message--assistant">
                  <div className="chat-message__avatar chat-message__avatar--assistant">
                    <Chat size={18} />
                  </div>
                  <div className="chat-message__wrapper">
                    <div className="chat-message__content chat-message__content--assistant">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area */}
          <div className="helian-input">
            <div className="helian-input__container">
              <div className="helian-input__attachments">
                <IconButton kind="ghost" size="md" label="Anexar arquivo">
                  <Attachment size={20} />
                </IconButton>
              </div>
              <TextArea
                ref={textAreaRef}
                id="chat-input"
                labelText=""
                placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="helian-input__textarea"
              />
              <div className="helian-input__send">
                <Button
                  renderIcon={Send}
                  iconDescription="Enviar"
                  hasIconOnly
                  kind={input.trim() ? 'primary' : 'ghost'}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                />
              </div>
            </div>
            <p className="helian-input__disclaimer">
              A IA pode cometer erros. Sempre verifique informações importantes antes de tomar decisões.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
