import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CubeNavigator from './CubeNavigator';
import { CUBE_PALETTES } from './cubePalettes';
import * as cubeSettings from './cubeSettings';
import { renderSection } from './cubeContent';
import { profile, projects } from '../../data/portfolio';
import { games } from '../../data/games';
import { TbArrowLeft } from './icons';
import ProjectPage from './pages/ProjectPage';
import CaseStudyPage from './pages/CaseStudyPage';
import GamePage from './pages/GamePage';
import AboutPage from './pages/AboutPage';
import SoundToggle from './SoundToggle';
import sfx from './sfx';

// horizontal faces get the darker "turn side" chord, vertical the "turn center"
const SIDE_FACE = { about: true, contact: true, work: false, play: false };

const ease = [0.2, 0.9, 0.25, 1];

const DESCS = { work: 'Selected projects', about: 'Background & skills', play: 'Games I’ve built', contact: 'Get in touch' };
const DIR_TO_FACE = { up: 'work', right: 'about', down: 'play', left: 'contact' };
// which faces open a cube menu vs. dive straight to a dedicated page
const HAS_CUBE_MENU = { work: true, play: true, contact: true, about: false };

const baseSize = () => {
  if (typeof window === 'undefined') return 720;
  return Math.round(Math.min(Math.min(window.innerWidth, window.innerHeight) * 0.9, 900));
};

/**
 * The cube IS the site (desktop). Three levels:
 *   menu  → aim a face and open it
 *   face  → a short menu renders inside the glass (Work titles, Play titles, Contact)
 *   page  → picking an item (or About) dives THROUGH the face into a full-res HTML page
 * Back steps out one level at a time.
 */
