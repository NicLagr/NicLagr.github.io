import React, { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../../../data/portfolio';
import { TbLayoutGrid, TbUser, TbDeviceGamepad2, TbMail, TbArrowUpRight } from '../icons';

const ease = [0.2, 0.9, 0.25, 1];

// This section renders on the narrow / touch path (desktop uses CubeConsole).
// The cube is still the hero here — tap a face to jump to that section, drag to
// turn it — with the content scrolling beneath. Three.js loads as its own chunk.
const CubeNavigator = lazy(() => import('../CubeNavigator'));

// show the cube unless the device can't handle it (reduced-motion or no WebGL);
// those fall back to the channel list.
const canCube = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};
// sized for a narrow viewport, leaving room for the hint + signature beneath
const cubeSize = () => {
  if (typeof window === 'undefined') return 360;
  return Math.round(Math.min(window.innerWidth * 0.82, window.innerHeight * 0.5, 460));
};

const channels = [
  { id: 'work', label: 'Work', desc: 'Selected projects', Icon: TbLayoutGrid },
  { id: 'about', label: 'About', desc: 'Background & skills', Icon: TbUser },
  { id: 'play', label: 'Play', desc: 'Games I’ve built', Icon: TbDeviceGamepad2 },
  { id: 'contact', label: 'Contact', desc: 'Get in touch', Icon: TbMail },
];

const HomeSection = ({ onNavigate }) => {
  const [showCube] = useState(canCube);
  const [size] = useState(cubeSize);

  // Cube hero: tap a face to jump to its section, drag to turn it; content scrolls below.
  if (showCube) {
    return (
      <section id="home" className="gx-anchor min-h-[100svh] flex flex-col items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
        >
          <Suspense fallback={<div style={{ width: size, height: size + 40 }} />}>
            <CubeNavigator onNavigate={onNavigate} size={size} showCaption={false} />
          </Suspense>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 text-sm text-center"
          style={{ color: 'var(--ink-faint)' }}
        >
          {profile.name} · {profile.role} ·{' '}
          <a
            href={profile.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--ink)]"
            style={{ color: 'var(--ink-dim)' }}
          >
            Résumé
          </a>
        </motion.p>
      </section>
    );
  }

  // Reduced-motion / no-WebGL: the channel list is the nav.
  return (
    <section id="home" className="gx-anchor min-h-[100svh] flex flex-col justify-center px-5 py-20">
      <div className="mx-auto w-full" style={{ maxWidth: 560 }}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="font-semibold leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(2.6rem, 12vw, 3.6rem)' }}
        >
          Nicolò
          <br />
          Lagravinese
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.22 }}
          className="mt-4 text-base font-semibold"
          style={{ color: 'var(--accent)' }}
        >
          {profile.role}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } } }}
          className="mt-10 border-t"
          style={{ borderColor: 'var(--glass-edge-soft)' }}
        >
          {channels.map((c) => (
            <motion.button
              key={c.id}
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease }}
              onClick={() => onNavigate(c.id)}
              className="gx-channel gx-selectable group w-full flex items-center gap-4 py-5 px-2 border-b text-left"
              style={{ borderColor: 'var(--glass-edge-soft)' }}
            >
              <c.Icon size={24} className="flex-none" style={{ color: 'var(--accent)' }} />
              <span className="flex-1 min-w-0">
                <span className="block text-xl font-semibold gx-display leading-tight">{c.label}</span>
                <span className="block text-sm" style={{ color: 'var(--ink-dim)' }}>{c.desc}</span>
              </span>
              <TbArrowUpRight size={22} className="flex-none" style={{ color: 'var(--ink-faint)' }} />
            </motion.button>
          ))}
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          href={profile.links.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm"
          style={{ color: 'var(--ink-dim)' }}
        >
          Résumé →
        </motion.a>
      </div>
    </section>
  );
};

export default HomeSection;
