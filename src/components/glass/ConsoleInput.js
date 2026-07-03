import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * "Drive it like a console." Adds gamepad support (Gamepad API) on top of the
 * keyboard ← → section nav already in the shell:
 *   · D-pad / left-stick  ← →   move between sections
 *   · D-pad / left-stick  ↑ ↓   move a selection across tiles (native focus)
 *   · A (0)                     open the focused item
 *   · B (1)                     jump back to the top
 * No sound, nothing autoplays; pure input. Shows a brief hint on connect.
 */
const DEAD = 0.5;
const COOLDOWN = 240; // ms between repeats

const isVisible = (el) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight * 2;
};

const ConsoleInput = ({ onStep }) => {
  const [connected, setConnected] = useState(false);
  const raf = useRef(0);
  const lastAt = useRef(0);
  const prevButtons = useRef([]);

  useEffect(() => {
    const moveFocus = (dir) => {
      const items = Array.from(document.querySelectorAll('.gx-selectable')).filter(isVisible);
      if (!items.length) return;
      const cur = document.activeElement;
      let idx = items.indexOf(cur);
      idx = idx === -1 ? (dir > 0 ? 0 : items.length - 1) : Math.min(Math.max(idx + dir, 0), items.length - 1);
      items[idx].focus();
    };

    const act = (a) => {
      const now = performance.now();
      if (a.type !== 'button' && now - lastAt.current < COOLDOWN) return;
      if (a.type === 'axisX') { lastAt.current = now; onStep(a.dir); }
      else if (a.type === 'axisY') { lastAt.current = now; moveFocus(a.dir); }
      else if (a.type === 'A') {
        const el = document.activeElement;
        if (el && typeof el.click === 'function' && el !== document.body) el.click();
      } else if (a.type === 'B') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const poll = () => {
      raf.current = requestAnimationFrame(poll);
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = Array.from(pads).find(Boolean);
      if (!gp) return;

      const ax = gp.axes[0] || 0;
      const ay = gp.axes[1] || 0;
      const dpadX = (gp.buttons[15]?.pressed ? 1 : 0) - (gp.buttons[14]?.pressed ? 1 : 0);
      const dpadY = (gp.buttons[13]?.pressed ? 1 : 0) - (gp.buttons[12]?.pressed ? 1 : 0);

      const x = Math.abs(ax) > DEAD ? Math.sign(ax) : dpadX;
      const y = Math.abs(ay) > DEAD ? Math.sign(ay) : dpadY;
      if (x) act({ type: 'axisX', dir: x });
      else if (y) act({ type: 'axisY', dir: y });
      else lastAt.current = 0; // reset cooldown when stick returns to center

      // edge-detected face buttons
      const btns = gp.buttons.map((b) => b.pressed);
      if (btns[0] && !prevButtons.current[0]) act({ type: 'A' });
      if (btns[1] && !prevButtons.current[1]) act({ type: 'B' });
      prevButtons.current = btns;
    };

    const onConnect = () => {
      setConnected(true);
      raf.current = requestAnimationFrame(poll);
    };
    const onDisconnect = () => {
      const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
      if (!pads.length) { setConnected(false); cancelAnimationFrame(raf.current); }
    };

    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);
    // in case a pad is already present/held
    const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
    if (pads.length) onConnect();

    return () => {
      window.removeEventListener('gamepadconnected', onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
      cancelAnimationFrame(raf.current);
    };
  }, [onStep]);

  // auto-hide the hint a few seconds after connect
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    if (!connected) return undefined;
    setShowHint(true);
    const t = setTimeout(() => setShowHint(false), 7000);
    return () => clearTimeout(t);
  }, [connected]);

  return (
    <AnimatePresence>
      {showHint && (
        <motion.div
          className="fixed left-1/2 bottom-16 z-[950]"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <span className="gx-chip gx-glass gap-2">
            <span className="gx-dot" /> Controller connected · ◀ ▶ sections · ▲ ▼ select · A open
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsoleInput;
