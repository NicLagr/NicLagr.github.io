/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // The Liquid Glass design system lives in src/styles/glass.css (CSS vars +
      // .gx-* classes). Only the shared XMB palette is exposed to Tailwind here.
      colors: {
        gx: {
          0: '#0a0a1f',
          1: '#141436',
          2: '#1d1c4d',
          3: '#2a2566',
          ink: '#f4f5ff',
          dim: 'rgba(244,245,255,0.62)',
          accent: '#7aa2ff',
          accent2: '#5ee7c6',
          accent3: '#b69dff',
        },
      },
    },
  },
  plugins: [],
}
