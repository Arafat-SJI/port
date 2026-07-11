"use client";

import { useState } from "react";
import FileIcon from "@/components/ui/FileIcon";
import { NAV_ITEMS } from "@/data/portfolio";

function SidebarSection({ title, expanded, onToggle, borderTop = false, children }) {
  return (
    <div className={`shrink-0 ${borderTop ? "border-t border-border" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-0.5 flex items-center justify-between text-[11px] font-bold text-on-surface-variant opacity-80 uppercase hover:opacity-90 transition-opacity"
      >
        <span>{title}</span>
        <span
          className={`material-symbols-outlined text-[14px] normal-case sidebar-collapse-icon ${
            expanded ? "" : "-rotate-90"
          }`}
        >
          keyboard_arrow_down
        </span>
      </button>
      <div
        className={`sidebar-collapse ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="sidebar-collapse-inner">{children}</div>
      </div>
    </div>
  );
}

export default function ExplorerSidebar({
  activeHref,
  portfolioExpanded,
  onPortfolioToggle,
  onNavClick,
}) {
  const [outlineExpanded, setOutlineExpanded] = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false);

  const activeNav = NAV_ITEMS.find((item) => item.href === activeHref) ?? NAV_ITEMS[0];

  return (
    <aside className="flex h-full w-full min-h-0 flex-col bg-surface-container-lowest border-r border-border">
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden pt-1">
        <SidebarSection
          title="PORTFOLIO"
          expanded={portfolioExpanded}
          onToggle={onPortfolioToggle}
        >
          <div className="max-h-[min(60vh,28rem)] overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => onNavClick(e, item.href)}
                className={`flex items-center gap-1.5 px-4 py-1 text-[12px] leading-tight transition-colors ${
                  activeHref === item.href
                    ? "active-tab text-secondary"
                    : "text-on-surface-text opacity-70 hover:text-on-surface-variant-hover hover:bg-surface-container-hover-low"
                }`}
              >
                <FileIcon ext={item.ext} size={16} /> {item.label}
              </a>
            ))}
          </div>
        </SidebarSection>

        <div
          className={`sidebar-collapse min-h-0 ${
            portfolioExpanded ? "flex-1 grid-rows-[1fr]" : "shrink-0 grid-rows-[0fr]"
          }`}
          aria-hidden
        >
          <div className="sidebar-collapse-inner" />
        </div>

        <div className="shrink-0">
          <SidebarSection
            title="OUTLINE"
            expanded={outlineExpanded}
            onToggle={() => setOutlineExpanded((v) => !v)}
            borderTop
          >
            <div className="py-0.5">
              <p className="px-6 py-0.5 text-[11px] text-on-surface-variant/70 italic">
                No symbols found in document
              </p>
            </div>
          </SidebarSection>

          <SidebarSection
            title="TIMELINE"
            expanded={timelineExpanded}
            onToggle={() => setTimelineExpanded((v) => !v)}
            borderTop
          >
            <div className="py-0.5 space-y-0.5">
              <div className="flex items-center gap-1.5 px-4 py-0.5 text-[11px] text-on-surface-text hover:bg-surface-container-hover-low cursor-default">
                <FileIcon ext={activeNav.ext} size={14} />
                <span className="truncate">{activeNav.label}</span>
              </div>
              <p className="px-6 py-0.5 text-[10px] text-on-surface-variant/60">
                Local History will track recent changes.
              </p>
            </div>
          </SidebarSection>
        </div>
      </div>
    </aside>
  );
}
