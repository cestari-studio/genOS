'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Column,
  Button,
  Tile,
  ClickableTile,
  Tag,
} from '@carbon/react';
import {
  ArrowRight,
  Idea,
  DataBase,
  Chemistry,
  Earth,
  Partnership,
  Enterprise,
  UserMultiple,
} from '@carbon/icons-react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';

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

function AnimatedSection({ children, className, style, id }: any) {
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
      id={id}
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
      'End-to-end content pipeline \u2014 from brief to published asset \u2014 with matrix views, version control, and brand DNA alignment.',
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
      'Visibility analytics for AI-generated answers \u2014 track how your brand appears inside ChatGPT, Gemini, Perplexity, and more.',
    href: '/marketing',
  },
];

const testimonials = [
  {
    quote:
      'Cestari Studio transformed the way we approach content. Our production velocity increased 8\u00d7 while maintaining our brand voice.',
    author: 'Daniela Ferreira',
    role: 'CMO, Vortex Media Group',
  },
  {
    quote:
      'The genOS token economy gives us complete financial visibility on AI spend \u2014 something no other platform offers at this level.',
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
export default function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  useEffect(() => setMounted(true), []);

  const valueCards = [
    {
      value: t('landing.card1Value'),
      label: t('landing.card1Label'),
      desc: t('landing.card1Desc'),
      color: '#0f62fe',
    },
    {
      value: t('landing.card2Value'),
      label: t('landing.card2Label'),
      desc: t('landing.card2Desc'),
      color: '#a56eff',
    },
    {
      value: t('landing.card3Value'),
      label: t('landing.card3Label'),
      desc: t('landing.card3Desc'),
      color: '#08bdba',
    },
  ];

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
                {t('landing.eyebrow')}
              </p>
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: '#f4f4f4',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {t('landing.headline')}
              </h1>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '2.5rem',
                }}
              >
                <Tag type="blue" size="md">
                  {t('landing.socialProof')}
                </Tag>
              </motion.div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  size="xl"
                  renderIcon={ArrowRight}
                  href="/pricing"
                  style={{ minWidth: 180 }}
                >
                  {t('landing.ctaPrimary')}
                </Button>
                <Button
                  kind="ghost"
                  size="xl"
                  href="#solutions"
                  style={{ color: '#f4f4f4' }}
                >
                  {t('landing.ctaSecondary')}
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

      {/* ── VALUE CARDS ── */}
      <AnimatedSection
        style={{
          background: '#161616',
          padding: '0 0 clamp(4rem, 8vw, 6rem)',
        }}
      >
        <Grid fullWidth style={{ padding: '0 2rem', maxWidth: 1584, margin: '0 auto' }}>
          {valueCards.map((card, i) => (
            <Column key={card.label} lg={5} md={4} sm={4}>
              <motion.div variants={fadeUp} custom={i}>
                <Tile
                  style={{
                    padding: '2rem',
                    minHeight: 200,
                    background: '#262626',
                    borderTop: `3px solid ${card.color}`,
                    marginBottom: '1rem',
                  }}
                >
                  <p
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: card.color,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {card.value}
                  </p>
                  <p
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#f4f4f4',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {card.label}
                  </p>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#8d8d8d',
                      lineHeight: 1.5,
                    }}
                  >
                    {card.desc}
                  </p>
                </Tile>
              </motion.div>
            </Column>
          ))}
        </Grid>
      </AnimatedSection>

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
              {t('landing.solutionsEyebrow')}
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
              {t('landing.solutionsTitle')}{' '}
              <span style={{ fontWeight: 600 }}>{t('landing.solutionsTitleBold')}</span>
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
              {t('landing.solutionsDesc')}
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
              {t('landing.testimonialsEyebrow')}
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
              {t('landing.testimonialsTitle')}{' '}
              <span style={{ fontWeight: 600 }}>{t('landing.testimonialsTitleBold')}</span>
            </motion.h2>
          </Column>

          {testimonials.map((item, i) => (
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
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#f4f4f4' }}>
                      {item.author}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#8d8d8d' }}>{item.role}</p>
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
              {t('landing.ctaBannerTitle')}{' '}
              <span style={{ fontWeight: 600 }}>{t('landing.ctaBannerTitleBold')}</span>{' '}
              your content operation?
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
              {t('landing.ctaBannerDesc')}
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
                {t('landing.ctaBannerPrimary')}
              </Button>
              <Button
                kind="ghost"
                size="xl"
                href="/helian"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}
              >
                {t('landing.ctaBannerSecondary')}
              </Button>
            </div>
          </Column>
        </Grid>
      </section>
    </div>
  );
}
