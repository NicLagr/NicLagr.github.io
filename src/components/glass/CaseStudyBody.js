import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectVisual, { canWebGL, VisualCaption } from './ProjectVisual';
import { TbX, TbChevronLeft, TbChevronRight, TbExternalLink, TbVolume, TbVolumeOff } from './icons';
import MediaBadge from './MediaBadge';
import CaseStudyIndex from './CaseStudyIndex';

const ease = [0.2, 0.9, 0.25, 1];

/**
 * Zoom and pan for the lightbox.
 *
 * Fit-to-viewport is right for a screenshot and useless for a reference
 * board: the component sheet is 1560x3557, so fitting it into 75vh renders
 * 16px body text at about 3px. Scroll to zoom toward the cursor, drag to pan,
 * double-click to reset — the same gestures as Figma, so there is nothing to
 * learn. Transforms are written to the node directly rather than through
 * state, for the same reason the section dim is: this updates every wheel and
 * pointer event.
 */
const ZOOM_MIN = 1;
const ZOOM_MAX = 6;

function useZoomPan(resetKey) {
  const ref = useRef(null);
  const boxRef = useRef(null);
  const st = useRef({ z: 1, x: 0, y: 0, dragging: false, px: 0, py: 0 });
  const [zoomed, setZoomed] = useState(false);

  const paint = () => {
    const el = ref.current;
    if (!el) return;
    const { z, x, y } = st.current;
    el.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
    el.style.cursor = z > 1 ? (st.current.dragging ? 'grabbing' : 'grab') : 'zoom-in';
  };

  const reset = () => { st.current = { ...st.current, z: 1, x: 0, y: 0 }; setZoomed(false); paint(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reset(); }, [resetKey]);

  // Bound natively, non-passive. React registers wheel handlers as passive at
  // the root, so an onWheel prop can never preventDefault: the page scrolls
  // underneath and the zoom silently does nothing.
  const onWheel = (e) => {
    e.preventDefault();
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const s0 = st.current;
    const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, s0.z * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
    // keep the point under the cursor fixed while the scale changes
    const cx = e.clientX - (r.left + r.width / 2);
    const cy = e.clientY - (r.top + r.height / 2);
    const k = next / s0.z;
    st.current = { ...s0, z: next, x: next === 1 ? 0 : s0.x - cx * (k - 1), y: next === 1 ? 0 : s0.y - cy * (k - 1) };
    setZoomed(next > 1);
    paint();
  };

  const onPointerDown = (e) => {
    if (st.current.z <= 1) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    st.current = { ...st.current, dragging: true, px: e.clientX, py: e.clientY };
    paint();
  };
  const onPointerMove = (e) => {
    const s0 = st.current;
    if (!s0.dragging) return;
    st.current = { ...s0, x: s0.x + (e.clientX - s0.px), y: s0.y + (e.clientY - s0.py), px: e.clientX, py: e.clientY };
    paint();
  };
  const onPointerUp = () => { st.current = { ...st.current, dragging: false }; paint(); };
  const onDoubleClick = () => {
    if (st.current.z > 1) return reset();
    st.current = { ...st.current, z: 2.5 };
    setZoomed(true);
    paint();
  };

  const wheelRef = useRef(onWheel);
  wheelRef.current = onWheel;
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const fn = (e) => wheelRef.current(e);
    box.addEventListener('wheel', fn, { passive: false });
    return () => box.removeEventListener('wheel', fn);
  }, [resetKey]);

  return {
    ref,
    boxRef,
    zoomed,
    reset,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerLeave: onPointerUp, onDoubleClick },
  };
}

/**
 * Scroll-driven focus: the section you are reading sits at full strength and
 * the rest recede.
 *
 * Written against the nearest scrollable ancestor rather than the window,
 * because this page is rendered inside an absolutely-positioned
 * `overflow-y-auto` div (CubeConsole), so `window.scrollY` never moves and
 * anything bound to it would sit frozen at its initial value.
 *
 * Styles are written straight to the DOM inside a rAF rather than through
 * React state. A dim ramp updates on every scroll frame, and re-rendering a
 * page that holds a WebGL cube, a Figma iframe and three carousels at that
 * rate drops frames on exactly the modest laptops this site should feel good
 * on. Only `activeIndex` is state, and that changes a handful of times per
 * page.
 */
const DIM_MIN = 0.28;   // how far an off-focus section fades
const BLUR_MAX = 2.4;   // px, at full distance

function scrollParentOf(node) {
  let el = node?.parentElement;
  while (el) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) return el;
    el = el.parentElement;
  }
  return null;
}

