'use client';

import {
  Grid,
  Column,
  Button,
} from '@carbon/react';
import {
  ArrowRight,
  LogoLinkedin,
  LogoGithub,
  LogoTwitter,
  Translate,
} from '@carbon/icons-react';
import { I18nProvider, useTranslation } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n';

const navLinks = [
  { key: 'nav.products', href: '/' },
  { key: 'nav.solutions', href: '/#solutions' },
  { key: 'nav.pricing', href: '/pricing' },
  { key: 'nav.docs', href: '/docs' },
];

function PublicHeader() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9000,
        background: 'rgba(22,22,22,.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #393939',
      }}
    >
      <div
        style={{
          maxWidth: 1584,
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 48,
        }}
      >
        <a
          href="/"
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#f4f4f4',
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
        >
          Cestari Studio
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              style={{
                fontSize: '0.875rem',
                color: '#c6c6c6',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setLocale(locale === 'pt-BR' ? 'en' : 'pt-BR' as Locale)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'none',
              border: 'none',
              color: '#c6c6c6',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
            }}
            title={t('footer.language')}
          >
            <Translate size={16} />
            {locale === 'pt-BR' ? 'PT' : 'EN'}
          </button>

          <a
            href="/login"
            style={{
              fontSize: '0.875rem',
              color: '#78a9ff',
              textDecoration: 'none',
            }}
          >
            {t('nav.login')}
          </a>

          <Button
            size="sm"
            renderIcon={ArrowRight}
            href="/pricing"
            style={{ minWidth: 0 }}
          >
            {t('nav.cta')}
          </Button>
        </div>
      </div>
    </header>
  );
}

function PublicFooter() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <footer
      style={{
        background: '#161616',
        padding: '4rem 0 2rem',
        borderTop: '1px solid #393939',
      }}
    >
      <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
        <Column lg={4} md={4} sm={4}>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#f4f4f4',
              marginBottom: '1rem',
            }}
          >
            Cestari Studio
          </h3>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#8d8d8d',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}
          >
            {t('footer.description')}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <LogoLinkedin size={24} style={{ color: '#c6c6c6', cursor: 'pointer' }} />
            <LogoGithub size={24} style={{ color: '#c6c6c6', cursor: 'pointer' }} />
            <LogoTwitter size={24} style={{ color: '#c6c6c6', cursor: 'pointer' }} />
          </div>
        </Column>

        <Column lg={3} md={2} sm={4}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#f4f4f4',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.32px',
            }}
          >
            {t('footer.products')}
          </h4>
          {['genOS', 'Content Factory', 'Helian', 'GEO Intelligence'].map(
            (l) => (
              <a
                key={l}
                href={`/${l.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: '#c6c6c6',
                  textDecoration: 'none',
                  marginBottom: '0.75rem',
                }}
              >
                {l}
              </a>
            ),
          )}
        </Column>

        <Column lg={3} md={2} sm={4}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#f4f4f4',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.32px',
            }}
          >
            {t('footer.company')}
          </h4>
          {['About', 'Blog', 'Careers', 'Contact'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                color: '#c6c6c6',
                textDecoration: 'none',
                marginBottom: '0.75rem',
              }}
            >
              {l}
            </a>
          ))}
        </Column>

        <Column lg={3} md={2} sm={4}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#f4f4f4',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.32px',
            }}
          >
            {t('footer.resources')}
          </h4>
          {['Documentation', 'API Reference', 'Pricing', 'Status'].map(
            (l) => (
              <a
                key={l}
                href="#"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: '#c6c6c6',
                  textDecoration: 'none',
                  marginBottom: '0.75rem',
                }}
              >
                {l}
              </a>
            ),
          )}
        </Column>

        <Column lg={3} md={2} sm={4}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#f4f4f4',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.32px',
            }}
          >
            {t('footer.language')}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => setLocale('pt-BR')}
              style={{
                background: 'none',
                border: 'none',
                color: locale === 'pt-BR' ? '#78a9ff' : '#c6c6c6',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textAlign: 'left',
                padding: 0,
                fontWeight: locale === 'pt-BR' ? 600 : 400,
              }}
            >
              Portugu{'\u00eas'} (BR)
            </button>
            <button
              onClick={() => setLocale('en')}
              style={{
                background: 'none',
                border: 'none',
                color: locale === 'en' ? '#78a9ff' : '#c6c6c6',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textAlign: 'left',
                padding: 0,
                fontWeight: locale === 'en' ? 600 : 400,
              }}
            >
              English (US)
            </button>
          </div>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <div
            style={{
              borderTop: '1px solid #393939',
              marginTop: '3rem',
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <p style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>
              {t('footer.copyright', { year: String(new Date().getFullYear()) })}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['footer.privacy', 'footer.terms', 'footer.cookies'].map((key) => (
                <a
                  key={key}
                  href="#"
                  style={{
                    fontSize: '0.75rem',
                    color: '#6f6f6f',
                    textDecoration: 'none',
                  }}
                >
                  {t(key)}
                </a>
              ))}
            </div>
          </div>
        </Column>
      </Grid>
    </footer>
  );
}

export default function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <PublicHeader />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <PublicFooter />
      </div>
    </I18nProvider>
  );
}
