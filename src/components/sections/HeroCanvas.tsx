"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // Skip 3D on mobile — use CSS gradient fallback for performance
    if (isMobile) return;

    const isBot = /bot|crawler|spider|google|bing|yahoo|perplexity|gptbot|claudebot/i.test(
      navigator.userAgent
    );
    if (isBot) return;

    const testCanvas = document.createElement("canvas");
    const hasWebGL = !!(
      testCanvas.getContext("webgl2") || testCanvas.getContext("webgl")
    );
    if (!hasWebGL) return;

    let cancelled = false;

    // Delay Three.js load to let LCP paint first
    const loadTimer = setTimeout(() => {
    import("three").then((THREE) => {
      if (cancelled || !container) return;

      // ── Scene ──
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0f0f0f, 0.035);

      const camera = new THREE.PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 6);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x0f0f0f, 1);
      container.appendChild(renderer.domElement);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";

      // ── Soft floating orbs (warm, organic feel) — fewer on mobile ──
      const orbCount = isMobile ? 6 : 12;
      const orbs: THREE.Mesh[] = [];
      const orbData: { speed: number; radius: number; offset: number; yAmp: number }[] = [];

      for (let i = 0; i < orbCount; i++) {
        const size = 0.08 + Math.random() * 0.15;
        const geo = new THREE.SphereGeometry(size, isMobile ? 8 : 16, isMobile ? 8 : 16);
        const mat = new THREE.MeshBasicMaterial({
          color: i % 3 === 0 ? 0xc5a368 : i % 3 === 1 ? 0xd4b87a : 0xa8894f,
          transparent: true,
          opacity: 0.15 + Math.random() * 0.25,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const angle = (i / orbCount) * Math.PI * 2;
        const radius = 1.5 + Math.random() * 2.5;
        mesh.position.set(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 2
        );
        scene.add(mesh);
        orbs.push(mesh);
        orbData.push({
          speed: 0.15 + Math.random() * 0.25,
          radius,
          offset: angle,
          yAmp: 0.3 + Math.random() * 0.5,
        });
      }

      // ── Elegant ring (subtle, luxury feel) ──
      const ringGeo = new THREE.TorusGeometry(2.8, 0.008, isMobile ? 8 : 16, isMobile ? 60 : 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc5a368,
        transparent: true,
        opacity: 0.2,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI * 0.45;
      scene.add(ring);

      // ── Second ring ──
      const ring2Geo = new THREE.TorusGeometry(3.5, 0.005, isMobile ? 8 : 16, isMobile ? 60 : 120);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0xd4b87a,
        transparent: true,
        opacity: 0.1,
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI * 0.6;
      ring2.rotation.y = Math.PI * 0.15;
      scene.add(ring2);

      // ── Warm dust particles ──
      const particleCount = isMobile ? 25 : 60;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        particlePos[i] = (Math.random() - 0.5) * 14;
      }
      particleGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePos, 3)
      );
      const particleMat = new THREE.PointsMaterial({
        color: 0xc5a368,
        size: 0.02,
        transparent: true,
        opacity: 0.3,
      });
      scene.add(new THREE.Points(particleGeo, particleMat));

      // ── Soft ambient glow (center) ──
      const glowGeo = new THREE.SphereGeometry(1.2, isMobile ? 16 : 32, isMobile ? 16 : 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xc5a368,
        transparent: true,
        opacity: 0.04,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      scene.add(glow);

      // ── Mouse tracking ──
      let mouseX = 0;
      let mouseY = 0;
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      };
      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      // ── Animation ──
      let rafId: number;
      const clock = new THREE.Clock();

      const animate = () => {
        if (document.visibilityState === "hidden") {
          rafId = requestAnimationFrame(animate);
          return;
        }

        const t = clock.getElapsedTime();

        // Float orbs gently
        orbs.forEach((orb, i) => {
          const d = orbData[i];
          orb.position.x = Math.cos(t * d.speed + d.offset) * d.radius;
          orb.position.y += Math.sin(t * d.speed * 1.3) * 0.001 * d.yAmp;
        });

        // Slow ring rotation
        ring.rotation.z = t * 0.04;
        ring2.rotation.z = -t * 0.025;

        // Glow pulse
        glowMat.opacity = 0.03 + Math.sin(t * 0.5) * 0.015;

        // Camera follow mouse
        camera.position.x += (mouseX * 0.25 - camera.position.x) * 0.015;
        camera.position.y += (-mouseY * 0.25 - camera.position.y) * 0.015;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };

      animate();

      // ── Resize ──
      let resizeTimer: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!container) return;
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
        }, 150);
      };
      window.addEventListener("resize", handleResize, { passive: true });

      // ── Cleanup ──
      cleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimer);

        renderer.dispose();
        orbs.forEach((o) => {
          o.geometry.dispose();
          (o.material as THREE.MeshBasicMaterial).dispose();
        });
        ringGeo.dispose();
        ringMat.dispose();
        ring2Geo.dispose();
        ring2Mat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        glowGeo.dispose();
        glowMat.dispose();

        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    });
    }, 1500); // Delay Three.js by 1.5s

    return () => {
      clearTimeout(loadTimer);
      cancelled = true;
      cleanupRef.current?.();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
}
