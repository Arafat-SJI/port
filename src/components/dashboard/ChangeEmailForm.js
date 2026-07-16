"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  changeEmailAction,
  verifyCurrentPasswordAction,
} from "@/app/dashboard-araf/actions";
import PasswordField from "@/components/dashboard/PasswordField";

const verifyInitial = { error: null, verified: false };
const emailChangeInitial = { error: null, success: false, message: null, email: null };

const fieldClass =
  "h-10 w-full rounded-lg border-0 bg-surface-container-high px-3 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow disabled:opacity-70";

export default function ChangeEmailForm({ currentEmail }) {
  const router = useRouter();
  const [displayEmail, setDisplayEmail] = useState(currentEmail);
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailUnlocked, setEmailUnlocked] = useState(false);

  const [emailVerifyState, emailVerifyAction, emailVerifying] = useActionState(
    verifyCurrentPasswordAction,
    verifyInitial
  );
  const [emailChangeState, emailChangeAction, emailChanging] = useActionState(
    changeEmailAction,
    emailChangeInitial
  );

  useEffect(() => {
    setDisplayEmail(currentEmail);
  }, [currentEmail]);

  useEffect(() => {
    if (emailVerifyState?.verified) setEmailUnlocked(true);
  }, [emailVerifyState]);

  useEffect(() => {
    if (emailChangeState?.success) {
      setEmailUnlocked(false);
      setEmailCurrentPassword("");
      setNewEmail("");
      if (emailChangeState.email) setDisplayEmail(emailChangeState.email);
      router.refresh();
    }
  }, [emailChangeState, router]);

  const emailSame =
    newEmail.trim().length > 0 &&
    newEmail.trim().toLowerCase() === String(displayEmail ?? "").toLowerCase();
  const emailInvalid =
    newEmail.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim());
  const canSubmitEmail =
    emailUnlocked &&
    newEmail.trim().length > 0 &&
    !emailSame &&
    !emailInvalid &&
    !emailChanging;

  return (
    <section className="rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-secondary">mail</span>
        <h2 className="text-[15px] font-medium text-on-surface">Change email</h2>
      </div>

      <p className="mb-3.5 text-[12px] text-on-surface-variant">
        Current email:{" "}
        <span className="font-medium text-on-surface">{displayEmail || "—"}</span>
      </p>

      <form action={emailVerifyAction} className="space-y-3.5">
        <PasswordField
          id="emailCurrentPassword"
          name="currentPassword"
          label="Current password"
          autoComplete="current-password"
          required
          value={emailCurrentPassword}
          onChange={(e) => {
            setEmailCurrentPassword(e.target.value);
            if (emailUnlocked) setEmailUnlocked(false);
          }}
          disabled={emailUnlocked}
          className={fieldClass}
        />

        {!emailUnlocked ? (
          <>
            {emailVerifyState?.error ? (
              <p
                className="rounded-lg bg-error-container/25 px-3 py-2 text-[12px] text-error"
                role="alert"
              >
                {emailVerifyState.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={emailVerifying}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              {emailVerifying ? "Checking…" : "Continue"}
            </button>
          </>
        ) : (
          <p className="flex items-center gap-1.5 text-[12px] text-secondary">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            Current password verified
          </p>
        )}
      </form>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          emailUnlocked ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <form action={emailChangeAction} className="space-y-3.5 pt-4">
            <input type="hidden" name="currentPassword" value={emailCurrentPassword} />

            <div className="space-y-1.5">
              <label htmlFor="newEmail" className="block text-[12px] text-on-surface-variant">
                New email
              </label>
              <input
                id="newEmail"
                name="newEmail"
                type="email"
                autoComplete="email"
                required={emailUnlocked}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>

            {emailInvalid ? (
              <p className="text-[12px] text-error" role="alert">
                Enter a valid email address.
              </p>
            ) : null}

            {emailSame ? (
              <p className="text-[12px] text-error" role="alert">
                New email must be different from your current email.
              </p>
            ) : null}

            {emailChangeState?.error && !emailInvalid && !emailSame ? (
              <p
                className="rounded-lg bg-error-container/25 px-3 py-2 text-[12px] text-error"
                role="alert"
              >
                {emailChangeState.error}
              </p>
            ) : null}

            {emailChangeState?.success ? (
              <p
                className="rounded-lg bg-secondary/10 px-3 py-2 text-[12px] text-secondary"
                role="status"
              >
                {emailChangeState.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmitEmail}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">alternate_email</span>
              {emailChanging ? "Updating…" : "Update email"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
