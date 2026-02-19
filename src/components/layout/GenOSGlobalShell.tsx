'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Header as CarbonHeader,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Theme,
} from '@carbon/react';
import { Search, Login, Language, Earth } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import { I18nProvider } from '@/lib/i18n/context';

// ── L0 Navigation (Global — Cestari Studio) ────────────────────
interface NavItem {
  label: string;
  href: string;
}

const L0_NAV: NavItem[] = [
  { label: 'shell.solutions', href: '/solutions' },
  { label: 'shell.pricing', href: '/pricing' },
  { label: 'shell.docs', href: '/docs' },
];

// ── L1 Navigation (Product — genOS) ────────────────────────────
const L1_NAV: NavItem[] = [
  { label: 'shell.contentFactory', href: '/content' },
  { label: 'shell.geoIntelligence', href: '/geo' },
  { label: 'shell.agentOps', href: '/dashboard' },
  { label: 'shell.finops', href: '/billing' },
];

// ── Micro Footer ────────────────────────────────────────────────
function MicroFooter() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <footer
      style={{
        backgroundColor: '#161616',
        color: '#8d8d8d',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        lineHeight: '1rem',
        letterSpacing: '0.32px',
        borderTop: '1px solid #393939',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: '#f4f4f4', fontWeight: 500 }}>Cestari Studio</span>
        <span>© {new Date().getFullYear()}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link
          href="/privacy"
          style={{ color: '#78a9ff', textDecoration: 'none' }}
        >
          {t('shell.privacy')}
        </Link>
        <Link
          href="/terms"
          style={{ color: '#78a9ff', textDecoration: 'none' }}
        >
          {t('shell.terms')}
        </Link>
        <button
          onClick={() => setLocale(locale === 'pt-BR' ? 'en' : 'pt-BR')}
          style={{
            background: 'none',
            border: 'none',
            color: '#78a9ff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            padding: 0,
          }}
          aria-label={t('header.switchLanguage')}
        >
          <Earth size={14} />
          {locale === 'pt-BR' ? 'Português (BR)' : 'English'}
        </button>
      </div>
    </footer>
  );
}

// ── L1 Sub-navigation Bar ───────────────────────────────────────
function ProductNav() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        backgroundColor: 'var(--cds-layer-01, #f4f4f4)',
        borderBottom: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        height: '2.5rem',
        gap: '0.25rem',
      }}
    >
      <Link
        href="/dashboard"
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--cds-text-primary, #161616)',
          textDecoration: 'none',
          marginRight: '2rem',
        }}
      >
        genOS v4.5.0
      </Link>
      {L1_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            fontSize: '0.8125rem',
            color: 'var(--cds-text-secondary, #525252)',
            textDecoration: 'none',
            padding: '0.5rem 0.75rem',
            transition: 'color 150ms ease',
          }}
        >
          {t(item.label)}
        </Link>
      ))}
    </div>
  );
}

// ── Main Shell Component ────────────────────────────────────────
function GenOSGlobalShellInner({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* L0 Masthead — Global (Cestari Studio branding) */}
      <Theme theme="g100">
        <CarbonHeader aria-label="Cestari Studio — genOS">
          <HeaderName href="/" prefix="Cestari Studio">
            genOS
          </HeaderName>

          <HeaderNavigation aria-label={t('shell.globalNav')}>
            {L0_NAV.map((item) => (
              <HeaderMenuItem key={item.href} href={item.href}>
                {t(item.label)}
              </HeaderMenuItem>
            ))}
          </HeaderNavigation>

          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label={t('header.switchLanguage')}
              tooltipAlignment="end"
              onClick={() => setLocale(locale === 'pt-BR' ? 'en' : 'pt-BR')}
            >
              <Language size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label={t('header.search')} tooltipAlignment="end">
              <Search size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction aria-label={t('login.submit')} tooltipAlignment="end">
              <Link href="/login" style={{ color: 'inherit', display: 'flex' }}>
                <Login size={20} />
              </Link>
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </CarbonHeader>
      </Theme>

      {/* L1 Product Navigation */}
      <ProductNav />

      {/* Main content area */}
      <main style={{ flex: 1, paddingTop: '1rem' }}>
        {children}
      </main>

      {/* Micro Footer */}
      <Theme theme="g100">
        <MicroFooter />
      </Theme>
    </div>
  );
}

export default function GenOSGlobalShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <GenOSGlobalShellInner>{children}</GenOSGlobalShellInner>
    </I18nProvider>
  );
}
