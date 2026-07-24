"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import FileIcon from "@/components/ui/FileIcon";
import {
  DASHBOARD_NAV,
  isAiChatsPath,
  isMessagesPath,
  isSettingsPath,
} from "@/data/dashboard";
import { logoutAction } from "@/app/dashboard-araf/actions";
import { saveSectionOrderAction } from "@/app/dashboard-araf/sectionOrderActions";
import {
  FIXED_LAST_SLUG,
  normalizeSectionOrder,
  orderDashboardNav,
} from "@/lib/sectionOrder";
import { useSectionOrder } from "@/hooks/useSectionOrder";

function DropGap({ active }) {
  return (
    <div
      aria-hidden={!active}
      className="shrink-0 transition-[height] duration-200 ease-out"
      style={{ height: active ? 28 : 0 }}
    />
  );
}

export default function DashboardSidebar({
  email,
  initialSectionOrder,
  onClose,
}) {
  const pathname = usePathname();
  const settingsActive = isSettingsPath(pathname);
  const messagesActive = isMessagesPath(pathname);
  const aiChatsActive = isAiChatsPath(pathname);
  const [order, setAndBroadcast] = useSectionOrder(initialSectionOrder);
  const [dragSlug, setDragSlug] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const dragSlugRef = useRef(null);

  const items = useMemo(() => orderDashboardNav(DASHBOARD_NAV, order), [order]);
  const reorderable = useMemo(
    () => items.filter((item) => item.slug !== FIXED_LAST_SLUG),
    [items]
  );
  const contactItem = useMemo(
    () => items.find((item) => item.slug === FIXED_LAST_SLUG) ?? null,
    [items]
  );

  const persistOrder = useCallback(
    async (nextOrder) => {
      const normalized = setAndBroadcast(nextOrder);
      await saveSectionOrderAction(normalized);
    },
    [setAndBroadcast]
  );

  const clearDrag = useCallback(() => {
    dragSlugRef.current = null;
    setDragSlug(null);
    setDropIndex(null);
  }, []);

  const updateDropIndex = useCallback(
    (targetSlug, clientY, element) => {
      if (targetSlug === FIXED_LAST_SLUG || !element) return;

      const list = normalizeSectionOrder(order);
      const target = list.indexOf(targetSlug);
      if (target < 0) return;

      const rect = element.getBoundingClientRect();
      const after = clientY > rect.top + rect.height / 2;
      const slot = after ? target + 1 : target;
      setDropIndex((prev) => (prev === slot ? prev : slot));
    },
    [order]
  );

  const commitDrop = useCallback(() => {
    const moving = dragSlugRef.current || dragSlug;
    if (!moving || dropIndex === null) {
      clearDrag();
      return;
    }

    const current = normalizeSectionOrder(order);
    const from = current.indexOf(moving);
    if (from < 0) {
      clearDrag();
      return;
    }

    let insertAt = dropIndex;
    if (from < insertAt) insertAt -= 1;
    insertAt = Math.max(0, Math.min(current.length - 1, insertAt));

    if (from === insertAt) {
      clearDrag();
      return;
    }

    const next = [...current];
    const [moved] = next.splice(from, 1);
    next.splice(insertAt, 0, moved);
    clearDrag();
    void persistOrder(next);
  }, [clearDrag, dragSlug, dropIndex, order, persistOrder]);

  const renderRow = (item, { isContact = false } = {}) => {
    const active = pathname === item.href;
    const isDragging = dragSlug === item.slug;

    return (
      <div
        key={item.slug}
        data-nav-row={item.slug}
        className={`relative flex items-center gap-1.5 px-3 py-[5px] text-[12px] leading-tight transition-[opacity,transform,background-color,color] duration-200 ease-out ${
          active
            ? "active-tab bg-primary/10 text-secondary"
            : "text-on-surface-text opacity-75 hover:bg-surface-container-hover-low hover:text-on-surface-variant-hover hover:opacity-100"
        } ${isDragging ? "scale-[0.98] opacity-35" : ""}`}
        onDragOver={(e) => {
          if (isContact || !dragSlugRef.current) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          updateDropIndex(item.slug, e.clientY, e.currentTarget);
        }}
        onDrop={(e) => {
          e.preventDefault();
          commitDrop();
        }}
      >
        <Link
          href={item.href}
          className="absolute inset-0 z-[1] cursor-pointer"
          aria-label={item.label}
          onClick={() => onClose?.()}
        />
        <span className="relative z-[2] pointer-events-none flex min-w-0 flex-1 items-center gap-1.5">
          <FileIcon ext={item.ext} size={15} />
          <span className="truncate">{item.label}</span>
        </span>
        {!isContact ? (
          <button
            type="button"
            draggable
            aria-label={`Reorder ${item.label}`}
            onDragStart={(e) => {
              dragSlugRef.current = item.slug;
              setDragSlug(item.slug);
              setDropIndex(null);
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", item.slug);
              const row = e.currentTarget.closest("[data-nav-row]");
              if (row) {
                e.dataTransfer.setDragImage(row, 24, 14);
              }
            }}
            onDragEnd={clearDrag}
            className="relative z-[3] ml-auto hidden shrink-0 cursor-grab items-center text-on-surface-variant/70 active:cursor-grabbing sm:flex"
          >
            <span className="material-symbols-outlined !text-[14px] leading-none">menu</span>
          </button>
        ) : null}
      </div>
    );
  };

  const isGapActive = (slot) => dragSlug !== null && dropIndex === slot;

  return (
    <aside className="flex h-full w-[min(248px,85vw)] shrink-0 flex-col border-r border-border bg-surface-container-lowest md:w-[248px]">
      <div className="flex h-11 items-center gap-2 px-3">
        <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-label-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">
            arafat.workspace
          </p>
          <p className="truncate text-[11px] text-on-surface/80">dashboard-araf</p>
        </div>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface md:hidden"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined !text-[20px]">close</span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-2">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">
          Content
        </p>
        <nav
          className="min-h-0 flex-1 overflow-y-auto custom-scrollbar pb-2"
          onDragOver={(e) => {
            if (!dragSlugRef.current) return;
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            commitDrop();
          }}
        >
          {reorderable.map((item, index) => (
            <div key={item.slug}>
              <DropGap active={isGapActive(index)} />
              {renderRow(item)}
            </div>
          ))}
          <DropGap active={isGapActive(reorderable.length)} />
          {contactItem ? renderRow(contactItem, { isContact: true }) : null}
        </nav>

        <div className="pt-2 pb-2">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">
            System
          </p>
          <Link
            href="/dashboard-araf/messages"
            onClick={() => onClose?.()}
            className={`flex cursor-pointer items-center gap-1.5 px-3 py-[6px] text-[12px] transition-colors ${
              messagesActive
                ? "active-tab bg-primary/10 text-secondary"
                : "text-on-surface-text opacity-75 hover:bg-surface-container-hover-low hover:text-on-surface-variant-hover hover:opacity-100"
            }`}
          >
            <span className="material-symbols-outlined !text-[15px] text-primary/80">mail</span>
            Message
          </Link>
          <Link
            href="/dashboard-araf/ai-chats"
            onClick={() => onClose?.()}
            className={`flex cursor-pointer items-center gap-1.5 px-3 py-[6px] text-[12px] transition-colors ${
              aiChatsActive
                ? "active-tab bg-primary/10 text-secondary"
                : "text-on-surface-text opacity-75 hover:bg-surface-container-hover-low hover:text-on-surface-variant-hover hover:opacity-100"
            }`}
          >
            <span className="material-symbols-outlined !text-[15px] text-primary/80">
              smart_toy
            </span>
            AI Chat
          </Link>
          <Link
            href="/dashboard-araf/settings/email"
            onClick={() => onClose?.()}
            className={`flex cursor-pointer items-center gap-1.5 px-3 py-[6px] text-[12px] transition-colors ${
              settingsActive
                ? "active-tab bg-primary/10 text-secondary"
                : "text-on-surface-text opacity-75 hover:bg-surface-container-hover-low hover:text-on-surface-variant-hover hover:opacity-100"
            }`}
          >
            <span className="material-symbols-outlined !text-[15px] text-primary/80">settings</span>
            Settings
          </Link>
        </div>
      </div>

      <div className="p-3">
        <p className="mb-2 truncate font-label-mono text-[10px] text-on-surface-variant" title={email}>
          {email}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-surface-container-low text-[11px] text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[14px]">logout</span>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
