// Draws a section's *menu* onto a canvas mapped onto the cube's front face. The
// cube is a console navigator, not a webpage — it stays sparse the way the
// GameCube menu is sparse: one quiet word to anchor the face, then a short
// column of big titles floating in negative space. Only the AIMED row lights
// up and reveals its one detail line (org · year, an email, a handle); the
// rest are titles alone. Anything with real depth (a project, a game, all of
// About) opens a dedicated page. Returns the canvas + logical height + entry
// hotspots (logical px, in list order) for hit-testing + roving nav.
import { projects, profile } from '../../data/portfolio';
import { games } from '../../data/games';
import { CUBE_PALETTES } from './cubePalettes';
import { THEME_STYLES, themeFont } from './cubeThemes';
import { SOUND_THEMES } from './sfx';

const W = 1080; // logical width
const PAD = 84;
const DPR = 3; // crisp text on the gel

const INK = 'rgba(245,247,255,1)';
const DIM = 'rgba(238,242,255,0.7)';
const FAINT = 'rgba(238,242,255,0.42)';
const GLASS_FONT = '"General Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
// active face font — set per-render from the visual theme (see cubeThemes)
let FACE_FONT = GLASS_FONT;
const setFaceFont = (theme) => { FACE_FONT = themeFont(theme); };

const ROW_H = 116;
const ROW_GAP = 26;

function wrap(ctx, text, x, y, maxW, lh) {
  const words = String(text).split(' ');
  let line = '';
  let cy = y;
  for (let i = 0; i < words.length; i += 1) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = words[i];
      cy += lh;
    } else {
      line = test;
    }
  }
  if (line) { ctx.fillText(line, x, cy); cy += lh; }
  return cy;
}

// One quiet word anchoring the face — no index, no divider. It sits back so the
// titles carry the eye; it's just enough to say which channel you're on.
function header(ctx, label, y) {
  ctx.font = `600 34px ${FACE_FONT}`;
  ctx.fillStyle = FAINT;
  try { ctx.letterSpacing = '0.5px'; } catch (e) { /* older canvas */ }
  ctx.fillText(label, PAD, y);
  try { ctx.letterSpacing = '0px'; } catch (e) { /* older canvas */ }
  return y;
}

// A selectable row. At rest it's JUST the title (dimmed). When aimed, an aurora
// swells behind it, the title brightens, a chevron appears, and the one detail
// line is revealed below — all inside a fixed row height so nothing shifts as
// the cursor moves.
function entry(ctx, { title, meta, y, selected, action, hotspots }) {
  const rowTop = y;
  const base = y + 66;

  if (selected) {
    const cy = rowTop + ROW_H / 2;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'lighter';
    const glow = (cx, col, a) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.46);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(PAD - 48, rowTop - 6, W - (PAD - 48) * 2, ROW_H + 12);
    };
    glow(W * 0.32, '46,214,140', 0.22);
    glow(W * 0.7, '70,120,240', 0.2);
    ctx.restore();
  }

  ctx.font = `600 58px ${FACE_FONT}`;
  ctx.fillStyle = selected ? INK : 'rgba(245,247,255,0.58)';
  ctx.fillText(title, PAD, base);

  if (selected) {
    ctx.font = `300 46px ${FACE_FONT}`;
    ctx.fillStyle = 'rgba(238,242,255,0.6)';
    ctx.textAlign = 'right';
    ctx.fillText('›', W - PAD, base - 4);
    ctx.textAlign = 'left';
    if (meta) {
      ctx.font = `400 34px ${FACE_FONT}`;
      ctx.fillStyle = DIM;
      ctx.fillText(meta, PAD, base + 38);
    }
  }

  hotspots.push({ x: PAD - 48, y: rowTop, w: W - (PAD - 48) * 2, h: ROW_H, action });
  return y + ROW_H + ROW_GAP;
}

function drawWork(ctx, hotspots, sel) {
  header(ctx, 'Work', 128);
  let y = 198;
  projects.forEach((p, i) => {
    y = entry(ctx, {
      title: p.title,
      meta: `${p.org} · ${p.year}`,
      y,
      selected: i === sel,
      action: { type: 'project', id: p.id },
      hotspots,
    });
  });
  return y;
}

