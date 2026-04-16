'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Full-page background story animation
 * Tracks window scroll to tell the 'Document to Protection' story
 *
 * Phases:
 * 0.0 - 0.2: Raw Policy Document
 * 0.2 - 0.4: Analysis Layers Extracting
 * 0.4 - 0.7: Structured Scoring Framework
 * 0.7 - 1.0: Full Shield Protection
 */
export function FullPageStoryAnimation() {
  const { scrollYProgress } = useScroll(); // Tracks entire window page scroll

  // Phase 1: Document (fades out rapidly as we scroll down)
  const docOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const docPath = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Phase 2: Analysis Layers (appears, lifts off, and disappears entirely by 0.35)
  const analysisOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.35], [0, 1, 1, 0]);
  const analysisY = useTransform(scrollYProgress, [0.15, 0.35], [20, -20]);

  // Phase 3: SWOT/Radar Background Texture
  // We keep this deeply subdued and allow it to persist to the end of the page.
  const scoringOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.8, 1.0], [0, 1, 1, 0.6]);
  const scoringScale = useTransform(scrollYProgress, [0.35, 0.6], [0.85, 1.0]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden h-screen" aria-hidden="true">
      <div className="relative w-[500px] h-[500px] opacity-15 md:opacity-25 blur-[1px] text-brand mix-blend-multiply transition-opacity duration-700">
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Phase 1: Document Blueprint */}
          <motion.g style={{ opacity: docOpacity }}>
            <motion.path
              style={{ pathLength: docPath }}
              d="M 140 80 H 260 V 320 H 140 Z"
            />
            <motion.path
              style={{ pathLength: docPath }}
              d="M 160 130 H 240 M 160 170 H 240 M 160 210 H 200 M 160 250 H 240"
              strokeDasharray="4 4"
            />
          </motion.g>

          {/* Phase 2: Analysis Layers (Scanning) */}
          <motion.g style={{ opacity: analysisOpacity, y: analysisY }}>
            {/* Base Layer */}
            <path d="M 120 200 L 200 150 L 280 200 L 200 250 Z" strokeOpacity="0.4" />
            {/* Extracted Layer */}
            <path d="M 120 160 L 200 110 L 280 160 L 200 210 Z" strokeWidth="3" />
            <path d="M 200 110 V 150 M 120 160 V 200 M 280 160 V 200" strokeDasharray="4 4" strokeOpacity="0.6" />
          </motion.g>

          {/* Phase 3: Structured Scoring (SWOT/Pentagon) */}
          <motion.g style={{ opacity: scoringOpacity, scale: scoringScale }} transform="origin-center">
            {/* 5-point radar representing the 5 dimensions */}
            <path d="M 200 100 L 295 169 L 259 281 L 141 281 L 105 169 Z" strokeOpacity="0.3" />
            <path d="M 200 130 L 266 178 L 241 254 L 159 254 L 134 178 Z" strokeOpacity="0.5" />
            <path d="M 200 160 L 238 188 L 223 226 L 177 226 L 162 188 Z" strokeWidth="4" />
            <path d="M 200 200 L 200 100 M 200 200 L 295 169 M 200 200 L 259 281 M 200 200 L 141 281 M 200 200 L 105 169" strokeDasharray="4 4" strokeOpacity="0.6" />
          </motion.g>
        </svg>
      </div>
      
      {/* Soft gradient overlay above animation for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-hero/60 via-transparent to-bg/90" />
    </div>
  );
}

/**
 * Scroll-reveal wrapper — fades in sections as they enter viewport.
 * Used on the landing page for progressive content reveal.
 */
export function ScrollReveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container — children animate in sequence
 */
export function StaggerContainer({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Storytelling steps for "How it works" section
 * Progress indicator fills as user scrolls through steps
 */
export function ScrollProgressLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  return (
    <div ref={ref} className="absolute left-6 top-0 bottom-0 w-px hidden md:block">
      <div className="h-full bg-border w-px" />
      <motion.div
        className="absolute top-0 left-0 w-px bg-brand origin-top"
        style={{ scaleY: scrollYProgress, height: '100%' }}
      />
    </div>
  );
}
