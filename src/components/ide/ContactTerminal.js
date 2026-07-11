"use client";

import { CONTACT } from "@/data/portfolio";

export default function ContactTerminal({ onCollapse }) {
  return (
    <section
      aria-label="Let's Connect terminal"
      className="w-full overflow-hidden border-t border-border bg-surface-container-lowest"
    >
      <header className="flex h-8 items-center gap-2 border-b border-border bg-surface-container-low px-3">
        <span className="material-symbols-outlined text-[14px] text-secondary">terminal</span>
        <span className="text-[11px] font-semibold tracking-wide text-on-surface">
          Let&apos;s Connect
        </span>
        <span className="text-[10px] text-on-surface-variant/70 font-code-sm">— contact.ts</span>
        <button
          type="button"
          onClick={onCollapse}
          title="Back to Mentorship"
          className="ml-auto flex h-6 w-6 items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined !text-[16px]">keyboard_arrow_up</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-3 border-b border-border p-4 font-code-sm text-[12px] leading-relaxed md:border-b-0 md:border-r">
          <p className="text-secondary">
            <span className="text-on-surface-variant/70">$</span> cat README.md
          </p>
          <p className="text-on-surface-variant pl-3">{CONTACT.intro}</p>
          <p className="text-secondary pt-1">
            <span className="text-on-surface-variant/70">$</span> whoami --contact
          </p>
          <div className="space-y-1.5 pl-3">
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined !text-[14px] text-primary/80">
                alternate_email
              </span>
              <span>{CONTACT.email}</span>
            </a>
            <p className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined !text-[14px] text-primary/80">share</span>
              <span>{CONTACT.social}</span>
            </p>
          </div>
        </div>

        <form
          className="space-y-3 p-4 font-code-sm"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <p className="text-[12px] text-secondary">
            <span className="text-on-surface-variant/70">$</span> ./send-message
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant/70">
                name
              </span>
              <input
                className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-[12px] text-on-surface placeholder:text-on-surface-variant/45 focus:border-primary/50 focus:outline-none"
                placeholder="Your name"
                type="text"
                name="name"
                autoComplete="name"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant/70">
                email
              </span>
              <input
                className="w-full rounded border border-border bg-background px-2.5 py-1.5 text-[12px] text-on-surface placeholder:text-on-surface-variant/45 focus:border-primary/50 focus:outline-none"
                placeholder="you@email.com"
                type="email"
                name="email"
                autoComplete="email"
              />
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant/70">
              message
            </span>
            <textarea
              className="w-full resize-none rounded border border-border bg-background px-2.5 py-1.5 text-[12px] text-on-surface placeholder:text-on-surface-variant/45 focus:border-primary/50 focus:outline-none custom-scrollbar"
              placeholder="How can I help?"
              name="message"
              rows={3}
            />
          </label>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-1.5 rounded bg-primary px-3 py-2 text-[12px] font-semibold text-on-primary hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined !text-[14px]">send</span>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
