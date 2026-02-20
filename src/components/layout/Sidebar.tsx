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
  Chemistry,
  Chat,
  WatsonHealthAiResults,
  Enterprise,
  Home,
  Book,
  Catalog,
  Share,
  Rocket,
  MachineLearning,
  VoiceActivate,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  // ── Main Navigation ────────────────────────────────
  const mainNavItems = [
    { href: '/dashboard', icon: Dashboard, label: t('sidebar.dashboard') },
    { href: '/reports', icon: Report, label: t('sidebar.reports') },
  ];

  // ── Management ─────────────────────────────────────
  const managementItems = [
    { href: '/clients', label: t('sidebar.clients') },
    { href: '/projects', label: t('sidebar.projects') },
    { href: '/briefings', label: t('sidebar.briefings') },
    { href: '/brands', label: t('sidebar.brands') },
  ];

  // ── Content Factory ────────────────────────────────
  const contentItems = [
    { href: '/content', label: t('sidebar.contentLabel') },
    { href: '/content/grid', label: t('sidebar.contentGrid') },
    { href: '/content/assets', label: t('sidebar.contentAssets') },
    { href: '/content/copywriter', label: t('sidebar.copywriter') },
    { href: '/media', label: t('sidebar.mediaLibrary') },
    { href: '/calendar', label: t('sidebar.calendar') },
    { href: '/approvals', label: t('sidebar.approvals') },
  ];

  // ── Social Hub ─────────────────────────────────────
  const socialItems = [
    { href: '/social', label: t('sidebar.socialDashboard') },
    { href: '/social/content', label: t('sidebar.socialContent') },
    { href: '/social/scheduler', label: t('sidebar.scheduler') },
    { href: '/social/stories', label: t('sidebar.stories') },
    { href: '/social/ads', label: t('sidebar.ads') },
    { href: '/social/campaigns', label: t('sidebar.campaigns') },
    { href: '/social/inbox', label: t('sidebar.inbox') },
    { href: '/social/influencers', label: t('sidebar.influencers') },
    { href: '/social/listening', label: t('sidebar.listening') },
    { href: '/social/analytics', label: t('sidebar.socialAnalytics') },
    { href: '/social/reports', label: t('sidebar.socialReports') },
  ];

  // ── AI ─────────────────────────────────────────────
  const aiItems = [
    { href: '/ai/copilot', label: t('sidebar.aiCopilot') },
    { href: '/ai/lab', label: t('sidebar.aiLab') },
    { href: '/ai/knowledge', label: t('sidebar.knowledgeBase') },
  ];

  // ── Intelligence (GEO + Analytics) ─────────────────
  const intelligenceItems = [
    { href: '/analytics', label: t('sidebar.analytics') },
    { href: '/trends', label: t('sidebar.trends') },
    { href: '/geo', label: t('sidebar.geo') },
    { href: '/geo/semantic-map', label: t('sidebar.semanticMap') },
    { href: '/geo/keywords', label: t('sidebar.keywords') },
    { href: '/geo/competitors', label: t('sidebar.competitors') },
    { href: '/geo/sentiment', label: t('sidebar.sentiment') },
    { href: '/geo/viral', label: t('sidebar.viral') },
  ];

  // ── Finance ────────────────────────────────────────
  const financeItems = [
    { href: '/documents', label: t('sidebar.documents') },
    { href: '/contracts', label: t('sidebar.contracts') },
    { href: '/billing', label: t('sidebar.billing') },
    { href: '/quotes', label: t('sidebar.quotes') },
  ];

  // ── FinOps ─────────────────────────────────────────
  const finopsItems = [
    { href: '/finops', label: t('sidebar.finopsDashboard') },
    { href: '/finops/costs', label: t('sidebar.finopsCosts') },
    { href: '/finops/tokens', label: t('sidebar.finopsTokens') },
    { href: '/finops/invoices', label: t('sidebar.finopsInvoices') },
    { href: '/finops/roi', label: t('sidebar.finopsRoi') },
    { href: '/finops/forecast', label: t('sidebar.finopsForecast') },
    { href: '/finops/audit', label: t('sidebar.finopsAudit') },
  ];

  // ── Agency ─────────────────────────────────────────
  const agencyItems = [
    { href: '/agency', label: t('sidebar.agencyDashboard') },
    { href: '/agency/portfolio', label: t('sidebar.portfolio') },
    { href: '/agency/assets', label: t('sidebar.agencyAssets') },
    { href: '/agency/forecast', label: t('sidebar.agencyForecast') },
    { href: '/agency/contracts', label: t('sidebar.agencyContracts') },
    { href: '/agency/tokens', label: t('sidebar.agencyTokens') },
    { href: '/agency/profit', label: t('sidebar.agencyProfit') },
    { href: '/agency/onboarding', label: t('sidebar.agencyOnboarding') },
    { href: '/agency/sales-deck', label: t('sidebar.salesDeck') },
    { href: '/agency/feedback', label: t('sidebar.agencyFeedback') },
  ];

  // ── Tenant Hub ─────────────────────────────────────
  const hubItems = [
    { href: '/hub', label: t('sidebar.hubDashboard') },
    { href: '/hub/brand', label: t('sidebar.hubBrand') },
    { href: '/hub/dna-editor', label: t('sidebar.dnaEditor') },
    { href: '/hub/team', label: t('sidebar.hubTeam') },
    { href: '/hub/regional', label: t('sidebar.hubRegional') },
    { href: '/hub/billing', label: t('sidebar.hubBilling') },
    { href: '/hub/documents', label: t('sidebar.hubDocuments') },
    { href: '/hub/support', label: t('sidebar.hubSupport') },
    { href: '/hub/integrations', label: t('sidebar.hubIntegrations') },
    { href: '/hub/settings', label: t('sidebar.hubSettings') },
  ];

  // ── Admin ──────────────────────────────────────────
  const adminItems = [
    { href: '/admin/users', label: t('sidebar.adminUsers') },
    { href: '/admin/tenants', label: t('sidebar.adminTenants') },
    { href: '/admin/connectors', label: t('sidebar.adminConnectors') },
    { href: '/admin/audit', label: t('sidebar.adminAudit') },
    { href: '/admin/logs', label: t('sidebar.adminLogs') },
    { href: '/admin/health', label: t('sidebar.adminHealth') },
    { href: '/admin/heartbeat', label: t('sidebar.adminHeartbeat') },
    { href: '/admin/patches', label: t('sidebar.adminPatches') },
    { href: '/admin/i18n', label: t('sidebar.adminI18n') },
    { href: '/admin/quantum', label: t('sidebar.adminQuantum') },
    { href: '/admin/finops', label: t('sidebar.adminFinops') },
  ];

  // ── Settings ───────────────────────────────────────
  const settingsItems = [
    { href: '/settings', label: t('sidebar.settings') },
    { href: '/settings/users', label: t('sidebar.users') },
    { href: '/settings/integrations', label: t('sidebar.integrations') },
  ];

  const renderNavLink = (item: { href: string; icon: any; label: string }) => (
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

  const renderMenu = (
    icon: any,
    title: string,
    items: { href: string; label: string }[],
  ) => (
    <SideNavMenu
      renderIcon={icon}
      title={title}
      defaultExpanded={items.some((item) => isActive(item.href))}
    >
      {items.map((item) => (
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
        {/* Main */}
        {mainNavItems.map(renderNavLink)}

        <SideNavDivider />

        {/* Management */}
        {renderMenu(Folder, t('sidebar.management'), managementItems)}

        {/* Content Factory */}
        {renderMenu(Edit, t('sidebar.content'), contentItems)}

        {/* Social Hub */}
        {renderMenu(Chat, t('sidebar.socialHub'), socialItems)}

        {/* AI */}
        {renderMenu(WatsonHealthAiResults, t('sidebar.ai'), aiItems)}

        <SideNavDivider />

        {/* Intelligence */}
        {renderMenu(ChartRadar, t('sidebar.intelligence'), intelligenceItems)}

        {/* Finance */}
        {renderMenu(Money, t('sidebar.finance'), financeItems)}

        {/* FinOps */}
        {renderMenu(Calculator, t('sidebar.finops'), finopsItems)}

        <SideNavDivider />

        {/* Agency */}
        {renderMenu(Enterprise, t('sidebar.agency'), agencyItems)}

        {/* Tenant Hub */}
        {renderMenu(Home, t('sidebar.hub'), hubItems)}

        {/* Admin */}
        {renderMenu(UserAdmin, t('sidebar.admin'), adminItems)}

        <SideNavDivider />

        {/* System links */}
        <SideNavLink
          as={Link}
          href="/notifications"
          renderIcon={Notification}
          isActive={isActive('/notifications')}
        >
          {t('sidebar.notificationsLabel')}
        </SideNavLink>
        <SideNavLink
          as={Link}
          href="/docs"
          renderIcon={Book}
          isActive={isActive('/docs')}
        >
          {t('sidebar.docs')}
        </SideNavLink>

        <SideNavDivider />

        {/* Settings */}
        {renderMenu(Settings, t('sidebar.settings'), settingsItems)}
      </SideNavItems>
    </SideNav>
  );
}
