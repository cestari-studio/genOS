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
} from '@carbon/icons-react';

const navItems = [
  { href: '/dashboard', icon: Dashboard, label: 'Dashboard' },
  { href: '/clients', icon: UserMultiple, label: 'Clientes' },
  { href: '/projects', icon: Folder, label: 'Projetos' },
  { href: '/briefings', icon: TaskComplete, label: 'Briefings' },
  { href: '/documents', icon: Document, label: 'Documentos' },
  { href: '/analytics', icon: Analytics, label: 'Analytics' },
  { href: '/notifications', icon: Notification, label: 'Notificações' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
        {navItems.map((item) => (
          <SideNavLink
            key={item.href}
            as={Link}
            href={item.href}
            renderIcon={item.icon}
            isActive={pathname === item.href || pathname?.startsWith(item.href + '/')}
          >
            {item.label}
          </SideNavLink>
        ))}
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
