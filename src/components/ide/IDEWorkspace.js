"use client";

import { useLayoutEffect, useRef, useState } from "react";
import ActivityBar from "@/components/ide/ActivityBar";
import ActivitySidebar from "@/components/ide/ActivitySidebar";
import Breadcrumb from "@/components/ide/Breadcrumb";
import ChatPanel from "@/components/ide/ChatPanel";
import StatusBar from "@/components/ide/StatusBar";
import TopBar from "@/components/ide/TopBar";
import ExtensionDetailView, { ExtensionsEmptyState } from "@/components/ide/ExtensionDetailView";
import ContactReveal, { ContactScrollTrack } from "@/components/ide/ContactReveal";
import PortfolioContent from "@/components/portfolio/PortfolioContent";
import SectionSearchTarget from "@/components/portfolio/SectionSearchTarget";
import { NAV_ITEMS } from "@/data/portfolio";
import { findSearchScrollTarget, scrollContainerToElement } from "@/lib/searchScroll";
import {
  readWorkspaceState,
  writeWorkspaceState,
} from "@/lib/extensionStorage";
import { SECTION_SCROLL_MARGIN, useScrollSpy } from "@/hooks/useScrollSpy";
import { useTabStripScroll } from "@/hooks/useTabStripScroll";
import { useTerminalMessages } from "@/hooks/useTerminalMessages";
import { smoothScrollTo } from "@/lib/smoothScroll";

function isExtensionTab(tab) {
  return tab.startsWith("extension:");
}

function extensionIdFromTab(tab) {
  return tab.replace("extension:", "");
}

