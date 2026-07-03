import React, { useEffect, useRef } from 'react';

/**
 * The signature PS3-XMB backdrop: deep navy-indigo gradient (CSS)
 * with one slow flowing "wave" ribbon (animated SVG). The whole field
 * drifts with scroll and cursor at different depths, so there's quiet
 * parallax life behind the glass. No particle fields or blurred orbs.
 */
const GlassBackground = () => {
  const bgRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    if (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      const sy = window.scrollY || 0;
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.08) translate3d(${px * 0.4}px, ${py * 0.4 - sy * 0.015}px, 0)`;
      }
      if (waveRef.current) {
        waveRef.current.style.transform = `scale(1.06) translate3d(${px}px, ${py - sy * 0.05}px, 0)`;
      }
    };
    const onMove = (e) => {
      px = (e.clientX / window.innerWidth - 0.5) * 26;
      py = (e.clientY / window.innerHeight - 0.5) * 18;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={bgRef} className="gx-bg" aria-hidden="true" />

      {/* flowing wave ribbon */}
      <div ref={waveRef} className="gx-wave" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <linearGradient id="gxWaveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7aa2ff" stopOpacity="0" />
              <stop offset="35%" stopColor="#aab6ff" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#cdd6ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#5ee7c6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gxWaveGrad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5ee7c6" stopOpacity="0" />
              <stop offset="50%" stopColor="#9b8cff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7aa2ff" stopOpacity="0" />
            </linearGradient>
            <filter id="gxBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>

          {/* primary ribbon */}
          <path filter="url(#gxBlur)" fill="none" stroke="url(#gxWaveGrad)" strokeWidth="2.2">
            <animate
              attributeName="d"
              dur="14s"
              repeatCount="indefinite"
              values="
                M-100,440 C300,300 560,560 760,470 C980,372 1180,520 1560,400;
                M-100,470 C300,580 560,360 760,500 C980,620 1180,420 1560,470;
                M-100,440 C300,300 560,560 760,470 C980,372 1180,520 1560,400"
            />
          </path>

          {/* secondary, fainter ribbon */}
          <path filter="url(#gxBlur)" fill="none" stroke="url(#gxWaveGrad2)" strokeWidth="1.4" opacity="0.7">
            <animate
              attributeName="d"
              dur="19s"
              repeatCount="indefinite"
              values="
                M-100,520 C320,470 540,610 780,540 C1040,462 1220,600 1560,500;
                M-100,500 C320,600 540,460 780,560 C1040,640 1220,470 1560,540;
                M-100,520 C320,470 540,610 780,540 C1040,462 1220,600 1560,500"
            />
          </path>
        </svg>
      </div>
    </>
  );
};

export default GlassBackground;
