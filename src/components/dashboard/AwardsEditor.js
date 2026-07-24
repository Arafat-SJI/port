"use client";

import { useActionState, useEffect, useState } from "react";
import { saveAwardsContentAction } from "@/app/dashboard-araf/awardsActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import ItemActionsMenu from "@/components/dashboard/ItemActionsMenu";
import {
  createEmptyAwardsItem,
  normalizeAwardsContent,
} from "@/lib/awardsContent";

const initialState = { error: null, success: false, message: null, content: null };

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

export default function AwardsEditor({ initialContent }) {
  const [state, formAction, pending] = useActionState(
    saveAwardsContentAction,
    initialState
  );
  const [content, setContent] = useState(() =>
    normalizeAwardsContent(initialContent)
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeAwardsContent(initialContent))
  );
  const [flash, setFlash] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (state?.success && state.content) {
      const next = normalizeAwardsContent(state.content);
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
      label: item.title || item.issuer || `Award ${index + 1}`,
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
      items: [...prev.items, createEmptyAwardsItem()],
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
            <label className={labelClass} htmlFor="awards-title">
              Header title
            </label>
            <input
              id="awards-title"
              value={content.title}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, title: e.target.value }))
              }
              className={fieldClass}
              placeholder="Awards"
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
                  emoji_events
                </span>
                <h2 className="truncate text-[15px] font-medium text-on-surface">
                  {item.title || item.issuer || `Award ${index + 1}`}
                </h2>
              </div>
              <ItemActionsMenu
                label={item.title || item.issuer || `Award ${index + 1}`}
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
                placeholder="Best Developer Tool"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor={`issuer-${item.id}`}>
                  Issuer
                </label>
                <input
                  id={`issuer-${item.id}`}
                  value={item.issuer}
                  onChange={(e) => updateItem(item.id, { issuer: e.target.value })}
                  className={fieldClass}
                  placeholder="DevFest Bangladesh"
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
              <label className={labelClass} htmlFor={`description-${item.id}`}>
                Description
              </label>
              <textarea
                id={`description-${item.id}`}
                rows={3}
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, { description: e.target.value })
                }
                className={`${fieldClass} min-h-[80px] resize-y`}
                placeholder="Short description of the award…"
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
            Add award
          </button>

          <button
            type="submit"
            disabled={pending || !content.items.length || !isDirty}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {pending ? "Saving…" : "Save Awards"}
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
