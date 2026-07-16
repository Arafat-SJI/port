"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardShell({ email, sectionOrder, children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-surface-container-lowest px-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <span className="material-symbols-outlined !text-[22px]">menu</span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-label-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">
            arafat.workspace
          </p>
          <p className="truncate text-[11px] text-on-surface/80">dashboard-araf</p>
        </div>
        <span className="material-symbols-outlined shrink-0 text-[18px] text-primary">terminal</span>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 cursor-pointer border-0 bg-black/45 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <DashboardSidebar
        email={email}
        initialSectionOrder={sectionOrder}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="relative min-h-0 min-w-0 flex-1 overflow-y-auto custom-scrollbar bg-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 100% -10%, rgb(173 198 255 / 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, rgb(78 222 163 / 0.06), transparent 50%)",
          }}
        />
        <div className="relative z-[1] min-h-full">{children}</div>
      </div>
    </div>
  );
}
