import { useEffect } from "react";

export function useTabStripScroll(tabStripRef, activeHref) {
  useEffect(() => {
    const strip = tabStripRef.current;
    if (!strip) return;
    const activeTab = strip.querySelector(`[data-tab="${activeHref}"]`);
    activeTab?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [activeHref, tabStripRef]);

  useEffect(() => {
    const strip = tabStripRef.current;
    if (!strip) return;

    const onWheel = (e) => {
      if (e.deltaX !== 0) {
        strip.scrollLeft += e.deltaX;
        e.preventDefault();
        return;
      }
      if (e.deltaY !== 0) {
        strip.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    strip.addEventListener("wheel", onWheel, { passive: false });
    return () => strip.removeEventListener("wheel", onWheel);
  }, [tabStripRef]);
}
