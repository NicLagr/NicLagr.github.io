import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import { CUBE_PALETTES } from './cubePalettes';
import { themeById, themeFont } from './cubeThemes';

// green→blue→violet environment + magenta bloom + white glints → glossy bevels
function gradientEnvTexture(pal = CUBE_PALETTES[0]) {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, s);
  grad.addColorStop(0.0, pal.env[0]);
  grad.addColorStop(0.38, pal.env[1]);
  grad.addColorStop(0.62, pal.env[2]);
  grad.addColorStop(1.0, pal.env[3]);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  g.globalCompositeOperation = 'lighter';
  const blob = g.createRadialGradient(s * 0.66, s * 0.5, 0, s * 0.66, s * 0.5, s * 0.42);
  blob.addColorStop(0, `rgba(${pal.bloom},0.4)`);
  blob.addColorStop(1, `rgba(${pal.bloom},0)`);
  g.fillStyle = blob;
  g.fillRect(0, 0, s, s);
  const glint = (x, y, r, a) => {
    const hl = g.createRadialGradient(x, y, 0, x, y, r);
    hl.addColorStop(0, `rgba(255,255,255,${a})`);
    hl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hl;
    g.fillRect(0, 0, s, s);
  };
  // soft, small glints only — big/bright ones read as a grey frosted rim
  glint(s * 0.26, s * 0.16, s * 0.1, 0.5);
  glint(s * 0.82, s * 0.72, s * 0.08, 0.4);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function auroraTexture(pal = CUBE_PALETTES[0]) {
  const s = 512;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const g = c.getContext('2d');
  g.fillStyle = '#04070f';
  g.fillRect(0, 0, s, s);
  g.globalCompositeOperation = 'lighter';
  const blob = (x, y, r, col, a) => {
    const rg = g.createRadialGradient(x * s, y * s, 0, x * s, y * s, r * s);
    rg.addColorStop(0, `rgba(${col},${a})`);
    rg.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = rg;
    g.fillRect(0, 0, s, s);
  };
  // dim — the content plane now covers the front face, so the core only needs
  // to tint the beveled rim (a brighter core showed as a hard ring around the plane)
  const A = pal.aurora;
  blob(0.32, 0.24, 0.4, A[0], 0.42);
  blob(0.72, 0.3, 0.38, A[1], 0.36);
  blob(0.66, 0.58, 0.44, A[2], 0.2);
  blob(0.42, 0.64, 0.42, A[3], 0.4);
  blob(0.52, 0.92, 0.36, A[4], 0.36);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export const FACES = [
  { id: 'work', label: 'Work', pos: [0, 0.66, 1.09], w: 1.5, h: 0.42, o: 'h' },
  { id: 'about', label: 'About', pos: [0.66, 0, 1.09], w: 0.42, h: 1.5, o: 'vR' },
  { id: 'play', label: 'Play', pos: [0, -0.66, 1.09], w: 1.5, h: 0.42, o: 'h' },
  { id: 'contact', label: 'Contact', pos: [-0.66, 0, 1.09], w: 0.42, h: 1.5, o: 'vL' },
];

function labelTexture(text, orient, theme = 'glass') {
  const horizontal = orient === 'h';
  const cw = horizontal ? 1024 : 256;
  const ch = horizontal ? 256 : 1024;
  const c = document.createElement('canvas');
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, cw, ch);
  ctx.translate(cw / 2, ch / 2);
  if (orient === 'vL') ctx.rotate(Math.PI / 2);
  else if (orient === 'vR') ctx.rotate(-Math.PI / 2);
  // VT323 has no weights and runs small; other faces use a 600 weight
  ctx.font = theme === 'retro'
    ? `124px ${themeFont(theme)}`
    : `600 104px ${themeFont(theme)}`;
  try { ctx.letterSpacing = '2px'; } catch (e) { /* ignore */ }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillText(text.toUpperCase(), 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

// Apply a visual theme in place (no rebuild). Everything comes from the theme
// registry (cubeThemes): the shell material (glass / metal / wireframe / emissive
// glow), the renderer pixel ratio (< 1 → chunky nearest-neighbour pixels), and
// the cube-label font.
function applyThemeStyle(themeId, renderer, cube, labels, size, crisp = false) {
  const t = themeById(themeId);
  const mm = t.material;
  // low-pixel themes (retro) render chunky, but that makes an open menu's text
  // unreadable — so when a dial/section is focused (crisp) we render at full
  // resolution; the idle cube keeps its pixelated look.
  const lowPix = t.pixel < 1 && !crisp;
  const pr = lowPix ? t.pixel : Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pr);
  renderer.setSize(size, size);
  renderer.domElement.style.imageRendering = lowPix ? 'pixelated' : 'auto';

  const m = cube.material;
  m.color.set(mm.color || '#ffffff'); // gunmetal for chrome, white elsewhere
  m.transmission = mm.transmission;
  m.opacity = mm.opacity;
  m.roughness = mm.roughness;
  m.metalness = mm.metalness;
  m.iridescence = mm.iridescence;
  m.clearcoat = mm.clearcoat;
  m.wireframe = mm.wireframe;
  m.envMapIntensity = mm.envMapIntensity;
  if (mm.emissive) { m.emissive.set(mm.emissive); m.emissiveIntensity = mm.emissiveIntensity; }
  else { m.emissive.set('#000000'); m.emissiveIntensity = 0; }
  // opaque metal/blueprint can skip alpha blending; everything else composites
  m.transparent = mm.opacity < 1 || mm.transmission > 0;
  m.needsUpdate = true; // transmission/wireframe toggles change the shader program

  (labels || []).forEach((l) => {
    const f = l.userData.face;
    if (l.material.map) l.material.map.dispose();
    l.material.map = labelTexture(f.label, f.o, themeId);
    l.material.needsUpdate = true;
  });
}

// Front face flat region = edge - 2*cornerRadius = 2.1 - 0.6 = 1.5. Size the
// content plane to fill it exactly: any smaller and the brighter aurora core
// peeks out as a hard-edged frame; the seam then sits right at the bevel start
// where the curvature hides it.
const FACE_INNER = 1.5;

// easings for the power-on flex
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const CubeNavigator = ({ onNavigate, size = 380, started = true, onStart, activeFace = null, highlight = null, showCaption = true, content = null, onHotspot, selectedIndex = 0, onHoverIndex, onHoverFace, palette = CUBE_PALETTES[0], faces = null, motion = 'lively', theme = 'glass' }) => {
  const facesList = faces || FACES;
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cubeMeshRef = useRef(null);
  const labelsRef = useRef(null);
  const sizeRef = useRef(size);
  const themeRef = useRef(theme);
  const motionRef = useRef(motion);
  const paletteRef = useRef(palette);
  const sceneRef = useRef(null);
  const pmremRef = useRef(null);
  const envRTRef = useRef(null);
  const coreMatRef = useRef(null);
  const captionRef = useRef(null);
  const hintRef = useRef(null);
  const activeRef = useRef(activeFace);
  const startedRef = useRef(started);
  const highlightRef = useRef(highlight);
  const onHotspotRef = useRef(onHotspot);
  const onHoverIndexRef = useRef(onHoverIndex);
  const onHoverFaceRef = useRef(onHoverFace);
  const onStartRef = useRef(onStart);
  const planeRef = useRef(null);
  const contentRef = useRef(content);
  const scrollRef = useRef(0);       // current (eased)
  const scrollTargetRef = useRef(0); // target (wheel / selection)
  const repeatYRef = useRef(1);
  const selIndexRef = useRef(selectedIndex);
  useEffect(() => { activeRef.current = activeFace; }, [activeFace]);
  useEffect(() => { motionRef.current = motion; }, [motion]);
  useEffect(() => { startedRef.current = started; }, [started]);
  useEffect(() => { highlightRef.current = highlight; }, [highlight]);
  useEffect(() => { onHotspotRef.current = onHotspot; }, [onHotspot]);
  useEffect(() => { onHoverIndexRef.current = onHoverIndex; }, [onHoverIndex]);
  useEffect(() => { onHoverFaceRef.current = onHoverFace; }, [onHoverFace]);
  useEffect(() => { onStartRef.current = onStart; }, [onStart]);

  // Resize LIVE (no scene rebuild → no boot-flex replay) so the cube can grow
  // when a settings dial opens. Camera aspect stays 1 (square), so only the
  // renderer + mount box need updating; the mount div reads `size` directly.
  useEffect(() => {
    sizeRef.current = size;
    const r = rendererRef.current;
    // retro renders at a low pixel ratio, so re-apply it here (plain setSize
    // would reset to the default ratio and lose the pixelation)
    if (r) applyThemeStyle(themeRef.current, r, cubeMeshRef.current, labelsRef.current, size, !!activeRef.current);
  }, [size]);

  // Swap the visual theme LIVE (material + pixelation + label font), no rebuild.
  useEffect(() => {
    themeRef.current = theme;
    const r = rendererRef.current;
    const cube = cubeMeshRef.current;
    if (r && cube) applyThemeStyle(theme, r, cube, labelsRef.current, sizeRef.current, !!activeRef.current);
  }, [theme]);

  // reset scroll AND re-render crisp when a dial opens (so a pixelated theme's
  // menu text is legible), chunky again when it closes.
  useEffect(() => {
    scrollRef.current = 0; scrollTargetRef.current = 0;
    const r = rendererRef.current;
    if (r && cubeMeshRef.current) applyThemeStyle(themeRef.current, r, cubeMeshRef.current, labelsRef.current, sizeRef.current, !!activeFace);
  }, [activeFace]);

  // Live-swap the skin (palette) without a full rebuild / boot replay. On mount
  // the refs are still null (the main effect builds the scene), so this no-ops;
  // later palette changes update the env map + aurora core in place.
  useEffect(() => {
    paletteRef.current = palette;
    const scene = sceneRef.current;
    const pmrem = pmremRef.current;
    const coreMat = coreMatRef.current;
    if (!scene || !pmrem || !coreMat) return;
    const gradTex = gradientEnvTexture(palette);
    const newRT = pmrem.fromEquirectangular(gradTex);
    scene.environment = newRT.texture;
    gradTex.dispose();
    if (envRTRef.current) envRTRef.current.dispose();
    envRTRef.current = newRT;
    const prevMap = coreMat.map;
    coreMat.map = auroraTexture(palette);
    coreMat.needsUpdate = true;
    if (prevMap) prevMap.dispose();
  }, [palette]);

  // keep the selected entry in view (eased in the animation loop)
  useEffect(() => {
    selIndexRef.current = selectedIndex;
    const c = contentRef.current;
    const repeatY = repeatYRef.current;
    if (!c || repeatY >= 1) return; // fits — nothing to scroll
    const hs = c.hotspots[selectedIndex];
    if (!hs) return;
    const win = repeatY * c.height;    // visible window height (logical px)
    const span = c.height - win;       // scrollable range
    let top = span * scrollTargetRef.current;
    const m = 70;
    if (hs.y < top + m) top = hs.y - m;
    else if (hs.y + hs.h > top + win - m) top = hs.y + hs.h - win + m;
    scrollTargetRef.current = Math.max(0, Math.min(1, top / span));
  }, [selectedIndex]);

  // build / swap the inner content texture when the section changes
  useEffect(() => {
    contentRef.current = content;
    const plane = planeRef.current;
    if (!plane) return;
    if (content && content.canvas) {
      const prev = plane.material.map;
      const tex = new THREE.CanvasTexture(content.canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      const repeatY = Math.min(1, content.width / content.height);
      repeatYRef.current = repeatY;
      tex.repeat.set(1, repeatY);
      // preserve the current scroll position across selection redraws
      tex.offset.set(0, (1 - repeatY) * (1 - scrollRef.current));
      plane.material.map = tex;
      plane.visible = true;
      if (prev) prev.dispose(); // frees the dummy on first swap, or the previous section
    } else {
      // keep the last map bound (so USE_UV stays defined); just hide the plane
      plane.visible = false;
    }
  }, [content]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizeRef.current, sizeRef.current);
    rendererRef.current = renderer;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    mount.appendChild(renderer.domElement);
    // quick fade so the first frame doesn't pop — kept short so the power-on
    // flex plays in full view rather than under a long fade
    mount.style.opacity = '0';
    requestAnimationFrame(() => {
      mount.style.transition = 'opacity 240ms ease';
      mount.style.opacity = '1';
    });
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.touchAction = 'pan-y';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const gradTex = gradientEnvTexture(paletteRef.current);
    const envRT = pmrem.fromEquirectangular(gradTex);
    scene.environment = envRT.texture;
    sceneRef.current = scene;
    pmremRef.current = pmrem;
    envRTRef.current = envRT;

    const group = new THREE.Group();
    scene.add(group);

    const edge = 2.1;

    // dark aurora inner core (menu backdrop, refracts through the glass)
    const auroraMap = auroraTexture(paletteRef.current);
    const coreEdge = edge * 0.94;
    const coreGeo = new RoundedBoxGeometry(coreEdge, coreEdge, coreEdge, 5, 0.22);
    const coreMat = new THREE.MeshBasicMaterial({ map: auroraMap });
    coreMatRef.current = coreMat;
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // CONTENT plane — sits ON the front face (not behind it), so the text is
    // crisp (transmission would blur it) and never shows a hard rectangle: the
    // shader feathers its edges to alpha 0 so it melts into the gel/aurora rim.
    const contentMat = new THREE.MeshBasicMaterial({
      toneMapped: false,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    // dummy 1px map so USE_UV is defined at first compile (our feather reads uv)
    const dummyMap = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
    dummyMap.needsUpdate = true;
    contentMat.map = dummyMap;
    contentMat.onBeforeCompile = (shader) => {
      shader.vertexShader = 'varying vec2 vFeatherUv;\n' + shader.vertexShader.replace(
        '#include <uv_vertex>',
        '#include <uv_vertex>\n\tvFeatherUv = uv;'
      );
      shader.fragmentShader = 'varying vec2 vFeatherUv;\n' + shader.fragmentShader.replace(
        '#include <map_fragment>',
        '#include <map_fragment>\n'
        + '\tfloat _fx = smoothstep(0.0, 0.055, vFeatherUv.x) * smoothstep(0.0, 0.055, 1.0 - vFeatherUv.x);\n'
        + '\tfloat _fy = smoothstep(0.0, 0.075, vFeatherUv.y) * smoothstep(0.0, 0.075, 1.0 - vFeatherUv.y);\n'
        + '\tdiffuseColor.a *= _fx * _fy;'
      );
    };
    const contentPlane = new THREE.Mesh(new THREE.PlaneGeometry(FACE_INNER, FACE_INNER), contentMat);
    contentPlane.position.set(0, 0, 1.052); // on the front surface (edge/2 = 1.05)
    contentPlane.visible = false;
    contentPlane.renderOrder = 5; // above glass + labels
    group.add(contentPlane);
    planeRef.current = contentPlane;

    // clear liquid-glass shell
    const glass = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      thickness: 0.14,        // thin → gentle refraction, text stays legible
      roughness: 0.03,
      metalness: 0,
      ior: 1.22,              // low index → minimal bending / no double-image
      iridescence: 0.3,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [200, 600],
      clearcoat: 1,
      clearcoatRoughness: 0.1,   // slightly softer rim reflection (less harsh grey)
      color: new THREE.Color('#ffffff'),
      envMapIntensity: 1.25,     // was 2.4 — bright env made the bevel read as a grey band
      specularIntensity: 1,
      transparent: true,
    });
    const cubeGeo = new RoundedBoxGeometry(edge, edge, edge, 6, 0.3);
    const cube = new THREE.Mesh(cubeGeo, glass);
    cube.renderOrder = 2;
    group.add(cube);
    cubeMeshRef.current = cube;

    const labels = facesList.map((f) => {
      const mat = new THREE.MeshBasicMaterial({
        map: labelTexture(f.label, f.o, themeRef.current),
        transparent: true,
        opacity: 0.94,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(f.w, f.h), mat);
      plane.position.set(f.pos[0], f.pos[1], f.pos[2]);
      plane.renderOrder = 4;
      plane.userData.face = f;
      group.add(plane);
      return plane;
    });
    labelsRef.current = labels;
    // apply the saved visual theme (pixelation + solid shell for retro) up front
    applyThemeStyle(themeRef.current, renderer, cube, labels, sizeRef.current);

    // ---- interaction ----
    let dragging = false;
    let moved = false;
    let last = { x: 0, y: 0 };
    let phase = 0;
    let dragYaw = 0;
    let dragPitch = 0;
    let hovered = null;
    let focus = 0;
    let spin = 0;
    let autoSpin = 0;
    let jitVel = 0; // unstable motion: a springy random-walk twitch
    let jitPos = 0;
    let wasActive = false;
    let curEmph = null;
    // power-on: a GameCube-style flex. The cube spins in WARPED (non-uniform
    // squash/stretch, like the logo flexing), then springs elastically into a
    // clean cube as the multi-turn spin decelerates into the resting menu pose;
    // labels resolve only once it has settled. Driven by a time-based bootT
    // (0 -> 1 over BOOT_DUR seconds) so the choreography runs at a consistent
    // speed regardless of frame rate.
    const BOOT_DUR = reduce ? 0 : 1.9; // seconds
    let bootStart = null;

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const toNdc = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const pickLabel = (e) => {
      toNdc(e);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(labels, false)[0];
      return hit ? hit.object : null;
    };
    // index of the entry under the pointer (-1 if none), accounting for scroll
    const contentIndexAt = (e) => {
      const c = contentRef.current;
      if (!c || !contentPlane.visible) return -1;
      toNdc(e);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObject(contentPlane, false)[0];
      if (!hit || !hit.uv) return -1;
      const repeatY = repeatYRef.current;
      const offsetY = (1 - repeatY) * (1 - scrollRef.current);
      const texV = hit.uv.y * repeatY + offsetY;
      const lx = hit.uv.x * c.width;
      const ly = (1 - texV) * c.height; // logical y from top
      return c.hotspots.findIndex((h) => lx >= h.x && lx <= h.x + h.w && ly >= h.y && ly <= h.y + h.h);
    };
    const hitContent = (e) => {
      const c = contentRef.current;
      const i = contentIndexAt(e);
      if (i >= 0 && onHotspotRef.current) onHotspotRef.current(c.hotspots[i].action);
    };

    const setHover = (plane) => {
      if (plane === hovered) return;
      hovered = plane;
      renderer.domElement.style.cursor = hovered && !activeRef.current ? 'pointer' : 'grab';
      // let the host sync its section label to the face under the mouse — and
      // clear it (null) when the mouse leaves a face, so the descriptor only
      // shows while actively hovering
      if (!activeRef.current && onHoverFaceRef.current) {
        onHoverFaceRef.current(plane ? plane.userData.face.id : null);
      }
    };

    const el = renderer.domElement;
    const onDown = (e) => {
      if (!startedRef.current) return; // compressed: click-to-start only
      if (activeRef.current) return;
      dragging = true;
      moved = false;
      last = { x: e.clientX, y: e.clientY };
      el.style.cursor = 'grabbing';
      if (hintRef.current) hintRef.current.style.opacity = '0';
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      last = { x: e.clientX, y: e.clientY };
      dragYaw += dx * 0.008;
      dragPitch = Math.max(-0.6, Math.min(0.6, dragPitch + dy * 0.008));
    };
    const onUp = () => {
      dragging = false;
      el.style.cursor = hovered && !activeRef.current ? 'pointer' : 'grab';
    };
    const onHoverMove = (e) => {
      if (!startedRef.current) { el.style.cursor = 'pointer'; return; }
      if (dragging) return;
      if (activeRef.current) {
        const i = contentIndexAt(e);
        el.style.cursor = i >= 0 ? 'pointer' : 'default';
        if (i >= 0 && onHoverIndexRef.current) onHoverIndexRef.current(i);
        return;
      }
      setHover(pickLabel(e));
    };
    const onLeave = () => { if (!dragging) setHover(null); };
    const onClick = (e) => {
      if (moved) return;
      if (!startedRef.current) { if (onStartRef.current) onStartRef.current(); return; }
      if (activeRef.current) { hitContent(e); return; }
      const plane = pickLabel(e);
      if (plane && onNavigate) onNavigate(plane.userData.face.id);
    };
    const onWheel = (e) => {
      if (!activeRef.current) return;
      if (repeatYRef.current >= 1) return; // content fits, nothing to scroll
      e.preventDefault();
      scrollTargetRef.current = Math.max(0, Math.min(1, scrollTargetRef.current + e.deltaY * 0.0009));
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('pointermove', onHoverMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('click', onClick);
    el.addEventListener('wheel', onWheel, { passive: false });

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => { visible = entries[0]?.isIntersecting ?? true; },
      { threshold: 0.05 }
    );
    io.observe(mount);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      if (!reduce) phase += 0.01;

      const active = !!activeRef.current;
      if (active && !wasActive) spin = Math.PI * 2;
      wasActive = active;
      focus += ((active ? 1 : 0) - focus) * 0.09;
      spin *= 0.93;
      if (!dragging) { dragYaw *= 0.92; dragPitch *= 0.92; }

      // ---- power-on flex (warp -> spin warped -> spring into a clean cube) ----
      // before power-on the cube sits COMPRESSED (a small squashed puck, gently
      // breathing to invite a click); clicking unfurls it via the flex below, in
      // sync with the startup chime
      if (bootStart === null) {
        if (startedRef.current) bootStart = performance.now();
        else {
          const pulse = reduce ? 1 : 1 + Math.sin(phase * 1.3) * 0.06;
          group.scale.set(0.6 * pulse, 0.13 * pulse, 0.6 * pulse); // thin wafer
          group.rotation.set(-0.16, reduce ? 0.2 : Math.sin(phase * 0.5) * 0.3, 0);
          labels.forEach((l) => { l.material.opacity += (0 - l.material.opacity) * 0.2; });
          el.style.cursor = 'pointer';
          renderer.render(scene, camera);
          return;
        }
      }
      const bt = BOOT_DUR ? Math.min(1, (performance.now() - bootStart) / (BOOT_DUR * 1000)) : 1;
      // overall size grows in with a small overshoot
      const grow = 0.3 + 0.7 * easeOutBack(bt);
      // elastic warp: a ring-down (guaranteed 0 at bt=1) that drives a
      // non-uniform squash/stretch so the cube looks like it's flexing. Slow
      // enough that the flex stays visible through the spin, not just frame 1.
      const warp = reduce ? 0 : Math.exp(-2.2 * bt) * (1 - bt * bt);
      const w1 = Math.sin(bt * Math.PI * 4.5);
      const w2 = Math.sin(bt * Math.PI * 3.2 + 1.1);
      const amp = 0.34 * warp;
      group.scale.set(
        grow * (1 + amp * w1),
        grow * (1 - amp * w1),
        grow * (1 + amp * 0.6 * w2)
      );
      // decelerating multi-turn spin that lands exactly on the rest yaw
      const introYaw = reduce ? 0 : (1 - easeOutCubic(bt)) * Math.PI * 2 * 2.5;
      const introPitch = reduce ? 0 : warp * 0.22 * w2;

      // ---- idle motion modes (fade out under focus so an open menu is still) --
      const mMode = motionRef.current;
      let swayMul = 1;   // scales the base sway
      let extraYaw = 0;  // mode-specific rotation added on top
      let extraPitch = 0;
      let breathe = 1;   // mode-specific scale multiplier
      if (mMode === 'calm') swayMul = 0.25;
      else if (mMode === 'spin') { if (!reduce) autoSpin += 0.012; }
      else if (mMode === 'drift') {
        // (autoSpin is unwound to a clean rest orientation below)
        // slow, wide floating orbit on both axes
        swayMul = 1.5;
        extraYaw = reduce ? 0 : Math.sin(phase * 0.27) * 0.17;
        extraPitch = reduce ? 0 : Math.cos(phase * 0.21) * 0.09;
      } else if (mMode === 'pulse') {
        // rhythmic breathing bounce, minimal sway
        swayMul = 0.5;
        breathe = reduce ? 1 : 1 + Math.sin(phase * 2.4) * 0.055;
      } else if (mMode === 'unstable') {
        // glitchy twitch: a damped random walk that springs back to center
        swayMul = 0.4;
        if (!reduce) {
          jitVel += (Math.random() - 0.5) * 0.9;
          jitVel *= 0.7;          // damp velocity
          jitPos = jitPos * 0.86 + jitVel * 0.012; // spring toward 0
          extraYaw = jitPos + Math.sin(phase * 11.3) * 0.014;
          extraPitch = jitPos * 0.6 + Math.sin(phase * 9.1) * 0.011;
          breathe = 1 + Math.sin(phase * 19) * 0.012;
        }
      }
      // Leaving Spin: ease the accumulated yaw to the NEAREST full turn (a clean
      // front-on rest) so switching motion never freezes the cube at a random
      // angle. Easing to the nearest multiple of 2π takes the short way and keeps
      // the rendered orientation continuous (no snap).
      if (mMode !== 'spin' && autoSpin !== 0) {
        const TWO_PI = Math.PI * 2;
        const nearest = Math.round(autoSpin / TWO_PI) * TWO_PI;
        autoSpin += (nearest - autoSpin) * 0.08;
        if (Math.abs(autoSpin - nearest) < 1e-3) autoSpin = nearest;
      }
      const swayY = 0.2 + (reduce ? 0 : Math.sin(phase) * 0.1 * swayMul);
      const swayX = -0.22 + (reduce ? 0 : Math.sin(phase * 0.7) * 0.04 * swayMul);
      const yaw = swayY * (1 - focus) + dragYaw + (reduce ? 0 : spin) + introYaw + (reduce ? 0 : (autoSpin + extraYaw) * (1 - focus));
      const pitch = swayX * (1 - focus) + -0.05 * focus + dragPitch + introPitch + (reduce ? 0 : extraPitch * (1 - focus));
      group.rotation.set(pitch, yaw, 0);
      // pulse/unstable breathe: fold onto the scale the boot flex set above
      // (fresh each frame, so this multiply never accumulates). Fades under focus.
      const bMul = 1 + (breathe - 1) * (1 - focus);
      if (bMul !== 1) group.scale.multiplyScalar(bMul);

      // labels stay hidden through the warped spin and resolve only as the cube
      // settles, so we never flash mirrored/back-facing or warped text
      const introReveal = reduce ? 1 : Math.max(0, Math.min(1, (bt - 0.75) / 0.2));

      // labels
      const emphId = hovered ? hovered.userData.face.id : highlightRef.current;
      labels.forEach((l) => {
        const isE = l.userData.face.id === emphId;
        const target = (1 - focus) * introReveal * (isE ? 1 : emphId ? 0.66 : 0.94);
        l.material.opacity += (target - l.material.opacity) * 0.2;
        const sc = isE && !active ? 1.08 : 1;
        l.scale.x += (sc - l.scale.x) * 0.2;
        l.scale.y = l.scale.x;
      });
      if (emphId !== curEmph) {
        curEmph = emphId;
        const f = facesList.find((x) => x.id === emphId);
        if (f && captionRef.current) captionRef.current.textContent = f.label;
      }

      // content scroll window (eased toward wheel / selection target)
      if (contentPlane.visible && contentPlane.material.map) {
        scrollRef.current += (scrollTargetRef.current - scrollRef.current) * 0.18;
        const repeatY = repeatYRef.current;
        contentPlane.material.map.offset.y = (1 - repeatY) * (1 - scrollRef.current);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointermove', onHoverMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('click', onClick);
      el.removeEventListener('wheel', onWheel);
      if (envRTRef.current) { envRTRef.current.dispose(); envRTRef.current = null; }
      pmrem.dispose();
      gradTex.dispose();
      sceneRef.current = null;
      pmremRef.current = null;
      coreMatRef.current = null;
      glass.dispose();
      cube.geometry.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      auroraMap.dispose();
      if (contentPlane.material.map) contentPlane.material.map.dispose();
      contentPlane.geometry.dispose();
      contentPlane.material.dispose();
      planeRef.current = null;
      labels.forEach((l) => { l.geometry.dispose(); l.material.map.dispose(); l.material.dispose(); });
      renderer.dispose();
      rendererRef.current = null;
      cubeMeshRef.current = null;
      labelsRef.current = null;
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []); // build once; size changes are handled live by the resize effect above

  return (
    <div className="flex flex-col items-center select-none">
      <div ref={mountRef} style={{ width: size, height: size }} aria-hidden="true" />
      {showCaption && (
        <div className="mt-1 text-center">
          <div className="gx-display text-2xl font-semibold leading-none">
            <span ref={captionRef}>Work</span>
          </div>
          <div ref={hintRef} className="gx-mono text-[11px] mt-2 transition-opacity duration-500" style={{ color: 'var(--ink-faint)' }}>
            hover a face · click to open
          </div>
        </div>
      )}
    </div>
  );
};

export default CubeNavigator;
