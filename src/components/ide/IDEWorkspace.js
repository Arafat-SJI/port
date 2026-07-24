"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { NAV_ITEMS, getActivityLabel, getVisibleActivityItems, CHAT_SIDEBAR_BREAKPOINT } from "@/data/portfolio";
import { findSearchScrollTarget, scrollContainerToElement } from "@/lib/searchScroll";
import {
  readWorkspaceState,
  writeWorkspaceState,
} from "@/lib/extensionStorage";
import { SECTION_SCROLL_MARGIN, useScrollSpy } from "@/hooks/useScrollSpy";
import { useTabStripScroll } from "@/hooks/useTabStripScroll";
import { useTerminalMessages } from "@/hooks/useTerminalMessages";
import { useSectionOrder } from "@/hooks/useSectionOrder";
import { orderNavItems } from "@/lib/sectionOrder";
import { smoothScrollTo } from "@/lib/smoothScroll";
import SidebarResizeHandle, {
  useSidebarWidth,
} from "@/components/ide/SidebarResizeHandle";
import {
  SIDEBAR_DRAWER_BREAKPOINT,
  getSidebarMode,
  getSidebarLayout,
} from "@/lib/sidebarPrefs";

function isExtensionTab(tab) {
  return tab.startsWith("extension:");
}

function extensionIdFromTab(tab) {
  return tab.replace("extension:", "");
}

