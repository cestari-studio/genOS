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
  ChartRadar,
  Earth,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const mainNavItems = [
    { href: '/dashboard', icon: Dashboard, label: t('sidebar.dashboard') },
    { href: '/reports', icon: Report, label: t('sidebar.reports') },
  ];

  const managementItems = [
    { href: '/clients', icon: UserMultiple, label: t('sidebar.clients') },
    { href: '/projects', icon: Folder, label: t('sidebar.projects') },
    { href: '/briefings', icon: TaskComplete, label: t('sidebar.briefings') },
  ];

  const contentItems = [
    { href: '/content', icon: Edit, label: t('sidebar.contentLabel') },
    { href: '/media', icon: Image, label: t('sidebar.mediaLibrary') },
    { href: '/calendar', icon: Calendar, label: t('sidebar.calendar') },
    { href: '/approvals', icon: Checkmark, label: t('sidebar.approvals') },
  ];

  const financeItems = [
    { href: '/documents', icon: Document, label: t('sidebar.documents') },
    { href: '/contracts', icon: Receipt, label: t('sidebar.contracts') },
    { href: '/billing', icon: Money, label: t('sidebar.billing') },
    { href: '/quotes', icon: Calculator, label: t('sidebar.quotes') },
  ];

  const systemItems = [
    { href: '/analytics', icon: Analytics, label: t('sidebar.analytics') },
    { href: '/trends', icon: ChartRadar, label: t('sidebar.trends') },
    { href: '/geo', icon: Earth, label: t('sidebar.geo') },
    { href: '/notifications', icon: Notification, label: t('sidebar.notificationsLabel') },
  ];

  const settingsItems = [
    { href: '/settings', icon: Settings, label: t('sidebar.settings') },
    { href: '/settings/users', icon: UserAdmin, label: t('sidebar.users') },
    { href: '/settings/integrations', icon: Connect, label: t('sidebar.integrations') },
  ];

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
          aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <SideNavItems>
        {mainNavItems.map(renderNavLink)}

        <SideNavDivider />

        <SideNavMenu
          renderIcon={Folder}
          title={t('sidebar.management')}
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

        <SideNavMenu
          renderIcon={Edit}
          title={t('sidebar.content')}
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

        <SideNavMenu
          renderIcon={Money}
          title={t('sidebar.finance')}
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

        {systemItems.map(renderNavLink)}

        <SideNavDivider />

        <SideNavMenu
          renderIcon={Settings}
          title={t('sidebar.settings')}
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

    </SideNav>
  );
}
