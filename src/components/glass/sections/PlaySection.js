import React from 'react';
import { motion } from 'framer-motion';
import { games } from '../../../data/games';
import { TbPlayerPlay, TbCode } from '../icons';
import SectionLabel from '../SectionLabel';

const ease = [0.2, 0.9, 0.25, 1];

const GameRow = ({ game }) => {
  const play = game.links?.play;
  const repo = game.links?.repo;
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.55, ease }}
      className="gx-row group flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
    >
      {game.media?.hero && (
        <span
          className="gx-row-media"
          style={{ backgroundImage: `url(${game.media.hero})` }}
          aria-hidden="true"
        />
      )}
      <span className="gx-row-aurora gx-aurora" aria-hidden="true" />

      <div className="gx-row-body flex-1 min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="font-semibold gx-display text-xl sm:text-2xl leading-tight">{game.title}</h3>
          <span className="gx-mono text-xs" style={{ color: 'var(--ink-faint)' }}>{game.year}</span>
        </div>
        <div className="mt-1 text-sm" style={{ color: 'var(--ink-dim)' }}>
          {(game.genres || []).slice(0, 2).join(' · ')}
          {game.engines?.[0] ? ` · ${game.engines[0]}` : ''}
        </div>
        <p className="mt-2 text-sm max-w-xl" style={{ color: 'var(--ink-faint)' }}>{game.summary}</p>
      </div>

      <div className="gx-row-body flex-none flex gap-2">
        {play && (
          <a href={play} target="_blank" rel="noopener noreferrer" className="gx-btn gx-btn-primary gx-selectable !py-1.5 !px-3.5 !text-sm">
            <TbPlayerPlay size={15} /> Play
          </a>
        )}
        {repo && (
          <a href={repo} target="_blank" rel="noopener noreferrer" className="gx-btn gx-selectable !py-1.5 !px-3.5 !text-sm">
            <TbCode size={15} /> Code
          </a>
        )}
      </div>
    </motion.div>
  );
};

const PlaySection = () => {
  return (
    <section id="play" className="gx-anchor py-24 sm:py-32 px-5">
      <div className="mx-auto w-full" style={{ maxWidth: 960 }}>
        <SectionLabel index="03">Play</SectionLabel>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          className="flex flex-col gap-3"
        >
          {games.map((g) => (
            <GameRow key={g.slug} game={g} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PlaySection;
