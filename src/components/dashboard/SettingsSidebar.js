"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SETTINGS_NAV } from "@/data/dashboard";

function groupSettingsNav(items) {
  const groups = [];
  const indexByName = new Map();
  for (const item of items) {
    const name = item.group || "Settings";
    if (!indexByName.has(name)) {
      indexByName.set(name, groups.length);
      groups.push({ name, items: [] });
    }
    groups[indexByName.get(name)].items.push(item);
  }
  return groups;
}

export default function SettingsSidebar({ onNavigate }) {
  const pathname = usePathname();
  const groups = groupSettingsNav(SETTINGS_NAV);

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
          <p className="truncate text-[12px] font-medium text-on-surface">Settings</p>
        </div>
        <span className="material-symbols-outlined shrink-0 pr-1 text-[18px] text-primary">
          settings
        </span>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto custom-scrollbar pt-2 pb-3">
        {groups.map((group) => (
          <div key={group.name} className="mb-2">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">
              {group.name}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={`flex cursor-pointer items-center gap-1.5 px-3 py-[7px] text-[12px] transition-colors ${
                    active
                      ? "active-tab bg-primary/10 text-secondary"
                      : "text-on-surface-text opacity-75 hover:bg-surface-container-hover-low hover:text-on-surface-variant-hover hover:opacity-100"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined !text-[15px] text-primary/80 ${
                      item.icon === "key" ? "rotate-90" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
