'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  HeaderGlobalAction,
  Search,
  Modal,
  Tag,
} from '@carbon/react';
import {
  Search as SearchIcon,
  Notification,
  UserAvatar,
  Help,
  Settings,
  Logout,
  Close,
  ArrowRight,
  Dashboard,
  UserMultiple,
  Folder,
  Document,
  TaskComplete,
  Chat,
  Analytics,
  Moon,
  Light,
  Keyboard,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import './Header.scss';

interface HeaderProps {
  onMenuClick?: () => void;
  user?: {
    name: string;
    email: string;
    initials: string;
  };
}

interface SearchResult {
  id: string;
  type: 'page' | 'client' | 'project' | 'document' | 'action';
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  path?: string;
  action?: () => void;
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const router = useRouter();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Navigation items for command palette
  const navigationItems: SearchResult[] = [
    { id: 'nav-dashboard', type: 'page', title: 'Dashboard', subtitle: 'Visão geral', icon: Dashboard, path: '/dashboard' },
    { id: 'nav-clients', type: 'page', title: 'Clientes', subtitle: 'Gerenciar clientes', icon: UserMultiple, path: '/clients' },
    { id: 'nav-projects', type: 'page', title: 'Projetos', subtitle: 'Gerenciar projetos', icon: Folder, path: '/projects' },
    { id: 'nav-briefings', type: 'page', title: 'Briefings', subtitle: 'Briefings de projetos', icon: TaskComplete, path: '/briefings' },
    { id: 'nav-documents', type: 'page', title: 'Documentos', subtitle: 'Biblioteca de documentos', icon: Document, path: '/documents' },
    { id: 'nav-helian', type: 'page', title: 'IA Helian', subtitle: 'Assistente de IA', icon: Chat, path: '/helian' },
    { id: 'nav-analytics', type: 'page', title: 'Analytics', subtitle: 'Relatórios e métricas', icon: Analytics, path: '/analytics' },
    { id: 'nav-settings', type: 'page', title: 'Configurações', subtitle: 'Preferências do sistema', icon: Settings, path: '/settings' },
  ];

  // Quick actions for command palette
  const quickActions: SearchResult[] = [
    { id: 'action-new-client', type: 'action', title: 'Novo Cliente', subtitle: 'Criar novo cliente', icon: UserMultiple, path: '/clients?new=true' },
    { id: 'action-new-project', type: 'action', title: 'Novo Projeto', subtitle: 'Criar novo projeto', icon: Folder, path: '/projects?new=true' },
    { id: 'action-new-briefing', type: 'action', title: 'Novo Briefing', subtitle: 'Criar novo briefing', icon: TaskComplete, path: '/briefings?new=true' },
    { id: 'action-toggle-theme', type: 'action', title: theme === 'dark' ? 'Tema Claro' : 'Tema Escuro', subtitle: 'Alternar aparência', icon: theme === 'dark' ? Light : Moon, action: () => toggleTheme() },
  ];

  // Filter results based on search query
  const getFilteredResults = useCallback((): SearchResult[] => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      return [...quickActions, ...navigationItems];
    }

    const allItems = [...quickActions, ...navigationItems];
    return allItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.subtitle?.toLowerCase().includes(query)
    );
  }, [searchQuery, quickActions, navigationItems]);

  const filteredResults = getFilteredResults();

  // Keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when palette opens
  useEffect(() => {
    if (commandPaletteOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  // Handle keyboard navigation in command palette
  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleResultSelect(filteredResults[selectedIndex]);
        }
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    if (result.action) {
      result.action();
    } else if (result.path) {
      router.push(result.path);
    }
    setCommandPaletteOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Handle logout
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const defaultUser = {
    name: 'Octavio Cestari',
    email: 'mail@cestari.studio',
    initials: 'OC',
  };

  const currentUser = user || defaultUser;

  return (
    <>
      <header className="genos-header">
        <div className="genos-header__content">
          {/* Search Trigger */}
          <button 
            className="genos-header__search"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Abrir busca"
          >
            <SearchIcon size={20} className="search-icon" />
            <span className="search-placeholder">Buscar ou navegar...</span>
            <div className="search-shortcut">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </div>
          </button>
          
          {/* Global Actions */}
          <div className="genos-header__actions">
            <button 
              className="header-action"
              onClick={() => router.push('/helian')}
              title="IA Helian"
            >
              <Chat size={20} />
              <span className="header-action__label">Helian</span>
            </button>
            
            <button 
              className="header-action" 
              title="Ajuda"
              onClick={() => window.open('https://docs.cestari.studio', '_blank')}
            >
              <Help size={20} />
            </button>
            
            <button 
              className="header-action header-action--notification" 
              title="Notificações"
              onClick={() => router.push('/notifications')}
            >
              <Notification size={20} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
            
            {/* User Menu */}
            <div className="header-user" ref={userMenuRef}>
              <button 
                className="header-action header-action--user"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="user-avatar-small">
                  <span>{currentUser.initials}</span>
                </div>
              </button>
              
              {userMenuOpen && (
                <div className="user-menu">
                  <div className="user-menu__header">
                    <div className="user-avatar-large">
                      <span>{currentUser.initials}</span>
                    </div>
                    <div className="user-menu__info">
                      <span className="user-menu__name">{currentUser.name}</span>
                      <span className="user-menu__email">{currentUser.email}</span>
                    </div>
                  </div>
                  
                  <div className="user-menu__divider" />
                  
                  <button className="user-menu__item" onClick={() => { router.push('/settings'); setUserMenuOpen(false); }}>
                    <Settings size={16} />
                    <span>Configurações</span>
                  </button>
                  
                  <button className="user-menu__item" onClick={() => { toggleTheme(); setUserMenuOpen(false); }}>
                    {theme === 'dark' ? <Light size={16} /> : <Moon size={16} />}
                    <span>{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>
                  </button>
                  
                  <button className="user-menu__item" onClick={() => setCommandPaletteOpen(true)}>
                    <Keyboard size={16} />
                    <span>Atalhos</span>
                    <span className="user-menu__shortcut">⌘K</span>
                  </button>
                  
                  <div className="user-menu__divider" />
                  
                  <button className="user-menu__item user-menu__item--danger" onClick={handleLogout}>
                    <Logout size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {commandPaletteOpen && (
        <div className="command-palette-overlay" onClick={() => setCommandPaletteOpen(false)}>
          <div 
            className="command-palette"
            onClick={e => e.stopPropagation()}
            onKeyDown={handlePaletteKeyDown}
          >
            <div className="command-palette__header">
              <SearchIcon size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar páginas, ações, clientes..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSelectedIndex(0); }}
                className="command-palette__input"
              />
              <button 
                className="command-palette__close"
                onClick={() => setCommandPaletteOpen(false)}
              >
                <Close size={20} />
              </button>
            </div>
            
            <div className="command-palette__results">
              {filteredResults.length === 0 ? (
                <div className="command-palette__empty">
                  <p>Nenhum resultado encontrado para "{searchQuery}"</p>
                </div>
              ) : (
                <>
                  {!searchQuery && (
                    <div className="command-palette__section">
                      <span className="command-palette__section-title">Ações rápidas</span>
                    </div>
                  )}
                  {filteredResults.map((result, index) => (
                    <button
                      key={result.id}
                      className={`command-palette__item ${index === selectedIndex ? 'command-palette__item--selected' : ''}`}
                      onClick={() => handleResultSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <result.icon size={20} />
                      <div className="command-palette__item-content">
                        <span className="command-palette__item-title">{result.title}</span>
                        {result.subtitle && (
                          <span className="command-palette__item-subtitle">{result.subtitle}</span>
                        )}
                      </div>
                      {result.type === 'page' && <ArrowRight size={16} className="command-palette__item-arrow" />}
                      {result.type === 'action' && (
                        <Tag size="sm" type="blue">Ação</Tag>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
            
            <div className="command-palette__footer">
              <div className="command-palette__hint">
                <kbd>↑</kbd><kbd>↓</kbd> para navegar
              </div>
              <div className="command-palette__hint">
                <kbd>↵</kbd> para selecionar
              </div>
              <div className="command-palette__hint">
                <kbd>esc</kbd> para fechar
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
