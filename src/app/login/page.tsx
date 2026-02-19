'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Form, TextInput, PasswordInput, Button, InlineLoading, Stack, Tile, InlineNotification,
} from '@carbon/react';
import { Terminal } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';

const ASCII_ART = `
  ____  ___  ____  ____  _____
 / ___\\/ _ \\/ __ \\/ __ \\/ ___/
/ /_  /  __/ / / / /_/ /\\__ \\
\\____/\\___/_/ /_/\\____/____/
       v4.5.0 Quantum Edition
`;

const BOOT_SEQUENCE_PT = [
  '> Inicializando kernel genOS...',
  '> Carregando Carbon Design System UI...',
  '> Conectando ao Supabase Database...',
  '> Handshake com Qiskit Runtime: SUCCESS',
  '> Aguardando autenticação do usuário...',
];

const BOOT_SEQUENCE_EN = [
  '> Initializing genOS kernel...',
  '> Loading Carbon Design System UI...',
  '> Connecting to Supabase Database...',
  '> Handshake with Qiskit Runtime: SUCCESS',
  '> Awaiting user authentication...',
];

export default function CliLoginPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cliText, setCliText] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  const bootSequence = locale === 'en' ? BOOT_SEQUENCE_EN : BOOT_SEQUENCE_PT;

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    bootSequence.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setCliText(prev => [...prev, line]);
      }, 600 * (index + 1));
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width) * 100;
    const y = (clientY / height) * 100;
    setMousePos({ x: `${x}%`, y: `${y}%` });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCliText(prev => [...prev, '> EXECUTING AUTH QUERY...']);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setCliText(prev => [...prev, `> ERROR: ${authError.message}`]);
      setError(
        authError.message === 'Invalid login credentials'
          ? t('login.invalidCredentials')
          : authError.message
      );
      setLoading(false);
    } else {
      setCliText(prev => [
        ...prev,
        '> AUTHENTICATION SUCCESS',
        '> Redirecting to Master Dashboard...',
      ]);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);
    }
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#161616',
        color: '#f4f4f4',
        fontFamily: '"IBM Plex Mono", monospace',
      }}
    >
      {/* Dynamic radial gradient background tracking mouse */}
      <motion.div
        animate={{
          background: `radial-gradient(circle at ${mousePos.x} ${mousePos.y}, #0f62fe33 0%, #001141 50%, #161616 100%)`,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <svg width="100%" height="100%" style={{ opacity: 0.1 }}>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </motion.div>

      {/* Central CLI card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '1rem',
        }}
      >
        <Tile
          style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: '#262626',
            border: '1px solid #393939',
            borderTop: '4px solid #0f62fe',
            padding: '2rem',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          }}
        >
          {/* macOS-style terminal dots */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#da1e28' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f1c21b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#24a148' }} />
          </div>

          <Stack gap={6}>
            {/* ASCII Art */}
            <pre
              style={{
                color: '#0f62fe',
                fontSize: '10px',
                lineHeight: '12px',
                margin: 0,
                fontFamily: '"IBM Plex Mono", monospace',
                overflow: 'hidden',
              }}
            >
              {ASCII_ART}
            </pre>

            {/* Boot sequence lines */}
            <div
              style={{
                minHeight: '120px',
                color: '#8d8d8d',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {cliText.map((text, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    color: text.includes('ERROR')
                      ? '#da1e28'
                      : text.includes('SUCCESS')
                        ? '#24a148'
                        : '#8d8d8d',
                  }}
                >
                  {text}
                </motion.span>
              ))}
            </div>

            {/* Auth form */}
            <Form onSubmit={handleLogin}>
              <Stack gap={5}>
                {error && (
                  <InlineNotification
                    kind="error"
                    title={t('login.errorTitle')}
                    subtitle={error}
                    hideCloseButton
                    lowContrast
                  />
                )}

                <TextInput
                  id="cli-email"
                  type="email"
                  labelText="> root@user_id"
                  placeholder="admin@cestari.studio"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  light={false}
                />

                <PasswordInput
                  id="cli-pwd"
                  labelText="> sys_passcode"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  light={false}
                />

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  renderIcon={loading ? undefined : Terminal}
                  style={{ width: '100%', maxWidth: 'none', marginTop: '0.5rem' }}
                >
                  {loading ? (
                    <InlineLoading status="active" description={t('login.submitting')} />
                  ) : (
                    'EXECUTE_LOGIN'
                  )}
                </Button>

                <div style={{ textAlign: 'center' }}>
                  <a
                    href="/forgot-password"
                    style={{ color: '#78a9ff', fontSize: '0.75rem', textDecoration: 'none' }}
                  >
                    {t('login.forgotPassword')}
                  </a>
                </div>
              </Stack>
            </Form>
          </Stack>
        </Tile>
      </div>
    </main>
  );
}
