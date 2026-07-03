import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PageShell, { pageFadeUp } from './PageShell';
import { TbArrowUpRight, TbCode, TbFileText } from '../icons';
import sfx from '../sfx';
import { CUBE_PALETTES } from '../cubePalettes';
import { themeById } from '../cubeThemes';
import * as cubeSettings from '../cubeSettings';
import { renderSettings } from '../cubeContent';

// The portfolio's own project page shows the real cube instead of a screenshot.
const CubeNavigator = lazy(() => import('../CubeNavigator'));

const canCube = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};

// Easter egg: on the portfolio page the cube doubles as a hidden settings console.
// Its four faces are live customization dials instead of the site nav — same face
// geometry (top / right / bottom / left), just relabeled. Selecting one spins the
// cube front-on and draws that dial's menu right onto the glass.
const SETTINGS_FACES = [
  { id: 'skin', label: 'Skin', pos: [0, 0.66, 1.09], w: 1.5, h: 0.42, o: 'h' },
  { id: 'sound', label: 'Sound', pos: [0.66, 0, 1.09], w: 0.42, h: 1.5, o: 'vR' },
  { id: 'motion', label: 'Motion', pos: [0, -0.66, 1.09], w: 1.5, h: 0.42, o: 'h' },
  { id: 'theme', label: 'Theme', pos: [-0.66, 0, 1.09], w: 0.42, h: 1.5, o: 'vL' },
];

