"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
  deleteGeminiApiKeyAction,
  saveGeminiApiKeyAction,
  setGeminiApiKeyActiveAction,
  setGeminiApiKeyCurrentAction,
} from "@/app/dashboard-araf/geminiKeyActions";
import { ConfirmModal, StatusModal } from "@/components/dashboard/Modal";
import PasswordField from "@/components/dashboard/PasswordField";
import { MAX_ACTIVE_GEMINI_KEYS } from "@/lib/geminiKey";

const initialState = {
  error: null,
  success: false,
  message: null,
  status: null,
};

const fieldClass =
  "h-10 rounded-lg border-0 bg-surface-container-high px-3 pr-10 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

function formatWhen(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function GeminiApiKeyForm({ initialStatus }) {
  const [state, formAction, pending] = useActionState(
    saveGeminiApiKeyAction,
    initialState
  );
  const [status, setStatus] = useState(initialStatus);
  const [apiKey, setApiKey] = useState("");
  const [keyName, setKeyName] = useState("");
  const [flash, setFlash] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toggling, startToggle] = useTransition();

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    if (state?.success && state.status) {
      setStatus(state.status);
      setApiKey("");
      setKeyName("");
    }
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

  const keys = Array.isArray(status?.keys) ? status.keys : [];
  const activeCount = status?.activeCount ?? keys.filter((k) => k.isActive).length;
  const maxActive = status?.maxActive ?? MAX_ACTIVE_GEMINI_KEYS;
  const hasError = Boolean(status?.lastError);
  const configured = Boolean(status?.configured);
  const atActiveLimit = activeCount >= maxActive;
  const busy = pending || toggling;

  const toggleKey = (item) => {
    if (!item?.id || busy) return;
    const next = !item.isActive;
    if (next && atActiveLimit) {
      setFlash({
        type: "error",
        text: `At most ${maxActive} keys can be active. Turn one off first.`,
      });
      return;
    }
    startToggle(async () => {
      const result = await setGeminiApiKeyActiveAction(item.id, next);
      if (result?.success && result.status) {
        setStatus(result.status);
        setFlash({ type: "success", text: result.message || "Key updated." });
      } else {
        setFlash({
          type: "error",
          text: result?.error || "Could not update key.",
        });
      }
    });
  };

  const setInUse = (item) => {
    if (!item?.id || busy || !item.isActive || item.isCurrent) return;
    startToggle(async () => {
      const result = await setGeminiApiKeyCurrentAction(item.id);
      if (result?.success && result.status) {
        setStatus(result.status);
        setFlash({ type: "success", text: result.message || "In-use key updated." });
      } else {
        setFlash({
          type: "error",
          text: result?.error || "Could not set in-use key.",
        });
      }
    });
  };

  const confirmDeleteKey = () => {
    if (!confirmDelete || busy) return;
    const id = confirmDelete.id;
    setConfirmDelete(null);
    startToggle(async () => {
      const result = await deleteGeminiApiKeyAction(id);
      if (result?.success && result.status) {
        setStatus(result.status);
        setFlash({ type: "success", text: result.message || "API key removed." });
      } else {
        setFlash({
          type: "error",
          text: result?.error || "Could not delete key.",
        });
      }
    });
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className={`material-symbols-outlined mt-0.5 text-[22px] ${
              hasError ? "text-error" : configured ? "text-secondary" : "text-primary/70"
            } ${!hasError && !configured ? "rotate-90" : ""}`}
          >
            {hasError ? "error" : configured ? "check_circle" : "key"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-on-surface">
              {hasError
                ? "One or more keys need attention"
                : configured
                  ? `${activeCount}/${maxActive} active · ${keys.length} saved`
                  : "No API key yet"}
            </p>
            <p className="mt-1 text-[13px] text-on-surface-variant">
              Keep up to {maxActive} keys Active. Use the small In use checkbox (one at a time)
              to pick which active key chat uses first — its toggle turns green. Other Active
              keys stay on standby. If the in-use key dies, it turns off and the next standby
              becomes in use. Stored in Supabase only — never in{" "}
              <code className="font-label-mono">.env</code> or AI knowledge.
            </p>

            {hasError ? (
              <div
                className="mt-3 rounded-lg border border-error/30 bg-error-container/20 px-3 py-2.5"
                role="alert"
              >
                <p className="text-[12px] font-medium text-error">Runtime error</p>
                <p className="mt-1 text-[12px] leading-relaxed text-on-surface-variant">
                  {status.lastError}
                </p>
                {status.lastErrorAt ? (
                  <p className="mt-1 font-label-mono text-[10px] text-on-surface-variant/70">
                    {formatWhen(status.lastErrorAt)}
                  </p>
                ) : null}
                <p className="mt-2 text-[12px] text-on-surface-variant">
                  Exhausted keys are turned off automatically. Turn on another saved key or add
                  a new one. Visitors still get a funny fallback — they never see this error.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {keys.length > 0 ? (
        <section className="space-y-2 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined rotate-90 text-[18px] text-primary">
                key
              </span>
              <h2 className="text-[15px] font-medium text-on-surface">Saved keys</h2>
            </div>
            <p className="font-label-mono text-[10px] text-on-surface-variant">
              {activeCount}/{maxActive} active
            </p>
          </div>
          <ul className="divide-y divide-border/50">
            {keys.map((item) => {
              const turnOnBlocked = !item.isActive && atActiveLimit;
              const inUse = Boolean(item.isActive && item.isCurrent);
              const label = item.isActive ? "Active" : "Inactive";
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 py-3 first:pt-1 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-on-surface">
                      {item.name || "Untitled key"}
                    </p>
                    <p className="mt-0.5 font-label-mono text-[11px] text-on-surface-variant">
                      {item.masked}
                      {item.createdAt ? ` · ${formatWhen(item.createdAt)}` : ""}
                    </p>
                    {item.lastError ? (
                      <p className="mt-1 text-[11px] text-error line-clamp-2">
                        {item.lastError}
                      </p>
                    ) : null}
                  </div>

                  <label
                    htmlFor={`gemini-in-use-${item.id}`}
                    className={`inline-flex items-center gap-1 select-none ${
                      item.isActive ? "cursor-pointer" : "cursor-not-allowed opacity-45"
                    }`}
                    title={
                      !item.isActive
                        ? "Turn Active first"
                        : inUse
                          ? "Currently in use for chat"
                          : "Mark as in use"
                    }
                  >
                    <input
                      id={`gemini-in-use-${item.id}`}
                      type="checkbox"
                      checked={inUse}
                      disabled={busy || !item.isActive}
                      onChange={() => setInUse(item)}
                      className="h-3.5 w-3.5 cursor-pointer rounded border-border accent-secondary disabled:cursor-not-allowed"
                    />
                    <span
                      className={`text-[10px] ${
                        inUse ? "text-secondary" : "text-on-surface-variant/80"
                      }`}
                    >
                      In use
                    </span>
                  </label>

                  <label
                    htmlFor={`gemini-key-${item.id}`}
                    className="inline-flex cursor-pointer items-center gap-1.5 select-none"
                    title={
                      turnOnBlocked
                        ? `At most ${maxActive} active`
                        : item.isActive
                          ? "Turn off"
                          : "Turn on"
                    }
                  >
                    <span
                      className={`text-[10px] ${
                        inUse ? "text-secondary" : "text-on-surface-variant/80"
                      }`}
                    >
                      {label}
                    </span>
                    <button
                      id={`gemini-key-${item.id}`}
                      type="button"
                      role="switch"
                      aria-checked={item.isActive}
                      aria-label={`${item.name || item.masked}: ${
                        item.isActive ? (inUse ? "active in use" : "active standby") : "inactive"
                      }`}
                      disabled={busy || turnOnBlocked}
                      onClick={() => toggleKey(item)}
                      className={`relative h-4 w-7 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                        inUse
                          ? "bg-secondary"
                          : item.isActive
                            ? "bg-on-surface-variant/55"
                            : "bg-surface-container-high"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full shadow-sm transition-transform ${
                          item.isActive ? "translate-x-3" : "translate-x-0"
                        } ${inUse ? "bg-on-secondary" : "bg-on-surface"}`}
                      />
                    </button>
                  </label>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setConfirmDelete(item)}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-high hover:text-error disabled:opacity-50"
                    title="Delete key"
                    aria-label="Delete key"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <form action={formAction} className="space-y-4 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
        <div>
          <label className="mb-1.5 block text-[12px] text-on-surface-variant" htmlFor="gemini-key-name">
            Key name
          </label>
          <input
            id="gemini-key-name"
            name="name"
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="h-10 w-full rounded-lg border-0 bg-surface-container-high px-3 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow"
            placeholder="e.g. Personal free tier"
            maxLength={60}
            required
            disabled={busy}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] text-on-surface-variant" htmlFor="gemini-api-key">
            Gemini API key
          </label>
          <PasswordField
            id="gemini-api-key"
            name="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className={fieldClass}
            placeholder="Paste Gemini API key"
            autoComplete="off"
            required
            disabled={busy}
          />
          <p className="mt-1.5 text-[11px] text-on-surface-variant">
            New keys turn on automatically if you are under {maxActive} active. Order stays the
            same when you toggle.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={busy || !apiKey.trim() || !keyName.trim()}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {pending ? "Saving…" : "Add key"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={Boolean(confirmDelete)}
        title="Delete API key?"
        message={
          confirmDelete
            ? `Remove “${confirmDelete.name || confirmDelete.masked}”? You can always add it again later.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={confirmDeleteKey}
        onCancel={() => setConfirmDelete(null)}
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
