"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AiChatsSidebar from "@/components/dashboard/AiChatsSidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MessagesSidebar from "@/components/dashboard/MessagesSidebar";
import SettingsSidebar from "@/components/dashboard/SettingsSidebar";
import { isAiChatsPath, isMessagesPath, isSettingsPath } from "@/data/dashboard";

export default function DashboardShell({
  email,
  sectionOrder,
  messageThreads = [],
  messagesLoadError = false,
  aiChatThreads = [],
  aiChatsLoadError = false,
  children,
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const settingsOpen = isSettingsPath(pathname);
  const messagesOpen = isMessagesPath(pathname);
  const aiChatsOpen = isAiChatsPath(pathname);
  const nestedOpen = settingsOpen || messagesOpen || aiChatsOpen;

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

  const closeMobile = () => setMobileOpen(false);

  const mobileSecondary = settingsOpen ? (
    <SettingsSidebar onNavigate={closeMobile} />
  ) : messagesOpen ? (
    <MessagesSidebar
      threads={messageThreads}
      loadError={messagesLoadError}
      onNavigate={closeMobile}
    />
  ) : aiChatsOpen ? (
    <AiChatsSidebar
      threads={aiChatThreads}
      loadError={aiChatsLoadError}
      onNavigate={closeMobile}
    />
  ) : null;

  const headerLabel = settingsOpen
    ? "settings"
    : messagesOpen
      ? "messages"
      : aiChatsOpen
        ? "ai-chats"
        : "dashboard-araf";
  const headerIcon = settingsOpen
    ? "settings"
    : messagesOpen
      ? "mail"
      : aiChatsOpen
        ? "smart_toy"
        : "terminal";

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
          <p className="truncate text-[11px] text-on-surface/80">{headerLabel}</p>
        </div>
        <span className="material-symbols-outlined shrink-0 text-[18px] text-primary">
          {headerIcon}
        </span>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 cursor-pointer border-0 bg-black/45 md:hidden"
          onClick={closeMobile}
        />
      ) : null}

      {/* Mobile drawer: content nav OR settings/messages/ai-chats secondary nav */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-full transition-transform duration-200 ease-out md:hidden ${
          mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        {mobileSecondary ?? (
          <DashboardSidebar
            email={email}
            initialSectionOrder={sectionOrder}
            onClose={closeMobile}
          />
        )}
      </div>

      {/* Desktop: main sidebar + smoothly sliding secondary sidebar */}
      <div className="hidden h-full shrink-0 md:flex">
        <DashboardSidebar
          email={email}
          initialSectionOrder={sectionOrder}
          onClose={closeMobile}
        />
        <div
          className={`h-full overflow-hidden transition-[width] duration-300 ease-out ${
            nestedOpen ? "w-[220px]" : "w-0"
          }`}
          aria-hidden={!nestedOpen}
        >
          <div
            className={`h-full transition-transform duration-300 ease-out ${
              nestedOpen ? "translate-x-0" : "-translate-x-4"
            }`}
          >
            {settingsOpen ? <SettingsSidebar onNavigate={closeMobile} /> : null}
            {messagesOpen ? (
              <MessagesSidebar
                threads={messageThreads}
                loadError={messagesLoadError}
                onNavigate={closeMobile}
              />
            ) : null}
            {aiChatsOpen ? (
              <AiChatsSidebar
                threads={aiChatThreads}
                loadError={aiChatsLoadError}
                onNavigate={closeMobile}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative min-h-0 min-w-0 flex-1 overflow-y-auto custom-scrollbar bg-background">
        <div className="relative min-h-full">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 100% -10%, rgb(173 198 255 / 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, rgb(78 222 163 / 0.06), transparent 50%)",
            }}
          />
          <div className="relative z-[1]">{children}</div>
        </div>
      </div>
    </div>
  );
}
