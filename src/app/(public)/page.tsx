'use client';

import { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Button,
  Tile,
  ClickableTile,
} from '@carbon/react';
import {
  ArrowRight,
  Idea,
  DataBase,
  Chemistry,
  Earth,
  LogoLinkedin,
  LogoGithub,
  LogoTwitter,
  Email,
  Phone,
  Partnership,
  Enterprise,
  UserMultiple,
} from '@carbon/icons-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/* ───────── animation helpers ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function AnimatedSection({ children, className, style }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  );
}

/* ───────── data ───────── */
const features = [
  {
    icon: <Idea size={32} />,
    title: 'genOS',
    subtitle: 'Agentic AI Orchestration',
    description:
      'Multi-agent platform that coordinates dozens of specialized AI models in real time, optimizing outputs with a token economy.',
    href: '/genos',
  },
  {
    icon: <DataBase size={32} />,
    title: 'Content Factory',
    subtitle: 'AI-Powered Content at Scale',
    description:
      'End-to-end content pipeline — from brief to published asset — with matrix views, version control, and brand DNA alignment.',
    href: '/content-factory',
  },
  {
    icon: <Chemistry size={32} />,
    title: 'Helian',
    subtitle: 'Quantum Multimodal AI',
    description:
      'Next-generation inference engine leveraging Variational Quantum Circuits for unprecedented optimization and accuracy.',
    href: '/helian',
  },
  {
    icon: <Earth size={32} />,
    title: 'GEO Intelligence',
    subtitle: 'Generative Engine Optimization',
    description:
      'Visibility analytics for AI-generated answers — track how your brand appears inside ChatGPT, Gemini, Perplexity, and more.',
    href: '/geo',
  },
];

const testimonials = [
  {
    quote:
      'Cestari Studio transformed the way we approach content. Our production velocity increased 8× while maintaining our brand voice.',
    author: 'Daniela Ferreira',
    role: 'CMO, Vortex Media Group',
  },
  {
    quote:
      'The genOS token economy gives us complete financial visibility on AI spend — something no other platform offers at this level.',
    author: 'Marcos Oliveira',
    role: 'VP Engineering, Scaleway',
  },
  {
    quote:
      "Helian's quantum optimization layer gave us a 34% lift in campaign performance. The future of martech is here.",
    author: 'Camila Rossi',
    role: 'Head of Growth, NexaBrand',
  },
];

