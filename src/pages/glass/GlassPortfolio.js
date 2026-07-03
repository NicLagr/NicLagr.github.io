import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassBackground from '../../components/glass/GlassBackground';
import ConsoleInput from '../../components/glass/ConsoleInput';
import DesktopHint from '../../components/glass/DesktopHint';
import CubeConsole from '../../components/glass/CubeConsole';
import { applyPageTheme } from '../../components/glass/cubeSettings';
import HomeSection from '../../components/glass/sections/HomeSection';
import WorkSection from '../../components/glass/sections/WorkSection';
import AboutSection from '../../components/glass/sections/AboutSection';
import PlaySection from '../../components/glass/sections/PlaySection';
import ContactSection from '../../components/glass/sections/ContactSection';

const ease = [0.2, 0.9, 0.25, 1];

// Pointer-capable, roomy screens get the cube shell (the app-like console menu);
// touch / small screens fall back to the scrollable page.
const shellCapable = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 768px) and (hover: hover)').matches;

// The page is a single scroll; the cube + ← → / gamepad drive navigation now
// that the top bar is gone. Order is the scroll/step order.
const SECTIONS = [
  { id: 'home' },
  { id: 'work' },
  { id: 'about' },
  { id: 'play' },
  { id: 'contact' },
];

const GlassPortfolio = () => {
  const [active, setActive] = useState('home');
  const [sweepKey, setSweepKey] = useState(0);
  const [sweeping, setSweeping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [useShell] = useState(shellCapable);
  const scrollingTo = useRef(null);
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);
  // apply the visitor's saved cube skin to the page accent on every entry path
  useEffect(() => { applyPageTheme(); }, []);

  const navigate = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    scrollingTo.current = id;
    setActive(id);
    setSweepKey((k) => k + 1);
    setSweeping(true);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      scrollingTo.current = null;
    }, 700);
  }, []);

  // active-section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingTo.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // step to an adjacent section (shared by keyboard ← → and the gamepad)
  const stepSection = useCallback((dir) => {
    if (document.body.style.overflow === 'hidden') return; // modal/menu open
    const i = SECTIONS.findIndex((s) => s.id === activeRef.current);
    const next = Math.min(Math.max(i + dir, 0), SECTIONS.length - 1);
    if (next !== i) navigate(SECTIONS[next].id);
    setShowHint(false);
  }, [navigate]);

  // keyboard: ← / → move between sections (↑/↓ left for native scroll)
  useEffect(() => {
    if (useShell) return undefined; // the shell owns its own keyboard nav
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      stepSection(e.key === 'ArrowRight' ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stepSection, useShell]);

  // one-time hint (skipped on touch and for returning visitors)
  useEffect(() => {
    if (useShell) return undefined; // shell shows its own hint
    let seen = false;
    try { seen = localStorage.getItem('gx-nav-hint') === '1'; } catch (e) {}
    if (seen || window.matchMedia('(hover: none)').matches) return undefined;
    const show = setTimeout(() => setShowHint(true), 2600);
    const hide = setTimeout(() => {
      setShowHint(false);
      try { localStorage.setItem('gx-nav-hint', '1'); } catch (e) {}
    }, 9000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [useShell]);

  // Desktop / pointer: the cube IS the site — menu on the cube, sections open as
  // a screen on the selected face (CubeConsole). Touch / small screens scroll.
  if (useShell) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <GlassBackground />
        {/* no boot overlay here — the navigator cube spins itself into the menu */}
        <CubeConsole />
      </div>
    );
  }

  return (
    <div className="gx-scroll" style={{ position: 'relative', minHeight: '100vh' }}>
      <GlassBackground />
      <DesktopHint />
      <ConsoleInput onStep={stepSection} />

      <main>
        <HomeSection onNavigate={navigate} />
        <WorkSection />
        <AboutSection />
        <PlaySection />
        <ContactSection />
      </main>

      {/* channel-switch sweep */}
      <AnimatePresence>
        {sweeping && (
          <motion.div
            key={sweepKey}
            aria-hidden="true"
            className="fixed inset-0 z-[1300] pointer-events-none"
            initial={{ opacity: 0, x: '-22%' }}
            animate={{ opacity: [0, 0.55, 0], x: '22%' }}
            transition={{ duration: 0.5, ease, times: [0, 0.45, 1] }}
            onAnimationComplete={() => setSweeping(false)}
            style={{
              background:
                'linear-gradient(100deg, transparent 30%, rgba(122,162,255,0.12) 45%, rgba(255,255,255,0.08) 50%, rgba(94,231,198,0.12) 55%, transparent 70%)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* one-time navigation hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="gx-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease }}
          >
            <span className="gx-chip gx-glass">
              Tip: use ← → to move between sections
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlassPortfolio;
