"use client";

import { useLayoutEffect, useRef, useState } from "react";
import ActivityBar from "@/components/ide/ActivityBar";
import ActivitySidebar from "@/components/ide/ActivitySidebar";
import Breadcrumb from "@/components/ide/Breadcrumb";
import ChatPanel from "@/components/ide/ChatPanel";
import StatusBar from "@/components/ide/StatusBar";
import TopBar from "@/components/ide/TopBar";
import PortfolioContent from "@/components/portfolio/PortfolioContent";
import { NAV_ITEMS } from "@/data/portfolio";
import { findSearchScrollTarget, scrollContainerToElement } from "@/lib/searchScroll";
import { SECTION_SCROLL_MARGIN, useScrollSpy } from "@/hooks/useScrollSpy";
import { useTabStripScroll } from "@/hooks/useTabStripScroll";
import { useTerminalMessages } from "@/hooks/useTerminalMessages";

export default function IDEWorkspace() {
  const mainRef = useRef(null);
  const tabStripRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const searchScrollTokenRef = useRef(0);
  const [activeHref, setActiveHref] = useState("#about");
  const [activeActivity, setActiveActivity] = useState("explorer");
  const [portfolioExpanded, setPortfolioExpanded] = useState(true);
  const [selectedSearchMatch, setSelectedSearchMatch] = useState(null);
  const terminalMsg = useTerminalMessages();

  const activeNav = NAV_ITEMS.find((item) => item.href === activeHref) ?? NAV_ITEMS[0];

  useTabStripScroll(tabStripRef, activeHref);
  useScrollSpy(mainRef, setActiveHref, isProgrammaticScrollRef);

  useLayoutEffect(() => {
    if (!selectedSearchMatch) return;

    const token = ++searchScrollTokenRef.current;
    isProgrammaticScrollRef.current = true;
    setActiveHref(selectedSearchMatch.href);

    const main = mainRef.current;
    if (!main) return;

    const target = findSearchScrollTarget(main, selectedSearchMatch.href);
    scrollContainerToElement(main, target, "center");

    window.setTimeout(() => {
      if (token === searchScrollTokenRef.current) {
        isProgrammaticScrollRef.current = false;
      }
    }, 120);
  }, [selectedSearchMatch]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setSelectedSearchMatch(null);

    const main = mainRef.current;
    const target = document.querySelector(href);
    if (!target || !main) return;

    const top =
      target.getBoundingClientRect().top -
      main.getBoundingClientRect().top +
      main.scrollTop;

    isProgrammaticScrollRef.current = true;
    setActiveHref(href);
    main.scrollTo({ top: top - SECTION_SCROLL_MARGIN, behavior: "smooth" });

    const clearProgrammaticScroll = () => {
      isProgrammaticScrollRef.current = false;
    };

    main.addEventListener("scrollend", clearProgrammaticScroll, { once: true });
    setTimeout(clearProgrammaticScroll, 800);
  };

  const handleSearchResultClick = (match) => {
    setSelectedSearchMatch(match);
  };

  return (
    <>
      <div className="flex h-screen pb-6">
        <ActivityBar activeActivity={activeActivity} onActivityChange={setActiveActivity} />

        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          <TopBar
            tabStripRef={tabStripRef}
            activeHref={activeHref}
            activeActivity={activeActivity}
            onNavClick={handleNavClick}
          />

          <div className="flex flex-1 min-h-0">
            <ActivitySidebar
              activeActivity={activeActivity}
              activeHref={activeHref}
              portfolioExpanded={portfolioExpanded}
              onPortfolioToggle={() => setPortfolioExpanded((expanded) => !expanded)}
              onNavClick={handleNavClick}
              selectedSearchMatch={selectedSearchMatch}
              onSearchResultClick={handleSearchResultClick}
              onSearchQueryChange={() => setSelectedSearchMatch(null)}
            />

            <div className="flex flex-1 flex-col min-w-0">
              <Breadcrumb activeNav={activeNav} />
              <main
                ref={mainRef}
                className="flex-1 overflow-y-auto custom-scrollbar relative font-code-sm"
              >
                <PortfolioContent searchHighlight={selectedSearchMatch} />
              </main>
            </div>

            <ChatPanel />
          </div>
        </div>
      </div>

      <StatusBar terminalMsg={terminalMsg} />
    </>
  );
}