export default function IDEWorkspace({
  sectionOrder: initialSectionOrder,
  aboutContent,
  experienceContent,
  skillsContent,
  projectsContent,
  educationContent,
  awardsContent,
  publicationContent,
  galleryContent,
  clubingContent,
  mentorshipContent,
  contactContent,
} = {}) {
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
  // Viewport flags must match SSR defaults, then sync after mount (avoids hydration mismatch).
  const [sidebarMode, setSidebarMode] = useState("wide");
  const [drawerMode, setDrawerMode] = useState(false);
  const [chatInSidebar, setChatInSidebar] = useState(false);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const terminalMsg = useTerminalMessages();

  useLayoutEffect(() => {
    const sync = () => {
      const width = window.innerWidth;
      setSidebarMode(getSidebarMode(width));
      const nextDrawer = width < SIDEBAR_DRAWER_BREAKPOINT;
      setDrawerMode(nextDrawer);
      if (!nextDrawer) setLeftDrawerOpen(false);

      const nextChatInSidebar = width < CHAT_SIDEBAR_BREAKPOINT;
      setChatInSidebar(nextChatInSidebar);
      if (!nextChatInSidebar) {
        setActiveActivity((prev) => (prev === "chat" ? "explorer" : prev));
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const layout = getSidebarLayout(sidebarMode);
  const sidebarsFixed = layout.mode === "fixed";
  const {
    width: leftSidebarWidth,
    handleResize: handleLeftSidebarResize,
  } = useSidebarWidth(layout.left.defaultWidth, {
    min: layout.left.min,
    max: layout.left.max,
    storageKey: layout.left.storageKey,
    prefsKey: "left-sidebar",
  });
  const {
    width: rightSidebarWidth,
    handleResize: handleRightSidebarResize,
  } = useSidebarWidth(layout.right.defaultWidth, {
    min: layout.right.min,
    max: layout.right.max,
    storageKey: layout.right.storageKey,
    prefsKey: "right-sidebar",
  });

  const closeLeftDrawer = () => setLeftDrawerOpen(false);

  useLayoutEffect(() => {
    const saved = readWorkspaceState();
    setOpenExtensionTabs(saved.openExtensionTabs);
    setActiveTab(saved.activeTab);
    const restoreChat =
      saved.activeActivity === "chat" &&
      typeof window !== "undefined" &&
      window.innerWidth < CHAT_SIDEBAR_BREAKPOINT;
    setActiveActivity(
      saved.activeActivity === "chat" && !restoreChat ? "explorer" : saved.activeActivity
    );
    if (!isExtensionTab(saved.activeTab)) {
      setActiveHref(saved.activeTab);
    }
    setWorkspaceHydrated(true);
  }, []);

  useLayoutEffect(() => {
    if (!workspaceHydrated) return;
    writeWorkspaceState({ openExtensionTabs, activeTab, activeActivity });
  }, [openExtensionTabs, activeTab, activeActivity, workspaceHydrated]);

  const [order] = useSectionOrder(initialSectionOrder);
  const navItems = useMemo(() => orderNavItems(NAV_ITEMS, order), [order]);

  const activeNav = navItems.find((item) => item.href === activeHref) ?? navItems[0];
  const activeExtensionId = isExtensionTab(activeTab) ? extensionIdFromTab(activeTab) : null;
  const showExtensionView = isExtensionTab(activeTab);

  useTabStripScroll(tabStripRef, activeTab);
  useScrollSpy(mainRef, setActiveHref, isProgrammaticScrollRef, navItems);

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
    if (drawerMode) closeLeftDrawer();
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
    if (drawerMode) closeLeftDrawer();
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
    if (drawerMode) closeLeftDrawer();
  };

  const handleActivityChange = (activity) => {
    setActiveActivity(activity);
    if (drawerMode) setLeftDrawerOpen(true);
  };

  const sidebarSelectedExtension =
    activeActivity === "extensions" && activeExtensionId ? activeExtensionId : null;

  return (
    <>
      <div className="flex h-screen pb-6">
        {!drawerMode && (
          <ActivityBar
            activeActivity={activeActivity}
            onActivityChange={handleActivityChange}
            includeChat={chatInSidebar}
          />
        )}

        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          <TopBar
            tabStripRef={tabStripRef}
            activeTab={activeTab}
            openExtensionTabs={openExtensionTabs}
            activeActivity={activeActivity}
            onTabSelect={handleTabSelect}
            onExtensionTabClose={handleExtensionTabClose}
            leftSidebarWidth={leftSidebarWidth}
            rightSidebarWidth={rightSidebarWidth}
            drawerMode={drawerMode}
            drawerOpen={leftDrawerOpen}
            onToggleDrawer={() => setLeftDrawerOpen((open) => !open)}
            tabs={navItems}
          />

          <div className="relative flex flex-1 min-h-0">
            {drawerMode && leftDrawerOpen && (
              <button
                type="button"
                aria-label="Close sidebar"
                className="absolute inset-0 z-40 bg-black/45 border-0 cursor-default"
                onClick={closeLeftDrawer}
              />
            )}

            <div
              className={
                drawerMode
                  ? `absolute inset-y-0 left-0 z-50 flex flex-col min-h-0 border-r border-border bg-surface-container-lowest shadow-xl transition-transform duration-200 ${
                      leftDrawerOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
                    }`
                  : "relative flex shrink-0 flex-col min-h-0 min-w-0"
              }
              style={{ width: drawerMode ? Math.max(leftSidebarWidth, 240) : leftSidebarWidth }}
            >
              {drawerMode && (
                <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 h-8">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase truncate mr-auto">
                    {getActivityLabel(activeActivity, { compact: true })}
                  </span>
                  {getVisibleActivityItems(chatInSidebar).map((item) => {
                    const isActive = activeActivity === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={item.label}
                        onClick={() => handleActivityChange(item.id)}
                        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                          isActive
                            ? "bg-surface-container-high text-on-surface"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                        }`}
                      >
                        <span className="material-symbols-outlined !text-[16px]">{item.icon}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex min-h-0 flex-1 flex-col">
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
                  navItems={navItems}
                  aboutContent={aboutContent}
                  experienceContent={experienceContent}
                  skillsContent={skillsContent}
                  projectsContent={projectsContent}
                  educationContent={educationContent}
                  awardsContent={awardsContent}
                  publicationContent={publicationContent}
                  galleryContent={galleryContent}
                  clubingContent={clubingContent}
                  mentorshipContent={mentorshipContent}
                  contactContent={contactContent}
                />
              </div>
              {!sidebarsFixed && !drawerMode && (
                <SidebarResizeHandle
                  side="left"
                  onResize={(event) => handleLeftSidebarResize(event, "left")}
                />
              )}
            </div>

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
                    <PortfolioContent
                      searchHighlight={selectedSearchMatch}
                      sectionOrder={order}
                      aboutContent={aboutContent}
                      experienceContent={experienceContent}
                      skillsContent={skillsContent}
                      projectsContent={projectsContent}
                      educationContent={educationContent}
                      awardsContent={awardsContent}
                      publicationContent={publicationContent}
                      galleryContent={galleryContent}
                      clubingContent={clubingContent}
                      mentorshipContent={mentorshipContent}
                      onNavigateSection={navigateToSection}
                    />
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
                  contactContent={contactContent}
                />
              )}
            </div>

            <div
              className="relative hidden min-[1020px]:flex shrink-0 flex-col min-h-0 min-w-0"
              style={{ width: rightSidebarWidth }}
            >
              {!sidebarsFixed && (
                <SidebarResizeHandle
                  side="right"
                  onResize={(event) => handleRightSidebarResize(event, "right")}
                />
              )}
              <ChatPanel />
            </div>
          </div>
        </div>
      </div>

      <StatusBar terminalMsg={terminalMsg} />
    </>
  );
}
