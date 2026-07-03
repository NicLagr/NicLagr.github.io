import React from 'react';
import { motion } from 'framer-motion';
import { profile } from '../../../data/portfolio';
import { TbArrowUpRight } from '../icons';
import SectionLabel from '../SectionLabel';

const ease = [0.2, 0.9, 0.25, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

// Direct channel list, matching the desktop cube's Contact face — name + handle,
// no CTA copy, no glyph icons.
const channels = [
  { title: 'Email', meta: profile.email, href: `mailto:${profile.email}` },
  { title: 'GitHub', meta: 'github.com/NicLagr', href: profile.links.github },
  { title: 'LinkedIn', meta: 'in/nicolo-lagravinese', href: profile.links.linkedin },
  { title: 'Résumé', meta: 'PDF', href: profile.links.resume },
];

const ContactSection = () => {
  const year = new Date().getFullYear();
  return (
    <section id="contact" className="gx-anchor py-24 sm:py-32 px-5">
      <div className="mx-auto w-full" style={{ maxWidth: 960 }}>
        <SectionLabel>Contact</SectionLabel>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.p
            variants={fadeUp}
            className="text-2xl sm:text-3xl leading-snug tracking-[-0.01em]"
            style={{ maxWidth: 760 }}
          >
            Graduating December 2026. Open to full-time frontend and UX roles from January 2027.
          </motion.p>

          <div className="mt-12 flex flex-col gap-3">
            {channels.map((c) => (
              <motion.a
                key={c.title}
                variants={fadeUp}
                href={c.href}
                target={c.href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="gx-row gx-selectable group"
              >
                <span className="gx-row-aurora gx-aurora" aria-hidden="true" />
                <div className="gx-row-body flex-1 min-w-0">
                  <div className="font-semibold gx-display text-xl leading-tight">{c.title}</div>
                  <div className="mt-0.5 gx-mono text-sm" style={{ color: 'var(--ink-faint)' }}>{c.meta}</div>
                </div>
                <TbArrowUpRight
                  size={20}
                  className="gx-row-body flex-none opacity-40 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                  style={{ color: 'var(--ink)' }}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <footer className="mt-20 text-xs" style={{ color: 'var(--ink-faint)' }}>
          © {year} {profile.name}
        </footer>
      </div>
    </section>
  );
};

export default ContactSection;
