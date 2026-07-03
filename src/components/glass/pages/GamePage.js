import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell, { pageFadeUp } from './PageShell';
import { TbPlayerPlay, TbCode, TbX } from '../icons';
import sfx from '../sfx';

const ease = [0.2, 0.9, 0.25, 1];

/** Dedicated game view — a short line on what it is, then the gallery does the talking. */
const GamePage = ({ game }) => {
  const [lightbox, setLightbox] = useState(null);
  if (!game) return null;

  const play = game.links?.play;
  const repo = game.links?.repo;
  const gallery = game.media?.gallery || [];
  const meta = [...(game.genres || []).slice(0, 3), game.year].filter(Boolean).join(' · ');
  const tags = [...(game.engines || []), ...(game.stack || [])];

  return (
    <PageShell title={game.title} maxWidth={980}>
      {game.media?.hero && (
        <motion.div
          variants={pageFadeUp}
          className="relative overflow-hidden mb-10"
          style={{ borderRadius: 24, aspectRatio: '16 / 8' }}
        >
          <img src={game.media.hero} alt={game.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,4,10,0.05), rgba(3,4,10,0.5))' }} />
        </motion.div>
      )}

      {meta && <motion.div variants={pageFadeUp} className="gx-label mb-3">{meta}</motion.div>}
      <motion.p variants={pageFadeUp} className="text-2xl leading-relaxed mb-8" style={{ maxWidth: 700 }}>
        {game.summary}
      </motion.p>

      <motion.div variants={pageFadeUp} className="flex flex-wrap items-center gap-3 mb-12">
        {play && (
          <a href={play} target="_blank" rel="noopener noreferrer" onClick={() => sfx.open()} className="gx-btn gx-btn-primary">
            <TbPlayerPlay size={18} /> Play now
          </a>
        )}
        {repo && (
          <a href={repo} target="_blank" rel="noopener noreferrer" onClick={() => sfx.open()} className="gx-btn">
            <TbCode size={18} /> Source code
          </a>
        )}
      </motion.div>

      {gallery.length > 0 && (
        <motion.div variants={pageFadeUp} className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => { sfx.open(); setLightbox(src); }}
                className="relative overflow-hidden group"
                style={{ borderRadius: 14, aspectRatio: '16 / 10', border: '1px solid var(--glass-edge-soft)' }}
              >
                <img
                  src={src}
                  alt={`${game.title} screenshot ${i + 1}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {tags.length > 0 && (
        <motion.div variants={pageFadeUp} className="flex flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <span key={`${t}-${i}`} className="gx-chip">{t}</span>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] grid place-items-center p-4 sm:p-10"
            onClick={() => { sfx.back(); setLightbox(null); }}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(3,4,10,0.82)', backdropFilter: 'blur(10px)' }} />
            <button
              onClick={() => setLightbox(null)}
              className="!absolute top-5 right-5 gx-glass w-10 h-10 rounded-full grid place-items-center z-10"
              aria-label="Close"
            >
              <TbX size={20} />
            </button>
            <motion.img
              key={lightbox}
              src={lightbox}
              alt={game.title}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-full max-h-full object-contain"
              style={{ borderRadius: 16 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
};

export default GamePage;
