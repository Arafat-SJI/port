"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  changePasswordAction,
  verifyCurrentPasswordAction,
} from "@/app/dashboard-araf/actions";
import PasswordField from "@/components/dashboard/PasswordField";

const verifyInitial = { error: null, verified: false };
const changeInitial = { error: null, success: false, message: null };

const fieldClass =
  "h-10 w-full rounded-lg border-0 bg-surface-container-high px-3 text-[13px] text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/40 transition-shadow disabled:opacity-70";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const [verifyState, verifyAction, verifying] = useActionState(
    verifyCurrentPasswordAction,
    verifyInitial
  );
  const [changeState, changeAction, changing] = useActionState(
    changePasswordAction,
    changeInitial
  );

  useEffect(() => {
    if (verifyState?.verified) setUnlocked(true);
  }, [verifyState]);

  useEffect(() => {
    if (changeState?.success) {
      setUnlocked(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [changeState]);

  const mismatchError = useMemo(() => {
    if (!confirmPassword) return null;
    if (newPassword !== confirmPassword) return "New passwords do not match.";
    return null;
  }, [newPassword, confirmPassword]);

  const tooShort = newPassword.length > 0 && newPassword.length < 8;
  const canSubmitPassword =
    unlocked &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    !mismatchError &&
    !changing;

  return (
    <section className="rounded-xl bg-surface-container-lowest/90 p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-secondary">lock_reset</span>
        <h2 className="text-[15px] font-medium text-on-surface">Change password</h2>
      </div>

      <form action={verifyAction} className="space-y-3.5">
        <PasswordField
          id="currentPassword"
          name="currentPassword"
          label="Current password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (unlocked) setUnlocked(false);
          }}
          disabled={unlocked}
          className={fieldClass}
        />

        {!unlocked ? (
          <>
            {verifyState?.error ? (
              <p
                className="rounded-lg bg-error-container/25 px-3 py-2 text-[12px] text-error"
                role="alert"
              >
                {verifyState.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={verifying}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              {verifying ? "Checking…" : "Continue"}
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
          unlocked ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <form action={changeAction} className="space-y-3.5 pt-4">
            <input type="hidden" name="currentPassword" value={currentPassword} />

            <PasswordField
              id="newPassword"
              name="newPassword"
              label="New password"
              autoComplete="new-password"
              required={unlocked}
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={fieldClass}
            />

            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm new password"
              autoComplete="new-password"
              required={unlocked}
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClass}
            />

            {tooShort ? (
              <p className="text-[12px] text-error" role="alert">
                New password must be at least 8 characters.
              </p>
            ) : null}

            {mismatchError ? (
              <p className="text-[12px] text-error" role="alert">
                {mismatchError}
              </p>
            ) : null}

            {changeState?.error && !mismatchError ? (
              <p
                className="rounded-lg bg-error-container/25 px-3 py-2 text-[12px] text-error"
                role="alert"
              >
                {changeState.error}
              </p>
            ) : null}

            {changeState?.success ? (
              <p
                className="rounded-lg bg-secondary/10 px-3 py-2 text-[12px] text-secondary"
                role="status"
              >
                {changeState.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmitPassword}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              {changing ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
