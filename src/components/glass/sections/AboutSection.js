import React from 'react';
import { motion } from 'framer-motion';
import { about, experience, education } from '../../../data/portfolio';
import SectionLabel from '../SectionLabel';

const ease = [0.2, 0.9, 0.25, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const AboutSection = () => {
  return (
    <section id="about" className="gx-anchor py-20 sm:py-28 px-5">
      <div className="mx-auto w-full" style={{ maxWidth: 980 }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <SectionLabel index="02">About</SectionLabel>

          <div className="grid lg:grid-cols-5 gap-x-12 gap-y-10 items-start">
            {/* bio + education — plain text, no panel */}
            <motion.div variants={fadeUp} className="lg:col-span-3">
              {about.bio.map((p, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${i === 0 ? 'text-xl' : 'mt-5 text-lg'}`}
                  style={{ color: i === 0 ? 'var(--ink)' : 'var(--ink-dim)' }}
                >
                  {p}
                </p>
              ))}

              <div className="mt-9 pt-7 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--ink-faint)' }}>Education</div>
                <div className="font-semibold text-lg gx-display leading-snug">{education.school}</div>
                <div className="mt-1.5" style={{ color: 'var(--ink-dim)' }}>{education.degree}</div>
                <div className="mt-1.5 text-sm" style={{ color: 'var(--ink-faint)' }}>
                  {education.dates} · {education.detail}
                </div>
              </div>
            </motion.div>

            {/* skills — single glass card for material contrast */}
            <motion.div variants={fadeUp} className="gx-glass gx-sheen p-7 lg:col-span-2">
              <div className="text-sm font-semibold mb-5" style={{ color: 'var(--ink-faint)' }}>Toolkit</div>
              <div className="space-y-4">
                {Object.entries(about.skills).map(([group, items]) => (
                  <div key={group}>
                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--ink-dim)' }}>{group}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((s) => (
                        <span key={s} className="gx-chip !py-1 !px-2.5 !text-[11px]">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* experience — bordered list, not card soup */}
          <motion.div variants={fadeUp} className="mt-16">
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--ink-faint)' }}>Experience</div>
            <div className="border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
              {experience.map((job, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="py-7 border-b flex flex-col sm:flex-row gap-3 sm:gap-10"
                  style={{ borderColor: 'var(--glass-edge-soft)' }}
                >
                  <div className="sm:w-56 flex-none">
                    <div className="font-semibold text-lg gx-display leading-tight">{job.company}</div>
                    <div className="mt-1 text-sm" style={{ color: 'var(--ink-dim)' }}>{job.dates}</div>
                    <div className="text-sm" style={{ color: 'var(--ink-faint)' }}>{job.location}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[17px]" style={{ color: 'var(--accent)' }}>
                      {job.role}
                      {job.type ? <span style={{ color: 'var(--ink-faint)' }}> · {job.type}</span> : null}
                    </div>
                    <ul className="mt-3 space-y-2">
                      {job.points.map((pt, j) => (
                        <li key={j} className="flex gap-3 leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
                          <span className="flex-none mt-2.5 h-px w-3.5" style={{ background: 'var(--accent)' }} />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
