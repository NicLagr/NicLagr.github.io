import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectVisual, { canWebGL, VisualCaption } from './ProjectVisual';
import { TbX, TbChevronLeft, TbChevronRight, TbExternalLink } from './icons';

const ease = [0.2, 0.9, 0.25, 1];

/**
 * The written case study for a project: a hero band, then a few short sections
 * in the user's own voice. A section can carry its own image (a single
 * contextual shot) and/or a small set of images (e.g. a before/after pair) —
 * these render right where they're relevant instead of in one big gallery at
 * the end, so evidence shows up as you read instead of after. Any case study
 * still using the older flat `gallery` array (not attached to a section) keeps
 * rendering as a grid at the end, for backward compatibility. Presentational
 * only — desktop wraps it in a PageShell, mobile renders it inside the project
 * sheet. Missing images degrade gracefully (hero falls back to the accent
 * band; a broken shot hides itself) so the layout never shows a torn image
 * while assets are still being dropped in.
 */
const hideImg = (e) => { e.currentTarget.style.display = 'none'; };
const hideTile = (e) => { e.currentTarget.style.display = 'none'; };
const hideFigure = (e) => {
  const fig = e.currentTarget.closest('figure');
  if (fig) fig.style.display = 'none';
};

// Every image in the case study, in reading order — section-attached images
// first (a section's single `image` then its `images` set), then any leftover
// flat `gallery` images. This flat list is what the lightbox actually
// navigates; sections just render their own slice of it inline.
function collectImages(cs) {
  const list = [];
  (cs.sections || []).forEach((s) => {
    if (s.images) s.images.forEach((im) => list.push(im));
    if (s.image) list.push(s.image);
  });
  (cs.gallery || []).forEach((g) => list.push(g));
  return list;
}

// A single contextual image, full-width at its own aspect ratio (not cropped
// to a tile) — right for a portrait screenshot or a photographed artifact,
// not just landscape UI shots.
const CaseImage = ({ image, index, onOpen }) => (
  <figure className="mt-5" style={{ maxWidth: image.maxWidth || 680 }}>
    <button
      onClick={() => onOpen(index)}
      className="relative overflow-hidden block w-full text-left group gx-selectable"
      style={{ borderRadius: 16, background: '#05060e', border: '1px solid var(--glass-edge-soft)' }}
    >
      <img
        src={image.src}
        alt={image.caption || ''}
        loading="lazy"
        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
        onError={hideFigure}
      />
    </button>
    {image.caption && (
      <figcaption className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
        {image.caption}
      </figcaption>
    )}
  </figure>
);

// Doesn't set the iframe's `src` until it actually scrolls into view. Figma's
// embed pulls keyboard focus into itself once it finishes loading (breaking
// arrow-key navigation elsewhere on the page, e.g. an open lightbox above it),
// and it's a heavy third-party load anyway — no reason to pay either cost
// before the visitor has actually scrolled down to it.
const LazyFigmaEmbed = ({ src }) => {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) setVisible(true); },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{ borderRadius: 16, border: '1px solid var(--glass-edge-soft)', height: 'min(80vh, 720px)', background: '#05060e' }}
    >
      {visible && (
        <iframe
          title="Figma prototype"
          src={src}
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
        />
      )}
    </div>
  );
};

