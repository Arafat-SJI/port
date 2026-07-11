"use client";

import IDEWorkspace from "@/components/ide/IDEWorkspace";
import LiveAnimationBackground from "@/components/ui/LiveAnimationBackground";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { ExtensionsProvider } from "@/hooks/useExtensions";

export default function Home() {
  return (
    <ExtensionsProvider>
      <ShaderBackground />
      <LiveAnimationBackground />
      <IDEWorkspace />
    </ExtensionsProvider>
  );
}
