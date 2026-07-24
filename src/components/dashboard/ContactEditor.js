"use client";

import { useActionState, useEffect, useState } from "react";
import { saveContactContentAction } from "@/app/dashboard-araf/contactActions";
import { StatusModal } from "@/components/dashboard/Modal";
import {
  CONTACT_SOCIAL_PLATFORMS,
  getSocialPlatformMeta,
  normalizeContactContent,
} from "@/lib/contactContent";

const initialState = { error: null, success: false, message: null, content: null };

const fieldClass =
  "w-full rounded-lg border-0 bg-surface-container-high px-3 py-2.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow";

const labelClass = "block text-[12px] text-on-surface-variant mb-1.5";

export default function ContactEditor({ initialContent }) {
  const [state, formAction, pending] = useActionState(
    saveContactContentAction,
    initialState
  );
  const [content, setContent] = useState(() =>
    normalizeContactContent(initialContent)
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(normalizeContactContent(initialContent))
  );
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (state?.success && state.content) {
      const next = normalizeContactContent(state.content);
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

  const updateSocial = (platform, patch) => {
    setContent((prev) => ({
      ...prev,
      socials: prev.socials.map((item) =>
        item.platform === platform ? { ...item, ...patch } : item
      ),
    }));
  };

  const isDirty = JSON.stringify(content) !== savedSnapshot;
  const persistable = {
    intro: content.intro,
    email: content.email,
    githubLabel: content.githubLabel,
    githubUrl: content.githubUrl,
    socials: content.socials,
  };

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="payload" value={JSON.stringify(persistable)} />

        <section className="space-y-3 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              terminal
            </span>
            <h2 className="text-[15px] font-medium text-on-surface">Terminal intro</h2>
          </div>
          <div>
            <label className={labelClass} htmlFor="contact-intro">
              Intro (README.md)
            </label>
            <textarea
              id="contact-intro"
              rows={3}
              value={content.intro}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, intro: e.target.value }))
              }
              className={`${fieldClass} min-h-[80px] resize-y`}
              placeholder="Happy to connect…"
              required
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              alternate_email
            </span>
            <h2 className="text-[15px] font-medium text-on-surface">whoami --contact</h2>
          </div>

          <div>
            <label className={labelClass} htmlFor="contact-email">
              Email (clickable mailto)
            </label>
            <input
              id="contact-email"
              type="email"
              value={content.email}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, email: e.target.value }))
              }
              className={fieldClass}
              placeholder="hello@example.com"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="contact-github-url">
              GitHub URL (clickable)
            </label>
            <input
              id="contact-github-url"
              type="url"
              value={content.githubUrl}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, githubUrl: e.target.value }))
              }
              className={fieldClass}
              placeholder="https://github.com/username"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">
              share
            </span>
            <h2 className="text-[15px] font-medium text-on-surface">Social links</h2>
          </div>
          <p className="text-[12px] text-on-surface-variant">
            Shown as <span className="text-on-surface">linkedin | facebook | …</span> when a URL
            is set. Leave blank to hide.
          </p>

          {CONTACT_SOCIAL_PLATFORMS.map((platform) => {
            const item = content.socials.find((s) => s.platform === platform.id);
            const meta = getSocialPlatformMeta(platform.id);
            return (
              <div
                key={platform.id}
                className="grid gap-3 rounded-lg bg-surface-container-high/40 p-3 sm:grid-cols-[120px_1fr]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden
                  />
                  <span className="text-[13px] font-medium capitalize" style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                </div>
                <input
                  type="url"
                  value={item?.url ?? ""}
                  onChange={(e) => updateSocial(platform.id, { url: e.target.value })}
                  className={fieldClass}
                  placeholder={`https://… (${meta.label})`}
                  aria-label={`${meta.label} URL`}
                />
              </div>
            );
          })}
        </section>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={pending || !isDirty}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {pending ? "Saving…" : "Save Contact"}
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
    </div>
  );
}
