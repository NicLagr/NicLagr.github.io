import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectVisual, { canWebGL, VisualCaption } from './ProjectVisual';
import { TbX, TbChevronLeft, TbChevronRight, TbExternalLink, TbVolume, TbVolumeOff } from './icons';
import MediaBadge from './MediaBadge';

const ease = [0.2, 0.9, 0.25, 1];

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
      className="relative overflow-hidden block w-full text-left group gx-selectable"
      style={{ borderRadius: 16, background: '#05060e', border: '1px solid var(--glass-edge-soft)' }}
    >
      <img
        src={image.src}
        alt={image.caption || ''}
        loading="lazy"
        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
        onError={hideFigure}
      />
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
const CarouselImageCard = ({ im, i, domIndex, isActive, isCanonical, onOpen, startIndex, goToDom }) => (
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
      className="relative overflow-hidden"
      style={{
        borderRadius: 16,
        background: '#05060e',
        border: '1px solid var(--glass-edge-soft)',
        aspectRatio: '1080 / 1240',
        boxShadow: isActive ? '0 20px 45px -12px rgba(0,0,0,0.55)' : 'none',
      }}
    >
      <img
        src={im.src}
        alt={isCanonical ? (im.caption || '') : ''}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        onError={hideTile}
      />
    </div>
  </button>
);

const Carousel = ({ items, startIndex, onOpen }) => {
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
const LazyFigmaEmbed = ({ src }) => {
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
      style={{ borderRadius: 16, border: '1px solid var(--glass-edge-soft)', height: 'min(80vh, 720px)', background: '#05060e' }}
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
const CaseStudyBody = ({ project, showHero = true, showMeta = true }) => {
  const cs = project?.caseStudy;
  const webglReady = useMemo(() => canWebGL(), []);
  const images = useMemo(() => collectImages(cs || {}), [cs]);
  const gallery = cs?.gallery || [];
  const [lightbox, setLightbox] = useState(null); // index into images, or null
  const lightboxRef = useRef(null);

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

      <div className="space-y-8">
        {cs.sections.map((s, i) => {
          const pairStart = imgCursor;
          if (s.images) imgCursor += s.images.length;
          const carouselStart = imgCursor;
          if (s.carousel) imgCursor += s.carousel.length;
          const singleIdx = s.image ? imgCursor++ : null;
          return (
            <section key={i}>
              <div style={{ maxWidth: 680 }}>
                <h2 className="gx-display text-xl font-semibold tracking-[-0.01em] mb-2.5" style={{ color: 'var(--ink)' }}>
                  {s.heading}
                </h2>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5" style={{ maxWidth: 960 }}>
                  {s.images.map((im, k) => (
                    <CaseImage key={k} image={im} index={pairStart + k} onOpen={setLightbox} />
                  ))}
                </div>
              )}
              {s.carousel && <Carousel items={s.carousel} startIndex={carouselStart} onOpen={setLightbox} />}
              {s.videos && <VideoCarousel items={s.videos} />}
              {s.image && <CaseImage image={s.image} index={singleIdx} onOpen={setLightbox} />}
            </section>
          );
        })}
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
              <motion.img
                key={lightbox}
                src={images[lightbox].src}
                alt={images[lightbox].caption || ''}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease }}
                className="block"
                style={{ borderRadius: 16, maxWidth: '90vw', maxHeight: '75vh', objectFit: 'contain' }}
              />
              {(images[lightbox].caption || images[lightbox].badge) && (
                <p className="mt-4 text-sm leading-relaxed text-center" style={{ color: 'var(--ink-dim)', maxWidth: 640 }}>
                  <MediaBadge badge={images[lightbox].badge} />
                  {images[lightbox].caption}
                </p>
              )}
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
