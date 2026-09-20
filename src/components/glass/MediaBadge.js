import React from 'react';

/**
 * Provenance badges for case-study media.
 *
 * A portfolio that shows design work next to shipped work has to say which is
 * which. A good mockup looks a lot like a screenshot — that is the point of a
 * good mockup — so without a marker the reader either guesses or, worse,
 * assumes the nicest image is the real one.
 *
 * Two kinds, and colour carries the meaning before the text does: blue for
 * something drawn, mint for something running. The label is overridable per
 * image, so `figma` can read "Figma · Wireframe" where that distinction is
 * worth making without inventing a third badge.
 */

// One 16×16 grid, 1.5px strokes, round joins — so the pair reads as a set.

/** Vector selection handles: a shape with its corner grips. "Drawn." */
const FigmaGlyph = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="4.2" y="4.2" width="7.6" height="7.6" rx="1" stroke="currentColor" strokeWidth="1.3" opacity="0.7" />
    <rect x="2.1" y="2.1" width="3.1" height="3.1" rx="0.8" fill="currentColor" />
    <rect x="10.8" y="2.1" width="3.1" height="3.1" rx="0.8" fill="currentColor" />
    <rect x="2.1" y="10.8" width="3.1" height="3.1" rx="0.8" fill="currentColor" />
    <rect x="10.8" y="10.8" width="3.1" height="3.1" rx="0.8" fill="currentColor" />
  </svg>
);

/** Angle brackets. "Built." */
const CodeGlyph = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M5.7 4.5 2.2 8l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.3 4.5 13.8 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.3 3.1 6.7 12.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
  </svg>
);

/** The clamshell itself — for footage of the thing in hand. */
const DeviceGlyph = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="2.3" y="2.4" width="11.4" height="5.5" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="2.3" y="8.9" width="11.4" height="4.7" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="4.9" cy="11.25" r="1" fill="currentColor" />
    <circle cx="11.1" cy="11.25" r="1" fill="currentColor" />
  </svg>
);

export const BADGES = {
  figma: { label: 'Figma', tint: 'var(--accent-2)', Glyph: FigmaGlyph },
  built: { label: 'Implementation', tint: 'var(--accent)', Glyph: CodeGlyph },
  device: { label: 'On device', tint: 'var(--accent)', Glyph: DeviceGlyph },
};

/**
 * Accepts `'figma'` or `{ kind: 'figma', label: 'Figma · Wireframe' }`.
 * Unknown keys resolve to null so a typo in the data drops the badge rather
 * than throwing mid-render.
 */
export function resolveBadge(badge) {
  if (!badge) return null;
  const kind = typeof badge === 'string' ? badge : badge.kind;
  const base = BADGES[kind];
  if (!base) return null;
  const label = (typeof badge === 'object' && badge.label) || base.label;
  return { kind, label, tint: base.tint, Glyph: base.Glyph };
}

/**
 * Renders inline, ahead of caption text — deliberately not an overlay on the
 * image. Tagging the artwork itself covers the work and competes with it; the
 * caption line is already where the reader goes to find out what they are
 * looking at, so the label belongs there and the image stays untouched.
 */
const MediaBadge = ({ badge }) => {
  const b = resolveBadge(badge);
  if (!b) return null;
  const { label, tint, Glyph } = b;

  return (
    <span className="gx-badge">
      <span className="gx-badge__icon" style={{ color: tint }}>
        <Glyph size={13} />
      </span>
      <span>{label}</span>
      <span className="gx-badge__rule" aria-hidden="true" />
    </span>
  );
};

export default MediaBadge;
