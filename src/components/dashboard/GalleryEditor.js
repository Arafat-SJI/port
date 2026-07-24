"use client";

import { useActionState, useEffect, useState } from "react";
import { saveGalleryContentAction } from "@/app/dashboard-araf/galleryActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import ItemActionsMenu from "@/components/dashboard/ItemActionsMenu";
import {
  createEmptyGalleryItem,
  normalizeGalleryContent,
} from "@/lib/galleryContent";

const initialState = { error: null, success: false, message: null, content: null };

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

export default function GalleryEditor({ initialContent }) {
  const [state, formAction, pending] = useActionState(
    saveGalleryContentAction,
    initialState
  );
  const [content, setContent] = useState(() =>
    normalizeGalleryContent(initialContent)
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeGalleryContent(initialContent))
  );
  const [flash, setFlash] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (state?.success && state.content) {
      const next = normalizeGalleryContent(state.content);
      setContent(next);
      setSavedSnapshot(JSON.stringify(next));
    }
  }, [state]);

  useEffect(() => {
    if (state?.error) {
      setFlash({ type: "error", text: state.error });
      return;
    }
    if (state?.success && state.message) {
      setFlash({ type: "success", text: state.message });
    }
  }, [state]);

  useEffect(() => {
    if (!flash) return undefined;
    const timer = window.setTimeout(() => setFlash(null), 2000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const closeFlash = () => setFlash(null);

  const updateItem = (id, patch) => {
    setContent((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  };

  const requestRemoveItem = (item, index) => {
    setPendingRemove({
      id: item.id,
      label: item.caption || `Gallery ${index + 1}`,
    });
  };

  const confirmRemoveItem = () => {
    if (!pendingRemove) return;
    const label = pendingRemove.label;
    setContent((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== pendingRemove.id),
    }));
    setPendingRemove(null);
    setFlash({
      type: "success",
      title: "Deleted",
      text: `“${label}” removed. Save to apply on the portfolio.`,
    });
  };

  const addItem = () => {
    setContent((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyGalleryItem()],
    }));
  };

  const moveItem = (id, direction) => {
    setContent((prev) => {
      const items = [...prev.items];
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) return prev;
      const next = index + direction;
      if (next < 0 || next >= items.length) return prev;
      const [moved] = items.splice(index, 1);
      items.splice(next, 0, moved);
      return { ...prev, items };
    });
  };

  const isDirty = JSON.stringify(content) !== savedSnapshot;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="payload" value={JSON.stringify(content)} />

        <section className="space-y-3 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              title
            </span>
            <h2 className="text-[15px] font-medium text-on-surface">Section header</h2>
          </div>
          <div>
            <label className={labelClass} htmlFor="gallery-title">
              Header title
            </label>
            <input
              id="gallery-title"
              value={content.title}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, title: e.target.value }))
              }
              className={fieldClass}
              placeholder="Gallery"
              required
            />
          </div>
        </section>

        {content.items.map((item, index) => (
          <section
            key={item.id}
            className={`space-y-4 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5 ${
              item.visible ? "" : "opacity-70"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  photo_library
                </span>
                <h2 className="truncate text-[15px] font-medium text-on-surface">
                  {item.caption || `Gallery ${index + 1}`}
                </h2>
              </div>
              <ItemActionsMenu
                label={item.caption || `Gallery ${index + 1}`}
                visible={item.visible !== false}
                onToggleVisible={(next) => updateItem(item.id, { visible: next })}
                onDelete={() => requestRemoveItem(item, index)}
                onMoveUp={() => moveItem(item.id, -1)}
                onMoveDown={() => moveItem(item.id, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < content.items.length - 1}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`caption-${item.id}`}>
                Caption
              </label>
              <input
                id={`caption-${item.id}`}
                value={item.caption}
                onChange={(e) => updateItem(item.id, { caption: e.target.value })}
                className={fieldClass}
                placeholder="DevFest Keynote"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`imageUrl-${item.id}`}>
                Image URL
              </label>
              <input
                id={`imageUrl-${item.id}`}
                value={item.imageUrl}
                onChange={(e) => updateItem(item.id, { imageUrl: e.target.value })}
                className={fieldClass}
                placeholder="https://…"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`imageAlt-${item.id}`}>
                Image alt text
              </label>
              <input
                id={`imageAlt-${item.id}`}
                value={item.imageAlt}
                onChange={(e) => updateItem(item.id, { imageAlt: e.target.value })}
                className={fieldClass}
                placeholder="Describe the image"
              />
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2 text-[12px] text-on-surface-variant">
              <input
                type="checkbox"
                checked={Boolean(item.wide)}
                onChange={(e) => updateItem(item.id, { wide: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              Wide layout
            </label>

            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.imageAlt || item.caption || ""}
                className="h-28 w-full rounded-lg object-cover bg-surface-container"
              />
            ) : null}
          </section>
        ))}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-4 text-[13px] font-semibold text-primary transition hover:border-primary/55 hover:bg-primary/15"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add gallery item
          </button>

          <button
            type="submit"
            disabled={pending || !content.items.length || !isDirty}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {pending ? "Saving…" : "Save Gallery"}
          </button>
        </div>
      </form>

      <StatusModal
        open={Boolean(flash)}
        type={flash?.type === "error" ? "error" : "success"}
        title={flash?.title}
        message={flash?.text}
        onClose={closeFlash}
        autoCloseMs={2000}
      />

      <ConfirmModal
        open={Boolean(pendingRemove)}
        title="Are you sure?"
        message={
          pendingRemove
            ? `Remove “${pendingRemove.label}”? This will be deleted after you save.`
            : null
        }
        confirmLabel="Delete"
        onCancel={() => setPendingRemove(null)}
        onConfirm={confirmRemoveItem}
      />
    </div>
  );
}
