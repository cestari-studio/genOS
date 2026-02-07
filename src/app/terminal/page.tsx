'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import './terminal.scss';

// ─── Types ─────────────────────────────────────────────
interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'system' | 'info' | 'error';
  lines: string[];
}

interface ChatMessage {
  role: string;
  content: string;
}

// ─── Constants ─────────────────────────────────────────
const ASCII_LOGO = [
  '                                                                ',
  '                         ██████████████████                     ',
  '                     █████                █████                 ',
  '                  ████                        ███               ',
  '               ████                      ███████████████        ',
  '             ████                   ██████        ███  ██████   ',
  '            ███                 █████               ██      ███ ',
  '          ███                 ███                    ███      ███',
  '         ██                 ███                       ███      ██',
  '        ██                ███                           ██████  █',
  '       ██                ██                                  ████',
  '      ██               ███                                      ',
  '     ██               ███                                       ',
  '    ███              ██                                         ',
  '    ██              ██                                          ',
  '   ███             ███                                          ',
  '   ██              ██                                           ',
  '   ██             ██                                            ',
  '   ██             ██                                            ',
  '   ██             ██                                            ',
  '   ██            ██                                             ',
  '   ██            ██                                             ',
  '   ██            ██                                             ',
  '    ██           ██                                             ',
  '    ██           ██                                             ',
  '     ██           ██                                 ███        ',
  '     ██           ██                                █████████   ',
  '      ██          ███                              ██       ████',
  '       ███         ██                            ███           █',
  '        ███         ██                          ███            █',
  '          ███       ███                       ███            ███',
  '           ███       ███                   ████             ███ ',
  '             ████      ██               █████             ███   ',
  '                ██████  ███        ███████              ████    ',
  '                     ████████████████                 ████      ',
  '                            ███                    ████         ',
  '                               █████           ██████           ',
  '                                  ███████████████               ',
  '                                                                ',
];

const BRANDING = {
  title: 'genOS™️ Content Factory CLI v1.0',
  subtitle: 'Powered by Helian AI',
  copyright: '© 2026 Cestari Studio Inc. All rights reserved.',
  hint: 'Digite uma pergunta ou use /help para comandos.',
};

const SUGGESTIONS = [
  'Quais clientes precisam de atenção?',
  'Resumo do meu negócio',
  'Ideias de conteúdo para Bella Cucina',
  '/clients',
  '/status',
  '/help',
];

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧'];

// ─── Helpers ───────────────────────────────────────────
let entryCounter = 0;
function makeId() {
  return `entry-${++entryCounter}-${Date.now()}`;
}

function classifyLine(line: string | undefined | null): string {
  if (!line) return '';
  if (line.includes('✓')) return 'terminal-line--success';
  if (line.includes('⚠') || line.includes('ALTA')) return 'terminal-line--warning';
  if (line.includes('●') && (line.includes('online') || line.includes('ativo'))) return 'terminal-line--success';
  if (line.includes('██')) return 'terminal-line--accent';
  if (line.includes('─') || line.includes('│') || line.includes('┌') || line.includes('└') || line.includes('├') || line.includes('━')) return 'terminal-line--border';
  return '';
}

