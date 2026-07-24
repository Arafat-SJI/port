"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteMessageThreadAction,
  markMessageThreadReadAction,
} from "@/app/dashboard-araf/messageActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import { formatMessageTime } from "@/lib/contactMessages";

export default function MessageThreadView({ thread }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [flash, setFlash] = useState(null);
  const [localThread, setLocalThread] = useState(thread);

  useEffect(() => {
    setLocalThread(thread);
  }, [thread]);

  useEffect(() => {
    if (!flash) return undefined;
    const timer = window.setTimeout(() => setFlash(null), 2000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  useEffect(() => {
    if (!localThread || localThread.unreadCount === 0) return undefined;

    const key = localThread.emailKey;
    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const result = await markMessageThreadReadAction(key);
        if (result?.success) {
          setLocalThread((prev) =>
            prev
              ? {
                  ...prev,
                  unreadCount: 0,
                  messages: prev.messages.map((m) => ({ ...m, isRead: true })),
                }
              : prev
          );
          router.refresh();
        }
      });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [localThread?.emailKey, localThread?.unreadCount, router]);

  const confirmDeleteThread = () => {
    if (!localThread) return;
    const key = localThread.emailKey;
    setConfirmDelete(false);
    startTransition(async () => {
      const result = await deleteMessageThreadAction(key);
      if (result?.success) {
        setFlash({ type: "success", text: "Conversation deleted." });
        router.push("/dashboard-araf/messages");
        router.refresh();
      } else {
        setFlash({
          type: "error",
          text: result?.error || "Could not delete conversation.",
        });
      }
    });
  };

  if (!localThread) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl bg-surface-container-lowest/90 px-6 py-12 text-center">
        <span className="material-symbols-outlined mb-2 text-[32px] text-primary/55">
          chat_bubble
        </span>
        <p className="text-[14px] font-medium text-on-surface">Conversation not found</p>
        <p className="mt-1 max-w-xs text-[12px] text-on-surface-variant">
          Pick a sender from the Message sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest/90">
      <div className="flex min-h-[480px] flex-col">
        <header className="flex h-11 items-center gap-2 border-b border-border/60 px-3.5 sm:px-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-on-surface">
              {localThread.name || "Visitor"}
            </p>
            <p className="truncate text-[11px] text-on-surface-variant">
              {localThread.email} · {localThread.messageCount} message
              {localThread.messageCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={pending}
            className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-[12px] text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
            title="Delete conversation"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span className="hidden sm:inline">Delete</span>
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar px-3.5 py-4 sm:px-4">
          {localThread.messages.map((msg) => (
            <article
              key={msg.id}
              className="w-full rounded-2xl rounded-bl-md bg-surface-container-high/80 px-3.5 py-2.5"
            >
              <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[12px] font-medium text-on-surface">{msg.name}</span>
                <time className="text-[10px] text-on-surface-variant">
                  {formatMessageTime(msg.createdAt)}
                </time>
              </div>
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-on-surface/95">
                {msg.message}
              </p>
            </article>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete conversation?"
        message={`Remove all messages from ${localThread.email}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteThread}
        onCancel={() => setConfirmDelete(false)}
      />

      <StatusModal
        open={Boolean(flash)}
        type={flash?.type === "error" ? "error" : "success"}
        message={flash?.text}
        onClose={() => setFlash(null)}
        autoCloseMs={2000}
      />
    </div>
  );
}
