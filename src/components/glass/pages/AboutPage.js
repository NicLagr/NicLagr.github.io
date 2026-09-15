import React from 'react';
import { motion } from 'framer-motion';
import PageShell, { pageFadeUp } from './PageShell';
import { about, experience, education } from '../../../data/portfolio';

// A few real photos, no 3D, no orbiting labels. Only panels with an actual
// image get a tile; Fitness/Building never had photos, so they're one line
// of text below instead of an empty frame.
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

const hideFigure = (e) => {
  const fig = e.currentTarget.closest('figure');
  if (fig) fig.style.display = 'none';
};

/** Dedicated About page — reached by diving into the About face. */
const AboutPage = () => (
  <PageShell title="Background & skills" eyebrow="About" maxWidth={720}>
    <motion.div variants={pageFadeUp}>
      {about.bio.map((p, i) => (
        <p
          key={i}
          className={i === 0 ? 'text-2xl leading-relaxed' : 'mt-6 text-lg leading-relaxed'}
          style={{ color: 'var(--ink-dim)' }}
        >
          {p}
        </p>
      ))}
    </motion.div>

    <motion.div variants={pageFadeUp} className="mt-14 pt-8 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
      <div className="gx-label mb-3">Education</div>
      <div className="font-semibold text-lg gx-display leading-snug">{education.school}</div>
      <div className="mt-1.5" style={{ color: 'var(--ink-dim)' }}>{education.degree}</div>
      <div className="mt-1.5 text-sm" style={{ color: 'var(--ink-faint)' }}>
        {education.dates}
      </div>
    </motion.div>

    <motion.div variants={pageFadeUp} className="mt-14 pt-8 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
      <div className="gx-label mb-2">Experience</div>
      <div>
        {experience.map((job, i) => (
          <div
            key={i}
            className="py-6 pl-5"
            style={{ borderLeft: '2px solid var(--glass-edge-soft)' }}
          >
            <div className="font-semibold text-[17px] gx-display leading-tight">{job.role}</div>
            <div className="mt-0.5 mb-2 text-sm" style={{ color: 'var(--ink-faint)' }}>
              {job.company} · {job.dates}
            </div>
            <div className="leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
              {job.points[0]}
            </div>
          </div>
        ))}
      </div>
    </motion.div>

    <motion.div variants={pageFadeUp} className="mt-14 pt-8 border-t" style={{ borderColor: 'var(--glass-edge-soft)' }}>
      <div className="gx-label mb-4">Outside of work</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {LIFE_PHOTOS.map((p, i) => (
          <figure key={i} className="gx-glass overflow-hidden" style={{ borderRadius: 16 }}>
            <img
              src={p.image}
              alt=""
              className="w-full h-36 object-cover"
              style={{ imageRendering: p.pixel ? 'pixelated' : 'auto' }}
              onError={hideFigure}
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
  </PageShell>
);

export default AboutPage;
