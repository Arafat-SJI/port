"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContactMessageAction } from "@/app/contactMessageActions";
import { StatusModal } from "@/components/dashboard/Modal";
import {
  getSocialPlatformMeta,
  getVisibleContactSocials,
  normalizeContactContent,
} from "@/lib/contactContent";
import { useExtensions } from "@/hooks/useExtensions";
import TerminalLiveCanvas from "@/components/ide/TerminalLiveCanvas";

const LIVE_SKINS = new Set(["pulse", "scan", "neon-wave"]);

const initialSubmitState = { error: null, success: false, message: null };

function Prompt({ children }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] leading-none">
      <span className="text-secondary select-none terminal-accent">➜</span>
      <span className="text-primary/80 select-none">~/connect</span>
      <span className="text-on-surface-variant/45 select-none">$</span>
      <span className="text-on-surface">{children}</span>
    </p>
  );
}

const fieldClass =
  "terminal-field w-full rounded-md border border-border/70 bg-surface-container/40 px-3 py-2 text-[13px] leading-snug text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-[border-color,box-shadow,background-color] focus:border-primary/50 focus:bg-surface-container/70 focus:shadow-[0_0_0_1px_rgb(173_198_255/0.18)]";

export default function ContactTerminal({ onCollapse, content }) {
  const contact = normalizeContactContent(content);
  const socials = getVisibleContactSocials(contact);
  const { isActive, terminalTheme } = useExtensions();
  const skin = isActive("terminal-theme") ? terminalTheme : "";
  const liveVariant = LIVE_SKINS.has(skin) ? skin : "";
  const formRef = useRef(null);
  const [flash, setFlash] = useState(null);
  const [submitState, formAction, pending] = useActionState(
    submitContactMessageAction,
    initialSubmitState
  );

  useEffect(() => {
    if (submitState?.success) {
      formRef.current?.reset();
      setFlash({
        type: "success",
        text: submitState.message || "Message sent successfully.",
      });
      return;
    }
    if (submitState?.error) {
      setFlash({ type: "error", text: submitState.error });
    }
  }, [submitState]);

  useEffect(() => {
    if (!flash) return undefined;
    const timer = window.setTimeout(() => setFlash(null), 2000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const closeFlash = () => setFlash(null);

  return (
    <section
      aria-label="Let's Connect terminal"
      data-terminal-skin={skin || undefined}
      className="contact-terminal relative w-full overflow-hidden border-t border-border bg-surface-container-lowest"
    >
      <TerminalLiveCanvas variant={liveVariant} />
      <header className="terminal-header relative z-[1] flex h-9 items-center gap-2.5 border-b border-border bg-surface-container-low/90 px-3.5">
        <span className="material-symbols-outlined !text-[16px] text-secondary terminal-accent">
          terminal
        </span>
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[13px] font-semibold tracking-wide text-on-surface">
            Let&apos;s Connect
          </span>
          <span className="hidden items-center rounded bg-surface-container-highest/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-on-surface-variant/80 sm:inline-flex">
            bash
          </span>
          <span className="hidden truncate text-[12px] text-on-surface-variant/55 font-code-sm md:inline">
            contact.sh
          </span>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          title="Back to Mentorship"
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined !text-[18px]">keyboard_arrow_up</span>
        </button>
      </header>

      <div className="relative z-[1] grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-3.5 border-b border-border px-4 py-4 font-code-sm md:border-b-0 md:border-r md:px-5">
          <div className="space-y-2">
            <Prompt>cat README.md</Prompt>
            <p className="terminal-panel rounded-md border border-border/50 bg-background/35 px-3 py-2.5 text-[13px] leading-relaxed text-on-surface/90">
              <span className="text-on-surface-variant/50"># </span>
              {contact.intro}
            </p>
          </div>

          <div className="space-y-2">
            <Prompt>whoami --contact</Prompt>
            <div className="terminal-panel space-y-1.5 rounded-md border border-border/50 bg-background/35 px-3 py-2.5">
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex flex-wrap items-center gap-2 text-[13px] transition-colors"
                >
                  <span className="text-secondary/70 terminal-accent">email</span>
                  <span className="text-on-surface-variant/40">=</span>
                  <span className="text-primary group-hover:underline underline-offset-2">
                    {contact.email}
                  </span>
                </a>
              ) : null}

              {contact.githubUrl ? (
                <a
                  href={contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-wrap items-center gap-2 text-[13px] transition-colors"
                >
                  <span className="text-secondary/70 terminal-accent">github</span>
                  <span className="text-on-surface-variant/40">=</span>
                  <span className="text-primary break-all group-hover:underline underline-offset-2">
                    {contact.githubUrl}
                  </span>
                </a>
              ) : null}

              {socials.length ? (
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                  <span className="text-secondary/70 terminal-accent">social</span>
                  <span className="text-on-surface-variant/40">=</span>
                  <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    {socials.map((item, index) => {
                      const meta = getSocialPlatformMeta(item.platform);
                      return (
                        <span key={item.id} className="inline-flex items-center gap-1.5">
                          {index > 0 ? (
                            <span className="text-on-surface-variant/35" aria-hidden>
                              |
                            </span>
                          ) : null}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline underline-offset-2 transition-opacity hover:opacity-90"
                            style={{ color: meta.color }}
                          >
                            {item.label}
                          </a>
                        </span>
                      );
                    })}
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          <p className="flex items-center gap-2 text-[13px] text-on-surface-variant/45">
            <span className="text-secondary select-none terminal-accent">➜</span>
            <span
              className="inline-block h-[14px] w-[7px] rounded-[1px] bg-secondary/75 animate-pulse terminal-cursor"
              aria-hidden
            />
          </p>
        </div>

        <form
          ref={formRef}
          action={formAction}
          className="space-y-3 px-4 py-4 font-code-sm md:px-5"
        >
          <Prompt>./send-message</Prompt>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/70">
                <span className="text-secondary/80 terminal-accent">--</span>
                <span className="uppercase tracking-[0.12em]">name</span>
              </span>
              <input
                className={fieldClass}
                placeholder="Your name"
                type="text"
                name="name"
                autoComplete="name"
                required
                disabled={pending}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/70">
                <span className="text-secondary/80 terminal-accent">--</span>
                <span className="uppercase tracking-[0.12em]">email</span>
              </span>
              <input
                className={fieldClass}
                placeholder="you@email.com"
                type="email"
                name="email"
                autoComplete="email"
                required
                disabled={pending}
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-[11px] text-on-surface-variant/70">
              <span className="text-secondary/80 terminal-accent">--</span>
              <span className="uppercase tracking-[0.12em]">message</span>
            </span>
            <textarea
              className={`${fieldClass} custom-scrollbar resize-none`}
              placeholder="How can I help?"
              name="message"
              rows={3}
              required
              disabled={pending}
            />
          </label>

          <button
            type="submit"
            disabled={pending}
            className="terminal-submit flex w-full items-center justify-center rounded-md border border-primary/25 bg-primary/90 px-3 py-2 text-[13px] font-semibold text-on-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] transition-all hover:bg-primary hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>

      <StatusModal
        open={Boolean(flash)}
        type={flash?.type === "error" ? "error" : "success"}
        title={flash?.type === "error" ? "Something went wrong" : "Success"}
        message={flash?.text}
        onClose={closeFlash}
        autoCloseMs={2000}
      />
    </section>
  );
}