function drawPlay(ctx, hotspots, sel) {
  header(ctx, 'Play', 128);
  let y = 198;
  games.forEach((g, i) => {
    y = entry(ctx, {
      title: g.title,
      meta: `${(g.genres || []).slice(0, 2).join(' · ')} · ${g.year}`,
      y,
      selected: i === sel,
      action: { type: 'game', slug: g.slug },
      hotspots,
    });
  });
  return y;
}

function drawContact(ctx, hotspots, sel) {
  header(ctx, 'Contact', 128);
  let y = 190;
  ctx.font = `400 27px ${FACE_FONT}`;
  ctx.fillStyle = DIM;
  y = wrap(ctx, 'Graduating Dec 2026. Open to full-time frontend and UX roles from January 2027.', PAD, y, W - PAD * 2, 40) + 56;

  const channels = [
    { title: 'Email', meta: profile.email, url: `mailto:${profile.email}` },
    { title: 'GitHub', meta: 'github.com/NicLagr', url: profile.links.github },
    { title: 'LinkedIn', meta: 'in/nicolo-lagravinese', url: profile.links.linkedin },
    { title: 'Résumé', meta: 'PDF', url: profile.links.resume },
  ];
  channels.forEach((c, i) => {
    y = entry(ctx, {
      title: c.title,
      meta: c.meta,
      y,
      selected: i === sel,
      action: { type: 'link', url: c.url },
      hotspots,
    });
  });
  return y;
}

// `about` has no cube menu — it opens straight to a dedicated page.
const DRAW = { work: drawWork, play: drawPlay, contact: drawContact };

// selectedIndex highlights that entry (row glow + revealed detail); entries
// returned as hotspots in list order.
export function renderSection(id, selectedIndex = 0, theme = 'glass') {
  const draw = DRAW[id];
  if (!draw) return null;
  setFaceFont(theme);
  const big = document.createElement('canvas');
  big.width = W * DPR;
  big.height = 3600 * DPR;
  const ctx = big.getContext('2d');
  ctx.scale(DPR, DPR);
  ctx.textBaseline = 'alphabetic';
  // strong dark halo on every glyph — there's NO panel behind the text, it sits
  // straight on the gel, so the shadow is what keeps it legible over the aurora.
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 1;
  const hotspots = [];
  const endY = draw(ctx, hotspots, selectedIndex);
  // The plane is square, so a short (wide) section would be stretched vertically
  // (the "compressed" look). Pad to at least square so the scale stays uniform.
  const H = Math.max(Math.ceil(endY + 40), W);

  // Fully TRANSPARENT canvas — no background fill, no panel. Text (with its dark
  // halo) composites directly onto the cube's gel/aurora face, so there is no
  // container rectangle; it reads as printed on the glass.
  const canvas = document.createElement('canvas');
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  const c2 = canvas.getContext('2d');
  c2.drawImage(big, 0, 0);

  return { canvas, width: W, height: H, hotspots };
}

// ---------------------------------------------------------------------------
// Settings console — the portfolio page turns the cube into a hidden settings
// panel. Same drawing language as the section menus (selectable rows on the
// gel), but the rows are live customization controls: a color dot for skins, a
// check for the active choice. Actions are dispatched through the same hotspot
// path as the nav menus.
// ---------------------------------------------------------------------------

function settingRow(ctx, { title, meta, dot, active, y, selected, action, hotspots }) {
  const rowTop = y;
  const base = y + 66;

  if (selected) {
    const cy = rowTop + ROW_H / 2;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'lighter';
    const glow = (cx, col, a) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.46);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(PAD - 48, rowTop - 6, W - (PAD - 48) * 2, ROW_H + 12);
    };
    glow(W * 0.32, '46,214,140', 0.22);
    glow(W * 0.7, '70,120,240', 0.2);
    ctx.restore();
  }

  let tx = PAD;
  if (dot) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(PAD + 24, base - 18, 24, 0, Math.PI * 2);
    ctx.fillStyle = dot;
    ctx.fill();
    if (active) { ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
    ctx.restore();
    tx = PAD + 80;
  }

  ctx.font = `600 58px ${FACE_FONT}`;
  ctx.fillStyle = selected ? INK : 'rgba(245,247,255,0.62)';
  ctx.fillText(title, tx, base);

  ctx.textAlign = 'right';
  if (active && !dot) {
    ctx.font = `400 46px ${FACE_FONT}`;
    ctx.fillStyle = 'rgba(120,230,180,0.95)';
    ctx.fillText('✓', W - PAD, base - 2);
  } else if (selected) {
    ctx.font = `300 46px ${FACE_FONT}`;
    ctx.fillStyle = 'rgba(238,242,255,0.6)';
    ctx.fillText('›', W - PAD, base - 4);
  }
  ctx.textAlign = 'left';

  if (selected && meta) {
    ctx.font = `400 34px ${FACE_FONT}`;
    ctx.fillStyle = DIM;
    ctx.fillText(meta, tx, base + 38);
  }

  hotspots.push({ x: PAD - 48, y: rowTop, w: W - (PAD - 48) * 2, h: ROW_H, action });
  return y + ROW_H + ROW_GAP;
}

