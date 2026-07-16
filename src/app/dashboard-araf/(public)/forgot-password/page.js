"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/app/dashboard-araf/actions";

const initialState = { error: null, success: false, message: null };

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-lowest/90 px-3.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:border-primary/55 focus:shadow-[0_0_0_3px_rgb(173_198_255/0.12)] transition-all";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <main className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -15%, rgb(173 198 255 / 0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 90%, rgb(78 222 163 / 0.08), transparent 50%)",
        }}
      />

      <div className="relative z-[1] w-full max-w-[420px]">
        <div className="mb-5">
          <p className="font-label-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
            arafat.workspace
          </p>
          <h1 className="mt-1 text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
            Reset password
          </h1>
          <p className="mt-1 text-[13px] text-on-surface-variant">
            Enter your dashboard email and we’ll send a reset link.
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-xl border border-border bg-surface-container-lowest/95 p-5 shadow-[0_24px_80px_rgb(0_0_0/0.4)] sm:p-6"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[12px] text-on-surface-variant">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className={fieldClass}
              placeholder="you@example.com"
            />
          </div>

          {state?.error ? (
            <p
              className="rounded-lg border border-error/35 bg-error-container/25 px-3 py-2 text-[12px] text-error"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}

          {state?.success ? (
            <p
              className="rounded-lg border border-secondary/35 bg-secondary/10 px-3 py-2 text-[12px] text-secondary"
              role="status"
            >
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[17px]">mail</span>
            {pending ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-5 text-center text-[12px]">
          <Link
            href="/dashboard-araf/login"
            className="text-primary/90 underline-offset-2 hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
