"use client";

import { useActionState, useEffect, useState } from "react";
import { saveMentorshipContentAction } from "@/app/dashboard-araf/mentorshipActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import ItemActionsMenu from "@/components/dashboard/ItemActionsMenu";
import {
  createEmptyMentorshipItem,
  normalizeMentorshipContent,
} from "@/lib/mentorshipContent";

const initialState = { error: null, success: false, message: null, content: null };

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

export default function MentorshipEditor({ initialContent }) {
  const [state, formAction, pending] = useActionState(
    saveMentorshipContentAction,
    initialState
  );
  const [content, setContent] = useState(() =>
    normalizeMentorshipContent(initialContent)
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeMentorshipContent(initialContent))
  );
  const [flash, setFlash] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (state?.success && state.content) {
      const next = normalizeMentorshipContent(state.content);
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

  const updateStats = (patch) => {
    setContent((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...patch },
    }));
  };

  const requestRemoveItem = (item, index) => {
    setPendingRemove({
      id: item.id,
      label: item.program || `Mentorship ${index + 1}`,
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
      items: [...prev.items, createEmptyMentorshipItem()],
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
            <label className={labelClass} htmlFor="mentorship-title">
              Header title
            </label>
            <input
              id="mentorship-title"
              value={content.title}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, title: e.target.value }))
              }
              className={fieldClass}
              placeholder="Mentorship"
              required
            />
          </div>
        </section>

        <section className="space-y-3 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              analytics
            </span>
            <h2 className="text-[15px] font-medium text-on-surface">Stats</h2>
          </div>
          <div>
            <label className={labelClass} htmlFor="mentorship-stats-mentees">
              Mentees
            </label>
            <input
              id="mentorship-stats-mentees"
              value={content.stats.mentees}
              onChange={(e) => updateStats({ mentees: e.target.value })}
              className={fieldClass}
              placeholder="8+"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="mentorship-stats-programs">
              Programs
            </label>
            <input
              id="mentorship-stats-programs"
              value={content.stats.programs}
              onChange={(e) => updateStats({ programs: e.target.value })}
              className={fieldClass}
              placeholder="3"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="mentorship-stats-active">
              Active
            </label>
            <input
              id="mentorship-stats-active"
              value={content.stats.active}
              onChange={(e) => updateStats({ active: e.target.value })}
              className={fieldClass}
              placeholder="4yr"
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
                  school
                </span>
                <h2 className="truncate text-[15px] font-medium text-on-surface">
                  {item.program || `Mentorship ${index + 1}`}
                </h2>
              </div>
              <ItemActionsMenu
                label={item.program || `Mentorship ${index + 1}`}
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
              <label className={labelClass} htmlFor={`program-${item.id}`}>
                Program
              </label>
              <input
                id={`program-${item.id}`}
                value={item.program}
                onChange={(e) => updateItem(item.id, { program: e.target.value })}
                className={fieldClass}
                placeholder="Google Summer of Code"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`role-${item.id}`}>
                Role
              </label>
              <input
                id={`role-${item.id}`}
                value={item.role}
                onChange={(e) => updateItem(item.id, { role: e.target.value })}
                className={fieldClass}
                placeholder="Mentor"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`period-${item.id}`}>
                Period
              </label>
              <input
                id={`period-${item.id}`}
                value={item.period}
                onChange={(e) => updateItem(item.id, { period: e.target.value })}
                className={fieldClass}
                placeholder="2023 — Present"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`mentees-${item.id}`}>
                Mentees
              </label>
              <input
                id={`mentees-${item.id}`}
                value={item.mentees}
                onChange={(e) => updateItem(item.id, { mentees: e.target.value })}
                className={fieldClass}
                placeholder="6"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`topics-${item.id}`}>
                Topics (one per line)
              </label>
              <textarea
                id={`topics-${item.id}`}
                rows={3}
                value={item.topics.join("\n")}
                onChange={(e) =>
                  updateItem(item.id, { topics: e.target.value.split("\n") })
                }
                className={`${fieldClass} min-h-[72px] resize-y`}
                placeholder={"Open Source\nDistributed Systems"}
              />
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
                placeholder="Short description of the mentorship…"
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
            Add mentorship
          </button>

          <button
            type="submit"
            disabled={pending || !content.items.length || !isDirty}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {pending ? "Saving…" : "Save Mentorship"}
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
