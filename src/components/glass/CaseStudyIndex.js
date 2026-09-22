import React from 'react';

/**
 * The sticky section index beside a case study.
 *
 * Every case study now uses the same small vocabulary of section names
 * (Mission, Context, Research, Features, Learnings, and a handful of optional
 * middle ones), so this rail doubles as a promise: a reviewer skimming eight
 * projects can read the same ten words in the same order every time and know
 * immediately where the part they care about lives. That only works if the
 * names stay plain — a rail full of project-specific headings like "Where it
 * got to" is a list of sentences, not an index.
 *
 * Desktop only. On a phone the rail would eat a third of the reading width to
 * show what a thumb can find by scrolling, so it is hidden there and the
 * section headings carry the structure on their own.
 */
const CaseStudyIndex = ({ title, sections, activeIndex, onJump }) => {
  if (!sections || sections.length < 2) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="hidden lg:block sticky self-start"
      style={{ top: 96 }}
    >
      {title && (
        <div
          className="gx-display text-lg font-semibold tracking-[-0.01em] mb-5"
          style={{ color: 'var(--ink)' }}
        >
          {title}
        </div>
      )}
      <ul className="space-y-2.5">
        {sections.map((s, i) => {
          const on = i === activeIndex;
          return (
            <li key={i}>
              <button
                onClick={() => onJump(i)}
                className="text-left text-[15px] leading-snug transition-[color,opacity] duration-300 gx-selectable"
                style={{
                  color: on ? 'var(--ink)' : 'var(--ink-dim)',
                  opacity: on ? 1 : 0.55,
                }}
                aria-current={on ? 'true' : undefined}
              >
                {s.heading}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CaseStudyIndex;
