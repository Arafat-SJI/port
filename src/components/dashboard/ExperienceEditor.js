"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveExperienceContentAction } from "@/app/dashboard-araf/experienceActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import ItemActionsMenu from "@/components/dashboard/ItemActionsMenu";
import {
  createEmptyExperienceItem,
  formatExperienceDateDisplay,
  formatExperienceMeta,
  fromDateInputValue,
  normalizeExperienceContent,
  toDateInputValue,
  WORK_MODE_OPTIONS,
} from "@/lib/experienceContent";

const initialState = { error: null, success: false, message: null, content: null };

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const selectClass = `${fieldClass} cursor-pointer appearance-none bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat pr-9`;

const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

function DatePickerField({
  id,
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "Select date",
  displayOverride = null,
}) {
  const inputRef = useRef(null);
  const display =
    displayOverride ?? (value ? formatExperienceDateDisplay(value) : "");

  const openPicker = () => {
    if (disabled) return;
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      try {
        el.showPicker();
        return;
      } catch {
        /* fall through */
      }
    }
    el.focus();
    el.click();
  };

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <div
          className={`${fieldClass} flex items-center justify-between gap-2 ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <span className={display ? "text-on-surface" : "text-on-surface-variant/45"}>
            {display || placeholder}
          </span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant/70">
            calendar_today
          </span>
        </div>
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={toDateInputValue(value)}
          onChange={(e) => onChange(fromDateInputValue(e.target.value))}
          onClick={openPicker}
          disabled={disabled}
          className={`absolute inset-0 h-full w-full cursor-pointer opacity-0 ${
            disabled ? "pointer-events-none" : ""
          }`}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default function ExperienceEditor({ initialContent }) {
  const [state, formAction, pending] = useActionState(
    saveExperienceContentAction,
    initialState
  );
  const [content, setContent] = useState(() =>
    normalizeExperienceContent(initialContent)
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeExperienceContent(initialContent))
  );
  const [flash, setFlash] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  useEffect(() => {
    if (state?.success && state.content) {
      const next = normalizeExperienceContent(state.content);
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
      label: item.company || item.role || `Experience ${index + 1}`,
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
      items: [...prev.items, createEmptyExperienceItem()],
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
            <label className={labelClass} htmlFor="experience-title">
              Header title
            </label>
            <input
              id="experience-title"
              value={content.title}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, title: e.target.value }))
              }
              className={fieldClass}
              placeholder="Experience"
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
                  work
                </span>
                <h2 className="truncate text-[15px] font-medium text-on-surface">
                  {item.company || item.role || `Experience ${index + 1}`}
                </h2>
              </div>
              <ItemActionsMenu
                label={item.company || item.role || `Experience ${index + 1}`}
                visible={item.visible !== false}
                onToggleVisible={(next) => updateItem(item.id, { visible: next })}
                onDelete={() => requestRemoveItem(item, index)}
                onMoveUp={() => moveItem(item.id, -1)}
                onMoveDown={() => moveItem(item.id, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < content.items.length - 1}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor={`company-${item.id}`}>
                  Company
                </label>
                <input
                  id={`company-${item.id}`}
                  value={item.company}
                  onChange={(e) => updateItem(item.id, { company: e.target.value })}
                  className={fieldClass}
                  placeholder="SJ Innovation"
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor={`companyUrl-${item.id}`}>
                  Company link (optional)
                </label>
                <input
                  id={`companyUrl-${item.id}`}
                  type="url"
                  value={item.companyUrl}
                  onChange={(e) => updateItem(item.id, { companyUrl: e.target.value })}
                  className={fieldClass}
                  placeholder="https://company.com"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor={`role-${item.id}`}>
                  Role / title
                </label>
                <input
                  id={`role-${item.id}`}
                  value={item.role}
                  onChange={(e) => updateItem(item.id, { role: e.target.value })}
                  className={fieldClass}
                  placeholder="Jr. Software Engineer"
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor={`workMode-${item.id}`}>
                  On-site / Remote
                </label>
                <select
                  id={`workMode-${item.id}`}
                  value={item.workMode || ""}
                  onChange={(e) => updateItem(item.id, { workMode: e.target.value })}
                  className={selectClass}
                  style={{ backgroundImage: selectChevron }}
                >
                  <option value="">Select…</option>
                  {WORK_MODE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor={`employmentType-${item.id}`}>
                Employment type
              </label>
              <input
                id={`employmentType-${item.id}`}
                value={item.employmentType}
                onChange={(e) =>
                  updateItem(item.id, { employmentType: e.target.value })
                }
                className={fieldClass}
                placeholder="Full-time"
                autoComplete="off"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <DatePickerField
                id={`startDate-${item.id}`}
                label="Start date"
                value={item.startDate}
                onChange={(next) => updateItem(item.id, { startDate: next })}
              />
              <DatePickerField
                id={`endDate-${item.id}`}
                label="End date"
                value={item.current ? "" : item.endDate}
                onChange={(next) => updateItem(item.id, { endDate: next })}
                disabled={item.current}
                displayOverride={item.current ? "Present" : null}
              />
              <div>
                <label className={labelClass} htmlFor={`location-${item.id}`}>
                  Location
                </label>
                <input
                  id={`location-${item.id}`}
                  value={item.location}
                  onChange={(e) => updateItem(item.id, { location: e.target.value })}
                  className={fieldClass}
                  placeholder="Dhaka, Bangladesh"
                />
              </div>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2 text-[12px] text-on-surface-variant">
              <input
                type="checkbox"
                checked={item.current}
                onChange={(e) =>
                  updateItem(item.id, {
                    current: e.target.checked,
                    endDate: e.target.checked ? "Present" : "",
                  })
                }
                className="h-4 w-4 rounded border-border"
              />
              Currently working here
            </label>

            <div>
              <label className={labelClass} htmlFor={`bullets-${item.id}`}>
                Highlights (one per line)
              </label>
              <textarea
                id={`bullets-${item.id}`}
                rows={5}
                value={item.bullets.join("\n")}
                onChange={(e) =>
                  updateItem(item.id, {
                    bullets: e.target.value.split("\n"),
                  })
                }
                className={`${fieldClass} min-h-[120px] resize-y`}
                placeholder={"First achievement…\nSecond achievement…"}
              />
            </div>

            <p className="rounded-lg bg-surface-container-high/70 px-3 py-2 text-[12px] text-on-surface-variant">
              Preview meta:{" "}
              <span className="text-on-surface">{formatExperienceMeta(item) || "—"}</span>
            </p>
          </section>
        ))}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-4 text-[13px] font-semibold text-primary transition hover:border-primary/55 hover:bg-primary/15"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add experience
          </button>

          <button
            type="submit"
            disabled={pending || !content.items.length || !isDirty}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {pending ? "Saving…" : "Save Experience"}
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