const MOTION_MODES = [
  { id: 'calm', label: 'Calm', meta: 'Barely a sway' },
  { id: 'lively', label: 'Lively', meta: 'Gentle drift' },
  { id: 'drift', label: 'Drift', meta: 'Slow floating orbit' },
  { id: 'pulse', label: 'Pulse', meta: 'Breathing bounce' },
  { id: 'spin', label: 'Spin', meta: 'Constant rotation' },
  { id: 'unstable', label: 'Unstable', meta: 'Glitchy and twitchy' },
];

function drawSkin(ctx, hotspots, sel, opts) {
  header(ctx, 'Skin', 128);
  let y = 200;
  y = settingRow(ctx, { title: '‹ Back', y, selected: sel === 0, action: { type: 'back' }, hotspots });
  CUBE_PALETTES.forEach((p, i) => {
    y = settingRow(ctx, {
      title: p.name, dot: p.accent, active: i === opts.paletteIdx,
      meta: 'Recolors the cube and the page', y, selected: sel === i + 1,
      action: { type: 'palette', idx: i }, hotspots,
    });
  });
  return y;
}

function drawSound(ctx, hotspots, sel, opts) {
  header(ctx, 'Sound', 128);
  let y = 200;
  y = settingRow(ctx, { title: '‹ Back', y, selected: sel === 0, action: { type: 'back' }, hotspots });
  SOUND_THEMES.forEach((t, i) => {
    y = settingRow(ctx, {
      title: t.label, active: opts.soundOn && opts.soundTheme === t.id, meta: 'Sound font',
      y, selected: sel === i + 1, action: { type: 'sound-theme', id: t.id }, hotspots,
    });
  });
  y = settingRow(ctx, {
    title: 'Off', active: !opts.soundOn, y, selected: sel === SOUND_THEMES.length + 1,
    action: { type: 'sound-off' }, hotspots,
  });
  return y;
}

function drawMotion(ctx, hotspots, sel, opts) {
  header(ctx, 'Motion', 128);
  let y = 200;
  y = settingRow(ctx, { title: '‹ Back', y, selected: sel === 0, action: { type: 'back' }, hotspots });
  MOTION_MODES.forEach((mo, i) => {
    y = settingRow(ctx, {
      title: mo.label, active: opts.motion === mo.id, meta: mo.meta,
      y, selected: sel === i + 1, action: { type: 'motion', mode: mo.id }, hotspots,
    });
  });
  return y;
}

function drawTheme(ctx, hotspots, sel, opts) {
  header(ctx, 'Theme', 128);
  let y = 200;
  y = settingRow(ctx, { title: '‹ Back', y, selected: sel === 0, action: { type: 'back' }, hotspots });
  THEME_STYLES.forEach((t, i) => {
    y = settingRow(ctx, {
      title: t.label, active: opts.themeStyle === t.id, meta: t.meta,
      y, selected: sel === i + 1, action: { type: 'theme-style', id: t.id }, hotspots,
    });
  });
  return y;
}

const SETTINGS_DRAW = { skin: drawSkin, sound: drawSound, motion: drawMotion, theme: drawTheme };

export function renderSettings(setting, opts = {}, selectedIndex = 0) {
  const draw = SETTINGS_DRAW[setting];
  if (!draw) return null;
  setFaceFont(opts.themeStyle);
  const big = document.createElement('canvas');
  big.width = W * DPR;
  big.height = 3600 * DPR;
  const ctx = big.getContext('2d');
  ctx.scale(DPR, DPR);
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 1;
  const hotspots = [];
  const endY = draw(ctx, hotspots, selectedIndex, opts);
  const H = Math.max(Math.ceil(endY + 40), W);
  const canvas = document.createElement('canvas');
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.getContext('2d').drawImage(big, 0, 0);
  return { canvas, width: W, height: H, hotspots };
}