const CubeConsole = () => {
  const [size] = useState(baseSize);
  // click-to-start is always the entry (independent of sound); sfx.start() just
  // no-ops audio when muted, so the power-on ritual is the same either way
  const [started, setStarted] = useState(false);
  const handleStart = useCallback(() => { setStarted(true); sfx.start(); }, []);
  const [highlight, setHighlight] = useState(null); // which face is aimed/hovered (null = none)
  const [active, setActive] = useState(null); // face showing a cube menu, or null
  const [page, setPage] = useState(null);      // { kind:'project'|'game'|'about', id?/slug? }
  const [sel, setSel] = useState(0);           // selected entry index within a cube menu
  // skin + motion chosen on the "This Portfolio" settings cube (shared + persisted)
  const [paletteIdx, setPaletteIdx] = useState(cubeSettings.getPaletteIdx());
  const [motionMode, setMotionMode] = useState(cubeSettings.getMotion());
  const [themeStyle, setThemeStyle] = useState(cubeSettings.getThemeStyle());
  useEffect(() => cubeSettings.subscribe((s) => {
    setPaletteIdx(s.paletteIdx);
    setMotionMode(s.motionMode);
    setThemeStyle(s.themeStyle);
  }), []);

  const activeRef = useRef(active);
  const pageRef = useRef(page);
  const selRef = useRef(sel);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { selRef.current = sel; }, [sel]);
  useEffect(() => { setSel(0); }, [active]); // reset selection when entering a face

  // SFX: aim tick when the highlighted face changes (keyboard / gamepad / hover)
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    if (highlight) sfx.aim(!!SIDE_FACE[highlight]); // no sound when hover clears
  }, [highlight]);

  // SFX: soft tick while roving entries inside a face (skip the reset-to-0 on enter)
  const selEnterRef = useRef(true);
  useEffect(() => { selEnterRef.current = true; }, [active]);
  useEffect(() => {
    if (selEnterRef.current) { selEnterRef.current = false; return; }
    if (activeRef.current) sfx.tick();
  }, [sel]);

  // cube-menu content only for faces that have one (About dives straight to a page).
  // Re-rendered on selection change so the aurora "row glow" follows the cursor.
  const content = useMemo(
    () => (active && HAS_CUBE_MENU[active] ? renderSection(active, sel, themeStyle) : null),
    [active, sel, themeStyle]
  );
  const contentRef = useRef(content);
  const entryCountRef = useRef(0);
  useEffect(() => {
    contentRef.current = content;
    entryCountRef.current = content ? content.hotspots.length : 0;
  }, [content]);

  const open = useCallback((id) => {
    if (!id) return; // nothing aimed yet
    sfx.open();
    if (HAS_CUBE_MENU[id]) setActive(id);
    else setPage({ kind: 'about' }); // about is the only page-direct face
  }, []);

  // step out one level: case study → its project, page → cube menu, cube menu → root
  const back = useCallback(() => {
    sfx.back();
    const p = pageRef.current;
    if (p && p.kind === 'case-study') { setPage({ kind: 'project', id: p.id }); return; }
    if (p) setPage(null);
    else setActive(null);
  }, []);

  const onHotspot = useCallback((action) => {
    if (!action) return;
    sfx.open(); // selecting an entry (project / game / link) is an "open" too
    if (action.type === 'link') {
      window.open(action.url, action.url.startsWith('mailto') ? '_self' : '_blank', 'noopener');
    } else if (action.type === 'project') {
      setPage({ kind: 'project', id: action.id });
    } else if (action.type === 'game') {
      setPage({ kind: 'game', slug: action.slug });
    }
  }, []);

  // focus the page's scroll container so arrow/space/PageDown scroll it
  const pageScrollRef = useRef(null);
  useEffect(() => {
    if (page && pageScrollRef.current) {
      pageScrollRef.current.scrollTop = 0;
      pageScrollRef.current.focus({ preventScroll: true });
    }
  }, [page]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (pageRef.current) {
        if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); back(); }
        return;
      }
      if (activeRef.current) {
        // inside a cube menu: arrows rove the selection, Enter opens it
        const n = entryCountRef.current;
        if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(n - 1, s + 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
        else if (e.key === 'Enter') {
          e.preventDefault();
          const hs = contentRef.current?.hotspots[selRef.current];
          if (hs) onHotspot(hs.action);
        } else if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); back(); }
        return;
      }
      const dir = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left' }[e.key];
      if (dir) { e.preventDefault(); setHighlight(DIR_TO_FACE[dir]); }
      else if (e.key === 'Enter') { e.preventDefault(); setHighlight((h) => { open(h); return h; }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, back, onHotspot]);

  // gamepad: D-pad aims (root only), A opens, B backs out one level
  useEffect(() => {
    let raf = 0;
    let lastAt = 0;
    const prev = [];
    const poll = () => {
      raf = requestAnimationFrame(poll);
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = Array.from(pads).find(Boolean);
      if (!gp) return;
      const now = performance.now();
      const ax = gp.axes[0] || 0;
      const ay = gp.axes[1] || 0;
      const up = gp.buttons[12]?.pressed || ay < -0.5;
      const down = gp.buttons[13]?.pressed || ay > 0.5;
      const left = gp.buttons[14]?.pressed || ax < -0.5;
      const right = gp.buttons[15]?.pressed || ax > 0.5;
      const atRoot = !activeRef.current && !pageRef.current;
      const inMenu = activeRef.current && !pageRef.current;
      if (atRoot && now - lastAt > 240) {
        let dir = null;
        if (up) dir = 'up'; else if (right) dir = 'right'; else if (down) dir = 'down'; else if (left) dir = 'left';
        if (dir) { lastAt = now; setHighlight(DIR_TO_FACE[dir]); }
      } else if (inMenu && now - lastAt > 200) {
        // rove the selection inside a cube menu
        if (down) { lastAt = now; setSel((s) => Math.min(entryCountRef.current - 1, s + 1)); }
        else if (up) { lastAt = now; setSel((s) => Math.max(0, s - 1)); }
      }
      const a = gp.buttons[0]?.pressed;
      const b = gp.buttons[1]?.pressed;
      if (a && !prev[0]) {
        if (atRoot) setHighlight((h) => { open(h); return h; });
        else if (inMenu) { const hs = contentRef.current?.hotspots[selRef.current]; if (hs) onHotspot(hs.action); }
      }
      if (b && !prev[1] && (activeRef.current || pageRef.current)) back();
      prev[0] = a; prev[1] = b;
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [open, back, onHotspot]);

  const hiLabel = highlight ? highlight.charAt(0).toUpperCase() + highlight.slice(1) : '';
  const atRoot = !active && !page;

  const renderPage = () => {
    if (!page) return null;
    if (page.kind === 'about') return <AboutPage />;
    if (page.kind === 'project') {
      return (
        <ProjectPage
          project={projects.find((p) => p.id === page.id)}
          onOpenCaseStudy={(id) => setPage({ kind: 'case-study', id })}
        />
      );
    }
    if (page.kind === 'case-study') return <CaseStudyPage project={projects.find((p) => p.id === page.id)} />;
    if (page.kind === 'game') return <GamePage game={games.find((g) => g.slug === page.slug)} />;
    return null;
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      <SoundToggle />

      {/* understated power-on prompt (until the cube is clicked) */}
      <AnimatePresence>
        {!started && (
          <motion.div
            key="startprompt"
            className="absolute left-1/2 -translate-x-1/2 bottom-[19%] text-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gx-display text-base font-medium tracking-wide" style={{ color: 'var(--ink-dim)' }}>
              {profile.name}
            </div>
            <motion.div
              className="gx-mono text-[10px] mt-1.5 tracking-[0.3em] uppercase"
              style={{ color: 'var(--ink-faint)' }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              click to start
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the cube — grows and dissolves outward as you dive into a page */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className={page ? '' : 'pointer-events-auto'}
          animate={{ scale: page ? 1.9 : active ? 1.18 : 0.62, opacity: page ? 0 : 1 }}
          transition={{ duration: 0.7, ease }}
          style={{ filter: page ? 'blur(2px)' : 'none' }}
        >
          <CubeNavigator
            size={size}
            palette={CUBE_PALETTES[paletteIdx]}
            motion={motionMode}
            theme={themeStyle}
            started={started}
            onStart={handleStart}
            activeFace={active}
            highlight={atRoot ? highlight : null}
            onNavigate={open}
            content={content}
            onHotspot={onHotspot}
            selectedIndex={sel}
            onHoverIndex={setSel}
            onHoverFace={setHighlight}
            showCaption={false}
          />
        </motion.div>
      </div>

      {/* dedicated page — expands in from the face */}
      <AnimatePresence>
        {page && (
          <motion.div
            key="page"
            ref={pageScrollRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.55, ease }}
            className="absolute inset-0 z-[40] overflow-y-auto gx-scroll outline-none"
          >
            {renderPage()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MENU chrome (root only, once powered on) */}
      <AnimatePresence>
        {atRoot && started && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* descriptor only while a face is actively hovered / aimed */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-24 text-center">
              <AnimatePresence mode="wait">
                {highlight && (
                  <motion.div
                    key={highlight}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.24, ease }}
                  >
                    <div className="gx-display text-2xl font-semibold leading-none">{hiLabel}</div>
                    <div className="mt-1.5 text-sm" style={{ color: 'var(--ink-dim)' }}>{DESCS[highlight]}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-7 text-center text-sm" style={{ color: 'var(--ink-faint)' }}>
              {profile.name} · {profile.role} ·{' '}
              <a
                href={profile.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto transition-colors hover:text-[var(--ink)]"
                style={{ color: 'var(--ink-dim)' }}
              >
                Résumé
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back + contextual hint (inside a face or a page) */}
      <AnimatePresence>
        {!atRoot && (
          <motion.div key="chrome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
            <button onClick={back} className="gx-btn gx-selectable absolute left-6 top-6 z-[60] !py-1.5 !px-3.5 !text-sm">
              <TbArrowLeft size={16} /> {page ? 'Back' : 'Menu'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CubeConsole;
