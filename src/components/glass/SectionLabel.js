import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.2, 0.9, 0.25, 1];

// Section header — one quiet word (matching the minimal desktop headers: no
// index, no divider), with the hero's aurora blooming softly behind it so every
// section still ties back to the cube. `index` is accepted but unused now.
const SectionLabel = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease }}
    className="relative w-fit mb-10"
  >
    <span className="gx-head-glow gx-aurora" aria-hidden="true" />
    <span
      className="relative z-10 gx-display font-semibold tracking-[-0.01em]"
      style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--ink)' }}
    >
      {children}
    </span>
  </motion.div>
);

export default SectionLabel;
