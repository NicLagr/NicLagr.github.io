import React from 'react';
import { motion } from 'framer-motion';
import PageShell, { pageFadeUp } from './PageShell';
import { about, experience, education } from '../../../data/portfolio';

/** Dedicated About page — reached by diving into the About face. */
const AboutPage = () => (
  <PageShell title="Background & skills" maxWidth={980}>
    <div className="grid lg:grid-cols-5 gap-x-12 gap-y-10 items-start">
      <motion.div variants={pageFadeUp} className="lg:col-span-3">
        {about.bio.map((p, i) => (
          <p key={i} className="text-2xl leading-relaxed" style={{ color: 'var(--ink)' }}>
            {p}
          </p>
        ))}

        <div className="mt-9 pt-7 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
          <div className="gx-label mb-3">Education</div>
          <div className="font-semibold text-lg gx-display leading-snug">{education.school}</div>
          <div className="mt-1.5" style={{ color: 'var(--ink-dim)' }}>{education.degree}</div>
          <div className="mt-1.5 text-sm" style={{ color: 'var(--ink-faint)' }}>
            {education.dates} · {education.detail}
          </div>
        </div>
      </motion.div>

      <motion.div variants={pageFadeUp} className="gx-glass gx-sheen p-7 lg:col-span-2">
        <div className="gx-label mb-4">Frontend & UX</div>
        <div className="flex flex-wrap gap-1.5">
          {about.skills.core.map((s) => (
            <span key={s} className="gx-chip">{s}</span>
          ))}
        </div>

        <div className="mt-7 pt-6 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--ink-dim)' }}>
            {about.adaptNote}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {about.skills.adapts.map((s) => (
              <span key={s} className="gx-chip !bg-transparent" style={{ color: 'var(--ink-faint)' }}>{s}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>

    <motion.div variants={pageFadeUp} className="mt-16">
      <div className="gx-label mb-2">Experience</div>
      <div className="border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
        {experience.map((job, i) => (
          <div
            key={i}
            className="py-6 border-b flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8"
            style={{ borderColor: 'var(--glass-edge-soft)' }}
          >
            <div className="sm:w-64 flex-none">
              <div className="font-semibold text-[17px] gx-display leading-tight">{job.role}</div>
              <div className="mt-0.5 text-sm" style={{ color: 'var(--ink-faint)' }}>
                {job.company} · {job.dates}
              </div>
            </div>
            <div className="flex-1 leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
              {job.points[0]}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </PageShell>
);

export default AboutPage;
