import { SECTION_SCROLL_MARGIN } from "@/hooks/useScrollSpy";

export function getScrollTopForElement(element, container, align = "center") {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const elementTop = elementRect.top - containerRect.top + container.scrollTop;
  const containerHeight = container.clientHeight;
  const elementHeight = elementRect.height;

  if (align === "start") {
    return elementTop - SECTION_SCROLL_MARGIN;
  }

  return elementTop - (containerHeight - elementHeight) / 2;
}

export function scrollContainerToElement(container, element, align = "center") {
  if (!container || !element) return;

  const top = getScrollTopForElement(element, container, align);
  const max = Math.max(0, container.scrollHeight - container.clientHeight);
  container.scrollTo({ top: Math.max(0, Math.min(top, max)), behavior: "auto" });
}

export function findSearchScrollTarget(container, matchHref) {
  const section = container.querySelector(matchHref);
  if (!section) return null;

  return (
    section.querySelector('[data-search-active="true"]') ??
    section.querySelector("[data-search-highlight]") ??
    section
  );
}
