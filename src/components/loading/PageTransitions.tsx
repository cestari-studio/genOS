'use client';

import { ReactNode } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

/**
 * Carbon easing curves for motion design:
 * - productive-standard: [0.2, 0, 0.38, 0.9] — fast, functional
 * - expressive-entrance: [0, 0, 0.3, 1] — fluid, immersive
 */

const EXPRESSIVE_ENTRANCE = [0, 0, 0.3, 1] as const;

/**
 * 4a. PageTransition — Smooth stage transition wrapper.
 * Applies expressive-entrance curve (fade-in + 20px slide-up).
 * Use inside ProgressIndicator steps for Onboarding and FinOps flows.
 */
interface PageTransitionProps {
  children: ReactNode;
  /** Unique key to trigger animation on step change */
  transitionKey: string | number;
  /** Animation direction */
  direction?: 'up' | 'down';
}

export function PageTransition({
  children,
  transitionKey,
  direction = 'up',
}: PageTransitionProps) {
  const yOffset = direction === 'up' ? 20 : -20;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: yOffset }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -yOffset }}
        transition={{
          duration: 0.4,
          ease: [...EXPRESSIVE_ENTRANCE],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 4b. FadeIn — Simple fade-in wrapper for lazy-loaded sections.
 */
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 0.5 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: [...EXPRESSIVE_ENTRANCE],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 4c. StaggerContainer + StaggerItem — Staggered entrance for card grids and lists.
 */
const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [...EXPRESSIVE_ENTRANCE],
    },
  },
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function StaggerContainer({ children, className, style }: StaggerContainerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/**
 * 4d. SlidePanel — Slide-in panel for sidebars and overlays.
 */
interface SlidePanelProps {
  children: ReactNode;
  open: boolean;
  from?: 'left' | 'right';
  width?: string;
}

export function SlidePanel({ children, open, from = 'right', width = '400px' }: SlidePanelProps) {
  const xInitial = from === 'right' ? width : `-${width}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: xInitial, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: xInitial, opacity: 0 }}
          transition={{
            duration: 0.35,
            ease: [...EXPRESSIVE_ENTRANCE],
          }}
          style={{
            position: 'fixed',
            top: 0,
            [from]: 0,
            width,
            height: '100vh',
            zIndex: 7000,
            background: 'var(--cds-layer-01)',
            borderLeft: from === 'right' ? '1px solid var(--cds-border-subtle-01)' : undefined,
            borderRight: from === 'left' ? '1px solid var(--cds-border-subtle-01)' : undefined,
            boxShadow: '0 4px 32px rgba(0, 0, 0, 0.16)',
            overflow: 'auto',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
