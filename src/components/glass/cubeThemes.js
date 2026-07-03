// Visual themes for the cube easter egg. Data only (no three), so any component
// can read it without the WebGL bundle. A theme is a bundle of:
//   material  — how the 3D shell renders (glass / metal / wireframe / emissive)
//   pixel     — renderer pixel ratio (< 1 = chunky nearest-neighbour "retro")
//   font      — canvas font stack for cube labels + menus (page CSS mirrors it)
//   bg        — a CSS hook class the page uses for background treatments
//   sound     — a *suggested* sound font (only nudged if sound is already on)
// Themes are orthogonal to skin (color), sound font, and motion — they change
// the STYLE, not the palette. Skin still tints the env map / aurora core, so a
// Chrome cube reflects the chosen skin, a Neon cube glows over it, etc.

const SANS = '"General Sans", system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const CRT = '"VT323", "JetBrains Mono", ui-monospace, monospace';
const TECH = '"Orbitron", "General Sans", sans-serif';

// material fields map 1:1 onto the MeshPhysicalMaterial shell in CubeNavigator
const GLASS_MAT = {
  transmission: 1, opacity: 1, roughness: 0.03, metalness: 0,
  iridescence: 0.3, clearcoat: 1, wireframe: false,
  emissive: null, emissiveIntensity: 0, envMapIntensity: 1.25,
};

export const CUBE_THEMES = [
  {
    id: 'glass', label: 'Glass', meta: 'Liquid glass, clean type',
    font: SANS, bg: 'glass', sound: 'glass', pixel: 1,
    material: { ...GLASS_MAT },
  },
  {
    id: 'retro', label: 'Retro', meta: 'Pixelated cube, CRT font',
    font: CRT, bg: 'retro', sound: 'retro', pixel: 0.5,
    material: {
      transmission: 0, opacity: 0.74, roughness: 0.55, metalness: 0,
      iridescence: 0, clearcoat: 0.15, wireframe: false,
      emissive: null, emissiveIntensity: 0, envMapIntensity: 1.25,
    },
  },
  {
    id: 'terminal', label: 'Terminal', meta: 'Green phosphor readout',
    font: MONO, bg: 'terminal', sound: 'retro', pixel: 1,
    material: {
      transmission: 0, opacity: 0.92, roughness: 0.5, metalness: 0,
      iridescence: 0, clearcoat: 0, wireframe: false,
      emissive: '#0aff9d', emissiveIntensity: 0.45, envMapIntensity: 0.35,
    },
  },
  {
    id: 'blueprint', label: 'Blueprint', meta: 'Wireframe schematic',
    font: MONO, bg: 'blueprint', sound: 'glass', pixel: 1,
    material: {
      transmission: 0, opacity: 1, roughness: 0.4, metalness: 0,
      iridescence: 0, clearcoat: 0, wireframe: true,
      emissive: '#7ab8ff', emissiveIntensity: 0.6, envMapIntensity: 0.3,
    },
  },
  {
    id: 'chrome', label: 'Chrome', meta: 'Polished liquid metal',
    font: TECH, bg: 'chrome', sound: 'chime', pixel: 1,
    material: {
      // gunmetal base so reflections read as metal (not blown-out porcelain)
      // and the white labels keep contrast
      color: '#7f8798', transmission: 0, opacity: 1, roughness: 0.12, metalness: 1,
      iridescence: 0.2, clearcoat: 1, wireframe: false,
      emissive: null, emissiveIntensity: 0, envMapIntensity: 1.7,
    },
  },
  {
    id: 'hologram', label: 'Hologram', meta: 'Translucent HUD',
    font: TECH, bg: 'hologram', sound: 'chime', pixel: 1,
    material: {
      transmission: 0.25, opacity: 0.42, roughness: 0.14, metalness: 0,
      iridescence: 0.8, clearcoat: 0.5, wireframe: false,
      emissive: '#26e0ff', emissiveIntensity: 0.5, envMapIntensity: 0.8,
    },
  },
  {
    id: 'neon', label: 'Neon', meta: 'Glowing outline grid',
    font: TECH, bg: 'neon', sound: 'chime', pixel: 1,
    material: {
      transmission: 0, opacity: 0.86, roughness: 0.3, metalness: 0,
      iridescence: 0, clearcoat: 0.4, wireframe: false,
      emissive: '#ff3df0', emissiveIntensity: 0.7, envMapIntensity: 0.55,
    },
  },
];

// the menu list (id/label/meta) drawn on the Theme dial
export const THEME_STYLES = CUBE_THEMES.map(({ id, label, meta }) => ({ id, label, meta }));

export const themeById = (id) => CUBE_THEMES.find((t) => t.id === id) || CUBE_THEMES[0];
export const themeFont = (id) => themeById(id).font;
