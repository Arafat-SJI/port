"use client";

import { useRef, useState } from "react";
import ActivityBar from "@/components/ide/ActivityBar";
import Breadcrumb from "@/components/ide/Breadcrumb";
import ChatPanel from "@/components/ide/ChatPanel";
import ExplorerSidebar from "@/components/ide/ExplorerSidebar";
import StatusBar from "@/components/ide/StatusBar";
import TopBar from "@/components/ide/TopBar";
import PortfolioContent from "@/components/portfolio/PortfolioContent";
import { NAV_ITEMS } from "@/data/portfolio";
import { SECTION_SCROLL_MARGIN, useScrollSpy } from "@/hooks/useScrollSpy";
import { useTabStripScroll } from "@/hooks/useTabStripScroll";
import { useTerminalMessages } from "@/hooks/useTerminalMessages";

export default function IDEWorkspace() {
  const mainRef = useRef(null);
  const tabStripRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const [activeHref, setActiveHref] = useState("#about");
  const [activeActivity, setActiveActivity] = useState("explorer");
  const [portfolioExpanded, setPortfolioExpanded] = useState(true);
  const terminalMsg = useTerminalMessages();

  const activeNav = NAV_ITEMS.find((item) => item.href === activeHref) ?? NAV_ITEMS[0];

  useTabStripScroll(tabStripRef, activeHref);
  useScrollSpy(mainRef, setActiveHref, isProgrammaticScrollRef);

  const handleNavClick = (e, href) => {
    e.preventDefault();
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

  return (
    <>
      <div className="flex h-screen pb-6">
        <ActivityBar activeActivity={activeActivity} onActivityChange={setActiveActivity} />

        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          <TopBar
            tabStripRef={tabStripRef}
            activeHref={activeHref}
            onNavClick={handleNavClick}
          />

          <div className="flex flex-1 min-h-0">
            <ExplorerSidebar
              activeHref={activeHref}
              portfolioExpanded={portfolioExpanded}
              onPortfolioToggle={() => setPortfolioExpanded((expanded) => !expanded)}
              onNavClick={handleNavClick}
            />

            <div className="flex flex-1 flex-col min-w-0">
              <Breadcrumb activeNav={activeNav} />
              <main
                ref={mainRef}
                className="flex-1 overflow-y-auto custom-scrollbar relative font-code-sm"
              >
                <PortfolioContent />
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
