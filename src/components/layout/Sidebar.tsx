'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  SideNavDivider,
} from '@carbon/react';
import {
  Dashboard,
  UserMultiple,
  Folder,
  Document,
  TaskComplete,
  Settings,
  Analytics,
  Notification,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Image,
  Edit,
  Checkmark,
  Receipt,
  Money,
  Calculator,
  UserAdmin,
  Connect,
  Report,
} from '@carbon/icons-react';

// Navegação principal
const mainNavItems = [
  { href: '/dashboard', icon: Dashboard, label: 'Dashboard' },
  { href: '/reports', icon: Report, label: 'Relatórios' },
];

// Gestão de Clientes e Projetos
const managementItems = [
  { href: '/clients', icon: UserMultiple, label: 'Clientes' },
  { href: '/projects', icon: Folder, label: 'Projetos' },
  { href: '/briefings', icon: TaskComplete, label: 'Briefings' },
];

// Conteúdo
const contentItems = [
  { href: '/content', icon: Edit, label: 'Conteúdo' },
  { href: '/media', icon: Image, label: 'Biblioteca de Mídia' },
  { href: '/calendar', icon: Calendar, label: 'Calendário' },
  { href: '/approvals', icon: Checkmark, label: 'Aprovações' },
];

// Documentos e Financeiro
const financeItems = [
  { href: '/documents', icon: Document, label: 'Documentos' },
  { href: '/contracts', icon: Receipt, label: 'Contratos' },
  { href: '/billing', icon: Money, label: 'Faturamento' },
  { href: '/quotes', icon: Calculator, label: 'Orçamentos' },
];

// Sistema
const systemItems = [
  { href: '/analytics', icon: Analytics, label: 'Analytics' },
  { href: '/notifications', icon: Notification, label: 'Notificações' },
];

// Configurações
const settingsItems = [
  { href: '/settings', icon: Settings, label: 'Configurações' },
  { href: '/settings/users', icon: UserAdmin, label: 'Usuários' },
  { href: '/settings/integrations', icon: Connect, label: 'Integrações' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const renderNavLink = (item: { href: string; icon: typeof Dashboard; label: string }) => (
    <SideNavLink
      key={item.href}
      as={Link}
      href={item.href}
      renderIcon={item.icon}
      isActive={isActive(item.href)}
    >
      {item.label}
    </SideNavLink>
  );

  return (
    <SideNav
      isFixedNav
      expanded={!collapsed}
      isChildOfHeader={false}
      aria-label="Side navigation"
      className="genos-sidebar"
    >
      <div className="sidebar-header">
        {!collapsed && (
          <div className="logo">
            <span className="logo-text">genOS</span>
            <span className="logo-sub">Content Factory</span>
          </div>
        )}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir' : 'Recolher'}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <SideNavItems>
        {/* Dashboard e Relatórios */}
        {mainNavItems.map(renderNavLink)}

        <SideNavDivider />

        {/* Gestão */}
        <SideNavMenu
          renderIcon={Folder}
          title="Gestão"
          defaultExpanded={
            managementItems.some(item => isActive(item.href))
          }
        >
          {managementItems.map((item) => (
            <SideNavMenuItem
              key={item.href}
              as={Link}
              href={item.href}
              isActive={isActive(item.href)}
            >
              {item.label}
            </SideNavMenuItem>
          ))}
        </SideNavMenu>

        {/* Conteúdo */}
        <SideNavMenu
          renderIcon={Edit}
          title="Conteúdo"
          defaultExpanded={
            contentItems.some(item => isActive(item.href))
          }
        >
          {contentItems.map((item) => (
            <SideNavMenuItem
              key={item.href}
              as={Link}
              href={item.href}
              isActive={isActive(item.href)}
            >
              {item.label}
            </SideNavMenuItem>
          ))}
        </SideNavMenu>

        {/* Financeiro */}
        <SideNavMenu
          renderIcon={Money}
          title="Financeiro"
          defaultExpanded={
            financeItems.some(item => isActive(item.href))
          }
        >
          {financeItems.map((item) => (
            <SideNavMenuItem
              key={item.href}
              as={Link}
              href={item.href}
              isActive={isActive(item.href)}
            >
              {item.label}
            </SideNavMenuItem>
          ))}
        </SideNavMenu>

        <SideNavDivider />

        {/* Sistema */}
        {systemItems.map(renderNavLink)}

        <SideNavDivider />

        {/* Configurações */}
        <SideNavMenu
          renderIcon={Settings}
          title="Configurações"
          defaultExpanded={
            settingsItems.some(item => isActive(item.href))
          }
        >
          {settingsItems.map((item) => (
            <SideNavMenuItem
              key={item.href}
              as={Link}
              href={item.href}
              isActive={isActive(item.href)}
            >
              {item.label}
            </SideNavMenuItem>
          ))}
        </SideNavMenu>
      </SideNavItems>

      <style jsx>{`
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #393939;
        }
        .logo {
          display: flex;
          flex-direction: column;
        }
        .logo-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }
        .logo-sub {
          font-size: 0.75rem;
          color: #8d8d8d;
        }
        .collapse-btn {
          background: transparent;
          border: none;
          color: #8d8d8d;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .collapse-btn:hover {
          color: white;
        }
      `}</style>
    </SideNav>
  );
}