// `showHero`/`showMeta` default on for the standalone desktop case-study page,
// which has no hero/title of its own. The mobile project sheet already shows
// an image and a "{year} · {org}" caption right above this component, so it
// passes both false to avoid repeating the same image and metadata twice.
const CaseStudyBody = ({ project, showHero = true, showMeta = true }) => {
  const cs = project?.caseStudy;
  const webglReady = useMemo(() => canWebGL(), []);
  const images = useMemo(() => collectImages(cs || {}), [cs]);
  const gallery = cs?.gallery || [];
  const [lightbox, setLightbox] = useState(null); // index into images, or null
  const lightboxRef = useRef(null);

  const step = (dir) => setLightbox((i) => (i === null ? null : (i + dir + images.length) % images.length));

  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, images.length]);

  // Claim focus when the lightbox opens — a case study can also embed a
  // cross-origin Figma iframe further down the page, and once that finishes
  // loading it can silently pull focus into itself, which stops our own
  // keydown listener above from ever seeing the arrow-key/Escape presses.
  useEffect(() => {
    if (lightbox !== null) lightboxRef.current?.focus();
  }, [lightbox]);

  if (!cs) return null;
  const showVisual = showHero && !cs.hero && !!project.visual && webglReady;
  let imgCursor = 0; // walks `images` in step with section rendering below

  return (
    <>
      {showHero && (cs.hero || showVisual) && (
        <div
          className="relative overflow-hidden mb-10"
          style={{ borderRadius: 20, background: project.accent, aspectRatio: '16 / 9' }}
        >
          {cs.hero && (
            <img
              src={cs.hero}
              alt={`${project.title} — main view`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={hideImg}
            />
          )}
          {showVisual && <ProjectVisual project={project} webglReady={webglReady} />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,4,10,0.04), rgba(3,4,10,0.4))' }} />
        </div>
      )}

      <VisualCaption show={showVisual} />
      {showMeta && <div className="gx-label mb-8">{project.org} · {project.role} · {project.year}</div>}

      <div className="space-y-8">
        {cs.sections.map((s, i) => {
          const pairStart = imgCursor;
          if (s.images) imgCursor += s.images.length;
          const singleIdx = s.image ? imgCursor++ : null;
          return (
            <section key={i}>
              <div style={{ maxWidth: 680 }}>
                <h2 className="gx-display text-xl font-semibold tracking-[-0.01em] mb-2.5" style={{ color: 'var(--ink)' }}>
                  {s.heading}
                </h2>
                {(Array.isArray(s.body) ? s.body : [s.body]).map((p, j) => (
                  <p key={j} className={`text-[15px] leading-relaxed${j > 0 ? ' mt-3' : ''}`} style={{ color: 'var(--ink-dim)' }}>
                    {p}
                  </p>
                ))}
              </div>
              {/* pairs get a wider column than the prose — at the 680 text
                  width each image in a 2-up grid shrinks to ~330px, too small
                  to read a screenshot's UI text on a laptop screen */}
              {s.images && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5" style={{ maxWidth: 960 }}>
                  {s.images.map((im, k) => (
                    <CaseImage key={k} image={im} index={pairStart + k} onOpen={setLightbox} />
                  ))}
                </div>
              )}
              {s.image && <CaseImage image={s.image} index={singleIdx} onOpen={setLightbox} />}
            </section>
          );
        })}
      </div>

      {cs.quote && (
        <figure className="mt-12" style={{ maxWidth: 680 }}>
          <blockquote
            className="gx-display text-lg leading-relaxed"
            style={{ color: 'var(--ink)', borderLeft: '2px solid var(--accent)', paddingLeft: '1.25rem' }}
          >
            “{cs.quote.text}”
          </blockquote>
          <figcaption className="gx-label mt-3" style={{ paddingLeft: '1.25rem' }}>
            {cs.quote.author}{cs.quote.role ? ` · ${cs.quote.role}` : ''}
          </figcaption>
        </figure>
      )}

      {gallery.length > 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: 960 }}>
          {gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setLightbox(imgCursor + i)}
              className="relative overflow-hidden text-left group gx-selectable"
              style={{ borderRadius: 16, background: '#05060e', border: '1px solid var(--glass-edge-soft)', aspectRatio: '4 / 3' }}
            >
              <img
                src={g.src}
                alt={g.caption || ''}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={hideTile}
              />
              {g.caption && (
                <span
                  className="absolute inset-x-0 bottom-0 p-3 text-xs leading-snug line-clamp-2"
                  style={{ background: 'linear-gradient(180deg, transparent, rgba(3,4,10,0.88) 70%)', color: 'var(--ink-dim)' }}
                >
                  {g.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {cs.figmaEmbed && (
        <div className="mt-12" style={{ maxWidth: 960 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="gx-label">Try the actual prototype</div>
            {cs.figmaEmbedLink && (
              <a
                href={cs.figmaEmbedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gx-label flex items-center gap-1"
                style={{ color: 'var(--accent)' }}
              >
                Open in Figma <TbExternalLink size={13} />
              </a>
            )}
          </div>
          <LazyFigmaEmbed src={cs.figmaEmbed} />
        </div>
      )}

      {createPortal(
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div
            ref={lightboxRef}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1250] grid place-items-center p-4 sm:p-10 outline-none"
            onClick={() => setLightbox(null)}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(3,4,10,0.85)', backdropFilter: 'blur(10px)' }} />
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="!absolute top-5 right-5 gx-glass w-10 h-10 rounded-full grid place-items-center z-10"
            >
              <TbX size={20} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); step(-1); }}
                  aria-label="Previous image"
                  className="!absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 gx-glass w-10 h-10 rounded-full grid place-items-center z-10"
                >
                  <TbChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); step(1); }}
                  aria-label="Next image"
                  className="!absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 gx-glass w-10 h-10 rounded-full grid place-items-center z-10"
                >
                  <TbChevronRight size={20} />
                </button>
              </>
            )}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col items-center"
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            >
              <motion.img
                key={lightbox}
                src={images[lightbox].src}
                alt={images[lightbox].caption || ''}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease }}
                className="block"
                style={{ borderRadius: 16, maxWidth: '90vw', maxHeight: '75vh', objectFit: 'contain' }}
              />
              {images[lightbox].caption && (
                <p className="mt-4 text-sm leading-relaxed text-center" style={{ color: 'var(--ink-dim)', maxWidth: 640 }}>
                  {images[lightbox].caption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
};

export default CaseStudyBody;
