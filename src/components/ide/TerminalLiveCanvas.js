"use client";

import { useEffect, useRef } from "react";

function makeParticles(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.7 + Math.random() * 1.4,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -0.12 - Math.random() * 0.28,
    a: 0.18 + Math.random() * 0.35,
  }));
}

function makeStars(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.6 + Math.random() * 1.2,
    tw: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 0.9,
  }));
}

/** Lightweight live motion for terminal skins only. */
export default function TerminalLiveCanvas({ variant }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!variant) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let particles = [];
    let stars = [];
    let reduced = false;

    const sync = () => {
      const parent = canvas.parentElement;
      w = parent?.clientWidth || canvas.clientWidth || 1;
      h = parent?.clientHeight || canvas.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = makeParticles(36, w, h);
      stars = makeStars(28, w, h);
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      reduced = media.matches;
    };
    onMotion();
    media.addEventListener?.("change", onMotion);

    const ro = new ResizeObserver(sync);
    ro.observe(canvas.parentElement || canvas);
    sync();

    const drawParticles = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -8) {
            p.y = h + 8;
            p.x = Math.random() * w;
          }
          if (p.x < -8) p.x = w + 8;
          if (p.x > w + 8) p.x = -8;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(220,226,232,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawConstellation = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.2 + Math.sin(t * 0.0014 * s.speed + s.tw) * 0.22;
        ctx.beginPath();
        ctx.fillStyle = `rgba(220,226,232,${tw})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(200,208,216,0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy < 110 * 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      if (!reduced) {
        for (const s of stars) {
          s.x += Math.sin(t * 0.00018 + s.tw) * 0.04;
          s.y += Math.cos(t * 0.00016 + s.tw) * 0.03;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
        }
      }
    };

    const drawTwinkle = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.12 + Math.sin(t * 0.002 * s.speed + s.tw) * 0.28;
        ctx.beginPath();
        ctx.fillStyle = `rgba(220,226,232,${Math.max(0.08, tw)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (t) => {
      if (variant === "pulse") drawParticles();
      else if (variant === "scan") drawConstellation(t);
      else drawTwinkle(t);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      media.removeEventListener?.("change", onMotion);
    };
  }, [variant]);

  if (!variant) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="terminal-live-layer pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
