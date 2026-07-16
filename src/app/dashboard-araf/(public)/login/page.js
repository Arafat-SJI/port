"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/dashboard-araf/actions";
import PasswordField from "@/components/dashboard/PasswordField";

const initialState = { error: null };

const fieldClass =
  "w-full h-11 rounded-lg border border-border bg-surface-container-lowest/90 px-3.5 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:border-primary/55 focus:shadow-[0_0_0_3px_rgb(173_198_255/0.12)] transition-all";

export default function DashboardLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -15%, rgb(173 198 255 / 0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 90%, rgb(78 222 163 / 0.08), transparent 50%), radial-gradient(ellipse 40% 35% at 10% 80%, rgb(173 198 255 / 0.06), transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgb(227 226 232) 1px, transparent 1px), linear-gradient(90deg, rgb(227 226 232) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-[1] w-full max-w-[420px]">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-container-lowest shadow-[0_0_24px_rgb(173_198_255/0.12)]">
            <span className="material-symbols-outlined text-[22px] text-primary">terminal</span>
          </div>
          <div>
            <p className="font-label-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
              arafat.workspace
            </p>
            <h1 className="text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
              Dashboard login
            </h1>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface-container-lowest/95 shadow-[0_24px_80px_rgb(0_0_0/0.45)]">
          <div className="flex h-9 items-center gap-1.5 border-b border-border bg-surface-container-low/80 px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-tertiary/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-secondary/70" />
            <span className="ml-2 truncate font-label-mono text-[10px] text-on-surface-variant/80">
              auth · sign-in
            </span>
          </div>

          <form action={formAction} className="space-y-4 p-5 sm:p-6">
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

            <PasswordField
              id="password"
              name="password"
              label="Password"
              autoComplete="current-password"
              required
              className={fieldClass}
            />

            {state?.error ? (
              <p
                className="rounded-lg border border-error/35 bg-error-container/25 px-3 py-2 text-[12px] text-error"
                role="alert"
              >
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[13px] font-semibold text-on-primary shadow-[0_0_28px_rgb(173_198_255/0.22)] transition hover:brightness-110 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[17px]">login</span>
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center font-label-mono text-[11px] text-on-surface-variant/70">
          Private access only · No pu
          <Link
            href="/dashboard-araf/forgot-password"
            className="text-inherit no-underline outline-none hover:text-inherit focus-visible:text-primary"
            title="Forgot password"
            aria-label="Forgot password"
          >
            b
          </Link>
          lic registration
        </p>
      </div>
    </main>
  );
}
