// Cube "skins" for the portfolio easter egg. Data only (no three), so ProjectPage
// can import it without pulling the WebGL bundle into the main chunk.
// `env`/`bloom`/`aurora` recolor the 3D cube; `accent`/`grad` recolor the page.
// `page: null` on Aurora means "revert to the site default accent" (it IS the default).
export const CUBE_PALETTES = [
  {
    id: 'aurora', name: 'Aurora', accent: '#5ee7c6', page: null,
    env: ['#c4ffe8', '#3fd39e', '#2f86d8', '#b487ff'],
    bloom: '255,90,150',
    aurora: ['46,214,140', '150,70,240', '236,58,150', '32,110,240', '110,54,220'],
  },
  {
    id: 'sunset', name: 'Sunset', accent: '#ff9e6b',
    page: { accent: '#ff9e6b', accent2: '#ff5f7e', accent3: '#ffb98f', grad: 'linear-gradient(120deg, #ff9e6b 0%, #ff5f7e 100%)', bgTint: '120, 54, 60' },
    env: ['#fff0d6', '#ffb168', '#ff5f7e', '#a05bff'],
    bloom: '255,150,90',
    aurora: ['255,150,80', '255,90,120', '255,120,180', '255,70,90', '200,80,160'],
  },
  {
    id: 'ice', name: 'Ice', accent: '#7ac8ff',
    page: { accent: '#7ac8ff', accent2: '#8f86ff', accent3: '#a7d8ff', grad: 'linear-gradient(120deg, #7ac8ff 0%, #8f86ff 100%)', bgTint: '40, 78, 150' },
    env: ['#eafffb', '#a7ecff', '#4aa8ff', '#8f86ff'],
    bloom: '120,220,255',
    aurora: ['90,210,255', '80,150,255', '120,120,255', '60,180,240', '140,140,255'],
  },
  {
    id: 'vapor', name: 'Vapor', accent: '#d98bff',
    page: { accent: '#d98bff', accent2: '#ff9cf0', accent3: '#c7a3ff', grad: 'linear-gradient(120deg, #d98bff 0%, #ff9cf0 100%)', bgTint: '96, 52, 130' },
    env: ['#ffe6fb', '#ff9cf0', '#c76bff', '#6b7dff'],
    bloom: '255,120,220',
    aurora: ['230,120,255', '180,90,255', '255,90,200', '130,110,255', '200,80,240'],
  },
  {
    id: 'matrix', name: 'Matrix', accent: '#38ff9d',
    page: { accent: '#38ff9d', accent2: '#0aff9d', accent3: '#7dffce', grad: 'linear-gradient(120deg, #38ff9d 0%, #12c47a 100%)', bgTint: '18, 96, 62' },
    env: ['#d6ffe9', '#4dffab', '#12b877', '#0a7d5a'],
    bloom: '40,255,150',
    aurora: ['40,255,150', '20,200,120', '80,255,180', '10,160,110', '60,220,150'],
  },
  {
    id: 'steel', name: 'Steel', accent: '#b8c6e0',
    page: { accent: '#b8c6e0', accent2: '#8fa6c8', accent3: '#dce4f2', grad: 'linear-gradient(120deg, #cdd8ec 0%, #8fa6c8 100%)', bgTint: '58, 68, 92' },
    env: ['#f4f7fc', '#c3d0e6', '#8494b4', '#5a6a8c'],
    bloom: '190,208,236',
    aurora: ['180,196,224', '140,160,196', '200,214,238', '120,140,180', '160,178,210'],
  },
  {
    id: 'neon', name: 'Neon', accent: '#ff4df0',
    page: { accent: '#ff4df0', accent2: '#29e7ff', accent3: '#ff8ff5', grad: 'linear-gradient(120deg, #ff4df0 0%, #29e7ff 100%)', bgTint: '110, 28, 108' },
    env: ['#ffd9fb', '#ff5df0', '#29e7ff', '#7b4dff'],
    bloom: '255,70,240',
    aurora: ['255,77,240', '41,231,255', '180,60,255', '255,120,245', '90,120,255'],
  },
];