/* ───────── page ───────── */
export default function CestariHomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ── HERO ── */}
      <section
        style={{
          background: '#161616',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: 800,
            height: 800,
            background:
              'radial-gradient(circle, rgba(15,98,254,.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-5%',
            width: 600,
            height: 600,
            background:
              'radial-gradient(circle, rgba(190,98,255,.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={10} md={6} sm={4}>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  letterSpacing: '0.32px',
                  color: '#78a9ff',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  fontWeight: 600,
                }}
              >
                Enterprise AI Solutions
              </p>
              <h1
                style={{
                  fontSize: 'clamp(3rem, 7vw, 5.25rem)',
                  fontWeight: 300,
                  lineHeight: 1.07,
                  color: '#f4f4f4',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Cestari
                <br />
                <span style={{ fontWeight: 600 }}>Studio</span>
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                  lineHeight: 1.4,
                  color: '#c6c6c6',
                  maxWidth: 640,
                  marginBottom: '3rem',
                }}
              >
                Enterprise AI Solutions for Content&nbsp;&amp;&nbsp;Marketing.
                <br />
                Build, orchestrate, and optimize at scale.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  size="xl"
                  renderIcon={ArrowRight}
                  href="/genos"
                  style={{ minWidth: 180 }}
                >
                  Explore genOS
                </Button>
                <Button
                  kind="ghost"
                  size="xl"
                  href="#solutions"
                  style={{ color: '#f4f4f4' }}
                >
                  View Solutions
                </Button>
              </div>
            </motion.div>
          </Column>

          {/* decorative side graphic */}
          <Column lg={6} md={2} sm={0}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={mounted ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: 340,
                  height: 340,
                  borderRadius: '50%',
                  border: '1px solid rgba(15,98,254,.25)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: '50%',
                    border: '1px solid rgba(15,98,254,.35)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, #0f62fe 0%, #a56eff 100%)',
                      opacity: 0.9,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </Column>
        </Grid>
      </section>

      {/* ── FEATURES ── */}
      <AnimatedSection
        id="solutions"
        style={{
          background: '#f4f4f4',
          padding: 'clamp(4rem, 8vw, 8rem) 0',
        }}
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
                color: '#0f62fe',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}
            >
              Our Solutions
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                lineHeight: 1.15,
                color: '#161616',
                marginBottom: '1rem',
              }}
            >
              Four pillars of the{' '}
              <span style={{ fontWeight: 600 }}>AI-native</span> enterprise
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              style={{
                fontSize: '1.125rem',
                color: '#525252',
                maxWidth: 560,
                lineHeight: 1.5,
                marginBottom: '3rem',
              }}
            >
              Each product works independently — or together as a unified
              ecosystem that compounds value across your entire marketing
              operation.
            </motion.p>
          </Column>

          {features.map((f, i) => (
            <Column key={f.title} lg={4} md={4} sm={4}>
              <motion.div variants={fadeUp} custom={i + 3}>
                <ClickableTile
                  href={f.href}
                  style={{
                    padding: '2rem',
                    minHeight: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '1rem',
                    background: '#fff',
                    borderTop: '3px solid #0f62fe',
                  }}
                >
                  <div style={{ color: '#0f62fe' }}>{f.icon}</div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#161616',
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#0f62fe',
                      textTransform: 'uppercase',
                      letterSpacing: '0.32px',
                    }}
                  >
                    {f.subtitle}
                  </p>
                  <p style={{ fontSize: '0.9375rem', color: '#525252', lineHeight: 1.5 }}>
                    {f.description}
                  </p>
                  <div style={{ marginTop: 'auto', color: '#0f62fe' }}>
                    <ArrowRight size={20} />
                  </div>
                </ClickableTile>
              </motion.div>
            </Column>
          ))}
        </Grid>
      </AnimatedSection>

      {/* ── TESTIMONIALS ── */}
      <AnimatedSection
        style={{
          background: '#262626',
          padding: 'clamp(4rem, 8vw, 8rem) 0',
        }}
      >
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={16} md={8} sm={4}>
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
              Testimonials
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
              Trusted by <span style={{ fontWeight: 600 }}>industry leaders</span>
            </motion.h2>
          </Column>

          {testimonials.map((t, i) => (
            <Column key={i} lg={5} md={4} sm={4}>
              <motion.div variants={fadeUp} custom={i + 2}>
                <Tile
                  style={{
                    background: '#393939',
                    padding: '2rem',
                    minHeight: 260,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    borderLeft: '3px solid #0f62fe',
                  }}
                >
                  <p
                    style={{
                      fontSize: '1.0625rem',
                      color: '#c6c6c6',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                      marginBottom: '1.5rem',
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f4f4f4' }}>
                      {t.author}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#8d8d8d' }}>{t.role}</p>
                  </div>
                </Tile>
              </motion.div>
            </Column>
          ))}
        </Grid>
      </AnimatedSection>

      {/* ── PARTNERS BAR ── */}
      <section
        style={{
          background: '#f4f4f4',
          padding: '4rem 0',
        }}
      >
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={16} md={8} sm={4}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4rem',
                flexWrap: 'wrap',
                opacity: 0.45,
              }}
            >
              {[Partnership, Enterprise, UserMultiple, Earth, Idea].map(
                (Icon, i) => (
                  <Icon key={i} size={48} style={{ color: '#161616' }} />
                ),
              )}
            </div>
          </Column>
        </Grid>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f62fe 0%, #a56eff 100%)',
          padding: 'clamp(4rem, 8vw, 6rem) 0',
        }}
      >
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          <Column lg={10} md={6} sm={4}>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              Ready to <span style={{ fontWeight: 600 }}>transform</span> your
              content operation?
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
              Schedule a live demo and see how Cestari Studio can
              multiply your team's creative output.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                size="xl"
                renderIcon={ArrowRight}
                href="/pricing"
                style={{
                  background: '#fff',
                  color: '#0f62fe',
                  minWidth: 180,
                }}
              >
                View Pricing
              </Button>
              <Button
                kind="ghost"
                size="xl"
                href="/helian"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}
              >
                Learn about Helian
              </Button>
            </div>
          </Column>
        </Grid>
      </section>

      {/* ── FOOTER ── */}
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
              Enterprise AI solutions for content, marketing, and creative operations.
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
              Products
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
              Company
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
              Resources
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
              Contact
            </h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <Email size={16} style={{ color: '#78a9ff' }} />
              <span style={{ fontSize: '0.875rem', color: '#c6c6c6' }}>
                hello@cestaristudio.com
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} style={{ color: '#78a9ff' }} />
              <span style={{ fontSize: '0.875rem', color: '#c6c6c6' }}>
                +55 11 9999-0000
              </span>
            </div>
          </Column>

          {/* copyright */}
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
                &copy; {new Date().getFullYear()} Cestari Studio. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {['Privacy', 'Terms', 'Cookies'].map((l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      fontSize: '0.75rem',
                      color: '#6f6f6f',
                      textDecoration: 'none',
                    }}
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
