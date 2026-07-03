import React from 'react';

/**
 * The written case study for a project: a hero band, a few short sections in the
 * user's own voice, then a curated image gallery with encyclopedic captions.
 * Presentational only — desktop wraps it in a PageShell, mobile renders it inside
 * the project sheet. Missing images degrade gracefully (hero falls back to the
 * accent band; a broken gallery shot hides its whole figure) so the layout never
 * shows a torn image while assets are still being dropped in.
 */
const hideImg = (e) => { e.currentTarget.style.display = 'none'; };
const hideFigure = (e) => {
  const fig = e.currentTarget.closest('figure');
  if (fig) fig.style.display = 'none';
};

const CaseStudyBody = ({ project }) => {
  const cs = project?.caseStudy;
  if (!cs) return null;

  return (
    <>
      {cs.hero && (
        <div
          className="relative overflow-hidden mb-10"
          style={{ borderRadius: 20, background: project.accent, aspectRatio: '16 / 9' }}
        >
          <img
            src={cs.hero}
            alt={`${project.title} — main view`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={hideImg}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,4,10,0.04), rgba(3,4,10,0.4))' }} />
        </div>
      )}

      <div className="gx-label mb-8">{project.org} · {project.role} · {project.year}</div>

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

      {cs.gallery && cs.gallery.length > 0 && (
        <div className="mt-12 space-y-8">
          {cs.gallery.map((g, i) => (
            <figure key={i}>
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: 16, background: '#05060e', border: '1px solid var(--glass-edge-soft)' }}
              >
                <img
                  src={g.src}
                  alt={g.caption || ''}
                  loading="lazy"
                  className="w-full h-auto block"
                  onError={hideFigure}
                />
              </div>
              {g.caption && (
                <figcaption className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--ink-dim)', maxWidth: 680 }}>
                  {g.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </>
  );
};

export default CaseStudyBody;
