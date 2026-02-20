'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Column,
  Button,
  Tile,
  Tag,
} from '@carbon/react';
import {
  ArrowRight,
  Bot,
  Currency,
  DataBase,
  Earth,
  Chemistry,
  Checkmark,
  Network_3,
  CloudMonitoring,
  IbmWatsonxCodeAssistant,
  Translate,
  ArrowUpRight,
} from '@carbon/icons-react';
import { motion, useInView } from 'framer-motion';

/* ───────── animation ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

function Section({ children, style, id }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      style={style}
    >
      {children}
    </motion.section>
  );
}

/* ───────── data ───────── */
const features = [
  {
    icon: <Bot size={32} />,
    title: 'Multi-Agent System',
    desc: 'Specialized AI agents collaborate in real time — strategists, copywriters, designers, analysts — all coordinated by an intelligent orchestration layer.',
  },
  {
    icon: <Currency size={32} />,
    title: 'Token Economy',
    desc: 'Granular consumption tracking per task, per model. Budget alerts, cost attribution, and predictive spend analytics built in.',
  },
  {
    icon: <DataBase size={32} />,
    title: 'Content Factory',
    desc: 'Integrated content pipeline from ideation through approval to multi-platform publishing, with full version history.',
  },
  {
    icon: <Earth size={32} />,
    title: 'GEO Intelligence',
    desc: 'Track and optimize your brand visibility across generative AI engines — the new SEO frontier.',
  },
  {
    icon: <Chemistry size={32} />,
    title: 'Quantum Optimization',
    desc: 'Powered by Helian, our quantum-classical hybrid layer applies VQC optimization to campaign parameters for superior results.',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime SLA', icon: <CloudMonitoring size={24} /> },
  { value: '500K+', label: 'Tokens / day', icon: <Currency size={24} /> },
  { value: '50+', label: 'AI Models', icon: <IbmWatsonxCodeAssistant size={24} /> },
  { value: '12', label: 'Languages', icon: <Translate size={24} /> },
];

/* ───────── page ───────── */
export default function GenosContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ── HERO ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0043ce 0%, #6929c4 60%, #491d8b 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }}
        />

        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto', position: 'relative' }}>
          <Column lg={10} md={6} sm={4}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Tag type="blue" size="md" style={{ marginBottom: '1.5rem' }}>
                Agentic AI Platform
              </Tag>
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.75rem)',
                  fontWeight: 300,
                  lineHeight: 1.07,
                  color: '#fff',
                  marginBottom: '1.5rem',
                }}
              >
                gen<span style={{ fontWeight: 700 }}>OS</span>
                <br />
                <span style={{ fontSize: '0.5em', fontWeight: 400, opacity: 0.85 }}>
                  Agentic AI Orchestration Platform
                </span>
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.375rem)',
                  color: 'rgba(255,255,255,.8)',
                  maxWidth: 580,
                  lineHeight: 1.5,
                  marginBottom: '2.5rem',
                }}
              >
                Coordinate dozens of specialized AI models through an intelligent
                orchestration layer. Monitor every token, optimize every output,
                and deliver enterprise-grade content at unprecedented scale.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  size="xl"
                  renderIcon={ArrowRight}
                  href="/pricing"
                  style={{
                    background: '#fff',
                    color: '#0043ce',
                    minWidth: 180,
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  kind="ghost"
                  size="xl"
                  renderIcon={ArrowUpRight}
                  style={{ color: '#fff' }}
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </Column>

          <Column lg={6} md={2} sm={0}>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
            >
              {/* Floating agent nodes */}
              <div style={{ position: 'relative', width: 320, height: 320 }}>
                {[0, 1, 2, 3, 4].map((i) => {
                  const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
                  const r = 120;
                  const x = Math.cos(angle) * r + 140;
                  const y = Math.sin(angle) * r + 140;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={mounted ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,.15)',
                        border: '1px solid rgba(255,255,255,.3)',
                        backdropFilter: 'blur(8px)',
                      }}
                    />
                  );
                })}
                {/* center node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={mounted ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{
                    position: 'absolute',
                    left: 130,
                    top: 130,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,.25)',
                    border: '2px solid rgba(255,255,255,.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Network_3 size={28} style={{ color: '#fff' }} />
                </motion.div>
              </div>
            </motion.div>
          </Column>
        </Grid>
      </section>

      {/* ── FEATURES ── */}
      <Section
        style={{ background: '#f4f4f4', padding: 'clamp(4rem, 8vw, 8rem) 0' }}
      >
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={8} md={6} sm={4}>
            <motion.p
              variants={fadeUp}
              custom={0}
              style={{
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.32px',
                color: '#0043ce',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}
            >
              Platform Capabilities
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: '#161616',
                marginBottom: '3rem',
              }}
            >
              Everything you need to{' '}
              <span style={{ fontWeight: 600 }}>orchestrate AI</span>
            </motion.h2>
          </Column>

          {features.map((f, i) => (
            <Column key={f.title} lg={i < 3 ? 5 : 8} md={4} sm={4}>
              <motion.div variants={fadeUp} custom={i + 2}>
                <Tile
                  style={{
                    padding: '2rem',
                    minHeight: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '1rem',
                    background: '#fff',
                    borderLeft: '3px solid #0043ce',
                  }}
                >
                  <div style={{ color: '#0043ce' }}>{f.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#161616' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: '#525252', lineHeight: 1.5 }}>
                    {f.desc}
                  </p>
                </Tile>
              </motion.div>
            </Column>
          ))}
        </Grid>
      </Section>

      {/* ── STATS ── */}
      <Section style={{ background: '#161616', padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={16} md={8} sm={4}>
            <motion.h2
              variants={fadeUp}
              custom={0}
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: 300,
                color: '#f4f4f4',
                textAlign: 'center',
                marginBottom: '3rem',
              }}
            >
              Built for <span style={{ fontWeight: 600 }}>enterprise scale</span>
            </motion.h2>
          </Column>

          {stats.map((s, i) => (
            <Column key={s.label} lg={4} md={4} sm={4}>
              <motion.div variants={fadeUp} custom={i + 1}>
                <Tile
                  style={{
                    background: '#262626',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      color: '#78a9ff',
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {s.icon}
                  </div>
                  <p
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: '#f4f4f4',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {s.value}
                  </p>
                  <p style={{ fontSize: '0.9375rem', color: '#8d8d8d' }}>
                    {s.label}
                  </p>
                </Tile>
              </motion.div>
            </Column>
          ))}
        </Grid>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section style={{ background: '#262626', padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={8} md={6} sm={4}>
            <motion.p
              variants={fadeUp}
              custom={0}
              style={{
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.32px',
                color: '#78a9ff',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: '#f4f4f4',
                marginBottom: '3rem',
              }}
            >
              Three steps to <span style={{ fontWeight: 600 }}>AI-native ops</span>
            </motion.h2>
          </Column>

          {[
            {
              step: '01',
              title: 'Connect',
              desc: 'Plug in your data sources, brand guidelines, and team members. genOS maps your entire content ecosystem.',
            },
            {
              step: '02',
              title: 'Orchestrate',
              desc: 'Define workflows and let AI agents collaborate — from research to copy to visuals to distribution.',
            },
            {
              step: '03',
              title: 'Optimize',
              desc: 'Analyze performance, refine agent behaviors, and continuously improve through real-time analytics.',
            },
          ].map((item, i) => (
            <Column key={item.step} lg={5} md={4} sm={4}>
              <motion.div variants={fadeUp} custom={i + 2}>
                <Tile
                  style={{
                    background: '#393939',
                    padding: '2rem',
                    minHeight: 220,
                    marginBottom: '1rem',
                    borderTop: '3px solid #0043ce',
                  }}
                >
                  <p
                    style={{
                      fontSize: '3rem',
                      fontWeight: 700,
                      color: '#0043ce',
                      marginBottom: '0.5rem',
                      opacity: 0.6,
                    }}
                  >
                    {item.step}
                  </p>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#f4f4f4',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: '#c6c6c6', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </Tile>
              </motion.div>
            </Column>
          ))}
        </Grid>
      </Section>

      {/* ── PRICING TEASER ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0043ce 0%, #6929c4 100%)',
          padding: 'clamp(4rem, 8vw, 6rem) 0',
        }}
      >
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={10} md={6} sm={4}>
            <p
              style={{
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.32px',
                color: 'rgba(255,255,255,.7)',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}
            >
              Pricing
            </p>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              Plans that <span style={{ fontWeight: 600 }}>scale with you</span>
            </h2>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,.8)',
                maxWidth: 540,
                lineHeight: 1.5,
                marginBottom: '2rem',
              }}
            >
              From startups to enterprise — transparent pricing with no hidden
              fees. Start free, upgrade when you're ready.
            </p>
            <Button
              size="xl"
              renderIcon={ArrowRight}
              href="/pricing"
              style={{ background: '#fff', color: '#0043ce', minWidth: 180 }}
            >
              View Plans
            </Button>
          </Column>
        </Grid>
      </section>

      {/* ── FOOTER MINI ── */}
      <footer style={{ background: '#161616', padding: '2rem 0', borderTop: '1px solid #393939' }}>
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={16} md={8} sm={4}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                &copy; {new Date().getFullYear()} Cestari Studio &middot; genOS
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {['Home', 'Content Factory', 'Helian', 'Pricing'].map((l) => (
                  <a
                    key={l}
                    href={`/${l.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{ fontSize: '0.875rem', color: '#c6c6c6', textDecoration: 'none' }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </Column>
        </Grid>
      </footer>
    </div>
  );
}
