"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

const THEME_BOOT_SCRIPT = `(function(){try{var h=document.documentElement,k=["portfolio-extensions-v7","portfolio-extensions-v6","portfolio-extensions-v5","portfolio-extensions-v4","portfolio-extensions-v3","portfolio-extensions-v2"],r=null;for(var i=0;i<k.length;i++){r=localStorage.getItem(k[i]);if(r)break;}if(!r){h.dataset.uiTheme="default";h.dataset.fontPack="inter";return;}var s=JSON.parse(r),t="default";if(s.activeThemeSource==="macintosh-theme"){t="macos";h.dataset.macVariant=s.macVariant||"sonoma";h.dataset.glassUi="true";h.dataset.macWallpaper="true";}else if(s.activeThemeSource==="theme-pack"){t=s.packTheme||"default";}else if(s.activeThemeSource==="live-animation"){h.dataset.liveAnimation=s.liveAnimation||"aurora";}h.dataset.uiTheme=t;h.dataset.fontPack=s.activeTypography?s.fontPack||"inter":"inter";if(s.activeTerminalTheme){h.dataset.terminalTheme=s.terminalTheme||"slate";}if(s.activeChatTheme){h.dataset.chatTheme=s.chatTheme||"midnight";}}catch(e){}})();`;

/** Injects theme boot into the SSR HTML stream (avoids React 19 client script warning). */
export default function ThemeBootScript() {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;

    return (
      <script
        id="theme-boot"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
      />
    );
  });

  return null;
}
