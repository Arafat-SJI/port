"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";
import { DEFAULT_EXTENSION_STATE } from "@/lib/extensionStorage";
import { UI_DEFAULTS_REVISION_KEY, normalizeUiExtensions } from "@/lib/uiExtensions";

function buildThemeBootScript(siteDefaults) {
  const defaultsJson = JSON.stringify(normalizeUiExtensions(siteDefaults));
  const revKeyJson = JSON.stringify(UI_DEFAULTS_REVISION_KEY);
  return `(function(){try{var h=document.documentElement,path=location.pathname||"";if(path==="/dashboard-araf"||path.indexOf("/dashboard-araf/")===0){h.dataset.uiTheme="default";h.dataset.fontPack="inter";h.removeAttribute("data-mac-variant");h.removeAttribute("data-glass-ui");h.removeAttribute("data-mac-wallpaper");h.removeAttribute("data-live-animation");h.removeAttribute("data-terminal-theme");h.removeAttribute("data-chat-theme");return;}var defaults=${defaultsJson},revKey=${revKeyJson},siteRev=defaults.revision||"",localRev=localStorage.getItem(revKey)||"",k=["portfolio-extensions-v7","portfolio-extensions-v6","portfolio-extensions-v5","portfolio-extensions-v4","portfolio-extensions-v3","portfolio-extensions-v2","portfolio-extensions-v1"];function clearExt(){for(var i=0;i<k.length;i++)localStorage.removeItem(k[i]);}function apply(s){var t="default";h.removeAttribute("data-mac-variant");h.removeAttribute("data-glass-ui");h.removeAttribute("data-mac-wallpaper");h.removeAttribute("data-live-animation");h.removeAttribute("data-terminal-theme");h.removeAttribute("data-chat-theme");if(s.activeThemeSource==="macintosh-theme"){t="macos";h.dataset.macVariant=s.macVariant||"sonoma";h.dataset.glassUi="true";h.dataset.macWallpaper="true";}else if(s.activeThemeSource==="theme-pack"){t=s.packTheme||"default";}else if(s.activeThemeSource==="live-animation"){h.dataset.liveAnimation=s.liveAnimation||"aurora";}h.dataset.uiTheme=t;h.dataset.fontPack=s.activeTypography?s.fontPack||"inter":"inter";if(s.activeTerminalTheme){h.dataset.terminalTheme=s.terminalTheme||"slate";}if(s.activeChatTheme){h.dataset.chatTheme=s.chatTheme||"midnight";}}if(siteRev&&localRev!==siteRev){clearExt();localStorage.setItem(revKey,siteRev);apply(defaults);return;}if(siteRev&&!localRev)localStorage.setItem(revKey,siteRev);var r=null;for(var j=0;j<k.length;j++){r=localStorage.getItem(k[j]);if(r)break;}if(!r){apply(defaults);return;}var s=JSON.parse(r);apply({activeThemeSource:s.activeThemeSource||defaults.activeThemeSource,packTheme:s.packTheme||defaults.packTheme,fontPack:s.fontPack||defaults.fontPack,macVariant:s.macVariant||defaults.macVariant,liveAnimation:s.liveAnimation||defaults.liveAnimation,activeTypography:!!s.activeTypography,activeTerminalTheme:!!s.activeTerminalTheme,terminalTheme:s.terminalTheme||defaults.terminalTheme,activeChatTheme:!!s.activeChatTheme,chatTheme:s.chatTheme||defaults.chatTheme});}catch(e){}})();`;
}

/** Injects theme boot into the SSR HTML stream (avoids React 19 client script warning). */
export default function ThemeBootScript({ siteDefaults }) {
  const inserted = useRef(false);
  const defaults = siteDefaults ?? DEFAULT_EXTENSION_STATE;

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;

    return (
      <script
        id="theme-boot"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: buildThemeBootScript(defaults) }}
      />
    );
  });

  return null;
}
