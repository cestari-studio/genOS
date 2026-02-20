'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Form, TextInput, PasswordInput, Button, InlineLoading, Stack, InlineNotification, Link as CarbonLink,
} from '@carbon/react';
import { Login, ArrowRight } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';

// ── Animated Fluid SVG Background ──────────────────────────────
function FluidBackground() {
  return (
    <svg
      viewBox="0 0 900 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <defs>
        {/* Blue fluid gradients */}
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#001d6c" />
          <stop offset="50%" stopColor="#0043ce" />
          <stop offset="100%" stopColor="#0f62fe" />
        </linearGradient>
        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f62fe" />
          <stop offset="50%" stopColor="#4589ff" />
          <stop offset="100%" stopColor="#8a3ffc" />
        </linearGradient>
        <linearGradient id="grad3" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#0043ce" />
          <stop offset="100%" stopColor="#001141" />
        </linearGradient>
        <radialGradient id="glow1" cx="30%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#4589ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#001141" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="70%" cy="60%" r="40%">
          <stop offset="0%" stopColor="#8a3ffc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#001141" stopOpacity="0" />
        </radialGradient>

        {/* Noise filter for texture */}
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Base */}
      <rect width="100%" height="100%" fill="#001141" />

      {/* Fluid blob 1 — slow orbit */}
      <motion.ellipse
        cx="300" cy="350" rx="320" ry="280"
        fill="url(#grad1)"
        opacity={0.6}
        animate={{
          cx: [300, 450, 350, 200, 300],
          cy: [350, 250, 450, 300, 350],
          rx: [320, 280, 350, 300, 320],
          ry: [280, 340, 260, 310, 280],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Fluid blob 2 — counter-orbit */}
      <motion.ellipse
        cx="600" cy="500" rx="250" ry="300"
        fill="url(#grad2)"
        opacity={0.5}
        animate={{
          cx: [600, 500, 700, 550, 600],
          cy: [500, 600, 400, 550, 500],
          rx: [250, 300, 220, 280, 250],
          ry: [300, 250, 320, 270, 300],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Fluid blob 3 — smaller accent */}
      <motion.ellipse
        cx="150" cy="700" rx="200" ry="180"
        fill="url(#grad3)"
        opacity={0.4}
        animate={{
          cx: [150, 250, 100, 200, 150],
          cy: [700, 600, 750, 650, 700],
          rx: [200, 230, 180, 210, 200],
          ry: [180, 200, 160, 190, 180],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Glow overlays */}
      <motion.rect
        width="100%" height="100%"
        fill="url(#glow1)"
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.rect
        width="100%" height="100%"
        fill="url(#glow2)"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle grain overlay */}
      <rect width="100%" height="100%" filter="url(#grain)" opacity={0.04} />
    </svg>
  );
}

// ── Animated Network Lines SVG ──────────────────────────────────
function NetworkLines() {
  const nodes = [
    { x: 120, y: 180 }, { x: 380, y: 120 }, { x: 650, y: 200 },
    { x: 200, y: 450 }, { x: 500, y: 380 }, { x: 750, y: 480 },
    { x: 100, y: 650 }, { x: 420, y: 700 }, { x: 700, y: 720 },
    { x: 300, y: 280 }, { x: 600, y: 580 },
  ];

  const connections = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5],
    [3, 6], [4, 7], [5, 8], [6, 7], [7, 8], [0, 9], [9, 4],
    [4, 10], [10, 8], [9, 3], [10, 7],
  ];

  return (
    <svg
      viewBox="0 0 900 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      {/* Connection lines */}
      {connections.map(([a, b], i) => (
        <motion.line
          key={`line-${i}`}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="#4589ff"
          strokeWidth={0.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.3, 0.15] }}
          transition={{ duration: 2, delay: i * 0.15, repeat: Infinity, repeatDelay: 6 }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={node.x} cy={node.y} r={3}
          fill="#4589ff"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0.8], opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, repeatDelay: 5 }}
        />
      ))}

      {/* Pulse rings on key nodes */}
      {[0, 4, 8].map((idx) => (
        <motion.circle
          key={`pulse-${idx}`}
          cx={nodes[idx].x} cy={nodes[idx].y} r={3}
          fill="none"
          stroke="#78a9ff"
          strokeWidth={1}
          animate={{ r: [3, 30], opacity: [0.5, 0] }}
          transition={{ duration: 3, delay: idx * 0.5, repeat: Infinity, repeatDelay: 4 }}
        />
      ))}
    </svg>
  );
}

