"use client";

import { useActionState, useEffect, useState } from "react";
import { savePublicationContentAction } from "@/app/dashboard-araf/publicationActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import ItemActionsMenu from "@/components/dashboard/ItemActionsMenu";
import {
  createEmptyPublicationItem,
  normalizePublicationContent,
} from "@/lib/publicationContent";

const initialState = { error: null, success: false, message: null, content: null };

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

export default function PublicationEditor({ initialContent }) {
  const [state, formAction, pending] = useActionState(
    savePublicationContentAction,
    initialState
  );
  const [content, setContent] = useState(() =>
    normalizePublicationContent(initialContent)
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizePublicationContent(initialContent))
  );
  const [flash, setFlash] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (state?.success && state.content) {
      const next = normalizePublicationContent(state.content);
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
      label: item.title || item.venue || `Publication ${index + 1}`,
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
      items: [...prev.items, createEmptyPublicationItem()],
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
        <input type="hidden" name="title" value={content.title} />
        <input type="hidden" name="items" value={JSON.stringify(content.items)} />

        <section className="space-y-3 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              title
            </span>
            <h2 className="text-[15px] font-medium text-on-surface">Section header</h2>
          </div>
          <div>
            <label className={labelClass} htmlFor="publication-title">
              Header title
            </label>
            <input
              id="publication-title"
              value={content.title}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, title: e.target.value }))
              }
              className={fieldClass}
              placeholder="Publication"
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
                  menu_book
                </span>
                <h2 className="truncate text-[15px] font-medium text-on-surface">
                  {item.title || item.venue || `Publication ${index + 1}`}
                </h2>
              </div>
              <ItemActionsMenu
                label={item.title || item.venue || `Publication ${index + 1}`}
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
              <label className={labelClass} htmlFor={`title-${item.id}`}>
                Title
              </label>
              <input
                id={`title-${item.id}`}
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                className={fieldClass}
                placeholder="Paper or article title"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`authors-${item.id}`}>
                Authors
              </label>
              <input
                id={`authors-${item.id}`}
                value={item.authors}
                onChange={(e) => updateItem(item.id, { authors: e.target.value })}
                className={fieldClass}
                placeholder="A. Rahman, J. Chen"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`venue-${item.id}`}>
                Venue
              </label>
              <input
                id={`venue-${item.id}`}
                value={item.venue}
                onChange={(e) => updateItem(item.id, { venue: e.target.value })}
                className={fieldClass}
                placeholder="IEEE Cloud Computing"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor={`type-${item.id}`}>
                  Type
                </label>
                <input
                  id={`type-${item.id}`}
                  value={item.type}
                  onChange={(e) => updateItem(item.id, { type: e.target.value })}
                  className={fieldClass}
                  placeholder="Journal / Conference / Article"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor={`year-${item.id}`}>
                  Year
                </label>
                <input
                  id={`year-${item.id}`}
                  value={item.year}
                  onChange={(e) => updateItem(item.id, { year: e.target.value })}
                  className={fieldClass}
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor={`link-${item.id}`}>
                Link (optional)
              </label>
              <input
                id={`link-${item.id}`}
                type="url"
                value={item.link}
                onChange={(e) => updateItem(item.id, { link: e.target.value })}
                className={fieldClass}
                placeholder="https://…"
              />
            </div>
          </section>
        ))}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-4 text-[13px] font-semibold text-primary transition hover:border-primary/55 hover:bg-primary/15"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add publication
          </button>

          <button
            type="submit"
            disabled={pending || !content.items.length || !isDirty}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {pending ? "Saving…" : "Save Publication"}
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
