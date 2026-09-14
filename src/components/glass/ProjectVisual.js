import React, { lazy, Suspense } from 'react';

// Decorative stand-ins for projects with no real screenshots to show
// (internal/proprietary apps). Keyed by `project.visual`.
const VISUALS = {
  globe: lazy(() => import('./GlobeVisual')),
  compare: lazy(() => import('./CompareVisual')),
};

export const canWebGL = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};

/** Renders `project`'s decorative visual, or nothing if it has none / WebGL isn't available. */
const ProjectVisual = ({ project, webglReady }) => {
  const Visual = project && project.visual && VISUALS[project.visual];
  if (!Visual || !webglReady) return null;
  return (
    <Suspense fallback={null}>
      <Visual colors={project.visualColors} />
    </Suspense>
  );
};

/** Note clarifying a rendered stand-in visual is not a real screenshot. */
export const VisualCaption = ({ show }) => {
  if (!show) return null;
  return (
    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--ink-faint)' }}>
      Placeholder visual, not a real screenshot. The interface is internal, proprietary GE Aerospace software, so it isn’t shown here.
    </p>
  );
};

export default ProjectVisual;
