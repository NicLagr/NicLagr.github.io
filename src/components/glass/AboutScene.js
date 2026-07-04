import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { motion, AnimatePresence } from 'framer-motion';
import { ABOUT_PANELS, LOTTIE } from './aboutPanels';
import sfx from './sfx';

const MODEL_URL = process.env.PUBLIC_URL + '/models/nicolo.glb';
// the model imports facing +X; -90° about Y turns it to face the camera
const BASE_Y = -Math.PI / 2;
// how far the head turns toward a hovered panel (offsets from BASE_Y / level)
const LOOK = {
  top: { yaw: 0, pitch: -0.34 },
  right: { yaw: 0.5, pitch: -0.04 },
  bottom: { yaw: 0, pitch: 0.26 },
  left: { yaw: -0.5, pitch: -0.04 },
};
// where each panel sits around the model on screen
const PLACE = {
  top: 'top-3 left-1/2 -translate-x-1/2',
  right: 'right-3 top-1/2 -translate-y-1/2',
  bottom: 'bottom-3 left-1/2 -translate-x-1/2',
  left: 'left-3 top-1/2 -translate-y-1/2',
};

/**
 * Personal About centerpiece: a 3D bust of Nicolò that turns to look at
 * whichever of the four surrounding panels the cursor is over. Clicking a panel
 * opens a short, personal blurb. Raw three.js (matches CubeNavigator; the
 * project is React 18, no react-three-fiber). Desktop only — the parent gates
 * this behind a WebGL / hover check and lazy-loads it.
 */