/** Dedicated project detail — the full-res view you reach from the Work menu. */
const ProjectPage = ({ project, onOpenCaseStudy }) => {
  const heroRef = useRef(null);
  const [cubeReady, setCubeReady] = useState(false);
  const [cubeSize, setCubeSize] = useState(300);
  // skin + motion are shared/persisted (also drive the main nav cube + page theme)
  const [paletteIdx, setPaletteIdx] = useState(cubeSettings.getPaletteIdx());
  const [motionMode, setMotionMode] = useState(cubeSettings.getMotion());
  const [themeStyle, setThemeStyle] = useState(cubeSettings.getThemeStyle());
  const [activeSetting, setActiveSetting] = useState(null);
  const [sel, setSel] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [soundTheme, setSoundTheme] = useState('glass');

  useEffect(() => { setCubeReady(canCube()); }, []);
  useEffect(() => {
    if (sfx.isEnabled) setSoundOn(!!sfx.isEnabled());
    if (sfx.getTheme) setSoundTheme(sfx.getTheme());
  }, []);
  // stay in sync with the shared store (so shuffle/reset + other views reflect here)
  useEffect(() => cubeSettings.subscribe((s) => {
    setPaletteIdx(s.paletteIdx);
    setMotionMode(s.motionMode);
    setThemeStyle(s.themeStyle);
  }), []);
  // reset the open dial (and its row cursor) when the project changes
  useEffect(() => { setActiveSetting(null); }, [project && project.id]);
  useEffect(() => { setSel(0); }, [activeSetting]);

  // SFX parity with the main cube: soft tick while roving rows inside a dial
  // (skip the reset-to-0 that fires when a dial opens).
  const selEnterRef = useRef(true);
  useEffect(() => { selEnterRef.current = true; }, [activeSetting]);
  useEffect(() => {
    if (selEnterRef.current) { selEnterRef.current = false; return; }
    if (activeSetting) sfx.tick();
  }, [sel, activeSetting]);

  // Dispatch the in-cube menu clicks (same hotspot path the nav menus use).
  const onHotspot = useCallback((action) => {
    if (!action) return;
    switch (action.type) {
      case 'back': if (sfx.back) sfx.back(); setActiveSetting(null); break;
      case 'palette': if (sfx.aim) sfx.aim(); cubeSettings.setPaletteIdx(action.idx); break;
      case 'sound-theme':
        if (sfx.setTheme) sfx.setTheme(action.id);
        setSoundTheme(action.id);
        setSoundOn(true);
        break;
      case 'sound-off':
        if (sfx.setEnabled) sfx.setEnabled(false);
        setSoundOn(false);
        break;
      case 'motion': if (sfx.aim) sfx.aim(); cubeSettings.setMotion(action.mode); break;
      case 'theme-style': {
        if (sfx.open) sfx.open();
        cubeSettings.setThemeStyle(action.id);
        // light touch: match the sound font ONLY if sound is already on (never
        // force audio on from a theme pick — the Sound dial owns that)
        const snd = themeById(action.id).sound;
        if (snd && sfx.isEnabled && sfx.isEnabled() && sfx.setTheme) {
          sfx.setTheme(snd);
          setSoundTheme(snd);
        }
        break;
      }
      default: break;
    }
  }, []);

  // Draw the active dial's menu onto the cube face (null → cube shows face labels).
  const settingsContent = useMemo(() => {
    const on = cubeReady && project && project.id === 'portfolio' && activeSetting;
    return on ? renderSettings(activeSetting, { paletteIdx, soundOn, soundTheme, motion: motionMode, themeStyle }, sel) : null;
  }, [cubeReady, project, activeSetting, paletteIdx, soundOn, soundTheme, motionMode, themeStyle, sel]);

  // (The chosen skin recolors the page accent app-wide + persistently via
  // cubeSettings.applyPageTheme — no per-page override that reverts on leave.)

  // Size the mini cube to the hero band. clientWidth/Height read the layout box,
  // so the page's scale-in animation doesn't thrash the renderer.
  useEffect(() => {
    const isPortfolio = project && project.id === 'portfolio';
    if (!isPortfolio || !cubeReady) return;
    const measure = () => {
      const el = heroRef.current;
      if (!el || !el.clientWidth || !el.clientHeight) return;
      const s = Math.max(260, Math.min(400, Math.min(el.clientWidth, el.clientHeight) * 0.92));
      setCubeSize(Math.round(s));
    };
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', measure); };
  }, [cubeReady, project]);

  if (!project) return null;
  const { links = {} } = project;
  const hasCaseStudy = !!project.caseStudy;
  const liveCube = cubeReady && project.id === 'portfolio';
  // grow the cube when a dial is open so its menu is comfortably readable
  const shownCubeSize = activeSetting ? Math.round(cubeSize * 1.6) : cubeSize;

  return (
    <PageShell title={project.title}>
      <motion.div
        ref={heroRef}
        variants={pageFadeUp}
        className="relative mb-10 grid place-items-center"
        style={{ borderRadius: 24, background: liveCube ? 'transparent' : project.accent, aspectRatio: '16 / 8', overflow: liveCube ? 'visible' : 'hidden' }}
      >
        {liveCube ? (
          <Suspense fallback={null}>
            <CubeNavigator
              size={shownCubeSize}
              showCaption={false}
              palette={CUBE_PALETTES[paletteIdx]}
              motion={motionMode}
              theme={themeStyle}
              faces={SETTINGS_FACES}
              activeFace={activeSetting}
              onNavigate={(id) => { if (sfx.open) sfx.open(); setActiveSetting(id); }}
              onHoverFace={(id) => { if (id && sfx.aim) sfx.aim(); }}
              content={settingsContent}
              onHotspot={onHotspot}
              selectedIndex={sel}
              onHoverIndex={setSel}
            />
          </Suspense>
        ) : (
          <>
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,4,10,0.05), rgba(3,4,10,0.55))' }} />
          </>
        )}
      </motion.div>

      {liveCube && !activeSetting && (
        <motion.div variants={pageFadeUp} className="-mt-2 mb-10 flex justify-center">
          <span className="gx-label" style={{ opacity: 0.5 }}>The cube is a tiny settings panel. Pick a face.</span>
        </motion.div>
      )}
      {liveCube && activeSetting && <div className="mb-10" />}

      <motion.div variants={pageFadeUp} className="gx-label mb-3">
        {project.org} · {project.role} · {project.year}
      </motion.div>
      <motion.p variants={pageFadeUp} className="text-2xl leading-relaxed mb-10" style={{ maxWidth: 680 }}>
        {project.summary}
      </motion.p>

      {project.video && (
        <motion.figure variants={pageFadeUp} className="mb-12">
          <div className="gx-label mb-3">Featured at Hannover Messe</div>
          <div className="relative overflow-hidden" style={{ borderRadius: 20, background: '#05060e', border: '1px solid var(--glass-edge-soft)' }}>
            <video
              src={project.video.src}
              controls
              playsInline
              preload="metadata"
              className="w-full h-auto block"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (project.video.end && v.currentTime >= project.video.end) v.pause();
              }}
            />
          </div>
          {project.video.caption && (
            <figcaption className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ink-dim)', maxWidth: 680 }}>
              {project.video.caption}
              {project.video.href && (
                <>
                  {' '}
                  <a
                    href={project.video.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sfx.open()}
                    className="inline-flex items-center gap-1 transition-colors hover:text-[var(--ink)]"
                    style={{ color: 'var(--accent)' }}
                  >
                    View on LinkedIn <TbArrowUpRight size={14} />
                  </a>
                </>
              )}
            </figcaption>
          )}
        </motion.figure>
      )}

      <motion.div variants={pageFadeUp} className="flex flex-wrap gap-1.5 mb-10">
        {project.tags.map((t) => (
          <span key={t} className="gx-chip">{t}</span>
        ))}
      </motion.div>

      {(hasCaseStudy || links.live || links.repo) && (
        <motion.div variants={pageFadeUp} className="flex flex-wrap gap-3">
          {hasCaseStudy && (
            <button
              type="button"
              onClick={() => { sfx.open(); onOpenCaseStudy && onOpenCaseStudy(project.id); }}
              className={links.live ? 'gx-btn' : 'gx-btn gx-btn-primary'}
            >
              <TbFileText size={18} /> Read case study
            </button>
          )}
          {links.live && (
            <a href={links.live} target="_blank" rel="noopener noreferrer" onClick={() => sfx.open()} className="gx-btn gx-btn-primary">
              View live <TbArrowUpRight size={18} />
            </a>
          )}
          {links.repo && (
            <a href={links.repo} target="_blank" rel="noopener noreferrer" onClick={() => sfx.open()} className="gx-btn">
              <TbCode size={18} /> Source code
            </a>
          )}
        </motion.div>
      )}
    </PageShell>
  );
};

export default ProjectPage;
