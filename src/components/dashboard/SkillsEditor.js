"use client";

import { useActionState, useEffect, useState } from "react";
import { saveSkillsContentAction } from "@/app/dashboard-araf/skillsActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import {
  createEmptySkillsGroup,
  normalizeSkillsContent,
} from "@/lib/skillsContent";

const initialState = { error: null, success: false, message: null, content: null };

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

function VisibilityToggle({ id, label, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-1.5 select-none"
      title={checked ? "Visible on portfolio" : "Hidden on portfolio"}
    >
      <span className="text-[10px] text-on-surface-variant/80">
        {checked ? "Shown" : "Hidden"}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? "shown" : "hidden"} on portfolio`}
        onClick={() => onChange(!checked)}
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
          checked ? "bg-on-surface-variant/55" : "bg-surface-container-high"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-on-surface shadow-sm transition-transform ${
            checked ? "translate-x-3" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

export default function SkillsEditor({ initialContent }) {
  const [state, formAction, pending] = useActionState(
    saveSkillsContentAction,
    initialState
  );
  const [content, setContent] = useState(() =>
    normalizeSkillsContent(initialContent)
  );
  const [flash, setFlash] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (state?.success && state.content) {
      setContent(normalizeSkillsContent(state.content));
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
    setContent((prev) => ({
      groups: prev.groups.filter((group) => group.id !== pendingRemove.id),
    }));
    setPendingRemove(null);
  };

  const addGroup = () => {
    setContent((prev) => ({
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
      return { groups };
    });
  };

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="groups" value={JSON.stringify(content.groups)} />

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
              <div className="flex flex-wrap items-center gap-2">
                <VisibilityToggle
                  id={`vis-${group.id}`}
                  label={group.title || `Group ${index + 1}`}
                  checked={group.visible !== false}
                  onChange={(next) => updateGroup(group.id, { visible: next })}
                />
                <button
                  type="button"
                  onClick={() => moveGroup(group.id, -1)}
                  disabled={index === 0}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move up"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveGroup(group.id, 1)}
                  disabled={index === content.groups.length - 1}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move down"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </button>
                <button
                  type="button"
                  onClick={() => requestRemoveGroup(group, index)}
                  className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md bg-error-container/20 px-2 text-[11px] text-error transition hover:bg-error-container/35"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Remove
                </button>
              </div>
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

        <button
          type="button"
          onClick={addGroup}
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-container-lowest/60 px-4 text-[13px] font-medium text-on-surface-variant transition hover:border-primary/40 hover:text-on-surface sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add skill group
        </button>

        <button
          type="submit"
          disabled={pending || !content.groups.length}
          className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          {pending ? "Saving…" : "Save Skills"}
        </button>
      </form>

      <StatusModal
        open={Boolean(flash)}
        type={flash?.type === "error" ? "error" : "success"}
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
        confirmLabel="Remove"
        onCancel={() => setPendingRemove(null)}
        onConfirm={confirmRemoveGroup}
      />
    </div>
  );
}
