"use client";

import { useActionState, useEffect, useState } from "react";
import { saveSkillsContentAction } from "@/app/dashboard-araf/skillsActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import ItemActionsMenu from "@/components/dashboard/ItemActionsMenu";
import {
  createEmptySkillsGroup,
  normalizeSkillsContent,
} from "@/lib/skillsContent";

const initialState = { error: null, success: false, message: null, content: null };

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

export default function SkillsEditor({ initialContent }) {
  const [state, formAction, pending] = useActionState(
    saveSkillsContentAction,
    initialState
  );
  const [content, setContent] = useState(() =>
    normalizeSkillsContent(initialContent)
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeSkillsContent(initialContent))
  );
  const [flash, setFlash] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (state?.success && state.content) {
      const next = normalizeSkillsContent(state.content);
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

  const updateGroup = (id, patch) => {
    setContent((prev) => ({
      ...prev,
      groups: prev.groups.map((group) =>
        group.id === id ? { ...group, ...patch } : group
      ),
    }));
  };

  const requestRemoveGroup = (group, index) => {
    setPendingRemove({
      id: group.id,
      label: group.title || `Group ${index + 1}`,
    });
  };

  const confirmRemoveGroup = () => {
    if (!pendingRemove) return;
    const label = pendingRemove.label;
    setContent((prev) => ({
      ...prev,
      groups: prev.groups.filter((group) => group.id !== pendingRemove.id),
    }));
    setPendingRemove(null);
    setFlash({
      type: "success",
      title: "Deleted",
      text: `“${label}” removed. Save to apply on the portfolio.`,
    });
  };

  const addGroup = () => {
    setContent((prev) => ({
      ...prev,
      groups: [...prev.groups, createEmptySkillsGroup()],
    }));
  };

  const moveGroup = (id, direction) => {
    setContent((prev) => {
      const groups = [...prev.groups];
      const index = groups.findIndex((group) => group.id === id);
      if (index < 0) return prev;
      const next = index + direction;
      if (next < 0 || next >= groups.length) return prev;
      const [moved] = groups.splice(index, 1);
      groups.splice(next, 0, moved);
      return { ...prev, groups };
    });
  };

  const isDirty = JSON.stringify(content) !== savedSnapshot;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="title" value={content.title} />
        <input type="hidden" name="groups" value={JSON.stringify(content.groups)} />

        <section className="space-y-3 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              title
            </span>
            <h2 className="text-[15px] font-medium text-on-surface">Section header</h2>
          </div>
          <div>
            <label className={labelClass} htmlFor="skills-title">
              Header title
            </label>
            <input
              id="skills-title"
              value={content.title}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, title: e.target.value }))
              }
              className={fieldClass}
              placeholder="Tech Stack"
              required
            />
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {content.groups.map((group, index) => (
          <section
            key={group.id}
            className={`space-y-4 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5 ${
              group.visible ? "" : "opacity-70"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  category
                </span>
                <h2 className="truncate text-[15px] font-medium text-on-surface">
                  {group.title || `Group ${index + 1}`}
                </h2>
              </div>
              <ItemActionsMenu
                label={group.title || `Group ${index + 1}`}
                visible={group.visible !== false}
                onToggleVisible={(next) => updateGroup(group.id, { visible: next })}
                onDelete={() => requestRemoveGroup(group, index)}
                onMoveUp={() => moveGroup(group.id, -1)}
                onMoveDown={() => moveGroup(group.id, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < content.groups.length - 1}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`title-${group.id}`}>
                Category title
              </label>
              <input
                id={`title-${group.id}`}
                value={group.title}
                onChange={(e) => updateGroup(group.id, { title: e.target.value })}
                className={fieldClass}
                placeholder="Frontend"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={`items-${group.id}`}>
                Skills (one per line)
              </label>
              <textarea
                id={`items-${group.id}`}
                rows={4}
                value={group.items.join("\n")}
                onChange={(e) =>
                  updateGroup(group.id, {
                    items: e.target.value.split("\n"),
                  })
                }
                className={`${fieldClass} min-h-[96px] resize-y`}
                placeholder={"React\nNext.js\nTailwind"}
              />
            </div>
          </section>
        ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={addGroup}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-4 text-[13px] font-semibold text-primary transition hover:border-primary/55 hover:bg-primary/15"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add skill group
          </button>

          <button
            type="submit"
            disabled={pending || !content.groups.length || !isDirty}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {pending ? "Saving…" : "Save Skills"}
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
        onConfirm={confirmRemoveGroup}
      />
    </div>
  );
}
