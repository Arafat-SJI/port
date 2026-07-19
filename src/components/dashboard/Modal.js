"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Shared dashboard modal shell — same chrome for every modal.
 * Portaled to document.body so backdrop covers sidebar/header stacking contexts.
 * Backdrop: dim + blur.
 */
export default function Modal({
  open,
  onClose,
  closeOnBackdrop = true,
  role = "dialog",
  labelledBy,
  describedBy,
  children,
  panelClassName = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]"
      onClick={closeOnBackdrop && onClose ? onClose : undefined}
      role="presentation"
    >
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className={`w-full max-w-sm overflow-hidden rounded-xl border border-border/60 bg-surface-container-lowest px-5 py-5 shadow-[0_16px_48px_rgb(0_0_0/0.55)] ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirming = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={confirming ? undefined : onCancel}
      closeOnBackdrop={!confirming}
      role="alertdialog"
      labelledBy="dashboard-confirm-title"
      describedBy={message ? "dashboard-confirm-desc" : undefined}
    >
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined mt-0.5 text-[22px] text-error">
          warning
        </span>
        <div className="min-w-0 flex-1">
          <p id="dashboard-confirm-title" className="text-[14px] font-medium text-on-surface">
            {title}
          </p>
          {message ? (
            <p id="dashboard-confirm-desc" className="mt-1 text-[13px] text-on-surface-variant">
              {message}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={confirming}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={confirming}
          className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-surface-container-high px-3 text-[13px] text-on-surface transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirming}
          className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-error-container/35 px-3 text-[13px] font-medium text-error transition hover:bg-error-container/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {confirming ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function StatusModal({
  open,
  type = "success",
  title,
  message,
  onClose,
  autoCloseMs = 2000,
}) {
  const isError = type === "error";
  const resolvedTitle = title ?? (isError ? "Something went wrong" : "Success");

  return (
    <Modal
      open={open}
      onClose={onClose}
      role={isError ? "alert" : "status"}
      labelledBy="dashboard-status-title"
      describedBy="dashboard-status-desc"
      panelClassName="!pb-4"
    >
      <div className="flex items-start gap-3">
        <span
          className={`material-symbols-outlined mt-0.5 text-[22px] ${
            isError ? "text-error" : "text-secondary"
          }`}
        >
          {isError ? "error" : "check_circle"}
        </span>
        <div className="min-w-0 flex-1">
          <p id="dashboard-status-title" className="text-[14px] font-medium text-on-surface">
            {resolvedTitle}
          </p>
          {message ? (
            <p id="dashboard-status-desc" className="mt-1 text-[13px] text-on-surface-variant">
              {message}
            </p>
          ) : null}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-high"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        ) : null}
      </div>

      {autoCloseMs > 0 ? (
        <div
          className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-surface-container-high"
          aria-hidden
        >
          <div
            key={`${type}-${message}-${autoCloseMs}`}
            className={`h-full w-full origin-left rounded-full ${
              isError ? "bg-error/70" : "bg-secondary/70"
            }`}
            style={{
              animation: `dashboard-status-loader ${autoCloseMs}ms linear forwards`,
            }}
          />
        </div>
      ) : null}

      <style>{`
        @keyframes dashboard-status-loader {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </Modal>
  );
}