export default function IDEWorkspace() {
  const mainRef = useRef(null);
  const contactTrackRef = useRef(null);
  const tabStripRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const searchScrollTokenRef = useRef(0);
  const pendingScrollHrefRef = useRef(null);
  const [activeHref, setActiveHref] = useState("#about");
  const [activeTab, setActiveTab] = useState("#about");
  const [openExtensionTabs, setOpenExtensionTabs] = useState([]);
  const [activeActivity, setActiveActivity] = useState("explorer");
  const [portfolioExpanded, setPortfolioExpanded] = useState(true);
  const [selectedSearchMatch, setSelectedSearchMatch] = useState(null);
  const [workspaceHydrated, setWorkspaceHydrated] = useState(false);
  const terminalMsg = useTerminalMessages();

  useLayoutEffect(() => {
    const saved = readWorkspaceState();
    setOpenExtensionTabs(saved.openExtensionTabs);
    setActiveTab(saved.activeTab);
    setActiveActivity(saved.activeActivity);
    if (!isExtensionTab(saved.activeTab)) {
      setActiveHref(saved.activeTab);
    }
    setWorkspaceHydrated(true);
  }, []);

  useLayoutEffect(() => {
    if (!workspaceHydrated) return;
    writeWorkspaceState({ openExtensionTabs, activeTab, activeActivity });
  }, [openExtensionTabs, activeTab, activeActivity, workspaceHydrated]);

  const activeNav = NAV_ITEMS.find((item) => item.href === activeHref) ?? NAV_ITEMS[0];
  const activeExtensionId = isExtensionTab(activeTab) ? extensionIdFromTab(activeTab) : null;
  const showExtensionView = isExtensionTab(activeTab);

  useTabStripScroll(tabStripRef, activeTab);
  useScrollSpy(mainRef, setActiveHref, isProgrammaticScrollRef);

  // Keep the top tab strip in sync with scroll-spy (sidebar already uses activeHref).
  useLayoutEffect(() => {
    if (isExtensionTab(activeTab)) return;
    if (activeTab === activeHref) return;
    setActiveTab(activeHref);
  }, [activeHref, activeTab]);

  useLayoutEffect(() => {
    if (!selectedSearchMatch) return;

    const token = ++searchScrollTokenRef.current;
    isProgrammaticScrollRef.current = true;
    setActiveHref(selectedSearchMatch.href);
    setActiveTab(selectedSearchMatch.href);

    const main = mainRef.current;
    const target = main ? findSearchScrollTarget(main, selectedSearchMatch.href) : null;

    if (!target) {
      pendingScrollHrefRef.current = selectedSearchMatch.href;
      return;
    }

    scrollContainerToElement(main, target, "center");

    window.setTimeout(() => {
      if (token === searchScrollTokenRef.current) {
        isProgrammaticScrollRef.current = false;
      }
    }, 120);
  }, [selectedSearchMatch]);

  const scrollToHref = (href, { behavior = "smooth" } = {}) => {
    const main = mainRef.current;
    const target = main?.querySelector(href);
    if (!target || !main) return false;

    const top =
      target.getBoundingClientRect().top -
      main.getBoundingClientRect().top +
      main.scrollTop;
    const destination = Math.max(0, top - SECTION_SCROLL_MARGIN);

    isProgrammaticScrollRef.current = true;
    setActiveHref(href);

    const clearProgrammaticScroll = () => {
      isProgrammaticScrollRef.current = false;
    };

    // Contact / terminal only — eased scroll without overshoot (Back would dip the wrong way first).
    if (href === "#contact" && behavior !== "auto") {
      smoothScrollTo(main, destination, {
        duration: 800,
        durationRelative: true,
        durationMin: 500,
        durationMax: 1400,
        easing: "easeInOutCubic",
        onScrollEnd: clearProgrammaticScroll,
      });
      // Safety clear if animation is interrupted.
      setTimeout(clearProgrammaticScroll, 1600);
      return true;
    }

    main.scrollTo({ top: destination, behavior });
    main.addEventListener("scrollend", clearProgrammaticScroll, { once: true });
    setTimeout(clearProgrammaticScroll, behavior === "smooth" ? 800 : 50);
    return true;
  };

  useLayoutEffect(() => {
    if (showExtensionView) return;

    const href = pendingScrollHrefRef.current;
    if (!href) return;

    pendingScrollHrefRef.current = null;

    const main = mainRef.current;
    if (!main) return;

    if (selectedSearchMatch?.href === href) {
      isProgrammaticScrollRef.current = true;
      const target = findSearchScrollTarget(main, href);
      scrollContainerToElement(main, target, "center");
      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 120);
      return;
    }

    scrollToHref(href, { behavior: "auto" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showExtensionView, activeTab, selectedSearchMatch]);

  const navigateToSection = (href) => {
    setSelectedSearchMatch(null);
    setActiveTab(href);
    setActiveHref(href);

    if (showExtensionView || !mainRef.current?.querySelector(href)) {
      pendingScrollHrefRef.current = href;
      return;
    }

    scrollToHref(href);
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    navigateToSection(href);
  };

  const handleTabSelect = (tabId) => {
    if (isExtensionTab(tabId)) {
      setSelectedSearchMatch(null);
      setActiveTab(tabId);
      setActiveActivity("extensions");
      return;
    }

    navigateToSection(tabId);
  };

  const handleExtensionSelect = (id) => {
    setOpenExtensionTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveTab(`extension:${id}`);
    setActiveActivity("extensions");
  };

  const handleExtensionTabClose = (e, id) => {
    e.stopPropagation();

    setOpenExtensionTabs((prev) => {
      const next = prev.filter((item) => item !== id);
      const tabId = `extension:${id}`;

      if (activeTab === tabId) {
        if (next.length > 0) {
          setActiveTab(`extension:${next[next.length - 1]}`);
          setActiveActivity("extensions");
        } else {
          pendingScrollHrefRef.current = activeHref;
          setActiveTab(activeHref);
        }
      }

      return next;
    });
  };

  const handleSearchResultClick = (match) => {
    setSelectedSearchMatch(match);
  };

  const handleActivityChange = (activity) => {
    setActiveActivity(activity);
  };

  const sidebarSelectedExtension =
    activeActivity === "extensions" && activeExtensionId ? activeExtensionId : null;

  return (
    <>
      <div className="flex h-screen pb-6">
        <ActivityBar activeActivity={activeActivity} onActivityChange={handleActivityChange} />

        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          <TopBar
            tabStripRef={tabStripRef}
            activeTab={activeTab}
            openExtensionTabs={openExtensionTabs}
            activeActivity={activeActivity}
            onTabSelect={handleTabSelect}
            onExtensionTabClose={handleExtensionTabClose}
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
              selectedExtensionId={sidebarSelectedExtension}
              onExtensionSelect={handleExtensionSelect}
            />

            <div className="relative flex flex-1 flex-col min-w-0 min-h-0">
              <Breadcrumb
                activeNav={activeNav}
                extensionId={showExtensionView ? activeExtensionId : null}
              />
              <main
                ref={mainRef}
                className="flex-1 min-h-0 overflow-y-auto custom-scrollbar relative font-code-sm"
              >
                {showExtensionView ? (
                  activeExtensionId ? (
                    <ExtensionDetailView extensionId={activeExtensionId} />
                  ) : (
                    <ExtensionsEmptyState />
                  )
                ) : (
                  <>
                    <PortfolioContent searchHighlight={selectedSearchMatch} />
                    <SectionSearchTarget
                      sectionHref="#contact"
                      searchHighlight={selectedSearchMatch}
                    >
                      <ContactScrollTrack trackRef={contactTrackRef} />
                    </SectionSearchTarget>
                  </>
                )}
              </main>
              {!showExtensionView && (
                <ContactReveal
                  scrollContainerRef={mainRef}
                  trackRef={contactTrackRef}
                  onCollapse={() => navigateToSection("#mentorship")}
                />
              )}
            </div>

            <ChatPanel />
          </div>
        </div>
      </div>

      <StatusBar terminalMsg={terminalMsg} />
    </>
  );
}
