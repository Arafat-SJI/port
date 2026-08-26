"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveUiExtensionsAction } from "@/app/dashboard-araf/uiExtensionsActions";
import {
  CHAT_THEME_OPTIONS,
  EXTENSIONS,
  FONT_PACK_OPTIONS,
  LIVE_ANIMATION_OPTIONS,
  MAC_THEME_VARIANTS,
  TERMINAL_THEME_OPTIONS,
  THEME_PACK_OPTIONS,
} from "@/data/extensions";
import {
  cloneUiExtensions,
  normalizeUiExtensions,
  uiExtensionsBodyEqual,
} from "@/lib/uiExtensions";
import LiveAnimationPreviewCanvas from "@/components/dashboard/LiveAnimationPreviewCanvas";
import TerminalLiveCanvas from "@/components/ide/TerminalLiveCanvas";

const CURSOR_DARK_SWATCH = ["#121317", "#adc6ff", "#1a1b20"];

const TERMINAL_LIVE_SKINS = new Set(["pulse", "scan", "neon-wave"]);
const CHAT_LIVE_SKINS = new Set(["shimmer", "ripple", "spark"]);

const FONT_SAMPLE = {
  inter: { label: "Inter", family: "var(--font-inter), system-ui, sans-serif" },
  system: { label: "System", family: "system-ui, -apple-system, sans-serif" },
  georgia: { label: "Georgia", family: "Georgia, 'Times New Roman', serif" },
  "mono-ui": { label: "Mono", family: "var(--font-jetbrains-mono), ui-monospace, monospace" },
};

const NAV_ITEMS = [
  { id: "default-theme", group: "Workspace theme" },
  { id: "theme-pack", group: "Workspace theme" },
  { id: "macintosh-theme", group: "Workspace theme" },
  { id: "live-animation", group: "Workspace theme" },
  { id: "typograph", group: "Overlays" },
  { id: "terminal-theme", group: "Overlays" },
  { id: "chat-theme", group: "Overlays" },
];

