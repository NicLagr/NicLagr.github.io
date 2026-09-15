import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectVisual, { canWebGL, VisualCaption } from './ProjectVisual';
import { TbX, TbChevronLeft, TbChevronRight } from './icons';

const ease = [0.2, 0.9, 0.25, 1];

/**
 * The written case study for a project: a hero band, a few short sections in the
 * user's own voice, then a curated image gallery with encyclopedic captions.
 * Presentational only — desktop wraps it in a PageShell, mobile renders it inside
 * the project sheet. Missing images degrade gracefully (hero falls back to the
 * accent band; a broken gallery shot hides its whole figure) so the layout never
 * shows a torn image while assets are still being dropped in.
 */
const hideImg = (e) => { e.currentTarget.style.display = 'none'; };
const hideTile = (e) => { e.currentTarget.style.display = 'none'; };

// `showHero`/`showMeta` default on for the standalone desktop case-study page,
// which has no hero/title of its own. The mobile project sheet already shows
// an image and a "{year} · {org}" caption right above this component, so it
// passes both false to avoid repeating the same image and metadata twice.
const CaseStudyBody = ({ project, showHero = true, showMeta = true }) => {
  const cs = project?.caseStudy;
  const webglReady = useMemo(() => canWebGL(), []);
  const gallery = cs?.gallery || [];
  const [lightbox, setLightbox] = useState(null); // index into gallery, or null

  const step = (dir) => setLightbox((i) => (i === null ? null : (i + dir + gallery.length) % gallery.length));

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
  }, [lightbox, gallery.length]);

  if (!cs) return null;
  const showVisual = showHero && !cs.hero && !!project.visual && webglReady;

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

      <div className="space-y-8" style={{ maxWidth: 680 }}>
        {cs.sections.map((s, i) => (
          <section key={i}>
            <h2 className="gx-display text-xl font-semibold tracking-[-0.01em] mb-2.5" style={{ color: 'var(--ink)' }}>
              {s.heading}
            </h2>
            {(Array.isArray(s.body) ? s.body : [s.body]).map((p, j) => (
              <p key={j} className={`text-[15px] leading-relaxed${j > 0 ? ' mt-3' : ''}`} style={{ color: 'var(--ink-dim)' }}>
                {p}
              </p>
            ))}
          </section>
        ))}
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
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: 680 }}>
          {gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
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

      {createPortal(
      <AnimatePresence>
        {lightbox !== null && gallery[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1250] grid place-items-center p-4 sm:p-10"
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
            {gallery.length > 1 && (
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
                src={gallery[lightbox].src}
                alt={gallery[lightbox].caption || ''}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease }}
                className="block"
                style={{ borderRadius: 16, maxWidth: '90vw', maxHeight: '75vh', objectFit: 'contain' }}
              />
              {gallery[lightbox].caption && (
                <p className="mt-4 text-sm leading-relaxed text-center" style={{ color: 'var(--ink-dim)', maxWidth: 640 }}>
                  {gallery[lightbox].caption}
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