function useSectionFocus(count, enabled) {
  const refs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!enabled || !count) return undefined;
    const first = refs.current.find(Boolean);
    const scroller = scrollParentOf(first);
    const viewportH = () => (scroller ? scroller.clientHeight : window.innerHeight);
    let raf = 0;

    const apply = () => {
      raf = 0;
      const h = viewportH();
      // The focus line sits above centre: a section feels "current" while its
      // heading is in the upper third, which is where the eye actually is.
      const focus = h * 0.38;
      // Once the container bottoms out, no further scrolling can bring the
      // last section up to the focus line, so without this the final section
      // stays dimmed and the rail never marks it read. At the bottom, the
      // last section is what you are looking at, by definition.
      const atBottom = scroller
        ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8
        : window.innerHeight + window.scrollY >= document.body.scrollHeight - 8;
      let best = 0;
      let bestD = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const offset = scroller ? scroller.getBoundingClientRect().top : 0;
        const top = r.top - offset;
        // distance from the focus line to the nearest part of the section
        const d = top > focus ? top - focus : Math.max(0, focus - (top + r.height));
        if (d < bestD) { bestD = d; best = i; }
        const t = atBottom && i === refs.current.length - 1 ? 0 : Math.min(1, d / (h * 0.55));
        el.style.opacity = String(1 - (1 - DIM_MIN) * t);
        el.style.filter = t > 0.02 ? `blur(${(BLUR_MAX * t).toFixed(2)}px)` : 'none';
      });
      if (atBottom) best = refs.current.length - 1;
      setActiveIndex((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const target = scroller || window;
    target.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    apply();
    return () => {
      target.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, enabled]);

  const jump = (i) => {
    const el = refs.current[i];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return { refs, activeIndex, jump };
}

/**
 * The written case study for a project: a hero band, then a few short sections
 * in the user's own voice. A section can carry its own image (a single
 * contextual shot) and/or a small set of images (e.g. a before/after pair) —
 * these render right where they're relevant instead of in one big gallery at
 * the end, so evidence shows up as you read instead of after. Any case study
 * still using the older flat `gallery` array (not attached to a section) keeps
 * rendering as a grid at the end, for backward compatibility. Presentational
 * only — desktop wraps it in a PageShell, mobile renders it inside the project
 * sheet. Missing images degrade gracefully (hero falls back to the accent
 * band; a broken shot hides itself) so the layout never shows a torn image
 * while assets are still being dropped in.
 */
const hideImg = (e) => { e.currentTarget.style.display = 'none'; };
const hideTile = (e) => { e.currentTarget.style.display = 'none'; };
const hideFigure = (e) => {
  const fig = e.currentTarget.closest('figure');
  if (fig) fig.style.display = 'none';
};

// Every image in the case study, in reading order — section-attached images
// first (a section's single `image` then its `images` set), then any leftover
// flat `gallery` images. This flat list is what the lightbox actually
// navigates; sections just render their own slice of it inline.
function collectImages(cs) {
  const list = [];
  (cs.sections || []).forEach((s) => {
    if (s.images) s.images.forEach((im) => list.push(im));
    if (s.carousel) s.carousel.forEach((im) => list.push(im));
    if (s.image) list.push(s.image);
  });
  (cs.gallery || []).forEach((g) => list.push(g));
  return list;
}

// A single contextual image, full-width at its own aspect ratio (not cropped
// to a tile) — right for a portrait screenshot or a photographed artifact,
// not just landscape UI shots.
const CaseImage = ({ image, index, onOpen }) => (
  <figure className="mt-5" style={{ maxWidth: image.maxWidth || 680 }}>
    <button
      onClick={() => onOpen(index)}
      className={`relative block w-full text-left group gx-selectable${image.bare ? '' : ' overflow-hidden'}`}
      style={image.bare
        ? { background: 'transparent', border: 'none' }
        : { borderRadius: 16, background: '#05060e', border: '1px solid var(--glass-edge-soft)' }}
    >
      <img
        src={image.src}
        alt={image.caption || ''}
        loading="lazy"
        className="w-full block transition-transform duration-500 group-hover:scale-[1.02]"
        style={image.maxHeight
          ? { height: image.maxHeight, objectFit: 'cover', objectPosition: 'top' }
          : { height: 'auto' }}
        onError={hideFigure}
      />
      {image.maxHeight && !image.bare && (
        <span
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(3,4,10,0.9))' }}
        />
      )}
    </button>
    {(image.caption || image.badge) && (
      <figcaption className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
        <MediaBadge badge={image.badge} />
        {image.caption}
      </figcaption>
    )}
  </figure>
);

