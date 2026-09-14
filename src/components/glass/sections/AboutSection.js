import React from 'react';
import { motion } from 'framer-motion';
import { about, experience, education } from '../../../data/portfolio';
import SectionLabel from '../SectionLabel';

const ease = [0.2, 0.9, 0.25, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

// A few real photos, no orbiting labels. Only panels with an actual image get
// a tile; Fitness/Building never had photos, so they're one line of text below.
const LIFE_PHOTOS = [
  {
    image: process.env.PUBLIC_URL + '/about/gaming.gif',
    pixel: true,
    caption: 'Talk to me about video games, retro or new.',
  },
  {
    image: process.env.PUBLIC_URL + '/about/outdoors.jpg',
    caption: 'Backpacking when I get the chance. Most recently, four days in Iceland.',
  },
  {
    image: process.env.PUBLIC_URL + '/about/lottie.jpg',
    caption: 'Lottie, my cat.',
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="gx-anchor py-20 sm:py-28 px-5">
      <div className="mx-auto w-full" style={{ maxWidth: 720 }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <SectionLabel index="02">About</SectionLabel>

          <motion.div variants={fadeUp}>
            {about.bio.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? 'text-xl leading-relaxed' : 'mt-5 text-lg leading-relaxed'}
                style={{ color: 'var(--ink-dim)' }}
              >
                {p}
              </p>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 pt-7 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--ink-faint)' }}>Education</div>
            <div className="font-semibold text-lg gx-display leading-snug">{education.school}</div>
            <div className="mt-1.5" style={{ color: 'var(--ink-dim)' }}>{education.degree}</div>
            <div className="mt-1.5 text-sm" style={{ color: 'var(--ink-faint)' }}>
              {education.dates}
            </div>
          </motion.div>

          {/* experience — bordered list, not card soup */}
          <motion.div variants={fadeUp} className="mt-14 pt-7 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--ink-faint)' }}>Experience</div>
            <div>
              {experience.map((job, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="py-6 pl-5"
                  style={{ borderLeft: '2px solid var(--glass-edge-soft)' }}
                >
                  <div className="font-semibold text-lg gx-display leading-tight">{job.company}</div>
                  <div className="mt-1 text-sm" style={{ color: 'var(--ink-faint)' }}>
                    {job.dates} · {job.location}
                  </div>
                  <div className="mt-2 font-semibold text-[17px]" style={{ color: 'var(--accent)' }}>
                    {job.role}
                    {job.type ? <span style={{ color: 'var(--ink-faint)' }}> · {job.type}</span> : null}
                  </div>
                  <p className="mt-3 leading-relaxed" style={{ color: 'var(--ink-dim)' }}>{job.points[0]}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-14 pt-7 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
            <div className="text-sm font-semibold mb-4" style={{ color: 'var(--ink-faint)' }}>Outside of work</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {LIFE_PHOTOS.map((p, i) => (
                <figure key={i} className="gx-glass overflow-hidden" style={{ borderRadius: 16 }}>
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-36 object-cover"
                    style={{ imageRendering: p.pixel ? 'pixelated' : 'auto' }}
                  />
                  <figcaption className="p-3 text-sm leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
                    {p.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--ink-faint)' }}>
              I also lift most days, play tennis and pickleball, and build PCs and keyboards.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
