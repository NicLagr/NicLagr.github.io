import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../../data/portfolio';
import { TbX, TbArrowUpRight, TbCode, TbFileText, TbArrowLeft } from '../icons';
import SectionLabel from '../SectionLabel';
import CaseStudyBody from '../CaseStudyBody';

const ease = [0.2, 0.9, 0.25, 1];

const ProjectRow = ({ project, onOpen }) => (
  <motion.button
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    transition={{ duration: 0.55, ease }}
    onClick={() => onOpen(project)}
    className="gx-row gx-selectable group"
  >
    {project.image && (
      <span
        className="gx-row-media"
        style={{ backgroundImage: `url(${project.image})` }}
        aria-hidden="true"
      />
    )}
    <span className="gx-row-aurora gx-aurora" aria-hidden="true" />

    <div className="gx-row-body flex-1 min-w-0">
      <div className="flex items-baseline gap-3 flex-wrap">
        <h3 className="font-semibold gx-display text-xl sm:text-2xl leading-tight">{project.title}</h3>
        <span className="gx-mono text-xs" style={{ color: 'var(--ink-faint)' }}>{project.year}</span>
      </div>
      <div className="mt-1 text-sm" style={{ color: 'var(--ink-dim)' }}>
        {project.org} · {project.role}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 5).map((t) => (
          <span key={t} className="gx-chip !py-1 !px-2">{t}</span>
        ))}
      </div>
    </div>

    <TbArrowUpRight
      size={22}
      className="gx-row-body flex-none opacity-40 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
      style={{ color: 'var(--ink)' }}
    />
  </motion.button>
);

export const ProjectSheet = ({ project, onClose }) => {
  const [showCase, setShowCase] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (showCase ? setShowCase(false) : onClose());
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, showCase]);

  // reset to the overview whenever a different project opens
  useEffect(() => { setShowCase(false); }, [project && project.id]);
  // jump back to the top of the sheet when toggling between views
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [showCase]);

  if (!project) return null;
  const { links = {} } = project;
  const hasCaseStudy = !!project.caseStudy;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1100] grid place-items-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(3,4,10,0.72)', backdropFilter: 'blur(8px)' }} />
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.4, ease }}
        onClick={(e) => e.stopPropagation()}
        className="gx-glass-strong gx-scroll relative w-full overflow-y-auto"
        style={{ maxWidth: 720, maxHeight: '88vh', borderRadius: 28 }}
      >
        <div className="relative h-44 sm:h-56" style={{ background: project.accent }}>
          {project.image && (
            <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,4,10,0.15), rgba(3,4,10,0.78))' }} />
          <button
            onClick={onClose}
            className="!absolute top-4 right-4 gx-glass w-9 h-9 rounded-full grid place-items-center z-10"
            aria-label="Close"
          >
            <TbX size={18} />
          </button>
          <div className="absolute bottom-5 left-6 right-6">
            <div className="gx-label !text-[var(--ink-dim)] mb-2">{project.year} · {project.org}</div>
            <h3 className="font-semibold tracking-[-0.02em]" style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.5rem)' }}>
              {project.title}
            </h3>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {showCase ? (
            <>
              <button
                type="button"
                onClick={() => setShowCase(false)}
                className="gx-btn !py-1.5 !px-3.5 !text-sm mb-7"
              >
                <TbArrowLeft size={16} /> Overview
              </button>
              <CaseStudyBody project={project} />
            </>
          ) : (
          <>
          <div className="gx-label mb-3">Role · {project.role}</div>
          <p className="text-lg leading-relaxed mb-7">{project.summary}</p>

          {project.video && (
            <figure className="mb-7">
              <div className="gx-label mb-2">Featured at Hannover Messe</div>
              <div className="relative overflow-hidden" style={{ borderRadius: 14, background: '#05060e' }}>
                <video
                  src={project.video.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto block"
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (project.video.end && v.currentTime >= project.video.end) v.pause();
                  }}
                />
              </div>
              {project.video.caption && (
                <figcaption className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
                  {project.video.caption}
                  {project.video.href && (
                    <>
                      {' '}
                      <a href={project.video.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                        View on LinkedIn
                      </a>
                    </>
                  )}
                </figcaption>
              )}
            </figure>
          )}

          <div className="gx-label mb-4">Highlights</div>
          <ul className="space-y-3 mb-8">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex gap-3.5 text-[15px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
                <span className="flex-none mt-2 h-px w-4 self-start" style={{ background: 'var(--accent-grad)' }} />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {project.tags.map((t) => (
              <span key={t} className="gx-chip">{t}</span>
            ))}
          </div>

          {(hasCaseStudy || links.live || links.repo) && (
            <div className="flex flex-wrap gap-3">
              {hasCaseStudy && (
                <button
                  type="button"
                  onClick={() => setShowCase(true)}
                  className={links.live ? 'gx-btn' : 'gx-btn gx-btn-primary'}
                >
                  <TbFileText size={18} /> Read case study
                </button>
              )}
              {links.live && (
                <a href={links.live} target="_blank" rel="noopener noreferrer" className="gx-btn gx-btn-primary">
                  View live <TbArrowUpRight size={18} />
                </a>
              )}
              {links.repo && (
                <a href={links.repo} target="_blank" rel="noopener noreferrer" className="gx-btn">
                  <TbCode size={18} /> Source code
                </a>
              )}
            </div>
          )}
          </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const WorkSection = () => {
  const [open, setOpen] = useState(null);

  return (
    <section id="work" className="gx-anchor py-24 sm:py-32 px-5">
      <div className="mx-auto w-full" style={{ maxWidth: 960 }}>
        <SectionLabel index="01">Work</SectionLabel>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          className="flex flex-col gap-3"
        >
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} onOpen={setOpen} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {open && <ProjectSheet project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default WorkSection;
