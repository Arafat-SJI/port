import { useEffect } from "react";
import { NAV_ITEMS } from "@/data/portfolio";

export const SECTION_SCROLL_MARGIN = 15;

export function useScrollSpy(containerRef, setActiveHref, isProgrammaticScrollRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      if (isProgrammaticScrollRef?.current) return;

      const scrollPos = container.scrollTop + SECTION_SCROLL_MARGIN + 1;
      let active = NAV_ITEMS[0].href;

      for (const item of NAV_ITEMS) {
        const section = container.querySelector(item.href);
        if (!section) continue;

        const sectionTop =
          section.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop;

        if (scrollPos >= sectionTop) {
          active = item.href;
        }
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
  }, [containerRef, setActiveHref, isProgrammaticScrollRef]);
}
