"use client";

import { useEffect, useRef } from "react";
import ContactTerminal from "@/components/ide/ContactTerminal";

/** Fallback reveal runway until the terminal height is measured */
const REVEAL_DISTANCE_FALLBACK_PX = 280;
/** Fixed gap between Mentorship bottom and terminal top */
const CONTENT_GAP_PX = 60;
/** Wheel delta multiplier inside the reveal zone (desktop) */
const WHEEL_DAMPING = 0.42;
/** Visual follow smoothing (desktop) */
const LERP = 0.14;
/** Only then may the terminal capture clicks/taps */
const INTERACTIVE_PROGRESS = 0.9;

/** Invisible runway inside the scroll area — drives reveal progress. */
export function ContactScrollTrack({ trackRef }) {
  return (
    <>
      <div className="shrink-0" style={{ height: CONTENT_GAP_PX }} aria-hidden />
      <div
        id="contact"
        ref={trackRef}
        className="w-full shrink-0 scroll-mt-[30px] pointer-events-none"
        style={{ height: REVEAL_DISTANCE_FALLBACK_PX }}
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
  contactContent,
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
    const mobileMq = window.matchMedia("(max-width: 767px)");
    let isMobile = mobileMq.matches;

    let targetProgress = reducedMotion ? 1 : 0;
    let visualProgress = reducedMotion ? 1 : 0;
    let rafId = 0;
    let running = false;
    let trackSyncQueued = false;

    // Dock stays non-interactive so transparent overflow never steals scroll/touch.
    dock.style.pointerEvents = "none";

    const syncTrackToTerminal = () => {
      const height = panel.offsetHeight;
      if (height > 0) {
        track.style.height = `${height}px`;
      }
    };

    const queueTrackSync = () => {
      if (trackSyncQueued) return;
      trackSyncQueued = true;
      requestAnimationFrame(() => {
        trackSyncQueued = false;
        syncTrackToTerminal();
        syncTarget();
      });
    };

    const apply = (p) => {
      const v = Math.min(1, Math.max(0, p));
      const eased = v * v * (3 - 2 * v);
      panel.style.transform = `translate3d(0, ${((1 - eased) * 100).toFixed(3)}%, 0)`;
      panel.style.opacity = (0.12 + eased * 0.88).toFixed(3);
      // Panel stays pointer-events:none so chrome never blocks hit-testing.
      // Form controls opt in when nearly open; wheel is handled via capture below.
      panel.classList.toggle("is-terminal-interactive", eased >= INTERACTIVE_PROGRESS);
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
      if (reducedMotion || isMobile) {
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

    const scrollByDelta = (deltaY, damp = 1) => {
      const max = Math.max(0, container.scrollHeight - container.clientHeight);
      container.scrollTop = Math.max(
        0,
        Math.min(max, container.scrollTop + deltaY * damp)
      );
      syncTarget();
    };

    const pointerOverPanel = (clientX, clientY) => {
      if (visualProgress < 0.08) return false;
      const rect = panel.getBoundingClientRect();
      if (rect.height < 4 || rect.width < 4) return false;
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    };

    const onWheel = (e) => {
      // Touch / small screens use native scroll only — wheel hijack causes sticky scroll.
      if (isMobile) return;

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
      scrollByDelta(e.deltaY, WHEEL_DAMPING);
    };

    // Terminal is a sibling overlay — wheel never reaches <main> when the cursor is
    // over it (even with pointer-events:none). Capture and drive main scroll instead.
    const onWindowWheel = (e) => {
      if (isMobile) return;
      if (!pointerOverPanel(e.clientX, e.clientY)) return;

      e.preventDefault();
      e.stopPropagation();
      scrollByDelta(e.deltaY, 1);
    };

    const onResize = () => {
      isMobile = mobileMq.matches;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        running = false;
      }
      queueTrackSync();
    };

    const onMobileChange = () => {
      isMobile = mobileMq.matches;
      if (isMobile && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        running = false;
      }
      syncTarget();
    };

    syncTrackToTerminal();
    apply(visualProgress);
    syncTarget();

    const resizeObserver = new ResizeObserver(() => {
      queueTrackSync();
    });
    resizeObserver.observe(panel);

    container.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("wheel", onWindowWheel, { passive: false, capture: true });
    container.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("resize", onResize);
    mobileMq.addEventListener("change", onMobileChange);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("wheel", onWindowWheel, { capture: true });
      container.removeEventListener("scroll", syncTarget);
      window.removeEventListener("resize", onResize);
      mobileMq.removeEventListener("change", onMobileChange);
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
        className="w-full will-change-transform bg-surface-container-lowest pointer-events-none [&.is-terminal-interactive_a]:pointer-events-auto [&.is-terminal-interactive_button]:pointer-events-auto [&.is-terminal-interactive_input]:pointer-events-auto [&.is-terminal-interactive_textarea]:pointer-events-auto [&.is-terminal-interactive_label]:pointer-events-auto"
        style={{
          transform: "translate3d(0, 100%, 0)",
          opacity: 0.12,
        }}
      >
        <ContactTerminal onCollapse={onCollapse} content={contactContent} />
      </div>
    </div>
  );
}
