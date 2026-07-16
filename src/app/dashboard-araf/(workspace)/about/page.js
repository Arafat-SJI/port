import FileIcon from "@/components/ui/FileIcon";
import AboutEditor from "@/components/dashboard/AboutEditor";
import { readAboutContentFromSupabase } from "@/lib/aboutContentServer";

export default async function DashboardAboutPage() {
  const content = await readAboutContentFromSupabase();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
          <FileIcon ext="tsx" size={18} />
        </div>
        <div className="min-w-0">
          <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
            Section
          </p>
          <h1 className="mt-0.5 text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
            About.tsx
          </h1>
        </div>
      </header>

      <AboutEditor initialContent={content} />
    </main>
  );
}
