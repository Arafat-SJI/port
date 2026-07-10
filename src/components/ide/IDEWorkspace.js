"use client";

import { useLayoutEffect, useRef, useState } from "react";
import ActivityBar from "@/components/ide/ActivityBar";
import ActivitySidebar from "@/components/ide/ActivitySidebar";
import Breadcrumb from "@/components/ide/Breadcrumb";
import ChatPanel from "@/components/ide/ChatPanel";
import StatusBar from "@/components/ide/StatusBar";
import TopBar from "@/components/ide/TopBar";
import ExtensionDetailView, { ExtensionsEmptyState } from "@/components/ide/ExtensionDetailView";
import PortfolioContent from "@/components/portfolio/PortfolioContent";
import { NAV_ITEMS } from "@/data/portfolio";
import { findSearchScrollTarget, scrollContainerToElement } from "@/lib/searchScroll";
import {
  readWorkspaceState,
  writeWorkspaceState,
} from "@/lib/extensionStorage";
import { SECTION_SCROLL_MARGIN, useScrollSpy } from "@/hooks/useScrollSpy";
import { useTabStripScroll } from "@/hooks/useTabStripScroll";
import { useTerminalMessages } from "@/hooks/useTerminalMessages";

function isExtensionTab(tab) {
  return tab.startsWith("extension:");
}

function extensionIdFromTab(tab) {
  return tab.replace("extension:", "");
}

export default function IDEWorkspace() {
  const mainRef = useRef(null);
  const tabStripRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const searchScrollTokenRef = useRef(0);
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

  useLayoutEffect(() => {
    if (!selectedSearchMatch) return;

    const token = ++searchScrollTokenRef.current;
    isProgrammaticScrollRef.current = true;
    setActiveHref(selectedSearchMatch.href);
    setActiveTab(selectedSearchMatch.href);

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

  const scrollToHref = (href) => {
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

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setSelectedSearchMatch(null);
    setActiveTab(href);
    scrollToHref(href);
  };

  const handleTabSelect = (tabId) => {
    setSelectedSearchMatch(null);
    setActiveTab(tabId);

    if (isExtensionTab(tabId)) {
      setActiveActivity("extensions");
      return;
    }

    scrollToHref(tabId);
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

            <div className="flex flex-1 flex-col min-w-0">
              <Breadcrumb
                activeNav={activeNav}
                extensionId={showExtensionView ? activeExtensionId : null}
              />
              <main
                ref={mainRef}
                className="flex-1 overflow-y-auto custom-scrollbar relative font-code-sm"
              >
                {showExtensionView ? (
                  activeExtensionId ? (
                    <ExtensionDetailView extensionId={activeExtensionId} />
                  ) : (
                    <ExtensionsEmptyState />
                  )
                ) : (
                  <PortfolioContent searchHighlight={selectedSearchMatch} />
                )}
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
