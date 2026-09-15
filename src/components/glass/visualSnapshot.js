// The cube's Work menu is a flat 2D canvas texture, but weather-viz/signpost's
// real thumbnails are live Three.js scenes (GlobeVisual/CompareVisual). Rather
// than reinvent them as flat glyphs, mount the actual component off-screen
// once, let it render a frame, and snapshot that canvas — so the cube shows
// the exact same art as the DOM list view.
import { createRoot } from 'react-dom/client';
import React from 'react';
import GlobeVisual from './GlobeVisual';
import CompareVisual from './CompareVisual';

const COMPONENTS = { globe: GlobeVisual, compare: CompareVisual };
const SNAPSHOT_SIZE = 320;

const cache = new Map();
const listeners = new Set();
function notify() { listeners.forEach((fn) => fn()); }
export function subscribeVisualSnapshotReady(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getVisualSnapshot(kind, colors) {
  const key = `${kind}:${(colors || []).join(',')}`;
  let entry = cache.get(key);
  if (entry) return entry;

  entry = { canvas: null, ready: false };
  cache.set(key, entry);

  const Comp = COMPONENTS[kind];
  if (!Comp) return entry;

  // GlobeVisual/CompareVisual each pause their render loop via an
  // IntersectionObserver when not visible — parking this off past -9999px
  // never intersects the viewport, so it would render nothing to capture.
  // Keeping it in-viewport but fully transparent satisfies the observer
  // while staying invisible to the actual visitor.
  const container = document.createElement('div');
  container.style.cssText = `position:fixed; left:0; top:0; width:${SNAPSHOT_SIZE}px; height:${SNAPSHOT_SIZE}px; opacity:0; pointer-events:none; z-index:-1;`;
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(React.createElement(Comp, { colors }));

  // a few hundred ms lets the scene's own boot/settle animation land somewhere
  // representative before we freeze it as a still image
  setTimeout(() => {
    const canvas = container.querySelector('canvas');
    if (canvas && canvas.width > 0) {
      const snap = document.createElement('canvas');
      snap.width = SNAPSHOT_SIZE;
      snap.height = SNAPSHOT_SIZE;
      snap.getContext('2d').drawImage(canvas, 0, 0, SNAPSHOT_SIZE, SNAPSHOT_SIZE);
      entry.canvas = snap;
      entry.ready = true;
      notify();
    }
    root.unmount();
    container.remove();
  }, 320);

  return entry;
}

export function preloadVisualSnapshots(projects) {
  projects.forEach((p) => { if (!p.image && p.visual) getVisualSnapshot(p.visual, p.visualColors); });
}