// ── Floating Geometric Shapes ───────────────────────────────────
function FloatingShapes() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Hexagon */}
      <motion.svg
        viewBox="0 0 100 100" width="120" height="120"
        style={{ position: 'absolute', top: '15%', left: '10%' }}
        animate={{ y: [0, -20, 0], rotate: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <polygon
          points="50,5 93,25 93,75 50,95 7,75 7,25"
          fill="none"
          stroke="url(#shapeGrad1)"
          strokeWidth="1"
          opacity={0.3}
        />
        <defs>
          <linearGradient id="shapeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4589ff" />
            <stop offset="100%" stopColor="#8a3ffc" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Diamond */}
      <motion.svg
        viewBox="0 0 100 100" width="80" height="80"
        style={{ position: 'absolute', top: '60%', right: '15%' }}
        animate={{ y: [0, 15, 0], rotate: [45, 90, 45] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect
          x="20" y="20" width="60" height="60"
          fill="none"
          stroke="#4589ff"
          strokeWidth="1"
          opacity={0.25}
        />
      </motion.svg>

      {/* Circle */}
      <motion.svg
        viewBox="0 0 100 100" width="60" height="60"
        style={{ position: 'absolute', bottom: '20%', left: '25%' }}
        animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="#a56eff" strokeWidth="1" opacity={0.2} />
      </motion.svg>

      {/* Triangle */}
      <motion.svg
        viewBox="0 0 100 100" width="90" height="90"
        style={{ position: 'absolute', top: '35%', right: '8%' }}
        animate={{ y: [0, 12, 0], rotate: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <polygon
          points="50,10 90,90 10,90"
          fill="none"
          stroke="#4589ff"
          strokeWidth="1"
          opacity={0.2}
        />
      </motion.svg>
    </div>
  );
}

// ── Main Login Page ─────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    setMousePos({ x, y });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? t('login.invalidCredentials')
          : authError.message
      );
      setLoading(false);
    } else {
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 400);
    }
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className="login-page"
    >
      {/* ─── Left Panel: Visual / Branding ─── */}
      <div className="login-visual">
        <FluidBackground />
        <NetworkLines />
        <FloatingShapes />

        {/* Mouse-tracking glow */}
        <motion.div
          className="login-glow"
          animate={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(69,137,255,0.15) 0%, transparent 60%)`,
          }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
        />

        {/* Branding overlay */}
        <div className="login-brand">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="login-brand__title">genOS</h1>
            <p className="login-brand__version">v4.5.0 — Quantum Edition</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="login-brand__tagline"
          >
            <p>{locale === 'en'
              ? 'AI-powered content factory for modern agencies'
              : 'Content factory com IA para agências modernas'
            }</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="login-brand__features"
          >
            {[
              locale === 'en' ? 'Multi-provider AI (Claude, Gemini, Granite)' : 'IA multi-provider (Claude, Gemini, Granite)',
              locale === 'en' ? 'Brand DNA & content intelligence' : 'DNA de marca & inteligência de conteúdo',
              locale === 'en' ? 'Social hub & analytics' : 'Hub social & analytics',
              locale === 'en' ? 'FinOps & token management' : 'FinOps & gestão de tokens',
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="login-feature"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.15 }}
              >
                <span className="login-feature__dot" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <motion.div
        className="login-form-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="login-form-wrapper">
          {/* Logo for mobile */}
          <div className="login-form__mobile-logo">
            <h2>genOS</h2>
            <span>v4.5.0</span>
          </div>

          <div className="login-form__header">
            <h2>{t('login.title')}</h2>
            <p>{locale === 'en'
              ? 'Sign in to your workspace'
              : 'Acesse seu workspace'
            }</p>
          </div>

          <Form onSubmit={handleLogin}>
            <Stack gap={6}>
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
                id="login-email"
                type="email"
                labelText={t('login.email')}
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                size="lg"
              />

              <PasswordInput
                id="login-password"
                labelText={t('login.password')}
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                size="lg"
              />

              <div className="login-form__actions">
                <CarbonLink href="/forgot-password" size="sm">
                  {t('login.forgotPassword')}
                </CarbonLink>
              </div>

              <Button
                type="submit"
                disabled={loading || !email || !password}
                renderIcon={loading ? undefined : ArrowRight}
                size="lg"
                className="login-form__submit"
              >
                {loading ? (
                  <InlineLoading status="active" description={t('login.submitting')} />
                ) : (
                  t('login.submit')
                )}
              </Button>
            </Stack>
          </Form>

          <div className="login-form__footer">
            <p>
              {locale === 'en' ? "Don't have an account?" : 'Ainda não tem uma conta?'}{' '}
              <CarbonLink href="/register" size="sm">
                {locale === 'en' ? 'Get started' : 'Comece agora'}
              </CarbonLink>
            </p>
          </div>

          <div className="login-form__legal">
            <p>
              Cestari Studio &copy; {new Date().getFullYear()} &middot;{' '}
              <CarbonLink href="/terms" size="sm">{locale === 'en' ? 'Terms' : 'Termos'}</CarbonLink>{' '}&middot;{' '}
              <CarbonLink href="/privacy" size="sm">{locale === 'en' ? 'Privacy' : 'Privacidade'}</CarbonLink>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
