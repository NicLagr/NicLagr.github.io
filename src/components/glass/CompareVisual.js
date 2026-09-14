import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * Decorative placeholder visual for scenario-comparison tools with no real
 * screenshots to show. A small cluster of bars rising and falling around one
 * fixed, brighter "baseline" bar, with a thin reference line at its height,
 * the actual mechanic (compare options against a constant), not a literal UI.
 */
const BARS = [
  { x: -0.9, base: 0.55, baseline: false },
  { x: -0.42, base: 0.85, baseline: false },
  { x: 0.06, base: 1.0, baseline: true },
  { x: 0.54, base: 0.7, baseline: false },
  { x: 1.02, base: 1.15, baseline: false },
];

const CompareVisual = ({ colors = ['#b69dff', '#5ee7c6'] }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const size = () => ({ w: mount.clientWidth || 400, h: mount.clientHeight || 220 });
    const { w, h } = size();

    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    camera.position.set(0.35, 0.95, 4.3);
    camera.lookAt(0.05, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const colorA = new THREE.Color(colors[0]);
    const colorB = new THREE.Color(colors[1]);
    const baselineColor = new THREE.Color('#f4f2ff');

    const barGeo = new RoundedBoxGeometry(0.34, 1, 0.34, 3, 0.05);
    const bars = BARS.map((b, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: b.baseline ? baselineColor : (i % 2 === 0 ? colorA : colorB),
        transparent: true,
        opacity: b.baseline ? 0.92 : 0.5,
      });
      const mesh = new THREE.Mesh(barGeo, mat);
      mesh.position.x = b.x;
      mesh.scale.y = b.base;
      mesh.position.y = (b.base * 1) / 2;
      group.add(mesh);
      return { mesh, mat, ...b, phase: i * 1.3 };
    });

    // thin reference line at the baseline's height, spanning the cluster
    const baselineBar = BARS.find((b) => b.baseline);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.35, baselineBar.base, 0),
      new THREE.Vector3(1.35, baselineBar.base, 0),
    ]);
    const line = new THREE.Line(
      lineGeo,
      new THREE.LineDashedMaterial({ color: baselineColor, transparent: true, opacity: 0.45, dashSize: 0.08, gapSize: 0.06 })
    );
    line.computeLineDistances();
    group.add(line);

    let raf;
    let visible = true;
    const io = new IntersectionObserver((es) => { visible = es[0]?.isIntersecting ?? true; }, { threshold: 0.02 });
    io.observe(mount);

    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      t += reduce ? 0.0015 : 0.006;
      group.rotation.y = 0.24 + Math.sin(t * 0.4) * 0.06;
      bars.forEach((b) => {
        if (b.baseline) return;
        const h = b.base + Math.sin(t * 1.6 + b.phase) * 0.16;
        b.mesh.scale.y = h;
        b.mesh.position.y = h / 2;
      });
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
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      barGeo.dispose();
      bars.forEach((b) => b.mat.dispose());
      lineGeo.dispose();
      line.material.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [colors]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
};

export default CompareVisual;
