"use client";

import { useState } from "react";
import {
  FONT_PACK_OPTIONS,
  MAC_THEME_VARIANTS,
  THEME_PACK_OPTIONS,
  getExtensionById,
} from "@/data/extensions";
import { useExtensions } from "@/hooks/useExtensions";

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5 text-tertiary">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="material-symbols-outlined text-[13px]">
          {i < rating ? "star" : "star"}
        </span>
      ))}
    </span>
  );
}

function ThemeSwatch({ colors }) {
  return (
    <div className="flex h-6 w-10 rounded overflow-hidden border border-border shrink-0">
      {colors.map((c) => (
        <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}

function DetailTabContent({ extension, tab }) {
  if (tab === "FEATURES") {
    return (
      <ul className="space-y-2 text-[13px] text-on-surface-variant leading-relaxed">
        {extension.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[14px] text-secondary mt-0.5">check_circle</span>
            {f}
          </li>
        ))}
      </ul>
    );
  }

  if (tab === "CHANGELOG") {
    return (
      <ul className="space-y-1.5 text-[12px] text-on-surface-variant font-code-sm">
        {extension.changelog.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-4 text-[13px] text-on-surface-variant leading-relaxed">
      {extension.longDescription.split("\n\n").map((para) => (
        <p key={para.slice(0, 40)}>
          {para.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} className="text-on-surface font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      ))}
    </div>
  );
}

function TypographySettings() {
  const { fontPack, setFontPack, isActive, isInstalled } = useExtensions();
  const installed = isInstalled("typograph");

  return (
    <div className="mt-6 border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-surface-container-low border-b border-border">
        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
          Font packs
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {FONT_PACK_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={!installed || !isActive("typograph")}
            onClick={() => setFontPack(opt.value)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
              fontPack === opt.value
                ? "bg-primary/10"
                : "hover:bg-surface-container-low"
            } ${!installed || !isActive("typograph") ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div>
              <p className="text-[12px] text-on-surface">{opt.label}</p>
              <p className="text-[11px] text-on-surface-variant">{opt.description}</p>
            </div>
            {fontPack === opt.value && isActive("typograph") && (
              <span className="material-symbols-outlined text-[16px] text-primary">check</span>
            )}
          </button>
        ))}
      </div>
      {!installed && (
        <p className="px-4 py-2 text-[11px] text-on-surface-variant/70">
          Install Typograph to choose a font pack.
        </p>
      )}
      {installed && !isActive("typograph") && (
        <p className="px-4 py-2 text-[11px] text-on-surface-variant/70">
          Activate Typograph to apply a font pack.
        </p>
      )}
    </div>
  );
}

function ThemePackGallery() {
  const { packTheme, setPackTheme, isActive, isInstalled, activate } = useExtensions();
  const installed = isInstalled("theme-pack");

  return (
    <div className="mt-6 border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-surface-container-low border-b border-border">
        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
          Included themes
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {THEME_PACK_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={!installed}
            onClick={() => {
              setPackTheme(opt.value);
              if (!isActive("theme-pack")) activate("theme-pack");
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
              packTheme === opt.value && isActive("theme-pack")
                ? "bg-primary/10"
                : "hover:bg-surface-container-low"
            } ${!installed ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ThemeSwatch colors={opt.swatch} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-on-surface">{opt.label}</p>
              {opt.value === "default" && (
                <p className="text-[10px] text-on-surface-variant">Current default palette</p>
              )}
            </div>
            {packTheme === opt.value && isActive("theme-pack") && (
              <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check</span>
            )}
          </button>
        ))}
      </div>
      {!installed && (
        <p className="px-4 py-2 text-[11px] text-on-surface-variant/70">
          Install Theme Studio to preview and apply themes.
        </p>
      )}
    </div>
  );
}

function MacVariantGallery() {
  const { macVariant, setMacVariant, isActive, isInstalled, activate } = useExtensions();
  const installed = isInstalled("macintosh-theme");

  return (
    <div className="mt-6 border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-surface-container-low border-b border-border">
        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">
          macOS variants
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {MAC_THEME_VARIANTS.map((variant) => (
          <button
            key={variant.value}
            type="button"
            disabled={!installed}
            onClick={() => {
              setMacVariant(variant.value);
              if (!isActive("macintosh-theme")) activate("macintosh-theme");
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
              macVariant === variant.value && isActive("macintosh-theme")
                ? "bg-primary/10"
                : "hover:bg-surface-container-low"
            } ${!installed ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex h-6 w-10 rounded overflow-hidden border border-border">
                {variant.swatch.map((c) => (
                  <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div
                className="h-3 w-10 rounded-sm border border-black/10"
                style={{ background: variant.wallpaper }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-on-surface">{variant.label}</p>
              <p className="text-[10px] text-on-surface-variant">{variant.description}</p>
            </div>
            {macVariant === variant.value && isActive("macintosh-theme") && (
              <span className="material-symbols-outlined text-[16px] text-primary shrink-0">check</span>
            )}
          </button>
        ))}
      </div>
      {!installed && (
        <p className="px-4 py-2 text-[11px] text-on-surface-variant/70">
          Install Aqua Desktop to switch between macOS variants.
        </p>
      )}
      {installed && !isActive("macintosh-theme") && (
        <p className="px-4 py-2 text-[11px] text-on-surface-variant/70">
          Activate Aqua Desktop to apply a variant.
        </p>
      )}
    </div>
  );
}

function MacTrafficLightsToggle() {
  const { macTrafficLights, setMacTrafficLights, isInstalled } = useExtensions();
  const installed = isInstalled("macintosh-theme");

  return (
    <div className="mt-4 border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[12px] text-on-surface">Window controls</p>
          <p className="text-[10px] text-on-surface-variant leading-snug mt-0.5">
            Show traffic lights in the top-right corner of the title bar
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={macTrafficLights}
          disabled={!installed}
          onClick={() => setMacTrafficLights(!macTrafficLights)}
          className={`relative shrink-0 w-[34px] h-[18px] rounded-full transition-colors ${
            !installed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${macTrafficLights ? "bg-secondary" : "bg-surface-container-highest"}`}
        >
          <span
            className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${
              macTrafficLights ? "translate-x-[16px]" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {installed && macTrafficLights && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <div className="flex items-center gap-[6px]">
            <span className="mac-traffic-light mac-traffic-close" />
            <span className="mac-traffic-light mac-traffic-minimize" />
            <span className="mac-traffic-light mac-traffic-maximize" />
          </div>
          <span className="text-[10px] text-on-surface-variant">Preview</span>
        </div>
      )}
      {!installed && (
        <p className="px-4 pb-2 text-[11px] text-on-surface-variant/70">
          Install Aqua Desktop to enable window controls.
        </p>
      )}
    </div>
  );
}

function DefaultThemePreview() {
  return (
    <div className="mt-6 rounded-lg overflow-hidden border border-border">
      <div className="flex h-20">
        <div className="w-1/3 bg-[#0d0e12] border-r border-border p-2 space-y-1">
          <div className="h-1.5 w-full bg-[#2b2f40] rounded-sm" />
          <div className="h-1.5 w-3/4 bg-[#33384d] rounded-sm" />
          <div className="h-1.5 w-5/6 bg-[#1a1b20] rounded-sm" />
        </div>
        <div className="flex-1 bg-[#121317] p-2 space-y-1">
          <div className="h-1.5 w-full bg-[#adc6ff]/30 rounded-sm" />
          <div className="h-1.5 w-2/3 bg-[#1f1f24] rounded-sm" />
        </div>
      </div>
      <p className="px-3 py-2 text-[10px] text-on-surface-variant bg-surface-container-low border-t border-border">
        #adc6ff accent · #121317 background · built-in palette
      </p>
    </div>
  );
}

export default function ExtensionDetailView({ extensionId }) {
  const extension = getExtensionById(extensionId);
  const { isInstalled, isActive, install, uninstall, activate, deactivate } = useExtensions();
  const [tab, setTab] = useState("DETAILS");

  if (!extension) {
    return (
      <div className="flex items-center justify-center h-full text-[13px] text-on-surface-variant">
        Extension not found.
      </div>
    );
  }

  const installed = isInstalled(extension.id);
  const active = isActive(extension.id);
  const builtin = extension.builtin;

  const handleInstall = () => {
    if (!installed && !builtin) install(extension.id);
  };

  const handleActivate = () => {
    if (!installed && !builtin) return;
    activate(extension.id);
  };

  const handleDeactivate = () => {
    deactivate(extension.id);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="px-8 pt-6 pb-8 max-w-4xl">
        {/* Header */}
        <div className="flex gap-5">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${extension.iconColor}22`, color: extension.iconColor }}
          >
            <span className="material-symbols-outlined text-[36px]">{extension.icon}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl text-on-surface font-semibold leading-tight">{extension.name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-[13px] text-primary hover:underline cursor-default">
                {extension.publisher}
              </span>
              <span className="text-[12px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">download</span>
                {extension.downloads}
              </span>
              <StarRating rating={extension.rating} />
            </div>
            <p className="text-[13px] text-on-surface-variant mt-1">{extension.tagline}</p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {!builtin && (
                <button
                  type="button"
                  onClick={handleInstall}
                  disabled={installed}
                  className={`h-[26px] px-4 rounded text-[12px] font-medium transition-all ${
                    installed
                      ? "bg-surface-container-high text-on-surface-variant cursor-default"
                      : "bg-primary text-on-primary hover:brightness-110"
                  }`}
                >
                  {installed ? "Installed" : "Install"}
                </button>
              )}
              {builtin && (
                <span className="text-[11px] text-on-surface-variant px-2 py-1 bg-surface-container-low rounded border border-border h-[26px] flex items-center">
                  Built-in
                </span>
              )}
              {(installed || builtin) && (
                active ? (
                  <button
                    type="button"
                    onClick={handleDeactivate}
                    disabled={builtin && active}
                    className="h-[26px] px-4 rounded text-[12px] font-medium bg-surface-container-highest text-on-surface hover:bg-surface-bright transition-all disabled:opacity-50 disabled:cursor-default"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleActivate}
                    className="h-[26px] px-4 rounded text-[12px] font-medium bg-primary text-on-primary hover:brightness-110 transition-all"
                  >
                    Activate
                  </button>
                )
              )}
              {!builtin && installed && (
                <button
                  type="button"
                  onClick={() => uninstall(extension.id)}
                  className="h-[26px] px-3 rounded text-[12px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  Uninstall
                </button>
              )}
              {active && (
                <span className="text-[11px] text-secondary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-6 border-b border-border">
          {["DETAILS", "FEATURES", "CHANGELOG"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`pb-2 text-[11px] font-bold tracking-wide transition-colors ${
                tab === t
                  ? "text-on-surface border-b-2 border-primary -mb-px"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex gap-8 mt-6">
          <div className="flex-1 min-w-0">
            <DetailTabContent extension={extension} tab={tab} />

            {tab === "DETAILS" && extension.id === "default-theme" && <DefaultThemePreview />}
            {tab === "DETAILS" && extension.id === "typograph" && <TypographySettings />}
            {tab === "DETAILS" && extension.id === "theme-pack" && <ThemePackGallery />}
            {tab === "DETAILS" && extension.id === "macintosh-theme" && (
              <>
                <MacVariantGallery />
                <MacTrafficLightsToggle />
              </>
            )}
          </div>

          <aside className="w-[200px] shrink-0 space-y-5">
            <div>
              <p className="text-[11px] font-bold text-on-surface mb-2">Marketplace</p>
              <dl className="space-y-2 text-[11px]">
                <div>
                  <dt className="text-on-surface-variant">Identifier</dt>
                  <dd className="text-on-surface font-code-sm break-all">{extension.identifier}</dd>
                </div>
                <div>
                  <dt className="text-on-surface-variant">Version</dt>
                  <dd className="text-on-surface">{extension.version}</dd>
                </div>
                <div>
                  <dt className="text-on-surface-variant">Published</dt>
                  <dd className="text-on-surface">{extension.published}</dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="text-[11px] font-bold text-on-surface mb-2">Categories</p>
              <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                {extension.category}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-bold text-on-surface mb-2">Resources</p>
              <ul className="space-y-1 text-[11px] text-primary">
                <li className="hover:underline cursor-default">Marketplace</li>
                <li className="hover:underline cursor-default">Repository</li>
                <li className="hover:underline cursor-default">License</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function ExtensionsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40 mb-3">extension</span>
      <p className="text-[14px] text-on-surface-variant">Select an extension to view details</p>
      <p className="text-[12px] text-on-surface-variant/60 mt-1 max-w-xs">
        Browse the marketplace in the sidebar, then click an extension to open it here.
      </p>
    </div>
  );
}
