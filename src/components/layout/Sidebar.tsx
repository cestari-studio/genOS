'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dashboard,
  UserMultiple,
  Folder,
  Document,
  TaskComplete,
  Analytics,
  Settings,
  Notification,
  Logout,
  Chat,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Add,
  Home,
  RecentlyViewed,
  Star,
  OverflowMenuVertical,
  Store,
  Money,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { AILabel } from '@/components/ui';
import './Sidebar.scss';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  isAI?: boolean;
}

export default function Sidebar({ collapsed: controlledCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(controlledCollapsed ?? false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useState<{ path: string; label: string; type: string }[]>([]);

  // Sync with controlled prop
  useEffect(() => {
    if (controlledCollapsed !== undefined) {
      setIsCollapsed(controlledCollapsed);
    }
  }, [controlledCollapsed]);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('genos-sidebar-collapsed');
    if (saved !== null && controlledCollapsed === undefined) {
      setIsCollapsed(saved === 'true');
    }
  }, [controlledCollapsed]);

  // Track recent items
  useEffect(() => {
    const saved = localStorage.getItem('genos-recent-items');
    if (saved) {
      try {
        setRecentItems(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing recent items:', e);
      }
    }
  }, []);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('genos-sidebar-collapsed', String(newState));
    onToggle?.(newState);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  // Main navigation items — v2.0
  const mainNavItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: Dashboard },
    { path: '/brands', label: 'Marcas', icon: Store },
    { path: '/posts', label: 'Posts', icon: TaskComplete },
    { path: '/credits', label: 'Créditos', icon: Money },
    { path: '/projects', label: 'Projetos', icon: Folder },
  ];

  // Tools section
  const toolsNavItems: NavItem[] = [
    { path: '/terminal', label: 'Terminal IA', icon: Terminal, isAI: true },
    { path: '/helian', label: 'IA Helian', icon: Chat, isAI: true },
    { path: '/analytics', label: 'Analytics', icon: Analytics },
    { path: '/team', label: 'Equipe', icon: UserMultiple },
  ];

  // Footer items
  const footerNavItems: NavItem[] = [
    { path: '/notifications', label: 'Notificações', icon: Notification, badge: 3 },
    { path: '/settings', label: 'Configurações', icon: Settings },
  ];

  const renderNavItem = (item: NavItem, showSection = false) => {
    const active = isActive(item.path);
    const Icon = item.icon;

    return (
      <li key={item.path}>
        <Link
          href={item.path}
          className={`
            nav-item 
            ${active ? 'nav-item--active' : ''} 
            ${item.isAI ? 'nav-item--ai' : ''}
          `}
          title={isCollapsed ? item.label : undefined}
          onMouseEnter={() => setHoveredItem(item.path)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <span className="nav-item__icon">
            <Icon size={20} />
          </span>
          
          {!isCollapsed && (
            <>
              <span className="nav-item__label">{item.label}</span>
              
              {item.isAI && (
                <span className="nav-item__ai-badge">
                  <AILabel size="mini" textLabel="AI" />
                </span>
              )}
              
              {item.badge && (
                <span className="nav-item__badge">{item.badge}</span>
              )}
            </>
          )}
          
          {active && <span className="nav-item__indicator" />}
        </Link>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && hoveredItem === item.path && (
          <div className="nav-item__tooltip">
            <span>{item.label}</span>
            {item.badge && <span className="tooltip-badge">{item.badge}</span>}
          </div>
        )}
      </li>
    );
  };

  return (
    <aside className={`genos-sidebar ${isCollapsed ? 'genos-sidebar--collapsed' : ''}`}>
      {/* Header */}
      <div className="genos-sidebar__header">
        <Link href="/dashboard" className="genos-sidebar__logo">
          <div className="genos-sidebar__logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.5"/>
            </svg>
          </div>
          {!isCollapsed && (
            <div className="genos-sidebar__logo-text">
              <span className="logo-name">genOS</span>
              <span className="logo-subtitle">Content Factory</span>
            </div>
          )}
        </Link>
        
        <button 
          className="genos-sidebar__toggle"
          onClick={handleToggle}
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Quick Action */}
      {!isCollapsed && (
        <div className="genos-sidebar__quick-action">
          <button
            className="quick-action-btn"
            onClick={() => router.push('/posts?new=true')}
          >
            <Add size={16} />
            <span>Novo Post</span>
          </button>
        </div>
      )}
      
      {isCollapsed && (
        <div className="genos-sidebar__quick-action genos-sidebar__quick-action--collapsed">
          <button
            className="quick-action-btn quick-action-btn--icon"
            onClick={() => router.push('/posts?new=true')}
            title="Novo Post"
          >
            <Add size={20} />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="genos-sidebar__nav">
        <div className="nav-section">
          {!isCollapsed && <span className="nav-section__title">Principal</span>}
          <ul className="nav-list">
            {mainNavItems.map(item => renderNavItem(item))}
          </ul>
        </div>

        <div className="nav-section">
          {!isCollapsed && <span className="nav-section__title">Ferramentas</span>}
          <ul className="nav-list">
            {toolsNavItems.map(item => renderNavItem(item))}
          </ul>
        </div>

        {/* Recent Items */}
        {!isCollapsed && recentItems.length > 0 && (
          <div className="nav-section nav-section--recent">
            <span className="nav-section__title">
              <RecentlyViewed size={14} />
              Recentes
            </span>
            <ul className="nav-list nav-list--recent">
              {recentItems.slice(0, 3).map((item, index) => (
                <li key={`recent-${index}`}>
                  <Link href={item.path} className="nav-item nav-item--recent">
                    <span className="nav-item__label">{item.label}</span>
                    <span className="nav-item__type">{item.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="genos-sidebar__footer">
        <ul className="nav-list">
          {footerNavItems.map(item => renderNavItem(item))}
        </ul>
        
        <div className="nav-divider" />
        
        <button
          className="nav-item nav-item--logout"
          onClick={handleLogout}
          title={isCollapsed ? 'Sair' : undefined}
        >
          <span className="nav-item__icon">
            <Logout size={20} />
          </span>
          {!isCollapsed && <span className="nav-item__label">Sair</span>}
        </button>

        {/* User Info */}
        {!isCollapsed && (
          <div className="genos-sidebar__user">
            <div className="user-avatar">
              <span>OC</span>
            </div>
            <div className="user-info">
              <span className="user-name">Octavio Cestari</span>
              <span className="user-role">Administrador</span>
            </div>
            <button className="user-menu-btn" title="Opções">
              <OverflowMenuVertical size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
