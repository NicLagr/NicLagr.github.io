import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.2, 0.9, 0.25, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/**
 * Full-res dedicated page you land on after diving through a cube face.
 * Blackout + aurora to match the hero; a console-style header; a reading column.
 * The enter/exit motion (expand-from-face) is owned by CubeConsole.
 */
const PageShell = ({ title, eyebrow, children, maxWidth = 880 }) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
    className="mx-auto w-full px-6 sm:px-10 pt-24 pb-32"
    style={{ maxWidth }}
  >
    <motion.div variants={fadeUp} className="relative mb-12">
      <span className="gx-head-glow gx-aurora" aria-hidden="true" />
      {eyebrow && (
        <div className="gx-label mb-3" style={{ color: 'var(--accent)' }}>{eyebrow}</div>
      )}
      <h1 className="gx-display font-semibold tracking-[-0.02em]" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)' }}>
        {title}
      </h1>
    </motion.div>

    {children}
  </motion.div>
);

export const pageFadeUp = fadeUp;
export default PageShell;