const CAROUSEL_CARD_W = 220;
const CARD_ASPECT_DEFAULT = '1080 / 1240';
const VIDEO_CARD_W = 320;
const CAROUSEL_COPIES = 3;

// Shared scroll/loop mechanics behind every focused carousel on this page:
// the centered item reads at full size, neighbors shrink and fade, and it
// loops seamlessly in both directions. Three full copies of the item list
// sit side by side in the DOM (domIndex = copy*n + i, copy in [0,1,2]), not
// just one "peek" card per end, so a continuous drag or fling never runs out
// of physical content to scroll into — there's no boundary to hit a dead
// zone against. The middle copy (domIndex n..2n-1) is home. A scroll
// listener watches which copy the centered card belongs to and, the instant
// it drifts into the leading or trailing copy, shifts `scrollLeft` back by
// exactly one copy-width in the same tick with no transition; since every
// copy is pixel-identical, that correction is invisible, and it happens
// continuously during the scroll rather than only once motion settles, so
// momentum carries through the "seam" the same way it does anywhere else.
// Every card in every copy must use `scroll-snap-align`, which is what makes
// the correction possible: `scroll-snap-type: mandatory` will always
// resettle on a real target we just moved to, never fight it back to a
// non-target position (that fight is exactly what broke the single-peek-
// clone version of this before three copies replaced it). Not the CSS
// `::scroll-marker`/`::scroll-button` proposal (Chrome-only, unshippable) —
// same visual result, works in every browser.
function useLoopCarousel(n) {
  const trackRef = useRef(null);
  const setWidthRef = useRef(0);
  const [activeDom, setActiveDom] = useState(0);
  const total = n * CAROUSEL_COPIES;
  const active = ((activeDom % n) + n) % n;

  const centerOn = (child, behavior) => {
    const el = trackRef.current;
    if (!el || !child) return;
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    if (behavior === 'smooth') el.scrollTo({ left, behavior });
    else el.scrollLeft = left;
  };

  // land on the home copy's first card before the first paint, and measure
  // the pixel width of one full copy (the distance from the home copy's
  // first card to the leading copy's first card) — used every scroll tick
  // to detect and correct for having drifted a whole copy off-center.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    setWidthRef.current = el.children[n].offsetLeft - el.children[0].offsetLeft;
    centerOn(el.children[n], 'instant');
    setActiveDom(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let d = 0; d < total; d++) {
        const child = el.children[d];
        if (!child) continue;
        const r = child.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - mid);
        if (dist < bestDist) { bestDist = dist; best = d; }
      }
      const setW = setWidthRef.current;
      if (setW > 0) {
        if (best < n) { el.scrollLeft += setW; best += n; }
        else if (best >= 2 * n) { el.scrollLeft -= setW; best -= n; }
      }
      setActiveDom(best);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [n, total]);

  const goToDom = (domIndex) => centerOn(trackRef.current?.children[domIndex], 'smooth');
  const stepPrev = () => goToDom(activeDom - 1);
  const stepNext = () => goToDom(activeDom + 1);
  const goToLogical = (i) => goToDom(n + i); // always via the home copy

  return { trackRef, activeDom, active, goToDom, stepPrev, stepNext, goToLogical };
}