function Swatch({ colors, className = "" }) {
  const list = Array.isArray(colors) && colors.length ? colors : CURSOR_DARK_SWATCH;
  return (
    <div
      className={`flex overflow-hidden rounded-md border border-border/80 ${className}`}
      aria-hidden
    >
      {list.map((c) => (
        <div key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}

function getWorkspacePalette(state) {
  // Live Animation keeps Cursor Dark IDE chrome; motion is background-only.
  if (state.activeThemeSource === "live-animation") {
    return CURSOR_DARK_SWATCH;
  }
  if (state.activeThemeSource === "theme-pack") {
    return (
      THEME_PACK_OPTIONS.find((o) => o.value === state.packTheme)?.swatch ?? CURSOR_DARK_SWATCH
    );
  }
  if (state.activeThemeSource === "macintosh-theme") {
    return MAC_THEME_VARIANTS.find((o) => o.value === state.macVariant)?.swatch ?? CURSOR_DARK_SWATCH;
  }
  return CURSOR_DARK_SWATCH;
}

function getMacWallpaper(state) {
  if (state.activeThemeSource !== "macintosh-theme") return null;
  return (
    MAC_THEME_VARIANTS.find((o) => o.value === state.macVariant)?.wallpaper ?? null
  );
}

function workspaceThemeLabel(state) {
  if (state.activeThemeSource === "theme-pack") {
    return THEME_PACK_OPTIONS.find((o) => o.value === state.packTheme)?.label ?? "Theme Studio";
  }
  if (state.activeThemeSource === "macintosh-theme") {
    return MAC_THEME_VARIANTS.find((o) => o.value === state.macVariant)?.label ?? "Aqua Desktop";
  }
  if (state.activeThemeSource === "live-animation") {
    return (
      LIVE_ANIMATION_OPTIONS.find((o) => o.value === state.liveAnimation)?.label ?? "Live Animation"
    );
  }
  return "Cursor Dark";
}

function isNavActive(state, id) {
  if (id === "default-theme") return state.activeThemeSource === "default";
  if (id === "theme-pack") return state.activeThemeSource === "theme-pack";
  if (id === "macintosh-theme") return state.activeThemeSource === "macintosh-theme";
  if (id === "live-animation") return state.activeThemeSource === "live-animation";
  if (id === "typograph") return state.activeTypography;
  if (id === "terminal-theme") return state.activeTerminalTheme;
  if (id === "chat-theme") return state.activeChatTheme;
  return false;
}

function LivePreview({ state }) {
  const palette = getWorkspacePalette(state);
  const bg = palette[0];
  const accent = palette[1];
  const panel = palette[2] ?? palette[0];
  const fontKey = state.activeTypography ? state.fontPack : "inter";
  const font = FONT_SAMPLE[fontKey] ?? FONT_SAMPLE.inter;
  const terminalOpt = state.activeTerminalTheme
    ? TERMINAL_THEME_OPTIONS.find((o) => o.value === state.terminalTheme)
    : null;
  const chatOpt = state.activeChatTheme
    ? CHAT_THEME_OPTIONS.find((o) => o.value === state.chatTheme)
    : null;
  const live = state.activeThemeSource === "live-animation";
  const macWallpaper = getMacWallpaper(state);
  const glass = state.activeThemeSource === "macintosh-theme";
  const terminalSkin = terminalOpt?.value || "";
  const chatSkin = chatOpt?.value || "";
  const terminalLive = TERMINAL_LIVE_SKINS.has(terminalSkin) ? terminalSkin : "";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-container-lowest">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <div className="min-w-0">
          <p className="font-label-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">
            Preview
          </p>
          <p className="truncate text-[12px] font-medium text-on-surface">
            {workspaceThemeLabel(state)}
            {terminalOpt ? ` · ${terminalOpt.label}` : ""}
            {chatOpt ? ` · ${chatOpt.label}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {state.activeTypography ? (
            <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-mono text-[9px] text-on-surface-variant">
              {font.label}
            </span>
          ) : null}
          {terminalOpt ? (
            <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-mono text-[9px] text-on-surface-variant">
              Term{terminalOpt.kind === "live" ? " · live" : ""}
            </span>
          ) : null}
          {chatOpt ? (
            <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-mono text-[9px] text-on-surface-variant">
              Chat{CHAT_LIVE_SKINS.has(chatSkin) ? " · live" : ""}
            </span>
          ) : null}
        </div>
      </div>
      <div className="p-3">
        <div
          className="relative overflow-hidden rounded-lg border border-white/10"
          style={{
            background: macWallpaper || bg,
            fontFamily: font.family,
          }}
        >
          {live ? (
            <LiveAnimationPreviewCanvas variant={state.liveAnimation || "aurora"} />
          ) : null}

          <div
            className="relative z-[1] flex h-7 items-center gap-2 border-b px-2.5"
            style={{
              background: glass ? "rgba(28,28,30,0.72)" : panel,
              borderColor: `${accent}33`,
              backdropFilter: glass ? "blur(8px)" : undefined,
            }}
          >
            {state.activeThemeSource === "macintosh-theme" && state.macTrafficLights ? (
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="h-2 w-2 rounded-full bg-[#28c840]" />
              </span>
            ) : null}
            <span className="truncate text-[9px] text-white/50">arafat.workspace</span>
          </div>

          <div className="relative z-[1] flex min-h-[112px]">
            <div
              className="hidden w-14 shrink-0 border-r p-1.5 sm:block"
              style={{
                background: glass ? "rgba(28,28,30,0.55)" : panel,
                borderColor: `${accent}22`,
                backdropFilter: glass ? "blur(8px)" : undefined,
              }}
            >
              <div className="mb-1.5 h-1.5 w-8 rounded" style={{ background: `${accent}55` }} />
              <div className="space-y-1">
                <div className="h-1 w-full rounded bg-white/10" />
                <div className="h-1 w-[80%] rounded" style={{ background: `${accent}66` }} />
              </div>
            </div>

            <div
              className="min-w-0 flex-1 p-2.5"
              style={{
                background: glass ? "rgba(18,18,20,0.45)" : "transparent",
                backdropFilter: glass ? "blur(6px)" : undefined,
              }}
            >
              <p className="text-[10px] text-white/40">About</p>
              <p className="mt-0.5 text-[13px] font-semibold text-white/90">Arafat</p>
              <p className="mt-1 text-[10px] leading-relaxed text-white/50">
                Visitor first paint preview.
              </p>
              <div
                className="mt-2 inline-flex h-6 items-center rounded px-2 text-[9px] font-semibold"
                style={{ background: accent, color: bg }}
              >
                View Projects
              </div>
            </div>

            {/* Real chat-panel skin classes so CSS + live layers apply */}
            {chatOpt ? (
              <div
                className="chat-panel relative hidden w-[116px] shrink-0 overflow-hidden border-l md:block"
                data-chat-skin={chatSkin}
              >
                <div className="chat-live-layer pointer-events-none absolute inset-0" aria-hidden />
                <div className="relative z-[1] flex h-full flex-col p-2">
                  <p className="chat-accent text-[9px] font-semibold">AI Chat</p>
                  <p className="mt-1 text-[8px] leading-snug text-white/45">{chatOpt.label}</p>
                  <div className="chat-composer mt-auto rounded border px-1.5 py-1 text-[8px] text-white/40">
                    Ask anything…
                  </div>
                  <div className="chat-send mt-1.5 flex h-5 items-center justify-center rounded text-[8px] font-semibold">
                    Send
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="hidden w-16 shrink-0 border-l p-1.5 md:block"
                style={{
                  background: glass ? "rgba(28,28,30,0.55)" : panel,
                  borderColor: `${accent}22`,
                }}
              >
                <div className="mb-1.5 h-1.5 w-10 rounded" style={{ background: `${accent}55` }} />
                <div className="h-6 rounded bg-white/5" />
              </div>
            )}
          </div>

          {/* Real contact-terminal skin + live canvas */}
          {terminalOpt ? (
            <div
              className="contact-terminal relative z-[1] overflow-hidden border-t"
              data-terminal-skin={terminalSkin}
            >
              <TerminalLiveCanvas variant={terminalLive} />
              <div className="terminal-header relative z-[1] flex h-7 items-center gap-1.5 border-b px-2.5">
                <span className="material-symbols-outlined !text-[12px] terminal-accent">
                  terminal
                </span>
                <span className="truncate text-[9px] font-semibold text-on-surface">
                  Let&apos;s Connect
                </span>
                <span className="terminal-accent ml-auto truncate text-[8px] opacity-80">
                  {terminalOpt.label}
                </span>
              </div>
              <div className="terminal-panel relative z-[1] space-y-1.5 px-2.5 py-2 font-label-mono">
                <p className="flex items-center gap-1 text-[9px]">
                  <span className="terminal-accent">➜</span>
                  <span className="text-white/45">~/connect</span>
                  <span className="text-white/30">$</span>
                  <span className="text-on-surface">hello</span>
                  <span className="terminal-cursor ml-0.5 inline-block h-2.5 w-1 animate-pulse" />
                </p>
                <div className="terminal-field rounded border px-1.5 py-1 text-[8px] text-white/35">
                  your message…
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OptionTile({ selected, onClick, title, subtitle, swatch, preview }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
        selected
          ? "bg-primary/14 ring-1 ring-primary/40"
          : "bg-surface-container-high/40 hover:bg-surface-container-high"
      }`}
    >
      {swatch ? <Swatch colors={swatch} className="h-7 w-10 shrink-0" /> : null}
      {preview ? <div className="shrink-0">{preview}</div> : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-medium text-on-surface">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block text-[10px] text-on-surface-variant/75">{subtitle}</span>
        ) : null}
      </span>
      {selected ? (
        <span className="material-symbols-outlined shrink-0 text-[16px] text-primary">
          check_circle
        </span>
      ) : null}
    </button>
  );
}

/** Matches About editor visibility toggles (ash, compact). */
function DashboardToggle({ id, label, checked, onChange, description }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-high/40 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-on-surface">{label}</p>
        {description ? (
          <p className="mt-0.5 text-[10px] text-on-surface-variant/75">{description}</p>
        ) : null}
      </div>
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center gap-1.5 select-none"
        title={checked ? "On" : "Off"}
      >
        <span className="text-[10px] text-on-surface-variant/80">{checked ? "On" : "Off"}</span>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={() => onChange(!checked)}
          className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
            checked ? "bg-on-surface-variant/55" : "bg-surface-container-high"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-on-surface shadow-sm transition-transform ${
              checked ? "translate-x-3" : "translate-x-0"
            }`}
          />
        </button>
      </label>
    </div>
  );
}

function DetailPanel({ extensionId, state, patch }) {
  const extension = EXTENSIONS.find((e) => e.id === extensionId);
  if (!extension) return null;

  const header = (
    <div className="mb-4 flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${extension.iconColor}22` }}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ color: extension.iconColor }}
        >
          {extension.icon}
        </span>
      </div>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-on-surface">{extension.name}</h2>
        <p className="mt-0.5 text-[12px] text-on-surface-variant">{extension.tagline}</p>
      </div>
    </div>
  );

  if (extensionId === "default-theme") {
    const active = state.activeThemeSource === "default";
    return (
      <div>
        {header}
        <div className="mb-3 flex items-center gap-3">
          <Swatch colors={CURSOR_DARK_SWATCH} className="h-9 w-14" />
          <p className="text-[12px] text-on-surface-variant">
            Soft blue accent on deep charcoal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => patch({ activeThemeSource: "default" })}
          className={`h-8 rounded-lg px-3 text-[12px] font-medium transition ${
            active
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
          }`}
        >
          {active ? "Active default" : "Set as site default"}
        </button>
      </div>
    );
  }

  if (extensionId === "theme-pack") {
    return (
      <div>
        {header}
        <button
          type="button"
          onClick={() => patch({ activeThemeSource: "theme-pack" })}
          className={`mb-3 h-8 rounded-lg px-3 text-[12px] font-medium transition ${
            state.activeThemeSource === "theme-pack"
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
          }`}
        >
          {state.activeThemeSource === "theme-pack" ? "Active default" : "Set as site default"}
        </button>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {THEME_PACK_OPTIONS.map((opt) => (
            <OptionTile
              key={opt.value}
              selected={
                state.activeThemeSource === "theme-pack" && state.packTheme === opt.value
              }
              onClick={() => patch({ activeThemeSource: "theme-pack", packTheme: opt.value })}
              title={opt.label}
              swatch={opt.swatch}
            />
          ))}
        </div>
      </div>
    );
  }

  if (extensionId === "macintosh-theme") {
    return (
      <div>
        {header}
        <button
          type="button"
          onClick={() => patch({ activeThemeSource: "macintosh-theme" })}
          className={`mb-3 h-8 rounded-lg px-3 text-[12px] font-medium transition ${
            state.activeThemeSource === "macintosh-theme"
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
          }`}
        >
          {state.activeThemeSource === "macintosh-theme"
            ? "Active default"
            : "Set as site default"}
        </button>
        <div className="mb-3 grid gap-1.5 sm:grid-cols-2">
          {MAC_THEME_VARIANTS.map((opt) => (
            <OptionTile
              key={opt.value}
              selected={
                state.activeThemeSource === "macintosh-theme" && state.macVariant === opt.value
              }
              onClick={() =>
                patch({ activeThemeSource: "macintosh-theme", macVariant: opt.value })
              }
              title={opt.label}
              subtitle={opt.description}
              swatch={opt.swatch}
            />
          ))}
        </div>
        <DashboardToggle
          id="mac-traffic"
          label="Traffic lights"
          description="Red / yellow / green window controls"
          checked={state.macTrafficLights}
          onChange={(macTrafficLights) => patch({ macTrafficLights })}
        />
      </div>
    );
  }

  if (extensionId === "live-animation") {
    return (
      <div>
        {header}
        <button
          type="button"
          onClick={() => patch({ activeThemeSource: "live-animation" })}
          className={`mb-3 h-8 rounded-lg px-3 text-[12px] font-medium transition ${
            state.activeThemeSource === "live-animation"
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
          }`}
        >
          {state.activeThemeSource === "live-animation"
            ? "Active default"
            : "Set as site default"}
        </button>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {LIVE_ANIMATION_OPTIONS.map((opt) => (
            <OptionTile
              key={opt.value}
              selected={
                state.activeThemeSource === "live-animation" &&
                state.liveAnimation === opt.value
              }
              onClick={() =>
                patch({ activeThemeSource: "live-animation", liveAnimation: opt.value })
              }
              title={opt.label}
              subtitle={opt.description}
              swatch={opt.swatch}
            />
          ))}
        </div>
      </div>
    );
  }

  if (extensionId === "typograph") {
    return (
      <div>
        {header}
        <div className="mb-3">
          <DashboardToggle
            id="typograph-on"
            label="Enable by default"
            description="Visitors start with your font pack"
            checked={state.activeTypography}
            onChange={(activeTypography) => patch({ activeTypography })}
          />
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {FONT_PACK_OPTIONS.map((opt) => {
            const sample = FONT_SAMPLE[opt.value];
            return (
              <OptionTile
                key={opt.value}
                selected={state.fontPack === opt.value}
                onClick={() => patch({ activeTypography: true, fontPack: opt.value })}
                title={opt.label}
                subtitle={opt.description}
                preview={
                  <span
                    className="flex h-7 w-10 items-center justify-center rounded-md border border-border bg-surface-container-highest text-[12px] text-on-surface"
                    style={{ fontFamily: sample?.family }}
                  >
                    Aa
                  </span>
                }
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (extensionId === "terminal-theme") {
    return (
      <div>
        {header}
        <div className="mb-3">
          <DashboardToggle
            id="terminal-on"
            label="Enable by default"
            description="Only styles the contact terminal"
            checked={state.activeTerminalTheme}
            onChange={(activeTerminalTheme) => patch({ activeTerminalTheme })}
          />
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {TERMINAL_THEME_OPTIONS.map((opt) => (
            <OptionTile
              key={opt.value}
              selected={state.terminalTheme === opt.value}
              onClick={() =>
                patch({ activeTerminalTheme: true, terminalTheme: opt.value })
              }
              title={opt.label}
              subtitle={`${opt.kind} · ${opt.description}`}
              swatch={opt.swatch}
            />
          ))}
        </div>
      </div>
    );
  }

  if (extensionId === "chat-theme") {
    return (
      <div>
        {header}
        <div className="mb-3">
          <DashboardToggle
            id="chat-on"
            label="Enable by default"
            description="Only styles the AI chat sidebar"
            checked={state.activeChatTheme}
            onChange={(activeChatTheme) => patch({ activeChatTheme })}
          />
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {CHAT_THEME_OPTIONS.map((opt) => (
            <OptionTile
              key={opt.value}
              selected={state.chatTheme === opt.value}
              onClick={() => patch({ activeChatTheme: true, chatTheme: opt.value })}
              title={opt.label}
              subtitle={`${opt.kind} · ${opt.description}`}
              swatch={opt.swatch}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function UiExtensionsEditor({ initialContent }) {
  const [state, setState] = useState(() => normalizeUiExtensions(initialContent));
  const [selectedId, setSelectedId] = useState("default-theme");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();
  const skipFirst = useRef(true);
  const dirtyRef = useRef(false);
  const timerRef = useRef(null);
  const latestRef = useRef(state);
  const savingRef = useRef(false);

  // Only accept server props when we are not mid-edit / mid-save (fixes double-click reset).
  useEffect(() => {
    const next = normalizeUiExtensions(initialContent);
    if (dirtyRef.current || savingRef.current) return;
    setState((prev) => {
      if (uiExtensionsBodyEqual(prev, next) && prev.revision === next.revision) return prev;
      return next;
    });
  }, [initialContent]);

  useEffect(() => {
    latestRef.current = state;
  }, [state]);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }

    dirtyRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("pending");
    setError(null);

    timerRef.current = setTimeout(() => {
      const payload = cloneUiExtensions(latestRef.current);
      savingRef.current = true;
      startTransition(async () => {
        const result = await saveUiExtensionsAction(payload);
        savingRef.current = false;
        if (result?.success) {
          const saved = result.content
            ? normalizeUiExtensions(result.content)
            : payload;
          // Keep local edits that happened while the request was in flight.
          const stillDirty = !uiExtensionsBodyEqual(latestRef.current, saved);
          dirtyRef.current = stillDirty;
          if (saved.revision) {
            latestRef.current = {
              ...latestRef.current,
              revision: saved.revision,
            };
          }
          setSaveStatus(stillDirty ? "pending" : "saved");
          setError(null);
          if (stillDirty) {
            // Queue another save for edits made during the previous request.
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              setState((prev) => ({ ...prev }));
            }, 200);
          }
        } else {
          setSaveStatus("error");
          setError(result?.error || "Save failed");
        }
      });
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]);

  const patch = (partial) => {
    dirtyRef.current = true;
    setState((prev) => normalizeUiExtensions({ ...prev, ...partial }));
  };

  const statusLabel =
    saveStatus === "pending" || pending
      ? "Saving…"
      : saveStatus === "saved"
        ? "Saved"
        : saveStatus === "error"
          ? "Error"
          : "Auto-saves";

  const groups = [];
  for (const item of NAV_ITEMS) {
    const last = groups[groups.length - 1];
    if (!last || last.name !== item.group) {
      groups.push({ name: item.group, items: [item] });
    } else {
      last.items.push(item);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] text-on-surface-variant">
          Choose one extension at a time. Preview updates live — auto-saves to Supabase.
        </p>
        <span
          className={`shrink-0 font-label-mono text-[10px] uppercase tracking-wider ${
            saveStatus === "error"
              ? "text-error"
              : saveStatus === "saved"
                ? "text-secondary"
                : "text-on-surface-variant/70"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {error ? (
        <p
          className="rounded-lg border border-error/35 bg-error-container/25 px-3 py-2 text-[12px] text-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <LivePreview state={state} />

      <div className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-border bg-surface-container-lowest md:flex-row">
        <nav className="shrink-0 border-b border-border md:w-[220px] md:border-b-0 md:border-r">
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar md:max-h-none md:h-full">
            {groups.map((group) => (
              <div key={group.name} className="py-2">
                <p className="px-3 pb-1 font-label-mono text-[9px] uppercase tracking-[0.14em] text-on-surface-variant/80">
                  {group.name}
                </p>
                {group.items.map((item) => {
                  const ext = EXTENSIONS.find((e) => e.id === item.id);
                  const selected = selectedId === item.id;
                  const active = isNavActive(state, item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left transition ${
                        selected
                          ? "bg-primary/12 text-on-surface"
                          : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined !text-[18px] shrink-0"
                        style={{ color: ext?.iconColor }}
                      >
                        {ext?.icon}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12px] font-medium">
                        {ext?.name}
                      </span>
                      {active ? (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" title="On" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5">
          <DetailPanel extensionId={selectedId} state={state} patch={patch} />
        </div>
      </div>
    </div>
  );
}
