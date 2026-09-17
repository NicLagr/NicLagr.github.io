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
import { TbList, Tb3DCubeSphere } from '../../components/glass/icons';

const ease = [0.2, 0.9, 0.25, 1];

// Measured directly off SoundToggle's actual rendered box (gx-btn + !p-2 +
// a 17px icon + 1px border = 35px) — hardcoding a round number here instead
// was the bug: it drew a visibly bigger, uncentered circle next to it.
const COLLAPSED = 35;
const ICON_BOX = 17;
const ICON_GAP = 8;
const PAD_RIGHT = 16;

// A quiet circular icon (matches SoundToggle) that expands into a pill on
// hover/focus, revealing what it does in plain words. Animates real pixel
// width (measured from the label once, on mount) rather than Framer Motion's
// `layout`/FLIP technique — FLIP scales the whole subtree via a transform,
// which visibly stretches the label text mid-animation; a true width tween
// with `overflow: hidden` reveals it cleanly instead. Hover is bound to a
// stable, non-resizing wrapper so the animation can never re-trigger itself.
const ExpandingIconButton = ({ wrapperClassName, label, onClick, children }) => {
  const [hover, setHover] = useState(false);
  const labelRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    if (labelRef.current) setLabelWidth(labelRef.current.getBoundingClientRect().width);
  }, [label]);

  const expandedWidth = COLLAPSED + ICON_GAP + labelWidth + PAD_RIGHT;

  return (
    <div
      className={`fixed z-[70] pointer-events-auto flex items-center justify-end ${wrapperClassName}`}
      style={{ width: expandedWidth + 8, height: COLLAPSED }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.button
        onClick={onClick}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-label={label}
        animate={{ width: hover ? expandedWidth : COLLAPSED }}
        transition={{ duration: 0.38, ease }}
        className="gx-btn gx-selectable"
        style={{
          // every box-model property forced inline (highest specificity) so
          // .gx-btn's own padding/gap/display can never fight this component's
          // sizing — only its visual treatment (bg/border/blur/color) is reused
          height: COLLAPSED,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 0,
          // gx-btn has a 1px border (box-sizing: border-box), so the actual
          // content area is COLLAPSED - 2, not COLLAPSED — centering against
          // the full box left the icon 1px right of true center
          paddingLeft: (COLLAPSED - 2 - ICON_BOX) / 2,
          gap: 0,
          overflow: 'hidden',
        }}
      >
        <span
          className="grid place-items-center flex-none"
          style={{ width: ICON_BOX, height: ICON_BOX, lineHeight: 0 }}
        >
          {children}
        </span>
        <span
          ref={labelRef}
          className="whitespace-nowrap text-sm font-medium flex-none"
          style={{
            marginLeft: ICON_GAP,
            opacity: hover ? 1 : 0,
            transition: `opacity 0.2s ease ${hover ? '0.14s' : '0s'}`,
          }}
        >
          {label}
        </span>
      </motion.button>
    </div>
  );
};

// Pointer-capable, roomy screens get the cube shell (the app-like console menu);
// touch / small screens, reduced-motion, and no-WebGL fall back to the scrollable
// page (mirrors HomeSection's canCube() check on the mobile path).
const shellCapable = () => {
  if (typeof window === 'undefined') return false;
  if (!window.matchMedia('(min-width: 768px) and (hover: hover)').matches) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

// The page is a single scroll; the cube + ← → / gamepad drive navigation now
// that the top bar is gone. Order is the scroll/step order.
const SECTIONS = [
  { id: 'home' },
  { id: 'work' },
  { id: 'about' },
  { id: 'play' },
  { id: 'contact' },
];

// `accessibleMode` comes from App.js's "Skip to content" link — the cube shell has
// no #home anchor for that link to reach, so activating it instead swaps in the
// same accessible list layout touch/reduced-motion visitors already get.
const GlassPortfolio = ({ accessibleMode = false, onAccessibleModeChange }) => {
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
      // a modal (project sheet, lightbox, ...) owns arrow keys while it's open —
      // stepSection() itself no-ops here too, but bailing before preventDefault
      // lets whatever's actually open handle the keypress cleanly
      if (document.body.style.overflow === 'hidden') return;
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
  if (useShell && !accessibleMode) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <GlassBackground />
        {/* visible-but-quiet opt-out for anyone who'd rather skim a plain list
            than drive the cube */}
        <ExpandingIconButton
          wrapperClassName="right-20 top-6"
          label="Switch to List View"
          onClick={() => onAccessibleModeChange(true)}
        >
          <TbList size={17} />
        </ExpandingIconButton>
        {/* no boot overlay here — the navigator cube spins itself into the menu */}
        <CubeConsole />
      </div>
    );
  }

  return (
    <div className="gx-scroll" style={{ position: 'relative', minHeight: '100vh' }}>
      <GlassBackground />
      {/* only a genuine capability fallback (touch/reduced-motion/no-webgl) needs
          pointing back to the full desktop experience — not a deliberate opt-out */}
      {!accessibleMode && <DesktopHint />}
      {/* only offer a way back to the cube if they actually have one to go back to */}
      {useShell && accessibleMode && (
        <ExpandingIconButton
          wrapperClassName="right-6 top-6"
          label="Switch to Cube View"
          onClick={() => onAccessibleModeChange(false)}
        >
          <Tb3DCubeSphere size={17} />
        </ExpandingIconButton>
      )}
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
