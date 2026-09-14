import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Decorative placeholder visual for projects whose real screenshots can't be
 * shown (internal/proprietary work). An abstract wireframe globe with a few
 * pulsing data-point markers, not real geography, so it never reads as an
 * actual screenshot of the app it's standing in for.
 */
const GlobeVisual = ({ colors = ['#b69dff', '#7aa2ff'] }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const size = () => ({ w: mount.clientWidth || 400, h: mount.clientHeight || 220 });
    const { w, h } = size();

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 0.25, 3.3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.x = 0.3;
    scene.add(group);

    const colorA = new THREE.Color(colors[0]);
    const colorB = new THREE.Color(colors[1]);

    // graticule wireframe, not real geography
    const sphereGeo = new THREE.SphereGeometry(1, 26, 18);
    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    const wire = new THREE.LineSegments(
      wireGeo,
      new THREE.LineBasicMaterial({ color: colorB, transparent: true, opacity: 0.32 })
    );
    group.add(wire);

    // faint solid core so the wireframe reads as a sphere, not a cage
    const coreGeo = new THREE.SphereGeometry(0.985, 32, 22);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x05060e, transparent: true, opacity: 0.55 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // a handful of pulsing "data node" points, evenly spread (Fibonacci sphere)
    const nodeCount = 14;
    const nodes = [];
    const dotGeo = new THREE.SphereGeometry(0.017, 8, 8);
    for (let i = 0; i < nodeCount; i += 1) {
      const phi = Math.acos(1 - 2 * ((i + 0.5) / nodeCount));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      const dotMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? colorA : colorB });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, y, z);
      group.add(dot);
      nodes.push({ mesh: dot, mat: dotMat, phase: (i / nodeCount) * Math.PI * 2 });
    }

    let raf;
    let visible = true;
    const io = new IntersectionObserver((es) => { visible = es[0]?.isIntersecting ?? true; }, { threshold: 0.02 });
    io.observe(mount);

    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      t += reduce ? 0.0012 : 0.004;
      group.rotation.y = t;
      nodes.forEach((n) => {
        const s = 1 + 0.35 * Math.sin(t * 6 + n.phase);
        n.mesh.scale.setScalar(s);
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
      sphereGeo.dispose();
      wireGeo.dispose();
      wire.material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      dotGeo.dispose();
      nodes.forEach((n) => n.mat.dispose());
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [colors]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
};

export default GlobeVisual;
