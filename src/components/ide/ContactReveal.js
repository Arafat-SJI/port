"use client";

import { useEffect, useRef } from "react";
import ContactTerminal from "@/components/ide/ContactTerminal";

/** Scroll distance through which the terminal eases fully open */
const REVEAL_DISTANCE_PX = 280;
/** Wheel delta multiplier inside the reveal zone */
const WHEEL_DAMPING = 0.42;
/** Visual follow smoothing */
const LERP = 0.14;

/** Invisible runway inside the scroll area — drives reveal progress. */
export function ContactScrollTrack({ trackRef }) {
  return (
    <>
      <div className="h-[60px] shrink-0" aria-hidden />
      <div
        id="contact"
        ref={trackRef}
        className="w-full shrink-0 scroll-mt-[15px] pointer-events-none"
        style={{ height: REVEAL_DISTANCE_PX }}
        aria-label="Let's Connect"
      />
    </>
  );
}

/**
 * Terminal docked to the bottom of the editor column (outside the scrollport).
 * Full width to the chat panel — no scrollbar gutter gap.
 */
export default function ContactReveal({
  onCollapse,
  scrollContainerRef,
  trackRef,
}) {
  const dockRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    const track = trackRef?.current;
    const dock = dockRef.current;
    const panel = panelRef.current;
    if (!container || !track || !dock || !panel) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let targetProgress = reducedMotion ? 1 : 0;
    let visualProgress = reducedMotion ? 1 : 0;
    let rafId = 0;
    let running = false;

    const apply = (p) => {
      const v = Math.min(1, Math.max(0, p));
      const eased = v * v * (3 - 2 * v);
      panel.style.transform = `translate3d(0, ${((1 - eased) * 100).toFixed(3)}%, 0)`;
      panel.style.opacity = (0.12 + eased * 0.88).toFixed(3);
      dock.style.pointerEvents = eased > 0.05 ? "auto" : "none";
    };

    const readTargetFromScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const raw = (containerRect.bottom - trackRect.top) / Math.max(1, track.offsetHeight);
      return Math.min(1, Math.max(0, raw));
    };

    const tick = () => {
      const diff = targetProgress - visualProgress;
      if (Math.abs(diff) < 0.0008) {
        visualProgress = targetProgress;
        apply(visualProgress);
        running = false;
        rafId = 0;
        return;
      }
      visualProgress += diff * (reducedMotion ? 1 : LERP);
      apply(visualProgress);
      rafId = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (reducedMotion) {
        visualProgress = targetProgress;
        apply(visualProgress);
        return;
      }
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const syncTarget = () => {
      targetProgress = readTargetFromScroll();
      kick();
    };

    const remainingScroll = () =>
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const onWheel = (e) => {
      const remaining = remainingScroll();
      const runway = track.offsetHeight;
      const inRunway = remaining <= runway + 1;
      const entering = e.deltaY > 0 && remaining <= runway + 48 && remaining > runway;

      if (!inRunway && !entering) return;

      if (e.deltaY > 0 && remaining <= 0.5) {
        e.preventDefault();
        return;
      }
      if (e.deltaY < 0 && remaining >= runway - 0.5) {
        return;
      }

      e.preventDefault();
      const max = Math.max(0, container.scrollHeight - container.clientHeight);
      container.scrollTop = Math.max(
        0,
        Math.min(max, container.scrollTop + e.deltaY * WHEEL_DAMPING)
      );
      syncTarget();
    };

    apply(visualProgress);
    syncTarget();
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("resize", syncTarget);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("scroll", syncTarget);
      window.removeEventListener("resize", syncTarget);
    };
  }, [scrollContainerRef, trackRef]);

  return (
    <div
      ref={dockRef}
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 overflow-hidden"
      aria-hidden={false}
    >
      <div
        ref={panelRef}
        className="w-full will-change-transform bg-surface-container-lowest"
        style={{
          transform: "translate3d(0, 100%, 0)",
          opacity: 0.12,
        }}
      >
        <ContactTerminal onCollapse={onCollapse} />
      </div>
    </div>
  );
}
