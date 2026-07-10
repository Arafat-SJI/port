"use client";

import IDEWorkspace from "@/components/ide/IDEWorkspace";
import ShaderBackground from "@/components/ui/ShaderBackground";
import { ExtensionsProvider } from "@/hooks/useExtensions";

export default function Home() {
  return (
    <ExtensionsProvider>
      <ShaderBackground />
      <IDEWorkspace />
    </ExtensionsProvider>
  );
}