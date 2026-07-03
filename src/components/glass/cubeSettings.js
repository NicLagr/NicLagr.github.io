// Shared cube customization store (the "This Portfolio" easter-egg settings).
// The skin + motion picked on the settings cube apply to the MAIN nav cube too
// and persist across reloads, and the chosen skin recolors the whole page accent.
// Data only (no three) so any component can read it without the WebGL bundle.
import { CUBE_PALETTES } from './cubePalettes';
import { CUBE_THEMES, THEME_STYLES } from './cubeThemes';

const KEY_SKIN = 'gx-skin';     // palette id
const KEY_MOTION = 'gx-motion'; // calm | lively | drift | pulse | spin | unstable
const KEY_THEME = 'gx-theme';   // visual style id (see cubeThemes)

const MOTIONS = ['calm', 'lively', 'drift', 'pulse', 'spin', 'unstable'];

// re-export so existing importers keep working (registry lives in cubeThemes)
export { THEME_STYLES };

const read = (k) => {
  try { return localStorage.getItem(k); } catch (e) { return null; }
};
const write = (k, v) => {
  try { localStorage.setItem(k, v); } catch (e) { /* ignore */ }
};

// resolve the stored skin id → index (default Aurora / 0)
let paletteIdx = (() => {
  const id = read(KEY_SKIN);
  const i = CUBE_PALETTES.findIndex((p) => p.id === id);
  return i >= 0 ? i : 0;
})();
let motionMode = (() => {
  const m = read(KEY_MOTION);
  return MOTIONS.includes(m) ? m : 'lively';
})();
let themeStyle = (() => {
  const t = read(KEY_THEME);
  return CUBE_THEMES.some((s) => s.id === t) ? t : 'glass';
})();

const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn({ paletteIdx, motionMode, themeStyle }));

export const getPaletteIdx = () => paletteIdx;
export const getPalette = () => CUBE_PALETTES[paletteIdx];
export const getMotion = () => motionMode;
export const getThemeStyle = () => themeStyle;

// Apply the current skin's accent to the whole document (buttons, chips, links,
// gradients, section markers all read these vars). `page: null` (Aurora) removes
// the overrides so the CSS defaults take over.
export function applyPageTheme() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const page = CUBE_PALETTES[paletteIdx] && CUBE_PALETTES[paletteIdx].page;
  if (page) {
    root.style.setProperty('--accent', page.accent);
    if (page.accent2) root.style.setProperty('--accent-2', page.accent2);
    if (page.accent3) root.style.setProperty('--accent-3', page.accent3);
    root.style.setProperty('--accent-grad', page.grad);
    // subtle: tint the page backdrop toward the skin (falls back to CSS default)
    if (page.bgTint) root.style.setProperty('--bg-tint', page.bgTint);
    else root.style.removeProperty('--bg-tint');
  } else {
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent-2');
    root.style.removeProperty('--accent-3');
    root.style.removeProperty('--accent-grad');
    root.style.removeProperty('--bg-tint');
  }
  // visual style → CSS hook for the whole-page retro font swap
  root.setAttribute('data-cube-theme', themeStyle);
}

export function setPaletteIdx(i) {
  const n = ((i % CUBE_PALETTES.length) + CUBE_PALETTES.length) % CUBE_PALETTES.length;
  if (n === paletteIdx) return;
  paletteIdx = n;
  write(KEY_SKIN, CUBE_PALETTES[n].id);
  applyPageTheme();
  emit();
}

export function setMotion(m) {
  if (!MOTIONS.includes(m) || m === motionMode) return;
  motionMode = m;
  write(KEY_MOTION, m);
  emit();
}

export function setThemeStyle(id) {
  if (!CUBE_THEMES.some((s) => s.id === id) || id === themeStyle) return;
  themeStyle = id;
  write(KEY_THEME, id);
  applyPageTheme(); // updates the data-cube-theme attribute
  emit();
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

// apply the saved skin as soon as the module loads, so the whole site opens in
// the visitor's chosen scheme (not just after visiting the settings cube)
applyPageTheme();