const AboutScene = () => {
  const mountRef = useRef(null);
  const hoverRef = useRef(null); // hovered panel `pos` or null
  const mouseRef = useRef({ x: 0, y: 0 }); // normalized pointer over the scene
  const readyRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(null); // opened panel id
  const [lottie, setLottie] = useState(false);
  const [hoverId, setHoverId] = useState(null);

  const activePanel = useMemo(() => ABOUT_PANELS.find((p) => p.id === active), [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const size = () => ({ w: mount.clientWidth || 600, h: mount.clientHeight || 600 });
    const { w, h } = size();

    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // soft, matte lighting so the skin doesn't read glossy/wet
    scene.add(new THREE.HemisphereLight(0xcdd8ff, 0x1a1c30, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(1.2, 1.6, 2.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa9bcff, 0.55);
    fill.position.set(-2, 0.6, -1);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x8fb4ff, 0.7);
    rim.position.set(0, 1.4, -2.5);
    scene.add(rim);

    const bust = new THREE.Group();
    scene.add(bust);

    // Liquid-glass material — the same look as the cube: transmissive glass with
    // clearcoat and iridescence, plus a faint inner glow so it keeps a slightly
    // holographic feel. Glass needs an environment to refract/reflect, so we
    // PMREM a small colored gradient in the site palette (blue → violet + glints).
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512; envCanvas.height = 256;
    const ectx = envCanvas.getContext('2d');
    const grd = ectx.createLinearGradient(0, 0, 512, 256);
    grd.addColorStop(0.0, '#0a2e22');
    grd.addColorStop(0.3, '#2f9e6e');  // green
    grd.addColorStop(0.55, '#3a6fd0'); // blue
    grd.addColorStop(0.8, '#8a4fd8');  // violet
    grd.addColorStop(1.0, '#c24bd0');  // magenta
    ectx.fillStyle = grd; ectx.fillRect(0, 0, 512, 256);
    ectx.fillStyle = 'rgba(255,255,255,0.95)'; ectx.beginPath(); ectx.arc(150, 70, 22, 0, 7); ectx.fill();
    ectx.fillStyle = 'rgba(130,235,255,0.85)'; ectx.beginPath(); ectx.arc(380, 150, 40, 0, 7); ectx.fill();
    ectx.fillStyle = 'rgba(120,255,180,0.7)'; ectx.beginPath(); ectx.arc(270, 200, 30, 0, 7); ectx.fill();
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envRT = pmrem.fromEquirectangular(envTex);
    scene.environment = envRT.texture;

    let holoShader = null;
    let auroraLo = -0.5;
    let auroraHi = 0.5;
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a1630'),
      transmission: 0,
      roughness: 0.14,
      metalness: 0,
      iridescence: 0.65,
      iridescenceIOR: 1.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5,
      emissive: new THREE.Color('#000000'),
      emissiveIntensity: 1,
      transparent: false,
    });
    // Aurora glow from within (violet low → blue → green high) plus a cyan rim,
    // so the glass reads like the cube's aurora-core-in-glass look.
    glassMat.onBeforeCompile = (shader) => {
      shader.uniforms.uAurLo = { value: auroraLo };
      shader.uniforms.uAurHi = { value: auroraHi };
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nuniform float uAurLo;\nuniform float uAurHi;\nuniform float uTime;')
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          float H = max(0.0001, uAurHi - uAurLo);
          float aurT = clamp((vWPos.y - uAurLo) / H, 0.0, 1.0);
          // vertical aurora ramp: violet/magenta (low) -> blue -> green (high)
          vec3 ramp = mix(vec3(0.55,0.15,0.78), vec3(0.18,0.45,1.00), smoothstep(0.0,0.5,aurT));
          ramp = mix(ramp, vec3(0.15,0.92,0.55), smoothstep(0.5,1.0,aurT));
          // concentrated glowing pockets so the core has depth, like the cube
          vec2 auv = vec2(vWPos.x, vWPos.y) / H;
          float bA = exp(-14.0*dot(auv-vec2(-0.18,0.30), auv-vec2(-0.18,0.30)));
          float bB = exp(-11.0*dot(auv-vec2(0.16,0.02), auv-vec2(0.16,0.02)));
          float bC = exp(-15.0*dot(auv-vec2(-0.04,-0.28), auv-vec2(-0.04,-0.28)));
          vec3 blobs = vec3(0.10,0.95,0.50)*bA + vec3(0.25,0.55,1.0)*bB + vec3(0.80,0.20,0.95)*bC;
          float aurF = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 1.8);
          float aurPulse = 0.92 + 0.08 * sin(uTime * 0.8 + vWPos.y * 2.0);
          totalEmissiveRadiance += ramp * (0.16 + 0.5 * aurF) * aurPulse;   // dim interior, brighter rim
          totalEmissiveRadiance += blobs * 0.7 * aurPulse;                  // glowing pockets
          totalEmissiveRadiance += vec3(0.4,0.9,1.0) * pow(aurF, 1.4) * 0.7;`);
      holoShader = shader;
    };

    let raf;
    let disposed = false;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        // turn the bust into liquid glass
        model.traverse((o) => {
          if (o.isMesh) {
            if (o.material) {
              const mats = Array.isArray(o.material) ? o.material : [o.material];
              mats.forEach((m) => { m?.map?.dispose?.(); m?.dispose?.(); });
            }
            o.material = glassMat;
          }
        });
        // center the model at the origin, then lift so the face sits mid-frame
        const box = new THREE.Box3().setFromObject(model);
        const c = box.getCenter(new THREE.Vector3());
        const s = box.getSize(new THREE.Vector3());
        model.position.sub(c);
        auroraLo = -s.y * 0.5;
        auroraHi = s.y * 0.5;
        bust.add(model);
        bust.rotation.y = BASE_Y;

        const maxd = Math.max(s.x, s.y, s.z);
        camera.position.set(0, s.y * 0.12, maxd * 2.45);
        camera.lookAt(0, s.y * 0.1, 0);

        readyRef.current = true;
        setReady(true);
      },
      undefined,
      (err) => { console.error('AboutScene model load failed', err); }
    );

    // pointer tracking over the scene for the idle look-follow
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseRef.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    mount.addEventListener('pointermove', onMove);

    let visible = true;
    const io = new IntersectionObserver((es) => { visible = es[0]?.isIntersecting ?? true; }, { threshold: 0.02 });
    io.observe(mount);

    let phase = 0;
    let curYaw = 0;
    let curPitch = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible || !readyRef.current) return;
      phase += 0.01;
      if (holoShader) {
        holoShader.uniforms.uAurLo.value = auroraLo;
        holoShader.uniforms.uAurHi.value = auroraHi;
        holoShader.uniforms.uTime.value = phase;
      }

      let tYaw;
      let tPitch;
      const hovered = hoverRef.current;
      if (hovered && LOOK[hovered]) {
        tYaw = LOOK[hovered].yaw;
        tPitch = LOOK[hovered].pitch;
      } else {
        // idle: gently follow the cursor, plus a slow breath of movement
        tYaw = mouseRef.current.x * 0.28 + (reduce ? 0 : Math.sin(phase * 0.6) * 0.03);
        tPitch = mouseRef.current.y * 0.16 + (reduce ? 0 : Math.sin(phase * 0.5) * 0.02);
      }
      curYaw += (tYaw - curYaw) * 0.09;
      curPitch += (tPitch - curPitch) * 0.09;
      bust.rotation.y = BASE_Y + curYaw;
      bust.rotation.x = curPitch;
      const bob = reduce ? 0 : Math.sin(phase * 0.8) * 0.004;
      bust.position.y = bob;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const d = size();
      camera.aspect = d.w / d.h;
      camera.updateProjectionMatrix();
      renderer.setSize(d.w, d.h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      mount.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      glassMat.dispose();
      envTex.dispose();
      envRT.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose?.();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            m?.map?.dispose?.();
            m?.normalMap?.dispose?.();
            m?.roughnessMap?.dispose?.();
            m?.dispose?.();
          });
        }
      });
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  const setHover = (pos, id) => {
    hoverRef.current = pos;
    setHoverId(id);
    if (pos && sfx.aim) sfx.aim();
  };
  const openPanel = (id) => { if (sfx.open) sfx.open(); setActive(id); };

  return (
    <div className="relative w-full" style={{ height: 'min(72vh, 620px)' }}>
      {/* 3D mount */}
      <div ref={mountRef} className="absolute inset-0" style={{ cursor: 'default' }} />

      {/* soft loading shimmer until the model is ready */}
      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="gx-label" style={{ opacity: 0.5 }}>Loading…</span>
        </div>
      )}

      {/* the four surrounding panels — glassmorphic pucks so they read as
          buttons. Hidden while a modal is open: the puck's transform makes a
          compositing layer, and the overlay's backdrop-filter clips a visible
          rectangle around it otherwise. */}
      {ABOUT_PANELS.map((p) => {
        const cx = PLACE[p.pos].includes('-translate-x');
        const cy = PLACE[p.pos].includes('-translate-y');
        const on = hoverId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onMouseEnter={() => setHover(p.pos, p.id)}
            onMouseLeave={() => setHover(null, null)}
            onFocus={() => setHover(p.pos, p.id)}
            onBlur={() => setHover(null, null)}
            onClick={() => openPanel(p.id)}
            className={`gx-glass gx-selectable !absolute z-10 rounded-full transition-all duration-200 ${PLACE[p.pos]} ${activePanel || lottie ? 'opacity-0 invisible pointer-events-none' : ''}`}
            style={{
              transform: `${cx ? 'translateX(-50%)' : ''} ${cy ? 'translateY(-50%)' : ''} translateY(${on ? -1 : 0}px) scale(${on ? 1.06 : 1})`,
              padding: '0.5rem 1.15rem',
              fontFamily: '"General Sans", system-ui, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: on ? 'var(--ink)' : 'var(--ink-dim)',
              background: on ? 'var(--glass-fill-strong)' : 'var(--glass-fill)',
              cursor: 'pointer',
            }}
            aria-label={`Open ${p.label}`}
          >
            {p.label}
          </button>
        );
      })}

      {/* Lottie easter egg */}
      <button
        type="button"
        onClick={() => { if (sfx.open) sfx.open(); setLottie(true); }}
        className="gx-glass !absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full grid place-items-center"
        aria-label="Meet Lottie"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ opacity: 0.8 }}>
          <g fill="var(--ink-dim)">
            <ellipse cx="12" cy="16" rx="4.4" ry="3.6" />
            <ellipse cx="6.2" cy="11" rx="1.9" ry="2.5" />
            <ellipse cx="17.8" cy="11" rx="1.9" ry="2.5" />
            <ellipse cx="9.2" cy="7.2" rx="1.7" ry="2.3" />
            <ellipse cx="14.8" cy="7.2" rx="1.7" ry="2.3" />
          </g>
        </svg>
      </button>

      {/* expanded panel */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(4,5,14,0.55)', backdropFilter: 'blur(6px)' }} />
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.2, 0.9, 0.25, 1] }}
              className="gx-glass-strong relative w-full overflow-hidden"
              style={{ maxWidth: 460, borderRadius: 24 }}
            >
              {activePanel.image && (
                <div className="relative h-40 sm:h-48" style={{ background: 'var(--accent-grad)' }}>
                  <img
                    src={process.env.PUBLIC_URL + activePanel.image}
                    alt={activePanel.heading}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ imageRendering: activePanel.pixel ? 'pixelated' : 'auto' }}
                    onError={(e) => { e.currentTarget.closest('div').style.display = 'none'; }}
                  />
                </div>
              )}
              <button
                onClick={() => setActive(null)}
                className="!absolute top-3 right-3 gx-glass w-8 h-8 rounded-full grid place-items-center z-10"
                aria-label="Close"
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>×</span>
              </button>
              <div className="p-6">
                <div className="gx-label mb-2">{activePanel.label}</div>
                <h3 className="gx-display font-semibold text-2xl mb-3">{activePanel.heading}</h3>
                {activePanel.body.map((t, i) => (
                  <p key={i} className={`leading-relaxed ${i ? 'mt-3' : ''}`} style={{ color: 'var(--ink-dim)' }}>{t}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lottie card */}
      <AnimatePresence>
        {lottie && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLottie(false)}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(4,5,14,0.55)', backdropFilter: 'blur(6px)' }} />
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="gx-glass-strong relative overflow-hidden text-center"
              style={{ maxWidth: 320, borderRadius: 24 }}
            >
              <div className="relative h-48" style={{ background: 'var(--accent-grad)' }}>
                <img
                  src={process.env.PUBLIC_URL + LOTTIE.image}
                  alt={LOTTIE.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.closest('div').style.display = 'none'; }}
                />
              </div>
              <div className="p-6">
                <h3 className="gx-display font-semibold text-xl mb-2">{LOTTIE.name}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--ink-dim)' }}>{LOTTIE.body}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutScene;
