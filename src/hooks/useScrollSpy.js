import { useEffect } from "react";

/** Offset used when clicking a nav item / search result to position the section. */
export const SECTION_SCROLL_MARGIN = 30;

/**
 * Spy line distance from the top of the scrollport.
 * Larger = earlier tab switch (header still clearly on screen, not yet leaving).
 */
const SECTION_SPY_OFFSET_PX = 100;

export function useScrollSpy(containerRef, setActiveHref, isProgrammaticScrollRef, navItems) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !navItems?.length) return;

    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      if (isProgrammaticScrollRef?.current) return;

      const containerRect = container.getBoundingClientRect();
      // Activate when the section header reaches this line (still on-screen).
      const probeY = containerRect.top + SECTION_SPY_OFFSET_PX;

      let active = navItems[0].href;

      for (const item of navItems) {
        const section = container.querySelector(item.href);
        if (!section) continue;

        // Prefer the visible section title so activation tracks the header, not padding.
        const marker = section.querySelector("h1, h2") ?? section;
        if (marker.getBoundingClientRect().top <= probeY) {
          active = item.href;
        }
      }

      // Keep last section active when pinned to the bottom of the scroll area.
      const distanceFromBottom =
        container.scrollHeight - (container.scrollTop + container.clientHeight);
      if (distanceFromBottom <= 2) {
        active = navItems[navItems.length - 1].href;
      }

      setActiveHref((prev) => (prev === active ? prev : active));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [containerRef, setActiveHref, isProgrammaticScrollRef, navItems]);
}
