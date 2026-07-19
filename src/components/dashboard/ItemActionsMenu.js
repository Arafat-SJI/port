"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Compact ⋮ menu for dashboard entry cards:
 * show/hide, delete, move up/down.
 */
export default function ItemActionsMenu({
  label,
  visible = true,
  onToggleVisible,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}) {
  const menuId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const itemClass =
    "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[12px] text-on-surface transition hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
        aria-label={`Actions for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 min-w-[168px] overflow-hidden rounded-lg border border-border/60 bg-surface-container-lowest py-1 shadow-[0_12px_32px_rgb(0_0_0/0.45)]"
        >
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => {
              onToggleVisible?.(!visible);
              close();
            }}
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              {visible ? "visibility" : "visibility_off"}
            </span>
            {visible ? "Hide on portfolio" : "Show on portfolio"}
          </button>

          <button
            type="button"
            role="menuitem"
            className={`${itemClass} text-error`}
            onClick={() => {
              onDelete?.();
              close();
            }}
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Delete
          </button>

          <div className="my-1 h-px bg-border/50" aria-hidden />

          <button
            type="button"
            role="menuitem"
            className={itemClass}
            disabled={!canMoveUp}
            onClick={() => {
              onMoveUp?.();
              close();
            }}
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              arrow_upward
            </span>
            Move up
          </button>

          <button
            type="button"
            role="menuitem"
            className={itemClass}
            disabled={!canMoveDown}
            onClick={() => {
              onMoveDown?.();
              close();
            }}
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              arrow_downward
            </span>
            Move down
          </button>
        </div>
      ) : null}
    </div>
  );
}
