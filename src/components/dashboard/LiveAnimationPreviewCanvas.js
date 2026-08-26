"use client";

import { useEffect, useRef } from "react";

function createParticles(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.5 + Math.random() * 1.4,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -0.06 - Math.random() * 0.18,
    a: 0.2 + Math.random() * 0.5,
  }));
}

function createStars(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.4 + Math.random() * 1.2,
    tw: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.8,
  }));
}

function createOrbs(count, w, h) {
  return Array.from({ length: count }, (_, i) => ({
    cx: w * (0.2 + (i % 3) * 0.28),
    cy: h * (0.3 + (i % 2) * 0.28),
    radius: 36 + i * 14,
    orbit: 18 + i * 10,
    phase: (i / count) * Math.PI * 2,
    speed: 0.00022 + i * 0.00005,
    color:
      i % 3 === 0
        ? "rgba(196,181,253,0.2)"
        : i % 3 === 1
          ? "rgba(103,232,249,0.18)"
          : "rgba(173,198,255,0.18)",
  }));
}

/** Compact live-animation canvas for dashboard UI preview (no ExtensionsProvider). */
export default function LiveAnimationPreviewCanvas({ variant = "aurora", className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let particles = [];
    let stars = [];
    let orbs = [];

    const syncSize = () => {
      w = canvas.clientWidth || 320;
      h = canvas.clientHeight || 140;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(28, w, h);
      stars = createStars(36, w, h);
      orbs = createOrbs(4, w, h);
    };

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const drawAurora = (t) => {
      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 4; i++) {
        const y = h * (0.18 + i * 0.16);
        const amp = 14 + i * 6;
        const grad = ctx.createLinearGradient(0, y - 40, 0, y + 40);
        const hue = 170 + i * 28;
        grad.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
        grad.addColorStop(0.5, `hsla(${hue}, 85%, 62%, ${0.16 - i * 0.02})`);
        grad.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const yy =
            y +
            Math.sin(x * 0.01 + t * 0.00035 + i) * amp +
            Math.sin(x * 0.004 - t * 0.0002 + i * 1.4) * (amp * 0.45);
          if (x === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const drawParticles = () => {
      ctx.fillStyle = "rgba(8,10,14,0.35)";
      ctx.fillRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        ctx.beginPath();
        ctx.fillStyle = `rgba(173,198,255,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawWaves = (t) => {
      ctx.fillStyle = "#0a0e16";
      ctx.fillRect(0, 0, w, h);
      const colors = [
        "rgba(96,165,250,0.18)",
        "rgba(52,211,153,0.14)",
        "rgba(125,211,252,0.16)",
      ];
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const base = h * (0.4 + i * 0.14);
        for (let x = 0; x <= w; x += 5) {
          const y =
            base +
            Math.sin(x * 0.008 + t * 0.00045 + i * 1.7) * (12 + i * 6) +
            Math.cos(x * 0.003 - t * 0.00028) * 7;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
      }
    };

    const drawOrbits = (t) => {
      ctx.fillStyle = "#090b12";
      ctx.fillRect(0, 0, w, h);
      for (const orb of orbs) {
        const angle = orb.phase + t * orb.speed;
        const x = orb.cx + Math.cos(angle) * orb.orbit;
        const y = orb.cy + Math.sin(angle * 0.85) * (orb.orbit * 0.55);
        const g = ctx.createRadialGradient(x, y, 0, x, y, orb.radius);
        g.addColorStop(0, orb.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawConstellation = (t) => {
      ctx.fillStyle = "#06080e";
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = 0.35 + Math.sin(t * 0.0015 * s.speed + s.tw) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(226,232,240,${twinkle})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(125,211,252,0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy < 90 * 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const s of stars) {
        s.x += Math.sin(t * 0.0002 + s.tw) * 0.04;
        s.y += Math.cos(t * 0.00018 + s.tw) * 0.03;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;
      }
    };

    const drawers = {
      aurora: drawAurora,
      particles: drawParticles,
      waves: drawWaves,
      orbits: drawOrbits,
      constellation: drawConstellation,
    };

    const tick = (t) => {
      (drawers[variant] || drawAurora)(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
