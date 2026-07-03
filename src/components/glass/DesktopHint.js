import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbX } from './icons';

/**
 * Small, dismissible note on the compact (narrow / touch) view pointing to the
 * desktop for the full console + sound + controller experience. Shown once
 * (remembered in localStorage), never nags.
 */
const DesktopHint = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem('gx-desktop-hint') === '1'; } catch (e) { /* ignore */ }
    if (seen) return undefined;
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem('gx-desktop-hint', '1'); } catch (e) { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-x-0 bottom-5 z-[300] flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.5, ease: [0.2, 0.9, 0.25, 1] }}
          className="gx-glass flex items-center gap-3 pl-4 pr-3 py-3 w-full max-w-[430px] pointer-events-auto"
          style={{ borderRadius: 16 }}
        >
            <span className="flex-1 text-[13px] leading-snug" style={{ color: 'var(--ink-dim)' }}>
              Open on desktop for the full experience: sound, the cube console, and controller support.
            </span>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="gx-selectable flex-none grid place-items-center w-7 h-7 rounded-full"
              style={{ color: 'var(--ink-faint)' }}
            >
              <TbX size={15} />
            </button>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DesktopHint;
