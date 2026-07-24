"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aiChatThreadHref } from "@/data/dashboard";

function previewText(text, max = 42) {
  const value = String(text ?? "").replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export default function AiChatsSidebar({ threads = [], onNavigate, loadError }) {
  const pathname = usePathname();
  const list = Array.isArray(threads) ? threads : [];

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-border bg-surface-container-lowest">
      <div className="flex h-11 items-center gap-1 px-2">
        <Link
          href="/dashboard-araf"
          onClick={() => onNavigate?.()}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
          aria-label="Back to content"
          title="Back"
        >
          <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-label-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">
            System
          </p>
          <p className="truncate text-[12px] font-medium text-on-surface">AI Chat</p>
        </div>
        <span className="material-symbols-outlined shrink-0 pr-1 text-[18px] text-primary">
          smart_toy
        </span>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto custom-scrollbar pt-2 pb-3">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">
          Visitors
        </p>

        {loadError ? (
          <p className="px-3 py-2 text-[11px] leading-relaxed text-error">
            Could not load visitors. Run migration 020.
          </p>
        ) : null}

        {!loadError && list.length === 0 ? (
          <p className="px-3 py-2 text-[11px] leading-relaxed text-on-surface-variant">
            No AI questions yet. Portfolio chat asks appear here by IP.
          </p>
        ) : null}

        {list.map((thread) => {
          const href = aiChatThreadHref(thread.ipKey);
          const active =
            pathname === href ||
            decodeURIComponent(pathname.split("/").pop() || "") === thread.ipKey;
          return (
            <Link
              key={thread.ipKey}
              href={href}
              onClick={() => onNavigate?.()}
              className={`flex cursor-pointer flex-col gap-0.5 px-3 py-[7px] transition-colors ${
                active
                  ? "active-tab bg-primary/10 text-secondary"
                  : "text-on-surface-text opacity-75 hover:bg-surface-container-hover-low hover:text-on-surface-variant-hover hover:opacity-100"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined !text-[15px] text-primary/80">
                  language
                </span>
                <span
                  className={`min-w-0 flex-1 truncate font-label-mono text-[11px] ${
                    thread.unreadCount ? "font-semibold" : ""
                  }`}
                >
                  {thread.name || thread.ip}
                </span>
                {thread.unreadCount > 0 ? (
                  <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold text-on-primary">
                    {thread.unreadCount}
                  </span>
                ) : null}
              </span>
              <span className="truncate pl-[21px] text-[10px] text-on-surface-variant/80">
                {previewText(thread.latestPreview)}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
