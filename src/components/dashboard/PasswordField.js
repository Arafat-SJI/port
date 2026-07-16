"use client";

import { useState } from "react";

export default function PasswordField({
  id,
  name,
  label,
  autoComplete,
  required = false,
  minLength,
  value,
  onChange,
  disabled = false,
  className = "",
  placeholder = "••••••••",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={id} className="block text-[12px] text-on-surface-variant">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pr-10 ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition hover:bg-surface-container hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          <span className="material-symbols-outlined !text-[18px]">
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
    </div>
  );
}
