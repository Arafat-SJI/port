"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EXTENSIONS } from "@/data/extensions";
import { useExtensions } from "@/hooks/useExtensions";
import {
  readExtensionSearchSession,
  writeExtensionSearchSession,
} from "@/lib/searchSession";
import { PREFS_CHANGED_EVENT } from "@/lib/sidebarPrefs";

const searchInputClass =
  "w-full h-[26px] bg-surface-container-high/80 border border-border/50 rounded-[3px] pl-2 text-[12px] text-on-surface placeholder:text-on-surface-variant/45 focus:outline-none focus:border-primary/35";

function ExtensionRow({ extension, selected, onSelect }) {
  const { isInstalled, isActive, isSiteDefault } = useExtensions();
  const installed = isInstalled(extension.id);
  const active = isActive(extension.id);
  const siteDefault = isSiteDefault(extension.id);

  return (
    <button
      type="button"
      onClick={() => onSelect(extension.id)}
      className={`w-full flex flex-col min-[1305px]:flex-row gap-2 px-2 py-2 text-left border-b border-border/40 transition-colors ${
        selected
          ? "bg-surface-container-hover-low"
          : "hover:bg-surface-container-low/60"
      }`}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded"
        style={{
          backgroundColor: `${extension.iconColor}22`,
          color: extension.iconColor,
        }}
      >
        <span className="material-symbols-outlined text-[18px]">{extension.icon}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[12px] text-white opacity-70 leading-tight truncate">{extension.name}</p>
          {siteDefault && (
            <span className="text-[9px] text-on-surface-variant/70 opacity-70 uppercase shrink-0">
              site default
            </span>
          )}
          {active && (
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" title="Active" />
          )}
        </div>
        <p className="text-[10px] opacity-70 text-on-surface-variant/90 truncate">{extension.publisher}</p>
        <p className="text-[10px] opacity-70 text-on-surface-variant/70 leading-snug mt-0.5 line-clamp-1">
          {extension.description}
        </p>
      </div>

      {installed && (
        <span className="shrink-0 opacity-70 self-start flex items-center gap-1 text-[9px] text-on-surface-variant/80 uppercase">
          <span className="material-symbols-outlined !text-[14px] text-[#7ee8b8] opacity-4s0">
            select_check_box
          </span>
          installed
        </span>
      )}
    </button>
  );
}

export default function ExtensionsSidebar({ selectedExtensionId, onExtensionSelect }) {
  const inputRef = useRef(null);
  const initialQuery = useMemo(() => readExtensionSearchSession(), []);
  const [query, setQuery] = useState(initialQuery);
  const { installed, isSiteDefault } = useExtensions();

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...EXTENSIONS];
    if (q) {
      list = list.filter(
        (ext) =>
          ext.name.toLowerCase().includes(q) ||
          ext.publisher.toLowerCase().includes(q) ||
          ext.description.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      const aSite = isSiteDefault(a.id) ? 0 : 1;
      const bSite = isSiteDefault(b.id) ? 0 : 1;
      if (aSite !== bSite) return aSite - bSite;
      return 0;
    });
  }, [query, isSiteDefault]);

  useEffect(() => {
    writeExtensionSearchSession(query);
  }, [query]);

  useEffect(() => {
    const onPrefs = (event) => {
      const keys = event.detail?.keys;
      if (keys && !keys.includes("extension-search")) return;
      setQuery(readExtensionSearchSession());
    };
    window.addEventListener(PREFS_CHANGED_EVENT, onPrefs);
    return () => window.removeEventListener(PREFS_CHANGED_EVENT, onPrefs);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <aside className="flex h-full w-full min-h-0 flex-col bg-surface-container-lowest border-r border-border">
      <div className="shrink-0 px-[10px] pt-[6px] pb-2 space-y-1">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Extensions in Marketplace"
          className={searchInputClass}
        />
        <p className="text-[11px] text-on-surface-variant/80 px-0.5 pt-0.5">
          {installed.length} installed
          {query.trim() ? ` · ${sorted.length} shown` : ""}
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {sorted.length === 0 ? (
          <p className="px-4 py-3 text-[11px] text-on-surface-variant/70">No extensions found.</p>
        ) : (
          sorted.map((extension) => (
            <ExtensionRow
              key={extension.id}
              extension={extension}
              selected={selectedExtensionId === extension.id}
              onSelect={onExtensionSelect}
            />
          ))
        )}
      </div>
    </aside>
  );
}
