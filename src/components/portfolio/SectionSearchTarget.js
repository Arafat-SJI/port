import { useLayoutEffect, useRef } from "react";
import { buildSearchMatcher } from "@/lib/searchIndex";

function clearHighlights(container) {
  container.querySelectorAll("[data-search-highlight]").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

function applyHighlights(container, highlight) {
  clearHighlights(container);
  if (!highlight?.query?.trim()) return;

  const matcher = buildSearchMatcher(highlight.query, {
    matchCase: highlight.matchCase,
    wholeWord: highlight.wholeWord,
    useRegex: highlight.useRegex,
  });
  if (!matcher) return;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  for (const node of textNodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest("[data-search-highlight]")) continue;

    const text = node.textContent ?? "";
    const flags = matcher.flags.includes("g") ? matcher.flags : `${matcher.flags}g`;
    const regex = new RegExp(matcher.source, flags);
    const matches = [...text.matchAll(regex)];
    if (!matches.length) continue;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    for (const match of matches) {
      const start = match.index ?? 0;
      if (start > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      }

      const mark = document.createElement("mark");
      mark.dataset.searchHighlight = "true";
      mark.className = "search-content-highlight";
      mark.textContent = match[0];

      if (highlight.text && text.trim() === highlight.text.trim() && match[0].length > 0) {
        mark.dataset.searchActive = "true";
      }

      fragment.appendChild(mark);
      lastIndex = start + match[0].length;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode?.replaceChild(fragment, node);
  }
}

export default function SectionSearchTarget({ sectionHref, searchHighlight, children }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!searchHighlight || searchHighlight.href !== sectionHref) {
      clearHighlights(container);
      return;
    }

    applyHighlights(container, searchHighlight);

    return () => {
      clearHighlights(container);
    };
  }, [searchHighlight, sectionHref]);

  return <div ref={containerRef}>{children}</div>;
}