// ─── Component ─────────────────────────────────────────
export default function TerminalPage() {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [revealLines, setRevealLines] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [logoHue, setLogoHue] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const welcomeShown = useRef(false);

  // Derived avatar state
  const avatarState = isProcessing && isRevealing ? 'responding' : isProcessing ? 'processing' : input.length > 0 ? 'typing' : 'idle';

  // Blue spectrum logo animation (2x speed)
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoHue(h => (h + 2) % 360);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [entries, revealLines, spinnerFrame]);

  // Spinner animation
  useEffect(() => {
    if (!isProcessing || isRevealing) return;
    const interval = setInterval(() => {
      setSpinnerFrame(f => (f + 1) % SPINNER_FRAMES.length);
    }, 100);
    return () => clearInterval(interval);
  }, [isProcessing, isRevealing]);

  // Avatar eye tracking — follows mouse when idle, darts when processing, reads when responding
  useEffect(() => {
    if (avatarState === 'processing') {
      const interval = setInterval(() => {
        if (!avatarRef.current) return;
        avatarRef.current.style.setProperty('--pupil-x', `${(Math.random() - 0.5) * 5}px`);
        avatarRef.current.style.setProperty('--pupil-y', `${(Math.random() - 0.5) * 3}px`);
      }, 300);
      return () => clearInterval(interval);
    }
    if (avatarState === 'responding') {
      let y = -2;
      const interval = setInterval(() => {
        if (!avatarRef.current) return;
        y += 0.15;
        if (y > 2.5) y = -2;
        avatarRef.current.style.setProperty('--pupil-x', `${(Math.random() - 0.5) * 0.5}px`);
        avatarRef.current.style.setProperty('--pupil-y', `${y}px`);
      }, 60);
      return () => clearInterval(interval);
    }
    const onMove = (e: MouseEvent) => {
      if (!avatarRef.current) return;
      const r = avatarRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const a = Math.atan2(e.clientY - cy, e.clientX - cx);
      const d = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy) / 80, 2.5);
      avatarRef.current.style.setProperty('--pupil-x', `${Math.cos(a) * d}px`);
      avatarRef.current.style.setProperty('--pupil-y', `${Math.sin(a) * d}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [avatarState]);

  // Avatar blink — random intervals
  useEffect(() => {
    let outer: ReturnType<typeof setTimeout>;
    let inner: ReturnType<typeof setTimeout>;
    const blink = () => {
      setIsBlinking(true);
      inner = setTimeout(() => setIsBlinking(false), 150);
      outer = setTimeout(blink, 2000 + Math.random() * 4000);
    };
    outer = setTimeout(blink, 1500 + Math.random() * 2000);
    return () => { clearTimeout(outer); clearTimeout(inner); };
  }, []);

  // Welcome message on mount
  useEffect(() => {
    if (welcomeShown.current) return;
    welcomeShown.current = true;
    const load = async () => {
      setIsProcessing(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const [{ count: cc }, { count: pc }, { count: bc }, { count: poc }] = await Promise.all([
          supabase.from('clients').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('briefings').select('*', { count: 'exact', head: true }),
          supabase.from('posts_v2').select('*', { count: 'exact', head: true }),
        ]);
        const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Operador';
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const welcome = [
          '',
          '  ─── DASHBOARD ──────────────────────────────────────────',
          '',
          `  Bem-vindo, ${name}!`,
          `  Sessão iniciada em ${dateStr} às ${timeStr}`,
          '',
          '  ─── MÓDULOS ATIVOS ─────────────────────────────────────',
          '',
          `  Clientes    ${String(cc ?? 0).padEnd(10)}Projetos    ${pc ?? 0}`,
          `  Briefings   ${String(bc ?? 0).padEnd(10)}Posts       ${poc ?? 0}`,
          '',
          '  ─── COMANDOS ───────────────────────────────────────────',
          '',
          '  /help       Ver ajuda            /status    Diagnóstico',
          '  /clients    Listar clientes      /projects  Listar projetos',
          '  /briefings  Listar briefings     /posts     Listar posts',
          '',
          '  Ou faça qualquer pergunta em linguagem natural para a IA.',
          '',
          '  ─────────────────────────────────────────────────────────',
          '',
        ].join('\n');
        await revealResponse(welcome, 'system');
      } catch (err) {
        console.error('Welcome error:', err);
        addEntry('system', ['', '  Sistema inicializado. Digite /help para comandos.', '']);
      } finally {
        setIsProcessing(false);
        focusInput();
      }
    };
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus input
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Add entry to history
  const addEntry = useCallback((type: TerminalEntry['type'], lines: string[]) => {
    setEntries(prev => [...prev, { id: makeId(), type, lines }]);
  }, []);

  // Reveal response line by line
  const revealResponse = useCallback((text: string, type: TerminalEntry['type'] = 'output'): Promise<void> => {
    return new Promise(resolve => {
      const lines = text.split('\n');
      setIsRevealing(true);
      setRevealLines([]);

      let i = 0;
      const interval = setInterval(() => {
        if (i < lines.length) {
          const currentLine = lines[i];
          setRevealLines(prev => [...prev, currentLine]);
          i++;
        } else {
          clearInterval(interval);
          setRevealLines([]);
          setIsRevealing(false);
          addEntry(type, lines);
          resolve();
        }
      }, 35);
    });
  }, [addEntry]);

  // ─── Local Commands ────────────────────────────────
  const handleHelp = useCallback(() => {
    addEntry('info', [
      '',
      '  Comandos disponíveis:',
      '  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '  /help            Ver esta ajuda',
      '  /clear           Limpar terminal',
      '  /status          Status do sistema',
      '  /clients         Listar clientes',
      '  /projects        Listar projetos',
      '  /briefings       Listar briefings',
      '  /posts           Listar posts recentes',
      '',
      '  Ou digite qualquer pergunta em linguagem',
      '  natural para o assistente IA.',
      '',
      '  Exemplos:',
      '  "Quais clientes precisam de atenção?"',
      '  "Crie uma copy para o Instagram da Bella Cucina"',
      '  "Resumo da semana"',
      '',
    ]);
  }, [addEntry]);

  const handleClear = useCallback(() => {
    setEntries([]);
    setChatHistory([]);
  }, []);

  const handleStatus = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const [
        { count: clientCount },
        { count: projectCount },
        { count: briefingCount },
        { count: postCount },
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('briefings').select('*', { count: 'exact', head: true }),
        supabase.from('posts_v2').select('*', { count: 'exact', head: true }),
      ]);

      await revealResponse([
        '',
        '  genOS System Status',
        '  ━━━━━━━━━━━━━━━━━━━',
        `  Auth         ● online    ${user?.email || 'N/A'}`,
        `  Database     ● online    Supabase`,
        `  Clientes     ${clientCount ?? 0} registros`,
        `  Projetos     ${projectCount ?? 0} registros`,
        `  Briefings    ${briefingCount ?? 0} registros`,
        `  Posts        ${postCount ?? 0} registros`,
        `  Frontend     ● online    app.cestari.studio`,
        '',
      ].join('\n'), 'info');
    } catch (err) {
      console.error('Status error:', err);
      addEntry('error', ['  ✗ Erro ao buscar status. Verifique sua sessão.']);
    }
  }, [addEntry, revealResponse]);

  const handleClients = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: clients } = await supabase
        .from('clients')
        .select('name, company_name, status, email')
        .order('created_at', { ascending: false })
        .limit(15);

      if (!clients?.length) {
        addEntry('info', ['  Nenhum cliente encontrado.']);
        return;
      }

      const lines = [
        '',
        '  Nome                         Status     Email',
        '  ─────────────────────────────────────────────────────────',
        ...clients.map(c => {
          const name = (c.company_name || c.name || '').padEnd(30);
          const status = (c.status || 'N/A').padEnd(10);
          return `  ${name} ${status} ${c.email || ''}`;
        }),
        '',
        `  ${clients.length} cliente(s) encontrado(s)`,
        '',
      ];
      await revealResponse(lines.join('\n'), 'output');
    } catch {
      addEntry('error', ['  ✗ Erro ao listar clientes.']);
    }
  }, [addEntry, revealResponse]);

  const handleProjects = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: projects } = await supabase
        .from('projects')
        .select('name, status, start_date, end_date')
        .order('created_at', { ascending: false })
        .limit(15);

      if (!projects?.length) {
        addEntry('info', ['  Nenhum projeto encontrado.']);
        return;
      }

      const lines = [
        '',
        '  Projeto                      Status         Período',
        '  ─────────────────────────────────────────────────────────────',
        ...projects.map(p => {
          const name = (p.name || '').padEnd(30);
          const status = (p.status || 'N/A').padEnd(14);
          const period = p.start_date ? `${p.start_date.slice(0, 10)} → ${p.end_date?.slice(0, 10) || '...'}` : 'N/A';
          return `  ${name} ${status} ${period}`;
        }),
        '',
        `  ${projects.length} projeto(s) encontrado(s)`,
        '',
      ];
      await revealResponse(lines.join('\n'), 'output');
    } catch {
      addEntry('error', ['  ✗ Erro ao listar projetos.']);
    }
  }, [addEntry, revealResponse]);

  const handleBriefings = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: briefings } = await supabase
        .from('briefings')
        .select('title, status, priority, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!briefings?.length) {
        addEntry('info', ['  Nenhum briefing encontrado.']);
        return;
      }

      const lines = [
        '',
        '  Briefing                     Status       Prioridade',
        '  ─────────────────────────────────────────────────────────',
        ...briefings.map(b => {
          const title = (b.title || '').substring(0, 30).padEnd(30);
          const status = (b.status || 'N/A').padEnd(12);
          const priority = b.priority || 'N/A';
          return `  ${title} ${status} ${priority}`;
        }),
        '',
        `  ${briefings.length} briefing(s) encontrado(s)`,
        '',
      ];
      await revealResponse(lines.join('\n'), 'output');
    } catch {
      addEntry('error', ['  ✗ Erro ao listar briefings.']);
    }
  }, [addEntry, revealResponse]);

  const handlePosts = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: posts } = await supabase
        .from('posts_v2')
        .select('title, status, platform, scheduled_date')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!posts?.length) {
        addEntry('info', ['  Nenhum post encontrado.']);
        return;
      }

      const lines = [
        '',
        '  Post                         Status       Plataforma',
        '  ─────────────────────────────────────────────────────────',
        ...posts.map(p => {
          const title = (p.title || '').substring(0, 30).padEnd(30);
          const status = (p.status || 'N/A').padEnd(12);
          const platform = p.platform || 'N/A';
          return `  ${title} ${status} ${platform}`;
        }),
        '',
        `  ${posts.length} post(s) encontrado(s)`,
        '',
      ];
      await revealResponse(lines.join('\n'), 'output');
    } catch {
      addEntry('error', ['  ✗ Erro ao listar posts.']);
    }
  }, [addEntry, revealResponse]);

  // ─── Command Router ────────────────────────────────
  const processLocalCommand = useCallback(async (cmd: string): Promise<boolean> => {
    const command = cmd.toLowerCase().trim();

    switch (command) {
      case '/help': handleHelp(); return true;
      case '/clear': handleClear(); return true;
      case '/status': await handleStatus(); return true;
      case '/clients': await handleClients(); return true;
      case '/projects': await handleProjects(); return true;
      case '/briefings': await handleBriefings(); return true;
      case '/posts': await handlePosts(); return true;
      default: return false;
    }
  }, [handleHelp, handleClear, handleStatus, handleClients, handleProjects, handleBriefings, handlePosts]);

  // ─── AI Chat ───────────────────────────────────────
  const handleAIChat = useCallback(async (message: string) => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: chatHistory.slice(-10),
        }),
      });

      if (!response.ok) {
        addEntry('error', ['  ✗ Erro na API. Código: ' + response.status]);
        return;
      }

      const data = await response.json();

      if (data.error) {
        addEntry('error', [`  ✗ ${data.error}`]);
        return;
      }

      // Save to chat history
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: data.response },
      ].slice(-20));

      await revealResponse(data.response);
    } catch {
      addEntry('error', ['  ✗ Falha na conexão. Verifique sua internet.']);
    }
  }, [addEntry, revealResponse, chatHistory]);

  // ─── Submit Handler ────────────────────────────────
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const cmd = input.trim();
    if (!cmd || isProcessing) return;

    addEntry('input', [cmd]);
    setCmdHistory(prev => [cmd, ...prev].slice(0, 50));
    setHistoryIdx(-1);
    setInput('');
    setIsProcessing(true);

    try {
      if (cmd.startsWith('/')) {
        const handled = await processLocalCommand(cmd);
        if (!handled) {
          addEntry('error', [`  Comando desconhecido: ${cmd}`, '  Use /help para ver comandos disponíveis.']);
        }
      } else {
        await handleAIChat(cmd);
      }
    } finally {
      setIsProcessing(false);
      focusInput();
    }
  }, [input, isProcessing, addEntry, processLocalCommand, handleAIChat, focusInput]);

  // Run a suggestion
  const runSuggestion = useCallback((text: string) => {
    if (isProcessing) return;
    const cmd = text.trim();
    if (!cmd) return;

    addEntry('input', [cmd]);
    setCmdHistory(prev => [cmd, ...prev].slice(0, 50));
    setHistoryIdx(-1);
    setInput('');
    setIsProcessing(true);

    (async () => {
      try {
        if (cmd.startsWith('/')) {
          const handled = await processLocalCommand(cmd);
          if (!handled) {
            addEntry('error', [`  Comando desconhecido: ${cmd}`]);
          }
        } else {
          await handleAIChat(cmd);
        }
      } catch (err) {
        console.error('Suggestion error:', err);
        addEntry('error', ['  ✗ Erro ao processar comando.']);
      } finally {
        setIsProcessing(false);
        focusInput();
      }
    })();
  }, [isProcessing, addEntry, processLocalCommand, handleAIChat, focusInput]);

  // ─── Keyboard Navigation ──────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1;
        setHistoryIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  }, [cmdHistory, historyIdx]);

  // ─── Render ────────────────────────────────────────
  return (
    <div className="terminal-page" onClick={focusInput}>
      <div className="terminal-window">
        {/* Title Bar */}
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="terminal-dot terminal-dot--red" />
            <span className="terminal-dot terminal-dot--yellow" />
            <span className="terminal-dot terminal-dot--green" />
          </div>
          <span className="terminal-title">genOS™️ — Cestari Studio Terminal</span>
          <div className="terminal-titlebar__actions">
            <button
              className="terminal-action-btn"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
            >
              clear
            </button>
          </div>
        </div>

        {/* Dashboard Header — ASCII Dashboard Layout */}
        <div className="terminal-dashboard">
          <div className="terminal-frame-line">
            {'┌─── CESTARI STUDIO ' + '─'.repeat(43) + '┐'}
          </div>
          <div className="terminal-dashboard__content">
            <div className="terminal-logo">
              <div className="terminal-logo__inner">
                {ASCII_LOGO.map((line, i) => {
                  const blueHue = 200 + Math.sin((logoHue + i * 6) * Math.PI / 180) * 30 + 30;
                  const lightness = 55 + Math.sin((logoHue + i * 10) * Math.PI / 180) * 15;
                  return (
                    <div
                      key={i}
                      className="terminal-logo__line"
                      style={{
                        color: `hsl(${blueHue}, 90%, ${lightness}%)`,
                      }}
                    >
                      {line || '\u00A0'}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="terminal-branding">
              <div className="terminal-branding__title">{BRANDING.title}</div>
              <div className="terminal-branding__subtitle">{BRANDING.subtitle}</div>
              <div className="terminal-branding__copyright">{BRANDING.copyright}</div>
            </div>
          </div>
          <div className="terminal-frame-line">
            {'└' + '─'.repeat(62) + '┘'}
          </div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body" ref={bodyRef}>
          {/* Rendered entries */}
          {entries.map(entry => (
            <div key={entry.id} className={`terminal-entry terminal-entry--${entry.type}`}>
              {entry.type === 'input' && (
                <span className="terminal-prompt">❯ </span>
              )}
              {entry.lines.map((line, i) => (
                <div key={i} className={`terminal-line ${classifyLine(line)}`}>
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          ))}

          {/* Lines being revealed */}
          {isRevealing && revealLines.length > 0 && (
            <div className="terminal-entry terminal-entry--output">
              {revealLines.map((line, i) => (
                <div key={i} className={`terminal-line terminal-line-reveal ${classifyLine(line)}`}>
                  {line || '\u00A0'}
                </div>
              ))}
              <span className="terminal-cursor" />
            </div>
          )}

          {/* Input Area with Avatar */}
          <div className="terminal-input-area">
            <div
              className={`terminal-avatar ${isBlinking ? 'terminal-avatar--blink' : ''}`}
              ref={avatarRef}
              data-state={avatarState}
            >
              <div className="terminal-avatar__eye terminal-avatar__eye--left">
                <div className="terminal-avatar__pupil" />
              </div>
              <div className="terminal-avatar__eye terminal-avatar__eye--right">
                <div className="terminal-avatar__pupil" />
              </div>
            </div>
            {isProcessing && !isRevealing && (
              <div className="terminal-processing-text">
                {SPINNER_FRAMES[spinnerFrame]} Processando
                <span className="processing-dots" />
              </div>
            )}
            {!isProcessing && (
              <form className="terminal-input-form" onSubmit={handleSubmit}>
                <span className="terminal-prompt">❯ </span>
                <input
                  ref={inputRef}
                  type="text"
                  className="terminal-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="digite um comando ou pergunta..."
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="terminal-suggestions">
          <span className="terminal-suggestions__label">Sugestões:</span>
          <div className="terminal-suggestions__list">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="terminal-suggestion"
                onClick={(e) => { e.stopPropagation(); runSuggestion(s); }}
                disabled={isProcessing}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