// Prev/Next + dot markers, shared chrome around whatever `renderCard` draws —
// the image carousel and the video carousel differ only in the card itself
// (a static thumbnail that opens a lightbox, vs. a card that plays video and
// carries a mute toggle), not in the loop/step/dot mechanics.
const CarouselChrome = ({ n, cardW, activeCaption, activeBadge, active, stepPrev, stepNext, goToLogical, trackRef, renderCard }) => {
  const cards = [];
  for (let copy = 0; copy < CAROUSEL_COPIES; copy++) {
    for (let i = 0; i < n; i++) cards.push({ i, domIndex: copy * n + i });
  }
  return (
    <div className="relative mt-5">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto gx-noscroll"
        style={{ scrollSnapType: 'x mandatory', paddingInline: `calc(50% - ${cardW / 2}px)`, paddingBlock: 12 }}
      >
        {cards.map(({ i, domIndex }) => renderCard(i, domIndex))}
      </div>

      <button
        onClick={stepPrev}
        aria-label="Previous"
        className="!absolute left-2 top-1/2 -translate-y-1/2 gx-glass rounded-full w-9 h-9 grid place-items-center z-10 hidden sm:grid"
      >
        <TbChevronLeft size={16} />
      </button>
      <button
        onClick={stepNext}
        aria-label="Next"
        className="!absolute right-2 top-1/2 -translate-y-1/2 gx-glass rounded-full w-9 h-9 grid place-items-center z-10 hidden sm:grid"
      >
        <TbChevronRight size={16} />
      </button>

      {(activeCaption || activeBadge) && (
        <p className="text-center text-sm mt-3" style={{ color: 'var(--ink)' }}>
          <MediaBadge badge={activeBadge} />
          {activeCaption}
        </p>
      )}

      <div className="flex items-center justify-center gap-2 mt-2">
        {Array.from({ length: n }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToLogical(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full"
            style={{
              width: i === active ? 8 : 6,
              height: i === active ? 8 : 6,
              background: i === active ? 'var(--accent)' : 'var(--glass-edge)',
              transition: 'all 200ms ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Defined at module scope deliberately, not inside `Carousel`'s render body —
// an inline component definition gets a fresh function identity every render,
// which makes React treat it as a different component type and unmount/
// remount the whole subtree (every `<img>` in it) on every state change
// instead of just re-rendering. Harmless for these still images beyond some
// wasted work, but the same mistake in `VideoCarouselCard` below is what
// silently broke the video/audio, so both are hoisted out on principle.
// `isCanonical` marks the first of the three DOM copies (see CAROUSEL_COPIES
// above) — the other two exist purely so the scroll-loop illusion has
// off-screen buffer to shift into, and duplicate every item's alt text
// again. Left alone, a screen reader (or any tool that reads accessible
// text/alt rather than pixels) hits every caption three times in a row.
// Hiding the non-canonical copies from the accessibility tree fixes that
// without touching the visual scroll/click mechanics, which need all three
// copies physically present in the DOM regardless.
const CarouselImageCard = ({ im, i, domIndex, isActive, isCanonical, onOpen, startIndex, goToDom, aspect, bare }) => (
  <button
    onClick={() => (isActive ? onOpen(startIndex + i) : goToDom(domIndex))}
    className="flex-none gx-selectable"
    aria-hidden={isCanonical ? undefined : true}
    tabIndex={isCanonical ? undefined : -1}
    style={{
      scrollSnapAlign: 'center',
      width: CAROUSEL_CARD_W,
      transform: isActive ? 'scale(1)' : 'scale(0.8)',
      opacity: isActive ? 1 : 0.4,
      transition: 'transform 350ms ease, opacity 350ms ease',
    }}
  >
    <div
      className={bare ? 'relative' : 'relative overflow-hidden'}
      style={bare ? { aspectRatio: aspect || CARD_ASPECT_DEFAULT } : {
        borderRadius: 16,
        background: '#05060e',
        border: '1px solid var(--glass-edge-soft)',
        aspectRatio: aspect || CARD_ASPECT_DEFAULT,
        boxShadow: isActive ? '0 20px 45px -12px rgba(0,0,0,0.55)' : 'none',
      }}
    >
      <img
        src={im.src}
        alt={isCanonical ? (im.caption || '') : ''}
        loading="lazy"
        className={`absolute inset-0 w-full h-full ${bare ? 'object-contain' : 'object-cover'}`}
        onError={hideTile}
      />
    </div>
  </button>
);

/**
 * A stat callout.
 *
 * One number, what it means, and where it came from. The source line is not
 * optional: a figure in a case study is a claim, and an unattributed claim
 * about a health outcome is worth less than no claim at all. It renders as a
 * link when a URL is given so the reader can check it in one click.
 */
const StatCallout = ({ stat }) => (
  <figure
    className="mt-6"
    style={{ maxWidth: 680, borderLeft: '2px solid var(--accent)', paddingLeft: '1.25rem' }}
  >
    <div
      className="gx-display font-semibold tracking-[-0.02em]"
      style={{ color: 'var(--ink)', fontSize: 'clamp(2.1rem, 4.6vw, 2.9rem)', lineHeight: 1.05 }}
    >
      {stat.value}
    </div>
    <div className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-dim)' }}>
      {stat.label}
    </div>
    {stat.source && (
      <figcaption className="gx-label mt-2.5">
        {stat.href ? (
          <a
            href={stat.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-[var(--ink)]"
            style={{ color: 'var(--accent)' }}
          >
            {stat.source} <TbExternalLink size={12} />
          </a>
        ) : stat.source}
      </figcaption>
    )}
  </figure>
);

const SectionPrototype = ({ proto }) => (
  <div className="mt-6" style={{ maxWidth: proto.device === false ? (proto.maxWidth || 960) : (proto.width || 340) }}>
    <div className="flex items-center justify-between mb-3">
      <div className="gx-label">{proto.label || 'Try the actual prototype'}</div>
      {proto.link && (
        <a
          href={proto.link}
          target="_blank"
          rel="noopener noreferrer"
          className="gx-label flex items-center gap-1"
          style={{ color: 'var(--accent)' }}
        >
          Open in Figma <TbExternalLink size={13} />
        </a>
      )}
    </div>
    {proto.device === false
      ? <LazyFigmaEmbed src={proto.src} height={proto.height || 'min(78vh, 760px)'} />
      : (
        <DeviceFrame width={proto.width || 340}>
          <LazyFigmaEmbed src={proto.src} bare />
        </DeviceFrame>
      )}
  </div>
);

const Carousel = ({ items, startIndex, onOpen, aspect, bare }) => {
  const n = items.length;
  const { trackRef, activeDom, active, goToDom, stepPrev, stepNext, goToLogical } = useLoopCarousel(n);

  return (
    <CarouselChrome
      n={n}
      cardW={CAROUSEL_CARD_W}
      activeCaption={items[active]?.caption}
      activeBadge={items[active]?.badge}
      active={active}
      stepPrev={stepPrev}
      stepNext={stepNext}
      goToLogical={goToLogical}
      trackRef={trackRef}
      renderCard={(i, domIndex) => (
        <CarouselImageCard
          aspect={aspect}
          bare={bare}
          key={domIndex}
          im={items[i]}
          i={i}
          domIndex={domIndex}
          isActive={domIndex === activeDom}
          isCanonical={domIndex < n}
          onOpen={onOpen}
          startIndex={startIndex}
          goToDom={goToDom}
        />
      )}
    />
  );
};

// A focused carousel for real device clips: only the centered card ever
// plays video, everything else — every other logical item, and every copy
// in the leading/trailing loop buffer — shows a static poster frame. Three
// videos autoplaying side by side (the original layout here) was too much
// at once; this keeps exactly one playing, same as the still-image carousel
// keeps exactly one in focus. The speaker button only shows up on a clip
// that's marked `hasAudio` (the radio one, the only clip actually recorded
// with meaningful sound) — no dead mute button on clips that couldn't do
// anything if you tapped it. Even that one starts muted; sound is something
// you opt into, never something that starts playing at you. Switching to a
// different card always re-mutes, so audio never silently carries over onto
// whatever you look at next.
// Hoisted for the same reason as `CarouselImageCard`: an inline definition
// would get a new identity — and force React to unmount/remount its
// `<video>` — on every render of `VideoCarousel`, which includes every time
// `muted` changes. That was the actual bug behind "the sound doesn't work":
// clicking the speaker button re-rendered with a *different* inline `Card`
// function, React tore down the playing video and mounted a brand new one to
// replace it, and the fresh element's autoplay-with-sound got silently
// blocked by the browser despite the click being a real user gesture, since
// as far as the browser could tell a new, unrelated media element had just
// asked to play audio out of nowhere. A stable component reference means the
// existing `<video>` DOM node just gets its `muted` property flipped in
// place, the same element, same playback, same gesture — which browsers do
// allow.
const VideoCarouselCard = ({ im, isActive, muted, onToggleMute, domIndex, goToDom, isCanonical }) => (
  <div
    role="button"
    tabIndex={isCanonical ? 0 : -1}
    aria-hidden={isCanonical ? undefined : true}
    aria-label={im.caption || undefined}
    onClick={() => !isActive && goToDom(domIndex)}
    onKeyDown={(e) => { if (!isActive && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); goToDom(domIndex); } }}
    className={isActive ? 'flex-none' : 'flex-none gx-selectable'}
    style={{
      scrollSnapAlign: 'center',
      width: VIDEO_CARD_W,
      cursor: isActive ? 'default' : 'pointer',
      transform: isActive ? 'scale(1)' : 'scale(0.8)',
      opacity: isActive ? 1 : 0.4,
      transition: 'transform 350ms ease, opacity 350ms ease',
    }}
  >
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 16,
        background: '#05060e',
        border: '1px solid var(--glass-edge-soft)',
        aspectRatio: '9 / 16',
        boxShadow: isActive ? '0 20px 45px -12px rgba(0,0,0,0.55)' : 'none',
      }}
    >
      {isActive ? (
        <video
          src={im.src}
          autoPlay
          muted={muted}
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={hideTile}
        />
      ) : (
        <img src={im.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      {isActive && im.hasAudio && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="!absolute bottom-3 right-3 gx-glass rounded-full w-9 h-9 grid place-items-center z-10"
        >
          {muted ? <TbVolumeOff size={16} /> : <TbVolume size={16} />}
        </button>
      )}
    </div>
  </div>
);

const VideoCarousel = ({ items }) => {
  const n = items.length;
  const { trackRef, activeDom, active, stepPrev, stepNext, goToLogical, goToDom } = useLoopCarousel(n);
  const [muted, setMuted] = useState(true);

  useEffect(() => { setMuted(true); }, [active]);

  return (
    <CarouselChrome
      n={n}
      cardW={VIDEO_CARD_W}
      activeCaption={items[active]?.caption}
      activeBadge={items[active]?.badge}
      active={active}
      stepPrev={stepPrev}
      stepNext={stepNext}
      goToLogical={goToLogical}
      trackRef={trackRef}
      renderCard={(i, domIndex) => (
        <VideoCarouselCard
          key={domIndex}
          im={items[i]}
          domIndex={domIndex}
          isActive={domIndex === activeDom}
          isCanonical={domIndex < n}
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
          goToDom={goToDom}
        />
      )}
    />
  );
};

// Doesn't set the iframe's `src` until it actually scrolls into view. Figma's
// embed pulls keyboard focus into itself once it finishes loading (breaking
// arrow-key navigation elsewhere on the page, e.g. an open lightbox above it),
// and it's a heavy third-party load anyway — no reason to pay either cost
// before the visitor has actually scrolled down to it.
/**
 * A prototype, in a phone.
 *
 * The embed on its own is whatever shape its container is, and Figma paints
 * its own backdrop into everything the frame does not fill — which is why a
 * 402x874 prototype in a 520x780 box arrived letterboxed in grey with the
 * bottom of the screen cut off. The fix is to stop fighting it: give the
 * iframe the screen's exact aspect ratio so the frame fills it edge to edge
 * and there is no backdrop left to show, then draw the hardware around it in
 * CSS. That also means the device matches the clay renders used elsewhere on
 * the page, instead of depending on the prototype's device setting in Figma.
 */
const SCREEN_W = 402;
const SCREEN_H = 874;
const BEZEL = 11;

const DeviceFrame = ({ children, width = 340 }) => {
  const inner = width - BEZEL * 2;
  return (
    <div
      style={{
        width,
        padding: BEZEL,
        borderRadius: 42,
        background: 'linear-gradient(160deg, #3a3531, #23201d 55%, #2e2a27)',
        boxShadow: '0 30px 70px -24px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: 32,
          width: inner,
          height: Math.round((inner * SCREEN_H) / SCREEN_W),
          background: '#000',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const LazyFigmaEmbed = ({ src, height = 'min(80vh, 720px)', bare }) => {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) setVisible(true); },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={bare
        ? { height: '100%', background: 'transparent' }
        : { borderRadius: 16, border: '1px solid var(--glass-edge-soft)', height, background: '#05060e' }}
    >
      {visible && (
        <iframe
          title="Figma prototype"
          src={src}
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
        />
      )}
    </div>
  );
};

// `showHero`/`showMeta` default on for the standalone desktop case-study page,
// which has no hero/title of its own. The mobile project sheet already shows
// an image and a "{year} · {org}" caption right above this component, so it
// passes both false to avoid repeating the same image and metadata twice.
const CaseStudyBody = ({ project, showHero = true, showMeta = true, indexTitle }) => {
  const cs = project?.caseStudy;
  const webglReady = useMemo(() => canWebGL(), []);
  const images = useMemo(() => collectImages(cs || {}), [cs]);
  const gallery = cs?.gallery || [];
  const [lightbox, setLightbox] = useState(null); // index into images, or null
  const lightboxRef = useRef(null);
  const zoom = useZoomPan(lightbox);

  // The dim ramp is a desktop reading aid. It is switched off for anyone who
  // asked for reduced motion, and on narrow screens where sections already
  // fill the viewport one at a time and dimming would only make the page
  // look broken mid-scroll.
  const focusOn = useMemo(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return window.matchMedia('(min-width: 1024px)').matches;
  }, []);
  const { refs: sectionRefs, activeIndex, jump } = useSectionFocus(cs?.sections?.length || 0, focusOn);

  const step = (dir) => setLightbox((i) => (i === null ? null : (i + dir + images.length) % images.length));

  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, images.length]);

  // Claim focus when the lightbox opens — a case study can also embed a
  // cross-origin Figma iframe further down the page, and once that finishes
  // loading it can silently pull focus into itself, which stops our own
  // keydown listener above from ever seeing the arrow-key/Escape presses.
  useEffect(() => {
    if (lightbox !== null) lightboxRef.current?.focus();
  }, [lightbox]);

  if (!cs) return null;
  const showVisual = showHero && !cs.hero && !!project.visual && webglReady;
  let imgCursor = 0; // walks `images` in step with section rendering below

  return (
    <>
      {/* A product shot (imageFit: 'contain') gets no forced aspect ratio, no
          accent-color background, and no darkening overlay — those all exist
          to make a cropped, letterboxed hero read cleanly, and a shot that's
          already a clean, fully-visible image needs none of it. Forcing one
          into that box either crops it (`cover`) or exposes the accent
          background as visible bars around it (`contain`); showing it at its
          own natural size sidesteps the mismatch instead of fighting it. */}
      {showHero && cs.hero && project.imageFit === 'contain' && (
        <img
          src={cs.hero}
          alt={`${project.title} — main view`}
          className="w-full h-auto block mb-10"
          style={{ borderRadius: 20, boxShadow: '0 24px 60px -20px rgba(0,0,0,0.5)' }}
          onError={hideImg}
        />
      )}
      {showHero && (cs.hero || showVisual) && project.imageFit !== 'contain' && (
        <div
          className="relative overflow-hidden mb-10"
          style={{ borderRadius: 20, background: project.accent, aspectRatio: '16 / 9' }}
        >
          {cs.hero && (
            <img
              src={cs.hero}
              alt={`${project.title} — main view`}
              className="absolute inset-0 w-full h-full object-cover"
              onError={hideImg}
            />
          )}
          {showVisual && <ProjectVisual project={project} webglReady={webglReady} />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(3,4,10,0.04), rgba(3,4,10,0.4))' }} />
        </div>
      )}

      <VisualCaption show={showVisual} />
      {showMeta && <div className="gx-label mb-8">{project.org} · {project.role} · {project.year}</div>}

      <div className="lg:grid lg:gap-14" style={{ gridTemplateColumns: '190px minmax(0, 1fr)' }}>
        <CaseStudyIndex
          title={indexTitle || project.title}
          sections={cs.sections}
          activeIndex={activeIndex}
          onJump={jump}
        />

      <div className="space-y-16" style={{ paddingBottom: focusOn ? '42vh' : 0 }}>
        {cs.sections.map((s, i) => {
          const pairStart = imgCursor;
          if (s.images) imgCursor += s.images.length;
          const carouselStart = imgCursor;
          if (s.carousel) imgCursor += s.carousel.length;
          const singleIdx = s.image ? imgCursor++ : null;
          return (
            <section
              key={i}
              ref={(el) => { sectionRefs.current[i] = el; }}
              style={{ scrollMarginTop: 88, willChange: focusOn ? 'opacity, filter' : undefined }}
            >
              <div style={{ maxWidth: 680 }}>
                <h2 className="gx-label mb-3" style={{ color: 'var(--ink-dim)' }}>{s.heading}</h2>
                {(Array.isArray(s.body) ? s.body : [s.body]).map((p, j) => (
                  <p key={j} className={`text-[15px] leading-relaxed${j > 0 ? ' mt-3' : ''}`} style={{ color: 'var(--ink-dim)' }}>
                    {p}
                  </p>
                ))}
              </div>
              {/* pairs get a wider column than the prose — at the 680 text
                  width each image in a 2-up grid shrinks to ~330px, too small
                  to read a screenshot's UI text on a laptop screen */}
              {s.images && (
                s.imagesStack ? (
                  <div style={{ maxWidth: 960 }}>
                    {s.images.map((im, k) => (
                      <CaseImage key={k} image={im} index={pairStart + k} onOpen={setLightbox} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5" style={{ maxWidth: 960 }}>
                    {s.images.map((im, k) => (
                      <CaseImage key={k} image={im} index={pairStart + k} onOpen={setLightbox} />
                    ))}
                  </div>
                )
              )}
              {s.carousel && <Carousel items={s.carousel} startIndex={carouselStart} onOpen={setLightbox} aspect={s.carouselAspect} bare={s.carouselBare} />}
              {s.videos && <VideoCarousel items={s.videos} />}
              {s.image && <CaseImage image={s.image} index={singleIdx} onOpen={setLightbox} />}
              {s.stat && <StatCallout stat={s.stat} />}
              {s.prototype && <SectionPrototype proto={s.prototype} />}
            </section>
          );
        })}
      </div>
      </div>

      {cs.quote && (
        <figure className="mt-12" style={{ maxWidth: 680 }}>
          <blockquote
            className="gx-display text-lg leading-relaxed"
            style={{ color: 'var(--ink)', borderLeft: '2px solid var(--accent)', paddingLeft: '1.25rem' }}
          >
            “{cs.quote.text}”
          </blockquote>
          <figcaption className="gx-label mt-3" style={{ paddingLeft: '1.25rem' }}>
            {cs.quote.author}{cs.quote.role ? ` · ${cs.quote.role}` : ''}
          </figcaption>
        </figure>
      )}

      {gallery.length > 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: 960 }}>
          {gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setLightbox(imgCursor + i)}
              className="relative overflow-hidden text-left group gx-selectable"
              style={{ borderRadius: 16, background: '#05060e', border: '1px solid var(--glass-edge-soft)', aspectRatio: '4 / 3' }}
            >
              <img
                src={g.src}
                alt={g.caption || ''}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={hideTile}
              />
              {/* No line clamp here. `line-clamp-2` looks right but silently
                  does nothing on this node — the clamp needs `display:
                  -webkit-box` and the absolutely-positioned span computes to
                  `flow-root`, so the only thing that took effect was the
                  `overflow: hidden`, which cut a three-line caption off
                  mid-word with no ellipsis to show for it. Letting the
                  overlay size to its own text keeps the caption whole; the
                  scrim already covers however tall it ends up, and these
                  captions carry the reasoning, so truncating them is the
                  wrong trade anyway. */}
              {g.caption && (
                <span
                  className="absolute inset-x-0 bottom-0 p-3 text-xs leading-snug"
                  style={{ background: 'linear-gradient(180deg, transparent, rgba(3,4,10,0.88) 45%)', color: 'var(--ink-dim)' }}
                >
                  {g.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {cs.figmaEmbed && (
        <div className="mt-12" style={{ maxWidth: 960 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="gx-label">Try the actual prototype</div>
            {cs.figmaEmbedLink && (
              <a
                href={cs.figmaEmbedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gx-label flex items-center gap-1"
                style={{ color: 'var(--accent)' }}
              >
                Open in Figma <TbExternalLink size={13} />
              </a>
            )}
          </div>
          <LazyFigmaEmbed src={cs.figmaEmbed} />
        </div>
      )}

      {createPortal(
      <AnimatePresence>
        {lightbox !== null && images[lightbox] && (
          <motion.div
            ref={lightboxRef}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1250] grid place-items-center p-4 sm:p-10 outline-none"
            onClick={() => setLightbox(null)}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(3,4,10,0.85)', backdropFilter: 'blur(10px)' }} />
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="!absolute top-5 right-5 gx-glass w-10 h-10 rounded-full grid place-items-center z-10"
            >
              <TbX size={20} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); step(-1); }}
                  aria-label="Previous image"
                  className="!absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 gx-glass w-10 h-10 rounded-full grid place-items-center z-10"
                >
                  <TbChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); step(1); }}
                  aria-label="Next image"
                  className="!absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 gx-glass w-10 h-10 rounded-full grid place-items-center z-10"
                >
                  <TbChevronRight size={20} />
                </button>
              </>
            )}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col items-center"
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            >
              <div
                ref={zoom.boxRef}
                className="overflow-hidden"
                style={{ borderRadius: 16, maxWidth: '90vw', maxHeight: '78vh', touchAction: 'none' }}
                {...zoom.handlers}
              >
                <img
                  ref={zoom.ref}
                  key={lightbox}
                  src={images[lightbox].src}
                  alt={images[lightbox].caption || ''}
                  draggable={false}
                  className="block select-none"
                  style={{ maxWidth: '90vw', maxHeight: '78vh', objectFit: 'contain', transformOrigin: 'center', willChange: 'transform' }}
                />
              </div>
              {(images[lightbox].caption || images[lightbox].badge) && (
                <p className="mt-4 text-sm leading-relaxed text-center" style={{ color: 'var(--ink-dim)', maxWidth: 640 }}>
                  <MediaBadge badge={images[lightbox].badge} />
                  {images[lightbox].caption}
                </p>
              )}
              <p className="mt-2 gx-label" style={{ opacity: zoom.zoomed ? 1 : 0.55 }}>
                {zoom.zoomed ? 'Drag to pan · double-click to reset' : 'Scroll to zoom · double-click to zoom in'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
};

export default CaseStudyBody;
