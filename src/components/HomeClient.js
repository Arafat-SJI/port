"use client";

import IDEWorkspace from "@/components/ide/IDEWorkspace";
import LiveAnimationBackground from "@/components/ui/LiveAnimationBackground";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { ExtensionsProvider } from "@/hooks/useExtensions";

export default function HomeClient({ sectionOrder, aboutContent, experienceContent }) {
  return (
    <ExtensionsProvider>
      <ShaderBackground />
      <LiveAnimationBackground />
      <IDEWorkspace
        sectionOrder={sectionOrder}
        aboutContent={aboutContent}
        experienceContent={experienceContent}
      />
    </ExtensionsProvider>
  );
}
